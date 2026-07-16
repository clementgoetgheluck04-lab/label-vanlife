import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

export function generateMemberAccessCode(): string {
  const value = randomBytes(8).toString("hex").toUpperCase();
  return `LV-${value.slice(0, 4)}-${value.slice(4, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}`;
}

export function normalizeMemberAccessCode(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 18);
}

export function hashMemberAccessLookupCode(code: string, secret: string): string {
  return createHash("sha256")
    .update(`${normalizeMemberAccessCode(code)}:${secret}`)
    .digest("hex");
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
