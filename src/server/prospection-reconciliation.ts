import "server-only";
import { getPrisma } from "@/lib/prisma";

// Manually verified in Resend /emails/suppressions on 2026-09-22.
// Append-only evidence: never use this repair to remove an existing exclusion.
const VERIFIED_PROVIDER_SUPPRESSIONS = [
  { email: "contact@domaine-de-christin.fr", reason: "bounce" },
  { email: "admin@camping-aubusson.fr", reason: "bounce" },
  { email: "campingmerrysuryonne@yahoo.com", reason: "complaint" },
  { email: "camping.la.vallee@orange.fr", reason: "bounce" },
] as const;

export async function reconcileVerifiedProviderSuppressions() {
  const prisma = getPrisma();
  let stopped = 0;
  for (const item of VERIFIED_PROVIDER_SUPPRESSIONS) {
    await prisma.$transaction(async (tx) => {
      const suppression = await tx.prospectSuppression.upsert({
        where: { email: item.email },
        create: { ...item, source: "resend-dashboard-audit-2026-09-22" },
        update: {},
      });
      const result = await tx.prospect.updateMany({
        where: { email: item.email, status: { notIn: ["INVALID", "UNSUBSCRIBED", "NOT_INTERESTED", "CONVERTED", "QUALIFIED"] } },
        data: { status: suppression.reason === "bounce" ? "INVALID" : "UNSUBSCRIBED", nextActionAt: null },
      });
      stopped += result.count;
    });
  }
  return { checked: VERIFIED_PROVIDER_SUPPRESSIONS.length, stopped };
}
