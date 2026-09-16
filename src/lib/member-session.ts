import { createHmac, timingSafeEqual } from "node:crypto";

export const MEMBER_SESSION_COOKIE = "lv-member-session";
export const MEMBER_SESSION_POLICY_COOKIE = "lv-member-policy";
export const MEMBER_SESSION_POLICY_VALUE = "1";
export const MEMBER_IDLE_TIMEOUT_MS = 10 * 24 * 60 * 60 * 1_000;

const MEMBER_SESSION_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1_000;

export type MemberSessionPayload = {
  version: 1;
  userId: string;
  lastSeenAt: number;
  rememberMe: boolean;
};

export type MemberSessionState =
  | { kind: "legacy" }
  | { kind: "expired" }
  | { kind: "active"; payload: MemberSessionPayload };

function getMemberSessionSecret(): string {
  const secret = process.env.MEMBER_ACCESS_CODE_SECRET || "";
  if (secret.length < 32 || /replace|example|changeme/i.test(secret)) {
    throw new Error("Member session secret is missing or too weak");
  }
  return secret;
}

export function createMemberSessionToken(
  userId: string,
  rememberMe: boolean,
  now = Date.now(),
  secret = getMemberSessionSecret(),
): string {
  const payload: MemberSessionPayload = { version: 1, userId, lastSeenAt: now, rememberMe };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyMemberSessionToken(
  token: string | undefined,
  expectedUserId: string,
  now = Date.now(),
  secret = getMemberSessionSecret(),
): MemberSessionPayload | null {
  if (!token || token.length > 2_048) return null;
  const [encoded, receivedSignature, extra] = token.split(".");
  if (!encoded || !receivedSignature || extra) return null;

  const expectedSignature = createHmac("sha256", secret).update(encoded).digest("base64url");
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<MemberSessionPayload>;
    if (
      payload.version !== 1
      || payload.userId !== expectedUserId
      || typeof payload.lastSeenAt !== "number"
      || !Number.isSafeInteger(payload.lastSeenAt)
      || payload.lastSeenAt <= 0
      || payload.lastSeenAt > now + MAX_CLOCK_SKEW_MS
      || typeof payload.rememberMe !== "boolean"
      || now - payload.lastSeenAt >= MEMBER_IDLE_TIMEOUT_MS
    ) return null;
    return payload as MemberSessionPayload;
  } catch {
    return null;
  }
}

export function getMemberSessionState(
  token: string | undefined,
  policy: string | undefined,
  expectedUserId: string,
  now = Date.now(),
  secret?: string,
): MemberSessionState {
  if (!token && !policy) return { kind: "legacy" };
  if (policy !== MEMBER_SESSION_POLICY_VALUE) return { kind: "expired" };

  try {
    const payload = verifyMemberSessionToken(token, expectedUserId, now, secret);
    return payload ? { kind: "active", payload } : { kind: "expired" };
  } catch {
    return { kind: "expired" };
  }
}

export function getMemberSessionCookieOptions(rememberMe: boolean) {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(rememberMe ? { maxAge: MEMBER_SESSION_COOKIE_MAX_AGE } : {}),
  };
}

export function getClearedMemberSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}
