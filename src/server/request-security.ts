import "server-only";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export class RateLimitError extends Error {
  constructor(public readonly retryAfter: number) {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}

export class OriginError extends Error {
  constructor() {
    super("Invalid request origin");
    this.name = "OriginError";
  }
}

export class RequestBodyError extends Error {
  constructor(
    message: string,
    public readonly status: 400 | 413 | 415,
  ) {
    super(message);
    this.name = "RequestBodyError";
  }
}

export function getClientAddress(request: NextRequest): string {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
  return /^[0-9a-f:.]{1,64}$/i.test(address) ? address : "unknown";
}

export function assertSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!origin || (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none")) {
    throw new OriginError();
  }
  try {
    if (new URL(origin).origin !== request.nextUrl.origin) throw new OriginError();
  } catch (error) {
    if (error instanceof OriginError) throw error;
    throw new OriginError();
  }
}

export function assertRequestSize(request: NextRequest, maxBytes: number): void {
  const rawLength = request.headers.get("content-length");
  if (!rawLength) return;
  const length = Number(rawLength);
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RequestBodyError("Invalid Content-Length", 400);
  }
  if (length > maxBytes) throw new RequestBodyError("Request body too large", 413);
}

export function assertJsonRequest(request: NextRequest, maxBytes = 100_000): void {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("application/json")) {
    throw new RequestBodyError("Content-Type must be application/json", 415);
  }
  assertRequestSize(request, maxBytes);
}

export function assertMultipartRequest(request: NextRequest, maxBytes: number): void {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (!contentType.startsWith("multipart/form-data;") || !contentType.includes("boundary=")) {
    throw new RequestBodyError("Content-Type must be multipart/form-data", 415);
  }
  assertRequestSize(request, maxBytes);
}

async function readBoundedBody(request: NextRequest, maxBytes: number): Promise<ArrayBuffer> {
  assertRequestSize(request, maxBytes);
  if (!request.body) return new ArrayBuffer(0);

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new RequestBodyError("Request body too large", 413);
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body.buffer;
}

export async function readJsonRequest(request: NextRequest, maxBytes = 100_000): Promise<unknown> {
  assertJsonRequest(request, maxBytes);
  const body = await readBoundedBody(request, maxBytes);
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
  } catch {
    throw new RequestBodyError("Invalid JSON body", 400);
  }
}

export async function readMultipartFormData(request: NextRequest, maxBytes: number): Promise<FormData> {
  assertMultipartRequest(request, maxBytes);
  const body = await readBoundedBody(request, maxBytes);
  try {
    return await new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body,
    }).formData();
  } catch {
    throw new RequestBodyError("Invalid multipart body", 400);
  }
}

export function secretsMatch(received: string, expected: string): boolean {
  const left = createHash("sha256").update(received).digest();
  const right = createHash("sha256").update(expected).digest();
  return timingSafeEqual(left, right);
}

export function enforceRateLimit(
  request: NextRequest,
  namespace: string,
  limit: number,
  windowMs: number,
): void {
  const now = Date.now();
  clearExpiredRateLimits(now);
  const key = `${namespace}:${getClientAddress(request)}`;
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  if (current.count >= limit) {
    throw new RateLimitError(Math.max(1, Math.ceil((current.resetAt - now) / 1_000)));
  }
  current.count += 1;
}

export function clearExpiredRateLimits(now = Date.now()): void {
  if (buckets.size < 1_000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}
