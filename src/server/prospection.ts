import "server-only";

import { Resend } from "resend";
import type { Prospect, ProspectStatus } from "@/generated/prisma/client";
import { SPOTTED_PLACES } from "@/data/spotted-places";
import { getPrisma } from "@/lib/prisma";
import { labelVanlifeEmail } from "@/server/email-template";
import { getAppUrl, getBackOfficeEmails, getTransactionalEmailFrom, requireServerEnv } from "@/server/env";

const DAY = 24 * 60 * 60 * 1_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTIVE_STATUSES: ProspectStatus[] = ["NEW", "CONTACTED", "FOLLOW_UP_1"];

export type ProspectingStage = "INITIAL" | "FOLLOW_UP_1" | "FOLLOW_UP_2";

export function normalizeProspectEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isProspectingEnabled(): boolean {
  return process.env.PROSPECTION_AUTOMATION_ENABLED === "true";
}

export function prospectingDailyLimit(): number {
  const value = Number.parseInt(process.env.PROSPECTION_DAILY_LIMIT || "8", 10);
  return Number.isFinite(value) ? Math.min(Math.max(value, 1), 25) : 8;
}

export function getProspectionReplyTo(): string {
  return process.env.PROSPECTION_REPLY_TO || "contact@labelvanlife.com";
}

function stageForStatus(status: ProspectStatus): ProspectingStage | null {
  if (status === "NEW") return "INITIAL";
  if (status === "CONTACTED") return "FOLLOW_UP_1";
  if (status === "FOLLOW_UP_1") return "FOLLOW_UP_2";
  return null;
}

function cleanName(value: string | null | undefined): string | null {
  const name = value?.trim();
  return name ? name.slice(0, 100) : null;
}

function greeting(prospect: Prospect): string {
  return prospect.contactName ? `Bonjour ${prospect.contactName},` : "Bonjour,";
}

function unsubscribeUrl(prospect: Prospect): string {
  return `${getAppUrl()}/desinscription?token=${encodeURIComponent(prospect.unsubscribeToken)}`;
}

function candidatureUrl(prospect: Prospect): string {
  const url = new URL("/labellisation/candidature", getAppUrl());
  if (prospect.sourceId) url.searchParams.set("claim", prospect.sourceId);
  return url.href;
}

