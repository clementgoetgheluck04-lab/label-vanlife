import { MEMBER_DISCOUNT_MAX, MEMBER_DISCOUNT_MIN } from "@/config/commercial";

// Compteurs publics contrôlés par les tests de cohérence avec les catalogues privés.
export const SITE_STATS = {
  labelledPlacesCount: 26,
  spottedPlacesCount: 613,
  memberAdvantagesMin: MEMBER_DISCOUNT_MIN,
  memberAdvantagesMax: MEMBER_DISCOUNT_MAX,
} as const;
