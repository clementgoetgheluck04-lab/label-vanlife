import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { Prisma } from "@/generated/prisma/client";
import { formatEuro } from "@/config/products";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { generateMemberAccessCode, hashMemberAccessCode, hashMemberAccessLookupCode } from "@/server/member-access";
import { getStripe } from "@/server/stripe";

export const dynamic = "force-dynamic";

function stripeId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

async function sendLabellisationPaymentConfirmation(orderId: string): Promise<void> {
  const prisma = getPrisma();
  const order = await prisma.checkoutOrder.findUnique({ where: { id: orderId } });
  if (!order || order.product !== "LABELLISATION") return;

  const payload = order.payload && typeof order.payload === "object" && !Array.isArray(order.payload)
    ? { ...(order.payload as Record<string, unknown>) }
    : {};
  if (payload.paymentConfirmationSentAt) return;

  const candidateEmail = typeof payload.email === "string" ? payload.email : "";
  const candidateName = typeof payload.contactName === "string" ? payload.contactName : "";
  const establishmentName = typeof payload.establishmentName === "string" ? payload.establishmentName : "l'établissement";
  const amount = formatEuro(order.amount);
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const messages = [
    resend.emails.send({
      from: "Label Vanlife <contact@labelvanlife.com>",
      to: "contact@labelvanlife.com",
      replyTo: candidateEmail || undefined,
      subject: `Paiement reçu — ${establishmentName}`,
      text: `Le paiement de ${amount} pour la candidature de ${establishmentName} a bien été reçu.\n\nCommande : ${order.id}\nLe dossier peut maintenant être étudié depuis l'administration Label Vanlife.`,
    }),
  ];
  if (candidateEmail) {
    messages.push(resend.emails.send({
      from: "Label Vanlife <contact@labelvanlife.com>",
      to: candidateEmail,
      subject: `Paiement confirmé — ${establishmentName}`,
      text: `Bonjour${candidateName ? ` ${candidateName}` : ""},\n\nNous confirmons la réception de votre paiement de ${amount} pour la candidature de ${establishmentName}. Votre dossier va maintenant être étudié.\n\nS'il est déclaré non conforme aux critères du Label Vanlife, ce paiement sera remboursé intégralement sur le moyen de paiement utilisé.\n\nL'équipe Label Vanlife`,
    }));
  }

  const results = await Promise.all(messages);
  if (results.some(({ error }) => error)) throw new Error("Payment confirmation email failed");
  await prisma.checkoutOrder.update({
    where: { id: order.id },
    data: {
      payload: {
        ...payload,
        paymentConfirmationSentAt: new Date().toISOString(),
      } as Prisma.InputJsonObject,
    },
  });
}

async function sendMembershipActivation(orderId: string): Promise<void> {
  const prisma = getPrisma();
  const order = await prisma.checkoutOrder.findUnique({
    where: { id: orderId },
    include: { user: { include: { profile: true, memberCard: true, membership: true } } },
  });
  if (!order || order.product !== "MEMBERSHIP" || !order.user) return;

  const payload = order.payload && typeof order.payload === "object" && !Array.isArray(order.payload)
    ? { ...(order.payload as Record<string, unknown>) }
    : {};
  if (payload.activationEmailSentAt) return;

  const code = generateMemberAccessCode();
  const codeHash = hashMemberAccessCode(
    order.user.email,
    code,
    requireServerEnv("MEMBER_ACCESS_CODE_SECRET"),
  );
  const codeLookupHash = hashMemberAccessLookupCode(
    code,
    requireServerEnv("MEMBER_ACCESS_CODE_SECRET"),
  );
  const codeExpiresAt = order.user.membership?.expiresAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1_000);
  const profile = order.user.profile;
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Nouveau membre";
  const cardNumber = order.user.memberCard?.cardNumber || "en cours de création";
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const { error: adminEmailError } = await resend.emails.send({
    from: "Label Vanlife <contact@labelvanlife.com>",
    to: "contact@labelvanlife.com",
    replyTo: order.user.email,
    subject: `Nouveau membre payé — ${fullName}`,
    text: `Un nouveau membre vient de finaliser son paiement.\n\nNom : ${fullName}\nEmail : ${order.user.email}\nTéléphone : ${profile?.phone || "Non renseigné"}\nMontant : ${formatEuro(order.amount)}\nCarte membre : ${cardNumber}\nCommande : ${order.id}`,
  });
  if (adminEmailError) throw new Error("Membership admin notification failed");
  const { error: memberEmailError } = await resend.emails.send({
    from: "Label Vanlife <contact@labelvanlife.com>",
    to: order.user.email,
    subject: "Votre carte membre Label Vanlife est activée",
    text: `Bonjour ${profile?.firstName || ""},\n\nVotre paiement de ${formatEuro(order.amount)} est confirmé et votre espace membre est actif pendant 12 mois.\n\nVotre code d'accès personnel : ${code}\nConservez-le : il reste valable pendant toute la durée de votre carte membre. Saisissez uniquement ce code sur ${getAppUrl()}/member-login.\n\nNuméro de carte membre : ${cardNumber}\nPrésentez votre carte numérique et ce numéro aux lieux labellisés pour faire vérifier sa validité et bénéficier des avantages membres.\n\nVous avez maintenant accès à la MAP interactive, à votre carte membre et au téléchargement de l'application depuis votre espace en ligne.\n\nL'équipe Label Vanlife`,
  });
  if (memberEmailError) throw new Error("Membership activation email failed");

  await prisma.checkoutOrder.update({
    where: { id: order.id },
    data: {
      payload: {
        ...payload,
        memberAccessCodeHash: codeHash,
        memberAccessCodeLookupHash: codeLookupHash,
        memberAccessCodeExpiresAt: codeExpiresAt.toISOString(),
        memberAccessCodeUsedAt: null,
        activationEmailSentAt: new Date().toISOString(),
      } as Prisma.InputJsonObject,
    },
  });
}

