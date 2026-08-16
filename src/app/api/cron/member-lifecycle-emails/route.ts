import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { Prisma } from "@/generated/prisma/client";
import { formatEuro } from "@/config/products";
import { MEMBER_PRODUCT_NAME, MEMBER_VALIDITY_TEXT } from "@/config/commercial";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl, getBackOfficeEmails, getTransactionalEmailFrom, requireServerEnv } from "@/server/env";
import { generateMemberAccessCode } from "@/server/member-access";
import { parseEmail } from "@/server/validation";

export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1_000;

function payloadRecord(payload: Prisma.JsonValue | null): Record<string, unknown> {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? { ...(payload as Record<string, unknown>) }
    : {};
}

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function firstName(profile?: { firstName?: string | null } | null): string {
  return profile?.firstName?.trim() || "l'ami vanlifer";
}

async function sendReviewRequestEmail(resend: Resend, to: string, name: string) {
  return resend.emails.send({
    from: getTransactionalEmailFrom(),
    to,
    subject: "Votre avis sur Label Vanlife nous aide à progresser",
    text: `Bonjour ${name},\n\nCela fait environ deux mois que votre carte membre Label Vanlife est active.\n\nVotre retour compte énormément : qu'est-ce qui vous aide vraiment, qu'est-ce qui manque, et qu'est-ce qui rendrait l'expérience encore plus utile sur la route ?\n\nVous pouvez simplement répondre à cet email avec votre avis. Nous lisons chaque retour.\n\nMerci de faire avancer Label Vanlife avec nous.\n\nL'équipe Label Vanlife`,
  });
}

async function sendRenewalReminderEmail(resend: Resend, to: string, name: string, amount: number, expiresAt: Date) {
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(expiresAt);
  return resend.emails.send({
    from: getTransactionalEmailFrom(),
    to,
    subject: "Votre carte membre arrive bientôt à échéance",
    text: `Bonjour ${name},\n\nVotre carte membre Label Vanlife arrive à échéance le ${date}.\n\nComme vous êtes déjà membre, vous pourrez renouveler votre carte au prix payé l'année précédente : ${formatEuro(amount)}.\n\nC'est notre manière de protéger les membres existants si le tarif public évolue l'an prochain.\n\nPour renouveler, connectez-vous à votre espace membre puis relancez l'adhésion : ${getAppUrl()}/member-login\n\nL'équipe Label Vanlife`,
  });
}

async function sendSimulationEmails(customerEmail: string) {
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const from = getTransactionalEmailFrom();
  const appUrl = getAppUrl();
  const code = generateMemberAccessCode();
  const adminRecipients = getBackOfficeEmails();

  const messages = [
    resend.emails.send({
      from,
      to: customerEmail,
      subject: "[TEST] Bienvenue dans Label Vanlife",
      text: `Bonjour Clément,\n\n[Simulation] Votre paiement de 29 € est confirmé.\n\n${MEMBER_PRODUCT_NAME}\n${MEMBER_VALIDITY_TEXT}\n\nVotre espace membre vous donne accès à la MAP Label Vanlife, à votre Carte membre numérique, aux fiches détaillées des lieux et au téléchargement de l'application depuis votre espace en ligne lorsqu'elle est disponible.\n\nL'équipe Label Vanlife`,
    }),
    resend.emails.send({
      from,
      to: customerEmail,
      subject: "[TEST] Votre code d'accès personnel Label Vanlife",
      text: `Bonjour Clément,\n\n[Simulation] Voici votre code d'accès personnel : ${code}\n\nConnexion à votre espace membre : ${appUrl}/member-login\n\nL'équipe Label Vanlife`,
    }),
    resend.emails.send({
      from,
      to: customerEmail,
      subject: "[TEST] Votre avis sur Label Vanlife nous aide à progresser",
      text: `Bonjour Clément,\n\n[Simulation J+60] Cela fait environ deux mois que votre carte membre Label Vanlife est active. Répondez simplement à cet email pour nous dire ce qui vous aide vraiment et ce qui manque.\n\nL'équipe Label Vanlife`,
    }),
    resend.emails.send({
      from,
      to: customerEmail,
      subject: "[TEST] Bienvenue dans la newsletter Label Vanlife",
      text: "Merci pour votre inscription. Vous recevrez désormais les actualités de Label Vanlife : nouveaux lieux, offres membres, guides et évolutions de la carte.",
    }),
    resend.emails.send({
      from,
      to: customerEmail,
      subject: "[TEST] Votre carte membre arrive bientôt à échéance",
      text: `Bonjour Clément,\n\n[Simulation renouvellement] Votre carte membre arrive bientôt à échéance. Comme vous êtes déjà membre, vous pourrez renouveler au prix payé l'année précédente : 29 €.\n\nConnexion : ${appUrl}/member-login\n\nL'équipe Label Vanlife`,
    }),
    resend.emails.send({
      from,
      to: adminRecipients,
      replyTo: customerEmail,
      subject: "[TEST BACK-OFFICE] Simulation parcours carte membre",
      text: `Simulation complète du parcours carte membre envoyée au client : ${customerEmail}\n\nEmails simulés : bienvenue, code d'accès, demande d'avis J+60, newsletter, rappel renouvellement au prix payé précédemment.\n\nCode de test généré pour l'email client : ${code}`,
    }),
  ];

  const results = await Promise.allSettled(messages);
  const errors = results
    .map((result) => {
      if (result.status === "rejected") return result.reason instanceof Error ? result.reason.message : "Email failed";
      return result.value.error?.message || null;
    })
    .filter((message): message is string => Boolean(message));

  return { sent: results.length - errors.length, failed: errors.length, errors };
}

