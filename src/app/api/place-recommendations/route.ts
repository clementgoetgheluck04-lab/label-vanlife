import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { ensureAppUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";
import { parseEmail, parseText } from "@/server/validation";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { SPOTTED_PLACES } from "@/data/spotted-places";
import { sendNeedHumanAlert } from "@/server/prospection";

const PLACE_TYPES = new Set([
  "camping", "ferme", "domaine", "restaurant", "producteur", "activité",
  "artisan", "commerce", "aire", "hébergement", "musée", "autre",
]);

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLocaleLowerCase("fr").replace(/[^a-z0-9]+/g, " ").trim();
}

function optionalUrl(value: unknown): string | null {
  const text = parseText(value, { max: 300 });
  if (text === null) return null;
  if (!text) return "";
  try {
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(text) ? text : `https://${text}`;
    const url = new URL(candidate);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "place-recommendation", 5, 24 * 60 * 60 * 1_000);
    const body = await readJsonRequest(request, 12_000) as Record<string, unknown>;
    if (typeof body.companyWebsite === "string" && body.companyWebsite.trim()) {
      return NextResponse.json({ success: true });
    }

    const placeName = parseText(body.placeName, { min: 2, max: 160, required: true });
    const city = parseText(body.city, { min: 2, max: 120, required: true });
    const region = parseText(body.region, { max: 120 });
    const country = parseText(body.country, { min: 2, max: 80, required: true });
    const reason = parseText(body.reason, { min: 10, max: 1_000, required: true });
    const placeType = typeof body.placeType === "string" ? body.placeType.trim().toLocaleLowerCase("fr") : "";
    const website = optionalUrl(body.website);
    const placeContactEmail = body.placeContactEmail ? parseEmail(body.placeContactEmail) : null;
    const recommenderEmail = body.recommenderEmail ? parseEmail(body.recommenderEmail) : null;
    if (!placeName || !city || region === null || !country || !reason || !PLACE_TYPES.has(placeType) || website === null) {
      return NextResponse.json({ error: "Informations invalides ou incomplètes" }, { status: 400 });
    }
    if (body.placeContactEmail && !placeContactEmail) return NextResponse.json({ error: "Email du lieu invalide" }, { status: 400 });
    if (body.recommenderEmail && !recommenderEmail) return NextResponse.json({ error: "Votre email est invalide" }, { status: 400 });

    const normalizedName = normalize(placeName);
    const normalizedCity = normalize(city);
    const known = [
      ...ENRICHED_LIEUX.map((place) => ({ id: place.id, name: place.nom, city: place.ville })),
      ...SPOTTED_PLACES.map((place) => ({ id: place.id, name: place.name, city: place.city })),
    ].find((place) => normalize(place.name) === normalizedName && normalize(place.city) === normalizedCity);

    let userId: string | null = null;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await ensureAppUser(data.user);
      userId = data.user.id;
    }

    const prisma = getPrisma();
    const recentDuplicate = await prisma.placeRecommendation.findFirst({
      where: {
        placeName: { equals: placeName, mode: "insensitive" },
        city: { equals: city, mode: "insensitive" },
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000) },
        ...(userId ? { userId } : recommenderEmail ? { recommenderEmail } : {}),
      },
      select: { id: true, matchedSourceId: true },
    });
    if (recentDuplicate) {
      return NextResponse.json({ success: true, duplicate: true, id: recentDuplicate.id, matchedSourceId: recentDuplicate.matchedSourceId });
    }

    const recommendation = await prisma.placeRecommendation.create({
      data: {
        userId,
        placeName,
        placeType,
        city,
        region: region || null,
        country,
        website: website || null,
        placeContactEmail,
        recommenderEmail,
        reason,
        matchedSourceId: known?.id || null,
      },
    });

    if (placeContactEmail) {
      await prisma.prospect.upsert({
        where: { email: placeContactEmail },
        create: {
          sourceId: `recommendation:${recommendation.id}`,
          name: placeName,
          email: placeContactEmail,
          website: website || null,
          city,
          region: region || null,
          sourceLabel: "Recommandation voyageur",
          sourceUrl: website || null,
          nextActionAt: null,
          metadata: { recommendationId: recommendation.id, reason, matchedSourceId: known?.id || null },
        },
        update: {
          website: website || undefined,
          city,
          region: region || undefined,
        },
      });
    }

    await prisma.analyticsEvent.create({
      data: {
        name: "place_recommend",
        userId,
        entityType: "place_recommendation",
        entityId: recommendation.id,
        properties: { matchedExistingPlace: Boolean(known), placeType },
      },
    });

    if (process.env.RESEND_API_KEY) {
      await sendNeedHumanAlert(
        `Nouveau lieu recommandé — ${placeName}`,
        `${placeName} à ${city}${region ? ` (${region})` : ""} a été recommandé. La recommandation ${recommendation.id} doit être vérifiée avant tout contact.`,
      ).catch((error) => console.error("[place-recommendation] alert failed", error));
    }

    return NextResponse.json({ success: true, id: recommendation.id, matchedSourceId: known?.id || null }, { status: 201 });
  } catch (error) {
    return apiError(error, "place-recommendation");
  }
}
