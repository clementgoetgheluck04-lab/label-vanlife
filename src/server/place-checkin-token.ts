import { createHmac, timingSafeEqual } from "node:crypto";

type PlaceCheckInToken = {
  version: 1;
  placeSlug: string;
  expiresAt: number;
};

function getSecret(): string {
  const secret = process.env.KIT_ACCESS_SECRET || process.env.MEMBER_CARD_SECRET || "";
  if (secret.length < 32 || /replace|example|changeme/i.test(secret)) {
    throw new Error("Place check-in secret is missing or too weak");
  }
  return secret;
}

function signature(encoded: string, secret: string) {
  return createHmac("sha256", secret).update(encoded).digest("base64url");
}

export function createPlaceCheckInToken(placeSlug: string, expiresAt: number, secret = getSecret()) {
  const payload: PlaceCheckInToken = { version: 1, placeSlug, expiresAt };
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${encoded}.${signature(encoded, secret)}`;
}

export function verifyPlaceCheckInToken(token: string | undefined, secret = getSecret(), now = Date.now()): PlaceCheckInToken | null {
  if (!token || token.length > 2_048) return null;
  const [encoded, received, extra] = token.split(".");
  if (!encoded || !received || extra) return null;
  const expected = signature(encoded, secret);
  const left = Buffer.from(received);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<PlaceCheckInToken>;
    if (payload.version !== 1 || typeof payload.placeSlug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.placeSlug)) return null;
    if (typeof payload.expiresAt !== "number" || !Number.isSafeInteger(payload.expiresAt) || payload.expiresAt <= now) return null;
    return payload as PlaceCheckInToken;
  } catch {
    return null;
  }
}
