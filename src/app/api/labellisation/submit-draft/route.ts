import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError } from "@/server/http";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { parseLabellisationPayload } from "@/server/validation";
import { LABELLISATION_CRITERIA } from "@/config/labellisation-criteria";

export const dynamic = "force-dynamic";
const BUCKET = "labellisation-attachments";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png"]);
const PLAN_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);

function isFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

function extension(file: File): string {
  if (file.type === "application/pdf") return "pdf";
  if (file.type === "image/png") return "png";
  return "jpg";
}

function formatApplication(payload: NonNullable<ReturnType<typeof parseLabellisationPayload>>, draftId: string, mediaLinks: string[]): string {
  const criteria = LABELLISATION_CRITERIA.map((criterion, index) => {
    const answer = payload.criteria?.[criterion.id];
    if (!answer) return `${index + 1}. ${criterion.title} : Non renseigné`;
    const choices = answer.examples.length ? answer.examples.join(", ") : "Aucun choix";
    return `${index + 1}. ${criterion.title} : ${answer.status === "yes" ? "Oui" : "Non"} — ${choices}${answer.detail ? ` — Précision : ${answer.detail}` : ""}`;
  }).join("\n");
  const reservationLabels: Record<string, string> = { online: "En ligne", email: "Email", phone: "Téléphone", onsite: "Sur place" };

  return [
    "NOUVELLE CANDIDATURE LABEL VANLIFE",
    `Référence : ${draftId}`,
    "",
    "ÉTABLISSEMENT ET CONTACT",
    `Nom : ${payload.establishmentName}`,
    `Type : ${payload.placeType}`,
    `Adresse : ${payload.address}, ${payload.postalCode} ${payload.city}, ${payload.region}`,
    `Site : ${payload.website || "Non renseigné"}`,
    `Facebook : ${payload.facebook || "Non renseigné"}`,
    `Contact : ${payload.contactName}`,
    `Fonction : ${payload.jobTitle || "Non renseignée"}`,
    `Email : ${payload.email}`,
    `Téléphone : ${payload.phone || "Non renseigné"}`,
    `SIRET : ${payload.siret || "Non renseigné"}`,
    `Autorisation d'exploitation confirmée : ${payload.operatingAuthorization ? "Oui" : "Non"}`,
    `Suit la page Facebook : ${payload.followFacebook ? "Oui" : "Non"}`,
    `Commentaires : ${payload.comments || "Aucun"}`,
    `Charte acceptée : ${payload.acceptCharter ? "Oui" : "Non"}`,
    "",
    "AUTO-ÉVALUATION — 22 CRITÈRES",
    criteria,
    "",
    "ACCUEIL VANLIFE",
    payload.welcomeMessage || "Non renseigné",
    "",
    "RÉDUCTION MEMBRES",
    `Réduction : ${payload.discountPercent}%`,
    `Clause de parité : ${payload.hasParityClause ? "Oui" : "Non"}`,
    `Tarif public : ${payload.publicPrice || 0} €`,
    `Tarif minimum autorisé : ${payload.minimumAllowedPrice || 0} €`,
    `Réservation : ${(payload.reservationModes || []).map((mode) => reservationLabels[mode] || mode).join(", ")}`,
    `Code promo privé : ${payload.promoCode || "Aucun"}`,
    `Conditions complémentaires : ${payload.discountConditions || "Aucune"}`,
    "",
    "FICHE ÉTABLISSEMENT",
    `Nombre total d'emplacements : ${payload.totalPitches || payload.capacity}`,
    `Emplacements couples : ${payload.couplePitchNumbers || "Non renseignés"}`,
    `Emplacements familles : ${payload.familyPitchNumbers || "Non renseignés"}`,
    `Lien de réservation : ${payload.bookingUrl || "Non renseigné"}`,
    `Logiciel de réservation : ${payload.bookingSoftware || "Non renseigné"}`,
    `Channel manager : ${payload.bookingChannelManager || "Non renseigné"}`,
    `Bons plans et activités : ${payload.activities || "Non renseignés"}`,
    `Page À découvrir : ${payload.discoveryUrl || "Non renseignée"}`,
    `Restauration : ${payload.foodOptions || "Non renseignée"}`,
    `Autres informations : ${payload.practicalInfo || "Non renseignées"}`,
    `Fichier plan d'origine : ${payload.planFileName || "Non renseigné"}`,
    `Fichiers photos d'origine : ${(payload.photoFileNames || []).join(", ") || "Non renseignés"}`,
    "",
    "PIÈCES JOINTES PRIVÉES (liens valables 7 jours)",
    ...mediaLinks,
  ].join("\n");
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "labellisation-draft", 3, 60 * 60 * 1_000);
    const formData = await request.formData();
    const rawPayload = formData.get("payload");
    if (typeof rawPayload !== "string" || rawPayload.length > 100_000) {
      return NextResponse.json({ error: "Dossier invalide" }, { status: 400 });
    }
    const payload = parseLabellisationPayload(JSON.parse(rawPayload));
    if (!payload) return NextResponse.json({ error: "Dossier incomplet" }, { status: 400 });

    const plan = formData.get("plan");
    const photos = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
    if (!isFile(plan) || !PLAN_TYPES.has(plan.type) || plan.size > MAX_FILE_SIZE || photos.length < 1 || photos.length > 3) {
      return NextResponse.json({ error: "Plan ou photos invalides" }, { status: 400 });
    }
    if (photos.some((file) => !PHOTO_TYPES.has(file.type) || file.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ error: "Chaque photo doit être au format JPG ou PNG et faire moins de 10MB" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: bucket } = await supabase.storage.getBucket(BUCKET);
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(BUCKET, {
        public: false,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: [...PLAN_TYPES, "application/json"],
      });
      if (error && !error.message.toLowerCase().includes("already")) throw error;
    }

    const draftId = randomUUID();
    const basePath = `pending/${draftId}`;
    const uploaded: string[] = [];
    const upload = async (path: string, file: File) => {
      const { error } = await supabase.storage.from(BUCKET).upload(path, await file.arrayBuffer(), { contentType: file.type, upsert: false });
      if (error) throw error;
      uploaded.push(path);
    };

    try {
      await upload(`${basePath}/plan.${extension(plan)}`, plan);
      for (let index = 0; index < photos.length; index += 1) {
        await upload(`${basePath}/photo-${index + 1}.${extension(photos[index])}`, photos[index]);
      }
      const applicationPath = `${basePath}/application.json`;
      const application = JSON.stringify({ ...payload, draftId, attachmentPaths: uploaded, submittedAt: new Date().toISOString() }, null, 2);
      const { error } = await supabase.storage.from(BUCKET).upload(applicationPath, application, { contentType: "application/json", upsert: false });
      if (error) throw error;
      uploaded.push(applicationPath);
    } catch (error) {
      if (uploaded.length) await supabase.storage.from(BUCKET).remove(uploaded);
      throw error;
    }

    const mediaPaths = uploaded.filter((path) => !path.endsWith("application.json"));
    const { data: signedMedia, error: signedMediaError } = await supabase.storage.from(BUCKET).createSignedUrls(mediaPaths, 7 * 24 * 60 * 60);
    if (signedMediaError) {
      await supabase.storage.from(BUCKET).remove(uploaded);
      throw signedMediaError;
    }
    const mediaLinks = (signedMedia || []).map((item, index) => `${index === 0 ? "Plan" : `Photo ${index}`} : ${item.signedUrl}`);
    const fullApplication = formatApplication(payload, draftId, mediaLinks);
    const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
    const summary = `${payload.establishmentName} · ${payload.address}, ${payload.postalCode} ${payload.city}\nContact : ${payload.contactName} · ${payload.email}\nRéduction membres : ${payload.discountPercent}%\nRéférence : ${draftId}`;
    const [{ error: applicantEmailError }, { error: adminEmailError }] = await Promise.all([
      resend.emails.send({
        from: "Label Vanlife <contact@labelvanlife.com>",
        to: payload.email,
        subject: "Votre candidature Label Vanlife a bien été enregistrée",
        text: `Bonjour ${payload.contactName},\n\nVotre candidature et ses pièces jointes ont bien été enregistrées.\n\n${summary}\n\nOffre 2026 : 110 € au lieu de 220 € jusqu'au 31 décembre 2026. Si le dossier est déclaré non conforme après étude, le paiement est remboursé intégralement.\n\nFinaliser le paiement depuis l'appareil utilisé pour la candidature : ${getAppUrl()}/labellisation/paiement\n\nL'équipe Label Vanlife`,
      }),
      resend.emails.send({
        from: "Label Vanlife <contact@labelvanlife.com>",
        to: "contact@labelvanlife.com",
        replyTo: payload.email,
        subject: `Nouvelle candidature — ${payload.establishmentName}`,
        text: fullApplication,
      }),
    ]);
    if (applicantEmailError || adminEmailError) {
      await supabase.storage.from(BUCKET).remove(uploaded);
      throw new Error("La confirmation email n'a pas pu être envoyée");
    }

    return NextResponse.json({ draftId, attachmentPaths: uploaded }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "labellisation-draft");
  }
}