async function runDueLifecycleEmails() {
  const prisma = getPrisma();
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const now = new Date();
  const reviewCutoff = new Date(now.getTime() - 60 * DAY);
  const renewalCutoff = new Date(now.getTime() + 30 * DAY);
  let reviewEmailsSent = 0;
  let renewalEmailsSent = 0;

  const reviewCandidates = await prisma.checkoutOrder.findMany({
    where: { product: "MEMBERSHIP", status: "PAID", paidAt: { lte: reviewCutoff } },
    include: { user: { include: { profile: true, membership: true } } },
    orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
    take: 100,
  });

  for (const order of reviewCandidates) {
    const payload = payloadRecord(order.payload);
    if (payload.memberReviewRequestSentAt || !order.user?.email) continue;
    const active = order.user.membership?.status === "ACTIVE"
      && (!order.user.membership.expiresAt || order.user.membership.expiresAt > now);
    if (!active) continue;

    const { error } = await sendReviewRequestEmail(resend, order.user.email, firstName(order.user.profile));
    await prisma.checkoutOrder.update({
      where: { id: order.id },
      data: {
        payload: {
          ...payload,
          memberReviewRequestAttemptedAt: now.toISOString(),
          ...(error
            ? { memberReviewRequestEmailError: (error.message || error.name).slice(0, 500) }
            : { memberReviewRequestSentAt: now.toISOString() }),
        } as Prisma.InputJsonObject,
      },
    });
    if (!error) reviewEmailsSent += 1;
  }

  const renewalCandidates = await prisma.membership.findMany({
    where: { status: "ACTIVE", expiresAt: { gte: now, lte: renewalCutoff } },
    include: {
      user: {
        include: {
          profile: true,
          checkoutOrders: {
            where: { product: "MEMBERSHIP", status: "PAID" },
            orderBy: [{ paidAt: "desc" }, { createdAt: "desc" }],
            take: 1,
          },
        },
      },
    },
    take: 100,
  });

  for (const membership of renewalCandidates) {
    const order = membership.user.checkoutOrders[0];
    if (!order || !membership.expiresAt || !membership.user.email) continue;
    const payload = payloadRecord(order.payload);
    if (payload.memberRenewalReminderMembershipExpiresAt === membership.expiresAt.toISOString()) continue;

    const { error } = await sendRenewalReminderEmail(
      resend,
      membership.user.email,
      firstName(membership.user.profile),
      order.amount,
      membership.expiresAt,
    );
    await prisma.checkoutOrder.update({
      where: { id: order.id },
      data: {
        payload: {
          ...payload,
          memberRenewalReminderAttemptedAt: now.toISOString(),
          memberRenewalReminderMembershipExpiresAt: membership.expiresAt.toISOString(),
          memberRenewalProtectedPrice: order.amount,
          ...(error
            ? { memberRenewalReminderEmailError: (error.message || error.name).slice(0, 500) }
            : { memberRenewalReminderSentAt: now.toISOString() }),
        } as Prisma.InputJsonObject,
      },
    });
    if (!error) renewalEmailsSent += 1;
  }

  return { reviewEmailsSent, renewalEmailsSent };
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runDueLifecycleEmails();
  return NextResponse.json({ success: true, ...result }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const customerEmail = parseEmail(body.customerEmail);
  if (!customerEmail) return NextResponse.json({ error: "Invalid customerEmail" }, { status: 400 });
  const result = await sendSimulationEmails(customerEmail);
  return NextResponse.json({ success: result.failed === 0, ...result }, { headers: { "Cache-Control": "no-store" } });
}
