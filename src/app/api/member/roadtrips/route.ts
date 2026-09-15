import { NextRequest, NextResponse } from "next/server";

import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function GET() {
  const member = await requireActiveMember();
  if (!member) return NextResponse.json({ roadTrips: [] });

  const roadTrips = await getPrisma().roadTrip.findMany({
    where: { userId: member.id },
    include: {
      etapes: {
        include: { place: { select: { name: true, slug: true, city: true } } },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    roadTrips: roadTrips.map((trip) => ({
      ...trip,
      tags: Array.isArray(trip.tags) ? trip.tags : [],
    })),
  });
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PLACE_TYPES = {
  camping: "CAMPING",
  parking: "PARKING",
  etape_nature: "ETAPE_NATURE",
  hebergement_insolite: "HEBERGEMENT_INSOLITE",
  restaurant: "RESTAURANT",
  activite: "ACTIVITE",
} as const;

function routeDistanceKm(points: Array<{ lat: number; lng: number }>): number | null {
  if (points.length < 2) return null;
  const radians = (degrees: number) => degrees * Math.PI / 180;
  let distance = 0;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const dLat = radians(current.lat - previous.lat);
    const dLng = radians(current.lng - previous.lng);
    const a = Math.sin(dLat / 2) ** 2
      + Math.cos(radians(previous.lat)) * Math.cos(radians(current.lat)) * Math.sin(dLng / 2) ** 2;
    distance += 6_371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return Math.round(distance);
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "roadtrip-create", 12, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });

    const body = await readJsonRequest(request, 12_000) as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim().replace(/\s+/g, " ") : "";
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 500) : "";
    const duration = typeof body.duration === "number" && Number.isInteger(body.duration)
      ? Math.min(90, Math.max(1, body.duration))
      : 1;
    const slugs = Array.isArray(body.placeSlugs)
      ? [...new Set(body.placeSlugs.filter((value): value is string => typeof value === "string" && SLUG.test(value)))].slice(0, 30)
      : [];

    if (title.length < 3 || title.length > 80) throw new RequestBodyError("Le titre doit contenir entre 3 et 80 caractères", 400);
    if (slugs.length === 0) throw new RequestBodyError("Ajoutez au moins un lieu labellisé", 400);

    const prisma = getPrisma();
    const labelledCatalog = new Map(ENRICHED_LIEUX.map((place) => [place.id, place]));
    const sourcePlaces = slugs.map((slug) => labelledCatalog.get(slug));
    if (sourcePlaces.some((place) => !place)) throw new RequestBodyError("Un lieu n’est pas reconnu comme labellisé", 400);

    // The static V1 catalogue remains the approved source while Place records
    // are progressively migrated. Only missing labelled places are inserted;
    // existing database records are never overwritten here.
    await prisma.place.createMany({
      data: sourcePlaces.map((place) => ({
        name: place!.nom,
        slug: place!.id,
        type: PLACE_TYPES[place!.type],
        description: place!.description,
        addressLine1: place!.address,
        city: place!.ville,
        region: place!.region,
        country: place!.pays,
        lat: place!.coordonnees.lat,
        lng: place!.coordonnees.lng,
        mainImageUrl: place!.photoUrl,
        images: place!.photos ?? [],
        discountPercent: place!.discountPercent,
        rating: place!.note,
        reviewCount: place!.avisCount,
        tags: place!.tags,
        services: place!.services,
        status: "PUBLISHED",
        favoritesCount: place!.favoris,
        phone: place!.telephone || null,
        email: place!.email || null,
        website: place!.siteWeb || null,
        hours: place!.horaires || null,
      })),
      skipDuplicates: true,
    });

    const places = await prisma.place.findMany({
      where: { slug: { in: slugs }, status: "PUBLISHED" },
      select: { id: true, slug: true, lat: true, lng: true },
    });
    const bySlug = new Map(places.map((place) => [place.slug, place]));
    const orderedPlaces = slugs.map((slug) => bySlug.get(slug)).filter((place): place is NonNullable<typeof place> => Boolean(place));
    if (orderedPlaces.length !== slugs.length) throw new RequestBodyError("Un lieu n’est plus disponible", 400);

    const roadTrip = await prisma.$transaction(async (tx) => {
      const created = await tx.roadTrip.create({
        data: {
          userId: member.id,
          title,
          description: description || `Itinéraire de ${orderedPlaces.length} étape${orderedPlaces.length > 1 ? "s" : ""} Label Vanlife.`,
          duration,
          distance: routeDistanceKm(orderedPlaces),
          isPublic: false,
          etapes: {
            create: orderedPlaces.map((place, index) => ({
              placeId: place.id,
              order: index + 1,
              day: Math.min(duration, index + 1),
            })),
          },
        },
        include: {
          etapes: {
            include: { place: { select: { name: true, slug: true, city: true } } },
            orderBy: { order: "asc" },
          },
        },
      });
      await tx.analyticsEvent.create({
        data: {
          name: "activity_created",
          userId: member.id,
          entityType: "road_trip",
          entityId: created.id,
          path: "/member/roadtrips",
          properties: { steps: orderedPlaces.length, duration },
        },
      });
      return created;
    });

    return NextResponse.json({
      roadTrip: { ...roadTrip, tags: Array.isArray(roadTrip.tags) ? roadTrip.tags : [] },
    }, { status: 201 });
  } catch (error) {
    return apiError(error, "roadtrip-create");
  }
}