function messageFor(prospect: Prospect, stage: ProspectingStage) {
  const city = prospect.city ? ` à ${prospect.city}` : "";
  const unsubscribe = unsubscribeUrl(prospect);
  const legal = `Pourquoi cet email ? Les coordonnées professionnelles publiques de ${prospect.name} ont été utilisées uniquement pour présenter une offre en lien direct avec son activité d’accueil. Label Vanlife — 10 chemin des Écoles, 31260 Montsaunès — contact@labelvanlife.com.`;

  if (stage === "INITIAL") {
    const subject = `${prospect.name} : mieux accueillir les voyageurs en van en 2027`;
    const paragraphs = [
      `Nous avons repéré ${prospect.name}${city} parmi les lieux dont l’accueil pourrait correspondre à la philosophie de Label Vanlife : une étape humaine, claire et adaptée aux voyageurs en van.`,
      "Les vans stationnés sur un parking ou un spot sauvage tout proche représentent souvent des voyageurs qui ne savent simplement pas qu’ils seraient bien accueillis chez vous. Notre rôle est de leur signaler votre présence au bon moment et de leur donner confiance avant leur arrivée.",
      "Label Vanlife référence des établissements vérifiés sur sa MAP privée, présente leurs services et leurs avantages membres, sans commission sur les réservations. Vous restez libre de votre accueil, de vos tarifs et de vos disponibilités.",
    ];
    const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nDécouvrir le concept : ${getAppUrl()}/le-label\nÉtudier la labellisation : ${candidatureUrl(prospect)}\n\n${legal}\nDésinscription : ${unsubscribe}`;
    return {
      subject,
      text,
      html: labelVanlifeEmail({
        preheader: `Une proposition concrète pour rendre ${prospect.name} visible auprès des vanlifers`,
        eyebrow: "UN LIEU REPÉRÉ PAR LABEL VANLIFE",
        title: "Et si les vans garés à proximité devenaient vos prochains visiteurs ?",
        greeting: greeting(prospect),
        paragraphs,
        action: { label: "Découvrir le concept", href: `${getAppUrl()}/le-label` },
        secondaryAction: { label: "Étudier la labellisation", href: candidatureUrl(prospect) },
        notice: "Aucune promesse de réservation : notre engagement porte sur la visibilité, la confiance et les outils mis à votre disposition.",
        legalFooter: legal,
        unsubscribeHref: unsubscribe,
        signature: "Clément — Label Vanlife",
      }),
    };
  }

  if (stage === "FOLLOW_UP_1") {
    const subject = `Avez-vous pu découvrir Label Vanlife, ${prospect.name} ?`;
    const paragraphs = [
      `Je me permets un court retour au sujet de ${prospect.name}${city}.`,
      "Notre objectif pour 2027 est simple : aider les voyageurs en van à choisir des lieux où ils savent qu’ils seront bien accueillis, plutôt que de rester sur un stationnement sauvage à quelques kilomètres.",
      "La page de présentation explique le fonctionnement du label, la MAP membre et ce que reçoit chaque établissement. Vous pouvez aussi répondre directement à cet email : une question simple reçoit une réponse simple.",
    ];
    const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nDécouvrir Label Vanlife : ${getAppUrl()}/le-label\n\n${legal}\nDésinscription : ${unsubscribe}`;
    return {
      subject,
      text,
      html: labelVanlifeEmail({
        preheader: "Un rappel court, sans engagement et sans commission",
        eyebrow: "LABEL VANLIFE 2027",
        title: "Un rappel, puis je vous laisse décider",
        greeting: greeting(prospect),
        paragraphs,
        action: { label: "Découvrir Label Vanlife", href: `${getAppUrl()}/le-label` },
        secondaryAction: { label: "Voir la labellisation", href: `${getAppUrl()}/labellisation` },
        legalFooter: legal,
        unsubscribeHref: unsubscribe,
        signature: "Clément — Label Vanlife",
      }),
    };
  }

  const subject = `Dernier message concernant ${prospect.name}`;
  const paragraphs = [
    `Je termine ici mes messages au sujet de ${prospect.name}${city}.`,
    "Si vous souhaitez rejoindre le réseau 2027, la prévente est actuellement proposée à 110 € au lieu de 290 €, dans la limite des places disponibles. Elle comprend la fiche, la présence sur la MAP, le kit de communication et l’accompagnement, sans commission sur vos réservations.",
    "Sans réponse de votre part, vous ne recevrez pas d’autre relance automatique. Vous pourrez naturellement revenir vers nous plus tard.",
  ];
  const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nVoir la labellisation : ${getAppUrl()}/labellisation\n\n${legal}\nDésinscription : ${unsubscribe}`;
  return {
    subject,
    text,
    html: labelVanlifeEmail({
      preheader: "Dernier message — aucune autre relance automatique sans réponse",
      eyebrow: "DERNIER MESSAGE",
      title: "À vous de choisir la suite",
      greeting: greeting(prospect),
      paragraphs,
      details: [
        { label: "Prévente 2027", value: "110 € au lieu de 290 €" },
        { label: "Commission", value: "0 % sur les réservations" },
        { label: "Validité", value: "Jusqu’au 31 décembre 2027" },
      ],
      action: { label: "Découvrir la labellisation", href: `${getAppUrl()}/labellisation` },
      secondaryAction: { label: "Déposer ma candidature", href: candidatureUrl(prospect) },
      notice: "Sans réponse, aucune autre relance automatique ne sera envoyée.",
      legalFooter: legal,
      unsubscribeHref: unsubscribe,
      signature: "Clément — Label Vanlife",
    }),
  };
}

export async function syncSpottedProspects(): Promise<number> {
  const prisma = getPrisma();
  const unique = new Map<string, (typeof SPOTTED_PLACES)[number]>();
  for (const place of SPOTTED_PLACES) {
    const email = normalizeProspectEmail(place.emails?.[0] || "");
    if (!EMAIL_PATTERN.test(email) || unique.has(email)) continue;
    unique.set(email, place);
  }

  const existing = await prisma.prospect.findMany({ select: { email: true } });
  const known = new Set(existing.map((item) => item.email));
  const rows = [...unique.entries()]
    .filter(([email]) => !known.has(email))
    .map(([email, place]) => ({
      sourceId: place.id,
      name: place.name.slice(0, 180),
      contactName: cleanName(place.contactName),
      email,
      website: place.website,
      city: place.city || null,
      region: place.region || null,
      sourceLabel: place.source || "Repérage Label Vanlife",
      sourceUrl: place.website,
      nextActionAt: new Date(),
      metadata: { network: place.network, postalCode: place.postalCode },
    }));
  if (!rows.length) return 0;
  const result = await prisma.prospect.createMany({ data: rows, skipDuplicates: true });
  return result.count;
}

export async function suppressProspect(email: string, reason: string, source: string): Promise<void> {
  const prisma = getPrisma();
  const normalized = normalizeProspectEmail(email);
  if (!EMAIL_PATTERN.test(normalized)) return;
  const status: ProspectStatus = reason === "bounce" ? "INVALID" : reason === "unsubscribe" || reason === "complaint" ? "UNSUBSCRIBED" : "NOT_INTERESTED";
  await prisma.$transaction([
    prisma.prospectSuppression.upsert({
      where: { email: normalized },
      create: { email: normalized, reason: reason.slice(0, 200), source: source.slice(0, 100) },
      update: { reason: reason.slice(0, 200), source: source.slice(0, 100) },
    }),
    prisma.prospect.updateMany({
      where: { email: normalized },
      data: { status, nextActionAt: null },
    }),
  ]);
}

async function sendOne(prospect: Prospect): Promise<"sent" | "skipped" | "failed"> {
  const stage = stageForStatus(prospect.status);
  if (!stage) return "skipped";
  const prisma = getPrisma();
  const suppression = await prisma.prospectSuppression.findUnique({ where: { email: prospect.email } });
  if (suppression) {
    await prisma.prospect.update({ where: { id: prospect.id }, data: { status: "UNSUBSCRIBED", nextActionAt: null } });
    return "skipped";
  }

  const campaignKey = `prospection:${stage.toLowerCase()}:${prospect.id}`;
  let record = await prisma.prospectMessage.findUnique({ where: { campaignKey } });
  if (record?.status === "SENT") return "skipped";

  const claimed = await prisma.prospect.updateMany({
    where: { id: prospect.id, status: prospect.status },
    data: { status: "SENDING" },
  });
  if (!claimed.count) return "skipped";

  const content = messageFor(prospect, stage);
  record = record || await prisma.prospectMessage.create({
    data: { prospectId: prospect.id, direction: "OUTBOUND", kind: stage, campaignKey, subject: content.subject, text: content.text },
  });

  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  let result;
  try {
    result = await resend.emails.send({
      from: getTransactionalEmailFrom(),
      to: prospect.email,
      replyTo: getProspectionReplyTo(),
      subject: content.subject,
      text: content.text,
      html: content.html,
      headers: {
        "List-Unsubscribe": `<${getAppUrl()}/api/prospection/unsubscribe?token=${encodeURIComponent(prospect.unsubscribeToken)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      tags: [
        { name: "category", value: "prospection" },
        { name: "stage", value: stage.toLowerCase() },
        { name: "prospect_id", value: prospect.id.slice(0, 256) },
      ],
    }, { idempotencyKey: campaignKey });
  } catch (error) {
    const message = (error instanceof Error ? error.message : "Échec réseau Resend").slice(0, 500);
    await prisma.$transaction([
      prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "FAILED", error: message } }),
      prisma.prospect.update({ where: { id: prospect.id }, data: { status: "ERROR", nextActionAt: null } }),
    ]);
    return "failed";
  }

  const now = new Date();
  if (result.error || !result.data?.id) {
    const error = (result.error?.message || result.error?.name || "Échec Resend").slice(0, 500);
    await prisma.$transaction([
      prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "FAILED", error } }),
      prisma.prospect.update({ where: { id: prospect.id }, data: { status: "ERROR", nextActionAt: null, metadata: { emailError: error } } }),
    ]);
    return "failed";
  }

  const nextStatus: ProspectStatus = stage === "INITIAL" ? "CONTACTED" : stage === "FOLLOW_UP_1" ? "FOLLOW_UP_1" : "FOLLOW_UP_2";
  const nextActionAt = stage === "INITIAL" ? new Date(now.getTime() + 7 * DAY) : stage === "FOLLOW_UP_1" ? new Date(now.getTime() + 10 * DAY) : null;
  await prisma.$transaction([
    prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "SENT", providerMessageId: result.data.id, sentAt: now } }),
    prisma.prospect.update({
      where: { id: prospect.id },
      data: {
        status: nextStatus,
        followUpCount: stage === "INITIAL" ? 0 : stage === "FOLLOW_UP_1" ? 1 : 2,
        firstContactedAt: prospect.firstContactedAt || now,
        lastContactedAt: now,
        nextActionAt,
      },
    }),
  ]);
  return "sent";
}

