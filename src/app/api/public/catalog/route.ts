import { NextResponse } from "next/server";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { redactPublicPlaceText } from "@/server/public-place";
import { getVisibleSpottedPlaces } from "@/server/spotted-visibility";

export const dynamic = "force-dynamic";

export async function GET() {
  const labelledPlaces = ENRICHED_LIEUX
    .filter((place) => place.status === "actif")
    .map((place) => ({
      id: place.id,
      nom: place.nom,
      type: place.type,
      description: redactPublicPlaceText(place.description),
      photoUrl: place.photoUrl,
      logoUrl: place.logoUrl,
      region: place.region,
      ville: place.ville,
      services: place.services,
      hasMemberBenefit: place.discountPercent > 0 || Boolean(place.priceHighlight),
    }));
  const spottedPlaces = (await getVisibleSpottedPlaces()).map((place) => ({
    id: place.id,
    name: place.name,
    city: place.city,
    region: place.region,
  }));

  return NextResponse.json({ labelledPlaces, spottedPlaces }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
