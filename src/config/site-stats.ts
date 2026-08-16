import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { SPOTTED_PLACES } from "@/data/spotted-places";
import { MEMBER_DISCOUNT_MAX, MEMBER_DISCOUNT_MIN } from "@/config/commercial";

export const SITE_STATS = {
  labelledPlacesCount: ENRICHED_LIEUX.filter((place) => place.status === "actif").length,
  spottedPlacesCount: SPOTTED_PLACES.length,
  memberAdvantagesMin: MEMBER_DISCOUNT_MIN,
  memberAdvantagesMax: MEMBER_DISCOUNT_MAX,
} as const;
