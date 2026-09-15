import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { Resend } from "resend";
import { Prisma } from "@/generated/prisma/client";
import { formatEuro } from "@/config/products";
import { MEMBER_EXPIRY_ISO, MEMBER_EXPIRY_LABEL, MEMBER_PRODUCT_NAME, MEMBER_VALIDITY_TEXT } from "@/config/commercial";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl, getBackOfficeEmails, getTransactionalEmailFrom, requireSecretEnv, requireServerEnv } from "@/server/env";
import { generateMemberAccessCode, hashMemberAccessCode, hashMemberAccessLookupCode } from "@/server/member-access";
import { getStripe } from "@/server/stripe";
import { assertRequestSize } from "@/server/request-security";
import { apiError } from "@/server/http";
import { labelVanlifeEmail } from "@/server/email-template";

export const dynamic = "force-dynamic";

function stripeId(value: string | { id: string } | null): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

type ResendEmailResult = Awaited<ReturnType<Resend["emails"]["send"]>>;

function resendEmailErrorMessage(result: PromiseSettledResult<ResendEmailResult>): string | null {
  if (result.status === "rejected") {
    return result.reason instanceof Error ? result.reason.message : "Email send failed";
  }
  return result.value.error?.message || null;
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
  if (candidateEmail) {
    await prisma.prospect.updateMany({
      where: { email: candidateEmail.trim().toLowerCase() },
      data: { status: "CONVERTED", convertedAt: new Date(), nextActionAt: null },
    });
  }
  const from = getTransactionalEmailFrom();
  const messages = [
    resend.emails.send({
      from,
      to: getBackOfficeEmails(),
      replyTo: candidateEmail || undefined,
      subject: `Paiement reçu — ${establishmentName}`,
      text: `Le paiement de ${amount} pour la candidature de ${establishmentName} a bien été reçu.\n\nCommande : ${order.id}\nLe dossier peut maintenant être étudié depuis l'administration Label Vanlife.`,
      html: labelVanlifeEmail({
        preheader: `Paiement reçu pour ${establishmentName}`,
        eyebrow: "ESPACE PROFESSIONNEL",
        title: "Un paiement de labellisation a été reçu",
        paragraphs: [`Le dossier de ${establishmentName} peut maintenant être étudié depuis l’administration Label Vanlife.`],
        details: [
          { label: "Établissement", value: establishmentName },
          { label: "Montant", value: amount },
          { label: "Commande", value: order.id },
        ],
        action: { label: "Ouvrir l’administration", href: `${getAppUrl()}/admin/labellisations` },
      }),
    }),
  ];
  if (candidateEmail) {
    messages.push(resend.emails.send({
      from,
      to: candidateEmail,
      subject: `Paiement confirmé — ${establishmentName}`,
      text: `Bonjour${candidateName ? ` ${candidateName}` : ""},\n\nNous confirmons la réception de votre paiement de ${amount} pour la candidature de ${establishmentName}. Votre dossier va maintenant être étudié.\n\nS'il est déclaré non conforme aux critères du Label Vanlife, ce paiement sera remboursé intégralement sur le moyen de paiement utilisé.\n\nL'équipe Label Vanlife`,
      html: labelVanlifeEmail({
        preheader: `Votre paiement de ${amount} est confirmé`,
        eyebrow: "CANDIDATURE ENREGISTRÉE",
        title: "Votre paiement est confirmé",
        greeting: `Bonjour${candidateName ? ` ${candidateName}` : ""},`,
        paragraphs: [`Nous avons bien reçu votre paiement pour la candidature de ${establishmentName}. Votre dossier va maintenant être étudié par notre équipe.`],
        details: [
          { label: "Établissement", value: establishmentName },
          { label: "Montant réglé", value: amount },
        ],
        notice: "Si le dossier est déclaré non conforme aux critères du Label Vanlife, le paiement sera remboursé intégralement sur le moyen de paiement utilisé.",
      }),
    }));
  }

  const results = await Promise.allSettled(messages);
  const emailErrors = results
    .map(resendEmailErrorMessage)
    .filter((message): message is string => Boolean(message));
  await prisma.checkoutOrder.update({
    where: { id: order.id },
    data: {
      payload: {
        ...payload,
        paymentConfirmationAttemptedAt: new Date().toISOString(),
        ...(emailErrors.length === 0
          ? { paymentConfirmationSentAt: new Date().toISOString() }
          : { paymentConfirmationEmailError: emailErrors.join(" | ").slice(0, 500) }),
      } as Prisma.InputJsonObject,
    },
  });
}

