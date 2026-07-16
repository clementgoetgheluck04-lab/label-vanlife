import { createHash, randomInt, timingSafeEqual } from "node:crypto";

export function generateMemberAccessCode(): string {
  const digits = randomInt(0, 100_000_000).toString().padStart(8, "0");
  return `${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function normalizeMemberAccessCode(value: string): string {
  return value.replace(/\D/g, "").slice(0, 8);
}

export function hashMemberAccessCode(email: string, code: string, secret: string): string {
  return createHash("sha256")
    .update(`${email.trim().toLowerCase()}:${normalizeMemberAccessCode(code)}:${secret}`)
    .digest("hex");
}

export function memberAccessCodeMatches(email: string, code: string, secret: string, expectedHash: string): boolean {
  const actual = Buffer.from(hashMemberAccessCode(email, code, secret), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
