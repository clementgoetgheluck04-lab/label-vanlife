import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { ensureLabelledPlaces, getLabelledPlace } from "@/server/labelled-place";
import { assertSameOrigin, enforceRateLimit, readMultipartFormData, RequestBodyError } from "@/server/request-security";
import { VISIT_PROOF_BUCKET, writeVisitProofMetadata } from "@/server/visit-proof";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 8 * 1024 * 1024;
const MAX_REQUEST_SIZE = 25 * 1024 * 1024;
const PHOTO_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const PHOTO_FIELDS = ["photoPlacement", "photoTariff", "photoChoice"] as const;

function parseMoney(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || !/^\d{1,5}([.,]\d{1,2})?$/.test(value.trim())) return null;
  const cents = Math.round(Number(value.replace(",", ".")) * 100);
  return Number.isSafeInteger(cents) && cents >= 0 && cents <= 1_000_000 ? cents : null;
}

function extension(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

async function hasImageSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  if (file.type === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png") return bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
  if (file.type === "image/webp") return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}

export async function POST(request: NextRequest) {
  const uploaded: string[] = [];
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "visit-proof", 6, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Un membre actif est requis." }, { status: 403 });
    const form = await readMultipartFormData(request, MAX_REQUEST_SIZE);
    const placeSlug = typeof form.get("placeSlug") === "string" ? String(form.get("placeSlug")) : "";
    const sourcePlace = getLabelledPlace(placeSlug);
    if (!sourcePlace) throw new RequestBodyError("Choisissez un lieu labellisé valide.", 400);

    const displayedPriceCents = parseMoney(form.get("displayedPrice"));
    const paidPriceCents = parseMoney(form.get("paidPrice"));
    if (displayedPriceCents === null || displayedPriceCents < 1 || paidPriceCents === null) {
      throw new RequestBodyError("Les tarifs affiché et payé sont invalides.", 400);
    }
    const rating = Number(form.get("rating"));
    const comment = typeof form.get("experience") === "string" ? String(form.get("experience")).trim().replace(/\s+/g, " ") : "";
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || comment.length < 20 || comment.length > 1_200) {
      throw new RequestBodyError("Ajoutez une note et un retour compris entre 20 et 1 200 caractères.", 400);
    }

    const files = PHOTO_FIELDS.map((field) => form.get(field));
    if (files.some((file) => !(file instanceof File) || file.size < 1 || file.size > MAX_FILE_SIZE || !PHOTO_TYPES.has(file.type))) {
      throw new RequestBodyError("Ajoutez exactement trois photos JPG, PNG ou WebP de moins de 8 Mo chacune.", 400);
    }
    const photos = files as File[];
    const signatures = await Promise.all(photos.map(hasImageSignature));
    if (signatures.some((valid) => !valid)) throw new RequestBodyError("Le contenu d’une photo ne correspond pas à son format.", 400);

    const discountPercent = Math.max(0, Math.min(100, sourcePlace.discountPercent || 0));
    const expectedMemberPriceCents = Math.round(displayedPriceCents * (1 - discountPercent / 100));
    const amountSavedCents = Math.max(0, displayedPriceCents - paidPriceCents);
    const prisma = getPrisma();
    const places = await ensureLabelledPlaces(prisma, [placeSlug]);
    const place = places?.[0];
    if (!place) throw new RequestBodyError("Ce lieu n’est plus disponible.", 400);

    const supabase = createAdminClient();
    const { data: bucket } = await supabase.storage.getBucket(VISIT_PROOF_BUCKET);
    if (!bucket) {
      const { error } = await supabase.storage.createBucket(VISIT_PROOF_BUCKET, { public: false, fileSizeLimit: MAX_FILE_SIZE, allowedMimeTypes: [...PHOTO_TYPES] });
      if (error && !error.message.toLowerCase().includes("already")) throw error;
    }
    const proofId = randomUUID();
    for (let index = 0; index < photos.length; index += 1) {
      const path = `${member.id}/${place.slug}/${proofId}/${PHOTO_FIELDS[index]}.${extension(photos[index])}`;
      const { error } = await supabase.storage.from(VISIT_PROOF_BUCKET).upload(path, await photos[index].arrayBuffer(), { contentType: photos[index].type, upsert: false });
      if (error) throw error;
      uploaded.push(path);
    }

    const submittedAt = new Date().toISOString();
    const metadata = writeVisitProofMetadata({ kind: "visit-proof", paths: uploaded, displayedPriceCents, paidPriceCents, discountPercent, expectedMemberPriceCents, status: "PENDING", submittedAt });
    const result = await prisma.$transaction(async (tx) => {
      const inserted = await tx.passportStamp.createMany({ data: [{ userId: member.id, placeId: place.id, amountSavedCents }], skipDuplicates: true });
      const stamp = inserted.count === 1
        ? await tx.passportStamp.findUniqueOrThrow({ where: { userId_placeId: { userId: member.id, placeId: place.id } } })
        : await tx.passportStamp.update({ where: { userId_placeId: { userId: member.id, placeId: place.id } }, data: { visitedAt: new Date(), amountSavedCents } });
      await tx.placeReview.upsert({
        where: { placeId_userId: { placeId: place.id, userId: member.id } },
        create: { placeId: place.id, userId: member.id, rating, comment, photos: metadata, isVerified: false },
        update: { rating, comment, photos: metadata, isVerified: false },
      });
      if (inserted.count === 1) {
        await tx.profile.updateMany({ where: { userId: member.id }, data: { points: { increment: 25 } } });
        const badge = await tx.badge.findUnique({ where: { code: "PREMIERE_ETAPE" }, select: { id: true } });
        if (badge) await tx.userBadge.upsert({ where: { userId_badgeId: { userId: member.id, badgeId: badge.id } }, create: { userId: member.id, badgeId: badge.id }, update: {} });
      }
      await tx.notification.create({ data: { userId: member.id, type: "PASSPORT_STAMP", title: `Passage enregistré · ${place.name}`, body: "Votre badge est créé. Votre retour sera visible après validation par Label Vanlife.", data: { placeSlug: place.slug, reviewStatus: "PENDING" } } });
      await tx.analyticsEvent.create({ data: { name: "visit_confirmed", userId: member.id, entityType: "lieux", entityId: place.slug, path: "/member/passeport", properties: { method: "three_photo_proof", firstConfirmation: inserted.count === 1, rating, discountPercent, displayedPriceCents, paidPriceCents } } });
      return { created: inserted.count === 1, stampId: stamp.id };
    });
    return NextResponse.json({ ...result, moderationStatus: "PENDING", expectedMemberPriceCents, amountSavedCents });
  } catch (error) {
    if (uploaded.length) {
      try { await createAdminClient().storage.from(VISIT_PROOF_BUCKET).remove(uploaded); } catch { /* The private orphan cleanup can be retried administratively. */ }
    }
    return apiError(error, "visit-proof");
  }
}
