import { createHmac, timingSafeEqual } from "node:crypto";

export const KIT_ACCESS_COOKIE = "lv-kit-access";

export type KitAccessTokenPayload = {
  version: 1;
  kind: "magic-link" | "access";
  email: string;
  placeId: string;
  expiresAt: number;
};

export function getKitAccessSecret(): string {
  const secret = process.env.KIT_ACCESS_SECRET || process.env.MEMBER_ACCESS_CODE_SECRET || "";
  if (secret.length < 32 || /replace|example|changeme/i.test(secret)) {
    throw new Error("Kit access secret is missing or too weak");
  }
  return secret;
}

export function signKitAccessToken(payload: KitAccessTokenPayload, secret = getKitAccessSecret()): string {
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyKitAccessToken(
  token: string | undefined,
  secret = getKitAccessSecret(),
  now = Date.now(),
): KitAccessTokenPayload | null {
  if (!token || token.length > 2_048) return null;
  const [encoded, receivedSignature, extra] = token.split(".");
  if (!encoded || !receivedSignature || extra) return null;

  const expectedSignature = createHmac("sha256", secret).update(encoded).digest("base64url");
  const received = Buffer.from(receivedSignature);
  const expected = Buffer.from(expectedSignature);
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<KitAccessTokenPayload>;
    if (
      payload.version !== 1
      || (payload.kind !== "magic-link" && payload.kind !== "access")
      || typeof payload.email !== "string"
      || typeof payload.placeId !== "string"
      || typeof payload.expiresAt !== "number"
      || !Number.isSafeInteger(payload.expiresAt)
      || payload.expiresAt <= now
      || payload.email.length > 320
      || payload.placeId.length > 120
    ) return null;
    return payload as KitAccessTokenPayload;
  } catch {
    return null;
  }
}

export function hasValidKitAccess(token: string | undefined): boolean {
  try {
    return verifyKitAccessToken(token)?.kind === "access";
  } catch {
    return false;
  }
}
