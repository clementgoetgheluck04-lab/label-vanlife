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

function clientAddress(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export function assertSameOrigin(request: NextRequest): void {
  const origin = request.headers.get("origin");
  const expectedOrigin = request.nextUrl.origin;
  if (!origin || origin !== expectedOrigin) throw new OriginError();
}

export function enforceRateLimit(
  request: NextRequest,
  namespace: string,
  limit: number,
  windowMs: number,
): void {
  const now = Date.now();
  const key = `${namespace}:${clientAddress(request)}`;
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
