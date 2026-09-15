import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { requireSecretEnv } from "@/server/env";

type MemberCardToken = {
  cardNumber: string;
  expiresAt: number;
};

function secret() {
  return requireSecretEnv("MEMBER_CARD_SECRET");
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

export function createMemberCardToken(cardNumber: string, expiresAt: Date | null) {
  const payload: MemberCardToken = {
    cardNumber,
    expiresAt: expiresAt?.getTime() ?? Date.now() + 24 * 60 * 60 * 1000,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function verifyMemberCardToken(token: string): MemberCardToken | null {
  const [encoded, received] = token.split(".");
  if (!encoded || !received || token.length > 2048) return null;

  const expected = sign(encoded);
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length || !timingSafeEqual(expectedBuffer, receivedBuffer)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as Partial<MemberCardToken>;
    if (typeof payload.cardNumber !== "string" || typeof payload.expiresAt !== "number") return null;
    if (payload.expiresAt < Date.now()) return null;
    return payload as MemberCardToken;
  } catch {
    return null;
  }
}
