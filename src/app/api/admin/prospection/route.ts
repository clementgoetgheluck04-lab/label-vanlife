import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { canResumeProspect } from "@/lib/prospection-resume";
import { reconcileVerifiedProviderSuppressions } from "@/server/prospection-reconciliation";
import { deliverabilitySafetyCheck } from "@/server/prospection";
import { requireAdminUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, readJsonRequest } from "@/server/request-security";
import { getProspectionReplyTo, isProspectingEnabled, prospectingDailyLimit, sendNeedHumanAlert, suppressProspect, syncSpottedProspects } from "@/server/prospection";

export const dynamic = "force-dynamic";

function metadataRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

export async function GET() {
  try {
    await requireAdminUser();
    const prisma = getPrisma();
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const [groups, prospects, outboundMessages, replies, deliverability, sentToday, exclusions] = await Promise.all([
      prisma.prospect.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.prospect.findMany({
        orderBy: [{ updatedAt: "desc" }],
        take: 100,
        include: { messages: { orderBy: { createdAt: "desc" }, take: 1 } },
      }),
      prisma.prospectMessage.findMany({
        where: { direction: "OUTBOUND", status: "SENT" },
        select: { prospectId: true, kind: true, metadata: true, prospect: { select: { status: true } } },
      }),
      prisma.prospectMessage.count({ where: { direction: "INBOUND", status: "RECEIVED" } }),
      deliverabilitySafetyCheck(),
      prisma.prospectMessage.count({ where: { direction: "OUTBOUND", status: "SENT", kind: { not: "AUTO_REPLY" }, sentAt: { gte: startOfDay } } }),
      prisma.prospectSuppression.findMany({ select: { email: true, reason: true }, orderBy: { createdAt: "desc" } }),
    ]);
    const counts = Object.fromEntries(groups.map((group) => [group.status, group._count._all]));
    const initialSubject = {
      direction: { sent: 0, engaged: 0 },
      opportunity: { sent: 0, engaged: 0 },
    };
    const clickers = new Set<string>();
    for (const message of outboundMessages) {
      const metadata = metadataRecord(message.metadata);
      const recordedClick = typeof metadata.clickCount === "number" && metadata.clickCount > 0;
      if (recordedClick) clickers.add(message.prospectId);
      if (message.kind !== "INITIAL") continue;
      const variant = metadata.variant === "direction" ? "direction" : metadata.variant === "opportunity" ? "opportunity" : null;
      if (!variant) continue;
      initialSubject[variant].sent += 1;
      const legacyEngagement = message.prospect.status === "ENGAGED";
      if (recordedClick || legacyEngagement) {
        initialSubject[variant].engaged += 1;
        clickers.add(message.prospectId);
      }
    }
    return NextResponse.json({
      settings: {
        enabled: isProspectingEnabled(),
        dailyLimit: prospectingDailyLimit(),
        replyTo: getProspectionReplyTo(),
        webhookConfigured: Boolean(process.env.RESEND_WEBHOOK_SECRET),
      },
      totals: {
        prospects: groups.reduce((sum, group) => sum + group._count._all, 0),
        sent: outboundMessages.length,
        replies,
        clickers: clickers.size,
        counts,
      },
      experiments: { initialSubject },
      safety: { ...deliverability, sentToday, exclusions },
      prospects,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "admin-prospection-list");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    await requireAdminUser();
    const body = await readJsonRequest(request, 8_192) as { action?: unknown; prospectId?: unknown };
    const action = typeof body.action === "string" ? body.action : "";
    const prospectId = typeof body.prospectId === "string" ? body.prospectId : "";
    const prisma = getPrisma();

    if (action === "reconcile_suppressions") {
      return NextResponse.json({ success: true, ...await reconcileVerifiedProviderSuppressions() }, { headers: { "Cache-Control": "no-store" } });
    }

    if (action === "sync") return NextResponse.json({ success: true, imported: await syncSpottedProspects() });
    if (action === "notify_setup") {
      await sendNeedHumanAlert("Connexion Resend nécessaire", "La machine de prospection est prête. Connectez-vous à Resend pour activer la réception automatique des réponses et le webhook sécurisé.");
      return NextResponse.json({ success: true });
    }
    if (!prospectId) return NextResponse.json({ error: "Prospect manquant" }, { status: 400 });
    const prospect = await prisma.prospect.findUnique({ where: { id: prospectId } });
    if (!prospect) return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });

    // Do not let pause -> resume erase a refusal, invalid address or completed sale.
    const excludedStatuses = ["NOT_INTERESTED", "UNSUBSCRIBED", "INVALID", "CONVERTED", "QUALIFIED"];
    if (["pause", "resume", "retry"].includes(action)) {
      const suppression = await prisma.prospectSuppression.findUnique({ where: { email: prospect.email } });
      if (suppression || excludedStatuses.includes(prospect.status)) {
        return NextResponse.json({ error: "Ce contact est exclu ou son parcours commercial est terminé. Aucune relance autorisée." }, { status: 409 });
      }
    }
    if (action === "pause") await prisma.prospect.updateMany({ where: { id: prospectId, status: prospect.status }, data: { status: "PAUSED", nextActionAt: null } });
    else if (action === "resume" || action === "retry") {
      if (!canResumeProspect(prospect.status, false)) {
        return NextResponse.json({ error: "Seuls les contacts en pause ou en erreur peuvent être repris." }, { status: 409 });
      }
      const status = !prospect.firstContactedAt ? "NEW" : prospect.followUpCount >= 3 && prospect.followUpCount < 10 ? "ENGAGED" : prospect.followUpCount <= 1 ? "CONTACTED" : prospect.followUpCount === 2 ? "FOLLOW_UP_1" : "FOLLOW_UP_2";
      const updated = await prisma.prospect.updateMany({ where: { id: prospectId, status: prospect.status }, data: { status, nextActionAt: status === "FOLLOW_UP_2" ? null : new Date() } });
      if (!updated.count) return NextResponse.json({ error: "Le statut a changé. Actualisez avant toute reprise." }, { status: 409 });
    } else if (action === "qualified") await prisma.prospect.update({ where: { id: prospectId }, data: { status: "QUALIFIED", nextActionAt: null } });
    else if (action === "converted") await prisma.prospect.update({ where: { id: prospectId }, data: { status: "CONVERTED", convertedAt: new Date(), nextActionAt: null } });
    else if (action === "suppress") await suppressProspect(prospect.email, "manual", "admin-dashboard");
    else return NextResponse.json({ error: "Action inconnue" }, { status: 400 });
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "admin-prospection-action");
  }
}
