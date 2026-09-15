import { NextResponse } from "next/server";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { SPOTTED_PLACES } from "@/data/spotted-places";
import { hasActiveMemberAccess } from "@/server/auth";

export async function GET() {
  let authorized = false;
  try {
    authorized = await hasActiveMemberAccess();
  } catch {
    authorized = false;
  }

  if (!authorized) {
    return NextResponse.json({ error: "Accès membre requis" }, {
      status: 403,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  return NextResponse.json({
    labelledPlaces: ENRICHED_LIEUX.filter((place) => place.status === "actif"),
    places: SPOTTED_PLACES,
  }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
