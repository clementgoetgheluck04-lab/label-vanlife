import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { requireAdminUser } from "@/server/auth";
import { requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { getStripe } from "@/server/stripe";
import { parseText } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdminUser();
    const orders = await getPrisma().checkoutOrder.findMany({
      where: { product: "LABELLISATION", status: { in: ["PAID", "REFUNDED"] } },
      orderBy: { createdAt: "desc" },
      select: { id: true, status: true, amount: true, currency: true, payload: true, paidAt: true, createdAt: true },
    });
    return NextResponse.json({ orders }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "admin-labellisations-list");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "admin-labellisation-decision", 30, 60 * 60 * 1_000);
    const admin = await requireAdminUser();
    const input = await request.json() as Record<string, unknown>;
    const orderId = parseText(input.orderId, { min: 10, max: 120, required: true });
    const decision = input.decision === "ACCEPTED" || input.decision === "REJECTED" ? input.decision : null;
    const reason = parseText(input.reason, { max: 1_000 });
    if (!orderId || !decision || reason === null) return NextResponse.json({ error: "Décision invalide" }, { status: 400 });
    if (decision === "REJECTED" && !reason) {
      return NextResponse.json({ error: "Le motif de non-conformité est obligatoire" }, { status: 400 });
    }

    const prisma = getPrisma();
    const order = await prisma.checkoutOrder.findUnique({ where: { id: orderId } });
    if (!order || order.product !== "LABELLISATION" || !["PAID", "REFUNDED"].includes(order.status)) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }
    const payload = order.payload && typeof order.payload === "object" && !Array.isArray(order.payload)
      ? { ...(order.payload as Record<string, unknown>) }
      : {};
    const previousDecision = payload.reviewStatus;
    if (previousDecision === decision) return NextResponse.json({ success: true, duplicate: true });
    if (previousDecision && previousDecision !== decision) {
      return NextResponse.json({ error: "Une décision définitive existe déjà" }, { status: 409 });
    }

    if (decision === "REJECTED") {
      if (!order.stripePaymentIntentId) return NextResponse.json({ error: "Paiement Stripe introuvable" }, { status: 409 });
      await getStripe().refunds.create({
        payment_intent: order.stripePaymentIntentId,
        metadata: { orderId: order.id, cause: "labellisation_non_conforme" },
      }, { idempotencyKey: `labellisation_refund_${order.id}` });
    }

    const candidateEmail = typeof payload.email === "string" ? payload.email : "";
    const establishmentName = typeof payload.establishmentName === "string" ? payload.establishmentName : "votre établissement";
    if (candidateEmail) {
      const accepted = decision === "ACCEPTED";
      const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
      const { error: emailError } = await resend.emails.send({
        from: "Label Vanlife <contact@labelvanlife.com>",
        to: candidateEmail,
        subject: accepted ? `Labellisation validée — ${establishmentName}` : `Décision et remboursement — ${establishmentName}`,
        text: accepted
          ? `Bonjour,\n\nVotre candidature pour ${establishmentName} est conforme et validée. Nous revenons vers vous avec votre fiche et votre kit Label Vanlife.\n\nL'équipe Label Vanlife`
          : `Bonjour,\n\nAprès étude, la candidature de ${establishmentName} ne peut pas être validée en l'état.\n\nMotif : ${reason}\n\nLe remboursement intégral du paiement a été déclenché sur le moyen de paiement utilisé. Le délai d'apparition dépend de votre établissement financier.\n\nL'équipe Label Vanlife`,
      });
      if (emailError) throw new Error("L'email de décision n'a pas pu être envoyé");
    }

    const reviewedPayload = {
      ...payload,
      reviewStatus: decision,
      reviewReason: reason || "",
      reviewedAt: new Date().toISOString(),
      reviewedBy: admin.id,
    } as Prisma.InputJsonObject;
    await prisma.$transaction([
      prisma.checkoutOrder.update({ where: { id: order.id }, data: { payload: reviewedPayload, ...(decision === "REJECTED" ? { status: "REFUNDED" as const } : {}) } }),
      ...(decision === "REJECTED" ? [prisma.payment.updateMany({ where: { orderId: order.id }, data: { status: "REFUNDED" } })] : []),
    ]);

    return NextResponse.json({ success: true, decision, refunded: decision === "REJECTED" });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "admin-labellisation-decision");
  }
}