async function claimEvent(event: Stripe.Event): Promise<"claimed" | "duplicate" | "busy"> {
  const prisma = getPrisma();
  const existing = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing?.status === "PROCESSED") return "duplicate";
  if (existing?.status === "PROCESSING") return "busy";
  if (existing?.status === "FAILED") {
    await prisma.stripeEvent.update({
      where: { id: event.id },
      data: { status: "PROCESSING", error: null },
    });
    return "claimed";
  }

  try {
    await prisma.stripeEvent.create({
      data: { id: event.id, type: event.type, status: "PROCESSING" },
    });
    return "claimed";
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return "busy";
    }
    throw error;
  }
}

async function activatePaidOrder(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) throw new Error("Checkout Session is missing orderId metadata");
  if (session.payment_status !== "paid") throw new Error("Checkout Session is not paid");

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    const order = await tx.checkoutOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new Error(`Unknown checkout order ${orderId}`);
    if (order.product === "MEMBERSHIP" && order.userId !== session.metadata?.userId) throw new Error("Checkout user mismatch");
    if (order.product !== session.metadata?.product) throw new Error("Checkout product mismatch");
    if (session.amount_total !== order.amount || session.currency !== order.currency) {
      throw new Error("Checkout amount or currency mismatch");
    }
    if (order.status === "PAID" || order.status === "REFUNDED") return;

    const paymentIntentId = stripeId(session.payment_intent);
    await tx.checkoutOrder.update({
      where: { id: order.id },
      data: {
        status: "PAID",
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: paymentIntentId,
        paidAt: order.paidAt ?? new Date(),
      },
    });

    await tx.payment.upsert({
      where: { orderId: order.id },
      create: {
        userId: order.userId,
        orderId: order.id,
        stripePaymentId: paymentIntentId ?? session.id,
        amount: order.amount,
        currency: order.currency,
        status: "SUCCEEDED",
        type: order.product === "MEMBERSHIP" ? "MEMBERSHIP" : "LABELLISATION",
        description: order.product === "MEMBERSHIP"
          ? "Carte membre Label Vanlife — 12 mois"
          : "Candidature Vanlife Friendly",
      },
      update: {
        stripePaymentId: paymentIntentId ?? session.id,
        status: "SUCCEEDED",
      },
    });

    if (order.product === "MEMBERSHIP") {
      if (!order.userId) throw new Error("Membership checkout is missing userId");
      const current = await tx.membership.findUnique({ where: { userId: order.userId } });
      const now = new Date();
      const base = current?.expiresAt && current.expiresAt > now ? current.expiresAt : now;
      const expiresAt = new Date(base);
      expiresAt.setUTCFullYear(expiresAt.getUTCFullYear() + 1);

      await tx.membership.upsert({
        where: { userId: order.userId },
        create: {
          userId: order.userId,
          offer: "YEARLY",
          status: "ACTIVE",
          startedAt: now,
          expiresAt,
        },
        update: { status: "ACTIVE", expiresAt, canceledAt: null },
      });

      await tx.memberCard.upsert({
        where: { userId: order.userId },
        create: {
          userId: order.userId,
          cardNumber: `LV-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`,
        },
        update: {},
      });
    }
  });
  await sendLabellisationPaymentConfirmation(orderId);
  await sendMembershipActivation(orderId);
}

async function cancelCheckout(session: Stripe.Checkout.Session): Promise<void> {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;
  await getPrisma().checkoutOrder.updateMany({
    where: { id: orderId, status: { in: ["PENDING", "CHECKOUT_CREATED"] } },
    data: { status: session.status === "expired" ? "CANCELED" : "FAILED" },
  });
}

async function refundOrder(charge: Stripe.Charge): Promise<void> {
  const paymentIntentId = stripeId(charge.payment_intent);
  if (!paymentIntentId || !charge.refunded) return;

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    const order = await tx.checkoutOrder.findUnique({
      where: { stripePaymentIntentId: paymentIntentId },
    });
    if (!order) return;

    await tx.checkoutOrder.update({ where: { id: order.id }, data: { status: "REFUNDED" } });
    await tx.payment.updateMany({ where: { orderId: order.id }, data: { status: "REFUNDED" } });
    if (order.product === "MEMBERSHIP" && order.userId) {
      await tx.membership.updateMany({
        where: { userId: order.userId },
        data: { status: "CANCELED", canceledAt: new Date() },
      });
    }
  });
}

async function processEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await activatePaidOrder(event.data.object as Stripe.Checkout.Session);
      return;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await cancelCheckout(event.data.object as Stripe.Checkout.Session);
      return;
    case "charge.refunded":
      await refundOrder(event.data.object as Stripe.Charge);
      return;
    default:
      return;
  }
}

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      requireServerEnv("STRIPE_WEBHOOK_SECRET"),
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const claim = await claimEvent(event);
    if (claim === "duplicate") return NextResponse.json({ received: true, duplicate: true });
    if (claim === "busy") return NextResponse.json({ error: "Event is already processing" }, { status: 409 });

    await processEvent(event);
    await getPrisma().stripeEvent.update({
      where: { id: event.id },
      data: { status: "PROCESSED", processedAt: new Date(), error: null },
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "Unknown webhook error";
    console.error(`[stripe-webhook:${event.id}]`, error);
    await getPrisma().stripeEvent.updateMany({
      where: { id: event.id },
      data: { status: "FAILED", error: message },
    });
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
