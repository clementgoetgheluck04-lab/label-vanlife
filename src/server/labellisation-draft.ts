import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { requireSecretEnv } from "@/server/env";

const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1_000;

type DraftProof = {
  draftId: string;
  email: string;
  attachmentPaths: string[];
};

function getDraftSecret(): string {
  return process.env.LABELLISATION_DRAFT_SECRET
    ? requireSecretEnv("LABELLISATION_DRAFT_SECRET")
    : requireSecretEnv("MEMBER_ACCESS_CODE_SECRET");
}

function canonicalDraft(proof: DraftProof, expiresAt: number): string {
  return [
    "label-vanlife-labellisation-draft-v1",
    proof.draftId,
    proof.email.trim().toLowerCase(),
    String(expiresAt),
    ...proof.attachmentPaths,
  ].join("\n");
}

function signature(proof: DraftProof, expiresAt: number): string {
  return createHmac("sha256", getDraftSecret())
    .update(canonicalDraft(proof, expiresAt))
    .digest("base64url");
}

export function createDraftToken(proof: DraftProof, now = Date.now()): string {
  const expiresAt = now + TOKEN_LIFETIME_MS;
  return `${expiresAt}.${signature(proof, expiresAt)}`;
}

export function verifyDraftToken(proof: DraftProof, token: string, now = Date.now()): boolean {
  const match = /^(\d{13})\.([A-Za-z0-9_-]{43})$/.exec(token);
  if (!match) return false;
  const expiresAt = Number(match[1]);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + TOKEN_LIFETIME_MS) {
    return false;
  }
  const actual = Buffer.from(match[2]);
  const expected = Buffer.from(signature(proof, expiresAt));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
