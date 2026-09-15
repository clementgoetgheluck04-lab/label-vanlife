import "server-only";

import type { PrismaClient } from "@/generated/prisma/client";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

const PLACE_TYPES = {
  camping: "CAMPING",
  parking: "PARKING",
  etape_nature: "ETAPE_NATURE",
  hebergement_insolite: "HEBERGEMENT_INSOLITE",
  restaurant: "RESTAURANT",
  activite: "ACTIVITE",
} as const;

export function getLabelledPlace(slug: string) {
  return ENRICHED_LIEUX.find((place) => place.id === slug);
}

export async function ensureLabelledPlaces(prisma: PrismaClient, slugs: string[]) {
  const uniqueSlugs = [...new Set(slugs)];
  const sourcePlaces = uniqueSlugs.map((slug) => getLabelledPlace(slug));
  if (sourcePlaces.some((place) => !place)) return null;

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

  return prisma.place.findMany({
    where: { slug: { in: uniqueSlugs }, status: "PUBLISHED" },
    select: { id: true, slug: true, lat: true, lng: true, name: true, city: true, region: true },
  });
}
