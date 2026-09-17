import type { Prisma } from "@/generated/prisma/client";

export const VISIT_PROOF_BUCKET = "member-visit-proofs";

export type VisitProofStatus = "PENDING" | "MEDIATION" | "PUBLISHED" | "REJECTED";

export type VisitProofMetadata = {
  kind: "visit-proof";
  paths: string[];
  displayedPriceCents: number;
  paidPriceCents: number;
  discountPercent: number;
  expectedMemberPriceCents: number;
  status: VisitProofStatus;
  submittedAt: string;
  moderatedAt?: string;
};

export function readVisitProofMetadata(value: Prisma.JsonValue | null | undefined): VisitProofMetadata | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  const paths = Array.isArray(record.paths) ? record.paths.filter((path): path is string => typeof path === "string") : [];
  const status = record.status;
  if (
    record.kind !== "visit-proof"
    || paths.length !== 3
    || typeof record.displayedPriceCents !== "number"
    || typeof record.paidPriceCents !== "number"
    || typeof record.discountPercent !== "number"
    || typeof record.expectedMemberPriceCents !== "number"
    || (status !== "PENDING" && status !== "MEDIATION" && status !== "PUBLISHED" && status !== "REJECTED")
    || typeof record.submittedAt !== "string"
  ) return null;
  return {
    kind: "visit-proof",
    paths,
    displayedPriceCents: record.displayedPriceCents,
    paidPriceCents: record.paidPriceCents,
    discountPercent: record.discountPercent,
    expectedMemberPriceCents: record.expectedMemberPriceCents,
    status,
    submittedAt: record.submittedAt,
    moderatedAt: typeof record.moderatedAt === "string" ? record.moderatedAt : undefined,
  };
}

export function writeVisitProofMetadata(metadata: VisitProofMetadata): Prisma.InputJsonObject {
  return metadata as unknown as Prisma.InputJsonObject;
}