async function sendMembershipActivation(orderId: string): Promise<void> {
  const prisma = getPrisma();
  const order = await prisma.checkoutOrder.findUnique({
    where: { id: orderId },
    include: { user: { include: { profile: true, memberCard: true, membership: true, memberCompanions: true } } },
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
    requireSecretEnv("MEMBER_ACCESS_CODE_SECRET"),
  );
  const codeLookupHash = hashMemberAccessLookupCode(
    code,
    requireSecretEnv("MEMBER_ACCESS_CODE_SECRET"),
  );
  const codeExpiresAt = order.user.membership?.expiresAt ?? new Date(MEMBER_EXPIRY_ISO);
  const profile = order.user.profile;
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Nouveau membre";
  const coveredPeople = [
    `${fullName}${profile?.age ? ` (${profile.age} ans)` : ""} — titulaire`,
    ...order.user.memberCompanions.map((companion) => `${companion.firstName} ${companion.lastName} (${companion.age} ans) — accompagnant`),
  ].join("\n");
  const cardNumber = order.user.memberCard?.cardNumber || "en cours de création";
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const from = getTransactionalEmailFrom();
  await prisma.checkoutOrder.update({
    where: { id: order.id },
    data: {
      payload: {
        ...payload,
        memberAccessCodeHash: codeHash,
        memberAccessCodeLookupHash: codeLookupHash,
        memberAccessCodeExpiresAt: codeExpiresAt.toISOString(),
        memberAccessCodeUsedAt: null,
        activationEmailAttemptedAt: new Date().toISOString(),
      } as Prisma.InputJsonObject,
    },
  });
  const [adminEmailResult, memberWelcomeEmailResult, memberAccessCodeEmailResult] = await Promise.allSettled([
    resend.emails.send({
    from,
    to: getBackOfficeEmails(),
    replyTo: order.user.email,
    subject: `Nouveau membre payé — ${fullName}`,
    text: `Un nouveau membre vient de finaliser son paiement.\n\nPersonnes couvertes :\n${coveredPeople}\n\nEmail : ${order.user.email}\nTéléphone : ${profile?.phone || "Non renseigné"}\nMontant : ${formatEuro(order.amount)}\nCarte membre : ${cardNumber}\nCommande : ${order.id}`,
    html: labelVanlifeEmail({
      preheader: `Nouvelle adhésion payée — ${fullName}`,
      eyebrow: "NOUVELLE ADHÉSION",
      title: "Un nouveau membre rejoint Label Vanlife",
      paragraphs: ["Le paiement a été confirmé et la carte membre a été activée automatiquement.", `Personnes couvertes :\n${coveredPeople}`],
      details: [
        { label: "Membre", value: fullName },
        { label: "Email", value: order.user.email },
        { label: "Téléphone", value: profile?.phone || "Non renseigné" },
        { label: "Montant", value: formatEuro(order.amount) },
        { label: "Carte", value: cardNumber },
        { label: "Commande", value: order.id },
      ],
      action: { label: "Ouvrir l’administration", href: `${getAppUrl()}/admin` },
    }),
    }),
    resend.emails.send({
    from,
    to: order.user.email,
    subject: "Bienvenue dans Label Vanlife",
    text: `Bonjour ${profile?.firstName || ""},\n\nBienvenue dans Label Vanlife — votre paiement de ${formatEuro(order.amount)} est confirmé.\n\n${MEMBER_PRODUCT_NAME}\n${MEMBER_VALIDITY_TEXT}\n\nNuméro de carte membre : ${cardNumber}\n\nVotre espace membre vous donne accès à la MAP Label Vanlife, à votre Carte membre numérique, aux fiches détaillées des lieux et au téléchargement de l'application depuis votre espace en ligne lorsqu'elle est disponible.\n\nPrésentez votre Carte membre numérique aux lieux labellisés pour faire vérifier sa validité et bénéficier des avantages membres.\n\nL'équipe Label Vanlife`,
    html: labelVanlifeEmail({
      preheader: `Votre paiement de ${formatEuro(order.amount)} est confirmé et votre carte est active`,
      eyebrow: "BIENVENUE DANS LA COMMUNAUTÉ",
      title: "Votre Carte membre est active",
      greeting: `Bonjour ${profile?.firstName || ""},`,
      paragraphs: ["Bienvenue dans Label Vanlife. Votre paiement est confirmé et votre espace membre est prêt.", "Retrouvez la MAP Label Vanlife, votre Carte membre numérique, les fiches détaillées des lieux et tous vos avantages."],
      details: [
        { label: "Offre", value: MEMBER_PRODUCT_NAME },
        { label: "Montant", value: formatEuro(order.amount) },
        { label: "Carte membre", value: cardNumber },
        { label: "Validité", value: MEMBER_VALIDITY_TEXT },
      ],
      action: { label: "Accéder à mon espace membre", href: `${getAppUrl()}/member-login` },
      notice: "Présentez votre Carte membre numérique aux lieux labellisés pour faire vérifier sa validité et bénéficier des avantages membres.",
    }),
    }),
    resend.emails.send({
    from,
    to: order.user.email,
    subject: "Votre code d'accès personnel Label Vanlife",
    text: `Bonjour ${profile?.firstName || ""},\n\nVoici votre code d'accès personnel : ${code}\n\nConservez-le : il reste valable jusqu'au ${MEMBER_EXPIRY_LABEL}, comme votre Carte membre.\n\nConnexion à votre espace membre : ${getAppUrl()}/member-login\n\nSaisissez uniquement ce code, puis vous serez redirigé vers votre espace membre.\n\nL'équipe Label Vanlife`,
    html: labelVanlifeEmail({
      preheader: "Votre code personnel pour ouvrir l’espace membre",
      eyebrow: "ACCÈS MEMBRE SÉCURISÉ",
      title: "Voici votre code d’accès personnel",
      greeting: `Bonjour ${profile?.firstName || ""},`,
      paragraphs: ["Utilisez ce code pour vous connecter simplement à votre espace membre Label Vanlife."],
      code,
      action: { label: "Ouvrir l’espace membre", href: `${getAppUrl()}/member-login` },
      notice: `Ce code est personnel. Ne le transmettez jamais. Il reste valable jusqu’au ${MEMBER_EXPIRY_LABEL}, comme votre Carte membre.`,
    }),
    }),
  ]);
  const emailErrors = [
    resendEmailErrorMessage(adminEmailResult) && `admin: ${resendEmailErrorMessage(adminEmailResult)}`,
    resendEmailErrorMessage(memberWelcomeEmailResult) && `member welcome: ${resendEmailErrorMessage(memberWelcomeEmailResult)}`,
    resendEmailErrorMessage(memberAccessCodeEmailResult) && `member access code: ${resendEmailErrorMessage(memberAccessCodeEmailResult)}`,
  ].filter((message): message is string => Boolean(message));

  await prisma.checkoutOrder.update({
    where: { id: order.id },
    data: {
      payload: {
        ...payload,
        memberAccessCodeHash: codeHash,
        memberAccessCodeLookupHash: codeLookupHash,
        memberAccessCodeExpiresAt: codeExpiresAt.toISOString(),
        memberAccessCodeUsedAt: null,
        memberPaidAmount: order.amount,
        memberPaidCurrency: order.currency,
        memberRenewalProtectedPrice: order.amount,
        memberRenewalProtectedPriceSourceOrderId: order.id,
        activationEmailAttemptedAt: new Date().toISOString(),
        ...(emailErrors.length === 0
          ? { activationEmailSentAt: new Date().toISOString() }
          : { activationEmailError: emailErrors.join(" | ").slice(0, 500) }),
      } as Prisma.InputJsonObject,
    },
  });
}

async function claimEvent(event: Stripe.Event): Promise<"claimed" | "duplicate" | "busy"> {
  const prisma = getPrisma();
  const existing = await prisma.stripeEvent.findUnique({ where: { id: event.id } });
  if (existing?.status === "PROCESSED") return "duplicate";
  if (existing?.status === "PROCESSING") {
    const leaseExpiredBefore = new Date(Date.now() - 5 * 60 * 1_000);
    const reclaimed = await prisma.stripeEvent.updateMany({
      where: { id: event.id, status: "PROCESSING", updatedAt: { lt: leaseExpiredBefore } },
      data: { status: "PROCESSING", error: null },
    });
    return reclaimed.count === 1 ? "claimed" : "busy";
  }
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
          ? MEMBER_PRODUCT_NAME
          : "Candidature Vanlife Friendly",
      },
      update: {
        stripePaymentId: paymentIntentId ?? session.id,
        status: "SUCCEEDED",
      },
    });

    if (order.product === "MEMBERSHIP") {
      if (!order.userId) throw new Error("Membership checkout is missing userId");
      const now = new Date();
      const expiresAt = new Date(MEMBER_EXPIRY_ISO);

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

    await tx.analyticsEvent.create({
      data: {
        name: order.product === "MEMBERSHIP" ? "membership_purchase" : "label_purchase",
        userId: order.userId,
        entityType: "checkout_order",
        entityId: order.id,
        source: "stripe",
        properties: { amount: order.amount, currency: order.currency, product: order.product },
      },
    });
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
  try {
    assertRequestSize(request, 2 * 1024 * 1024);
  } catch (error) {
    return apiError(error, "stripe-webhook-size");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      requireSecretEnv("STRIPE_WEBHOOK_SECRET"),
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