export async function runProspectionBatch() {
  const imported = await syncSpottedProspects();
  if (!isProspectingEnabled()) return { enabled: false, imported, sent: 0, failed: 0, skipped: 0 };
  const now = new Date();
  const parisWeekday = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" }).format(now);
  if (parisWeekday === "Sat" || parisWeekday === "Sun") {
    return { enabled: true, weekend: true, imported, sent: 0, failed: 0, skipped: 0 };
  }

  const prisma = getPrisma();
  const prospects = await prisma.prospect.findMany({
    where: { status: { in: ACTIVE_STATUSES }, nextActionAt: { lte: now } },
    orderBy: [{ nextActionAt: "asc" }, { createdAt: "asc" }],
    take: prospectingDailyLimit(),
  });
  let sent = 0;
  let failed = 0;
  let skipped = 0;
  for (const prospect of prospects) {
    const result = await sendOne(prospect);
    if (result === "sent") sent += 1;
    else if (result === "failed") failed += 1;
    else skipped += 1;
  }

  if (failed > 0) {
    await sendNeedHumanAlert("La prospection automatique a rencontré des erreurs", `${failed} message(s) n’ont pas pu être envoyés. Consultez le tableau de bord avant de relancer.`);
  }
  return { enabled: true, imported, selected: prospects.length, sent, failed, skipped };
}

export async function sendNeedHumanAlert(subject: string, details: string): Promise<void> {
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  await resend.emails.send({
    from: getTransactionalEmailFrom(),
    to: getBackOfficeEmails(),
    subject: `[ACTION REQUISE] ${subject}`,
    text: `${details}\n\nTableau de bord : ${getAppUrl()}/admin/prospection`,
    html: labelVanlifeEmail({
      preheader: "Une décision humaine est nécessaire dans la prospection Label Vanlife",
      eyebrow: "ACTION REQUISE",
      title: subject,
      paragraphs: [details],
      action: { label: "Ouvrir le tableau de bord", href: `${getAppUrl()}/admin/prospection` },
      notice: "Aucun message automatique supplémentaire n’est envoyé au prospect tant que sa situation n’est pas traitée.",
    }),
  });
}
