import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPrisma } from "@/lib/prisma";
import { labelVanlifeEmail } from "@/server/email-template";
import { getAppUrl, getTransactionalEmailFrom, requireSecretEnv, requireServerEnv } from "@/server/env";
import { getProspectionReplyTo, normalizeProspectEmail, sendNeedHumanAlert, suppressProspect } from "@/server/prospection";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ResendEvent = {
  type: string;
  data?: {
    email_id?: string;
    from?: string;
    to?: string[];
    subject?: string;
    click?: { link?: string };
  };
};

function senderAddress(value: string): string {
  const bracketed = value.match(/<([^>]+)>/);
  return normalizeProspectEmail(bracketed?.[1] || value);
}

function normalizedWords(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

function classifyReply(subject: string, body: string): "auto" | "unsubscribe" | "negative" | "interested" | "question" | "human" {
  const value = normalizedWords(`${subject}\n${body}`).slice(0, 12_000);
  if (/automatic reply|reponse automatique|absence|out of office|vacation reply|message automatique/.test(value)) return "auto";
  if (/desinscri|ne (me |nous )?contact|retir.{0,20}(liste|fichier)|supprim.{0,20}(liste|fichier)|stop|plus recevoir/.test(value)) return "unsubscribe";
  if (/pas interesse|non merci|ne souhait|refus|aucun interet|pas donner suite/.test(value)) return "negative";
  if (/plainte|avocat|juridique|rgpd|cnil|litige|rembours|negoci|contrat|facture|devis personnalise/.test(value)) return "human";
  if (/interess|d'accord|partant|souhait.{0,30}(rejoindre|inscri|candidat)|comment s'inscrire|oui[, .!]|plus d'information/.test(value)) return "interested";
  if (/\?|prix|tarif|cout|combien|commission|duree|validite|fonctionn|avantage/.test(value)) return "question";
  return "human";
}

async function handleDeliveryEvent(event: ResendEvent): Promise<void> {
  const providerMessageId = event.data?.email_id;
  if (!providerMessageId) return;
  const prisma = getPrisma();
  const message = await prisma.prospectMessage.findUnique({
    where: { providerMessageId },
    include: { prospect: true },
  });
  if (!message) return;
  if (event.type === "email.bounced" || event.type === "email.suppressed") await suppressProspect(message.prospect.email, "bounce", "resend-webhook");
  if (event.type === "email.complained") await suppressProspect(message.prospect.email, "complaint", "resend-webhook");
}

async function handleClick(event: ResendEvent): Promise<void> {
  const providerMessageId = event.data?.email_id;
  const link = event.data?.click?.link || "";
  let clickedUrl: URL;
  try {
    clickedUrl = new URL(link);
  } catch {
    return;
  }
  if (!providerMessageId || !/(^|\.)labelvanlife\.(fr|com)$/i.test(clickedUrl.hostname) || /desinscription|unsubscribe/i.test(clickedUrl.pathname)) return;
  const prisma = getPrisma();
  const message = await prisma.prospectMessage.findUnique({
    where: { providerMessageId },
    include: { prospect: true },
  });
  if (!message || message.direction !== "OUTBOUND" || message.prospect.followUpCount >= 10) return;
  if (!["CONTACTED", "FOLLOW_UP_1", "FOLLOW_UP_2"].includes(message.prospect.status)) return;
  await prisma.prospect.update({
    where: { id: message.prospect.id },
    data: {
      status: "ENGAGED",
      nextActionAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1_000),
    },
  });
}

async function sendSalesReply(prospect: { id: string; sourceId: string | null; name: string; email: string }, subject: string, inboundId: string, kind: "interested" | "question") {
  const prisma = getPrisma();
  const campaignKey = `reply:${inboundId}`;
  const existing = await prisma.prospectMessage.findUnique({ where: { campaignKey } });
  if (existing?.status === "SENT") return;
  const candidature = new URL("/labellisation/candidature", getAppUrl());
  if (prospect.sourceId) candidature.searchParams.set("claim", prospect.sourceId);
  const replySubject = /^re:/i.test(subject) ? subject : `Re: ${subject || `Label Vanlife et ${prospect.name}`}`;
  const paragraphs = kind === "interested"
    ? [
        `Merci pour votre retour concernant ${prospect.name}. Nous serions heureux d’étudier votre intégration au réseau Label Vanlife 2027.`,
        "La démarche commence par un dossier en ligne. Il nous permet de vérifier l’accueil, les services et l’avantage proposé aux membres. La prévente 2027 est actuellement à 110 € au lieu de 290 €, dans la limite des places disponibles.",
        "Le règlement couvre la fiche, la présence sur la MAP membre, le kit de communication et l’accompagnement jusqu’au 31 décembre 2027, sans commission sur vos réservations. Si le dossier est déclaré non conforme après étude, le paiement est remboursé intégralement.",
      ]
    : [
        `Merci pour votre question concernant ${prospect.name}. Voici les informations essentielles pour décider simplement.`,
        "La labellisation 2027 est proposée en prévente à 110 € au lieu de 290 €, dans la limite des places disponibles. Elle reste active jusqu’au 31 décembre 2027 et Label Vanlife ne prend aucune commission sur les réservations.",
        "Elle comprend l’étude du dossier, la fiche établissement, la présence sur la MAP membre, le kit de communication et l’accompagnement. Si une situation particulière nécessite une réponse personnalisée, répondez à ce message : elle sera transmise à Clément.",
      ];
  const text = `Bonjour,\n\n${paragraphs.join("\n\n")}\n\nDécouvrir le fonctionnement : ${getAppUrl()}/labellisation\nDéposer la candidature : ${candidature.href}\n\nClément — Label Vanlife`;
  const message = existing || await prisma.prospectMessage.create({
    data: { prospectId: prospect.id, direction: "OUTBOUND", kind: "AUTO_REPLY", campaignKey, subject: replySubject, text },
  });
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const result = await resend.emails.send({
    from: getTransactionalEmailFrom(),
    to: prospect.email,
    replyTo: getProspectionReplyTo(),
    subject: replySubject,
    text,
    html: labelVanlifeEmail({
      preheader: "La réponse Label Vanlife et les prochaines étapes",
      eyebrow: "VOTRE PROJET LABEL VANLIFE",
      title: kind === "interested" ? "Ravis de poursuivre avec vous" : "Les informations pour décider simplement",
      greeting: "Bonjour,",
      paragraphs,
      details: [
        { label: "Prévente 2027", value: "110 € au lieu de 290 €" },
        { label: "Commission", value: "0 % sur les réservations" },
        { label: "Validité", value: "Jusqu’au 31 décembre 2027" },
      ],
      action: { label: "Déposer ma candidature", href: candidature.href },
      secondaryAction: { label: "Découvrir le fonctionnement", href: `${getAppUrl()}/labellisation` },
      notice: "Une situation particulière ? Répondez simplement à ce message : Clément prendra le relais si une décision humaine est nécessaire.",
      signature: "Clément — Label Vanlife",
    }),
  }, { idempotencyKey: campaignKey });
  await prisma.prospectMessage.update({
    where: { id: message.id },
    data: result.error || !result.data?.id
      ? { status: "FAILED", error: (result.error?.message || result.error?.name || "Échec Resend").slice(0, 500) }
      : { status: "SENT", providerMessageId: result.data.id, sentAt: new Date() },
  });
}

async function handleInbound(event: ResendEvent): Promise<void> {
  const emailId = event.data?.email_id;
  const from = senderAddress(event.data?.from || "");
  if (!emailId || !from) return;
  const prisma = getPrisma();
  const prospect = await prisma.prospect.findUnique({ where: { email: from } });
  if (!prospect) return;
  if (await prisma.prospectMessage.findUnique({ where: { campaignKey: `inbound:${emailId}` } })) return;

  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const received = await resend.emails.receiving.get(emailId);
  const subject = received.data?.subject || event.data?.subject || "Réponse à Label Vanlife";
  const body = (received.data?.text || "").slice(0, 20_000);
  const classification = classifyReply(subject, body);
  await prisma.prospectMessage.create({
    data: {
      prospectId: prospect.id,
      direction: "INBOUND",
      kind: classification.toUpperCase(),
      status: "RECEIVED",
      campaignKey: `inbound:${emailId}`,
      providerMessageId: emailId,
      subject,
      text: body || "[Message sans version texte]",
      receivedAt: new Date(),
    },
  });

  if (classification === "auto") {
    await prisma.prospect.update({ where: { id: prospect.id }, data: { lastInboundAt: new Date() } });
    return;
  }
  if (classification === "unsubscribe" || classification === "negative") {
    await suppressProspect(from, classification === "unsubscribe" ? "unsubscribe" : "not-interested", "inbound-reply");
    await prisma.prospect.update({ where: { id: prospect.id }, data: { lastInboundAt: new Date() } });
    return;
  }
  if (classification === "interested" || classification === "question") {
    await prisma.prospect.update({ where: { id: prospect.id }, data: { status: "INTERESTED", lastInboundAt: new Date(), nextActionAt: null } });
    await sendSalesReply(prospect, subject, emailId, classification);
    return;
  }

  await prisma.prospect.update({ where: { id: prospect.id }, data: { status: "NEEDS_HUMAN", lastInboundAt: new Date(), nextActionAt: null } });
  await sendNeedHumanAlert(
    `Réponse à traiter — ${prospect.name}`,
    `De : ${from}\nObjet : ${subject}\n\n${body.slice(0, 4_000) || "Message HTML sans version texte"}`,
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
    const event = resend.webhooks.verify({
      payload,
      headers: {
        id: request.headers.get("svix-id") || "",
        timestamp: request.headers.get("svix-timestamp") || "",
        signature: request.headers.get("svix-signature") || "",
      },
      webhookSecret: requireSecretEnv("RESEND_WEBHOOK_SECRET"),
    }) as ResendEvent;

    if (event.type === "email.received") await handleInbound(event);
    if (event.type === "email.clicked") await handleClick(event);
    if (["email.bounced", "email.complained", "email.suppressed"].includes(event.type)) await handleDeliveryEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[resend-webhook] rejected", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
