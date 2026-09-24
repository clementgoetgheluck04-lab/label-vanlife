// Présentation seulement : ne pas utiliser pour les paiements actuels.
export const LABEL_OFFERS_START = "02/02/2027";
export const EXCELLENCE_PROMO_END = "01/02/2027";
export const ESSENTIAL_MONTHLY_CENTS = 2490;
export const EXCELLENCE_MONTHLY_CENTS = 5990;
export const LABEL_LOYALTY_TIERS = [
  { label: "1re année", essential: ESSENTIAL_MONTHLY_CENTS, excellence: EXCELLENCE_MONTHLY_CENTS },
  { label: "2e année", essential: 1990, excellence: 5490 },
  { label: "3e année et suivantes", essential: 1490, excellence: 4990 },
] as const;
export const EXCELLENCE_DISCOUNT_PERCENT = 20;
export const EXCELLENCE_PROMO_MONTHLY_CENTS = Math.round(EXCELLENCE_MONTHLY_CENTS * (100 - EXCELLENCE_DISCOUNT_PERCENT) / 100);
export const EXCELLENCE_PROMO_LOYALTY_CENTS = LABEL_LOYALTY_TIERS.map(
  (tier) => Math.round(tier.excellence * (100 - EXCELLENCE_DISCOUNT_PERCENT) / 100),
);
export const EXCELLENCE_CONTACT_LABEL = "Je souhaite être recontacté pour découvrir l’offre Excellence et recevoir une proposition promotionnelle avant le 31 décembre 2026, sans engagement.";
export const EXCELLENCE_CONTACT_VERSION = "2026-09-23";

export function formatOfferEuros(cents: number): string {
  return (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export const LABEL_OFFER_COMPARISON = [
  ["Contrôle des critères et labellisation", "Inclus", "Critères identiques"],
  ["Badge et kit de communication numérique", "Inclus", "Inclus"],
  ["Fiche détaillée, MAP et recherches", "Inclus", "Inclus"],
  ["Avantage réservé aux membres", "Inclus", "Inclus"],
  ["Publication Facebook d’arrivée", "Annonce simple", "Annonce + présentation éditorialisée"],
  ["Road trip créé autour du lieu", "Non inclus", "Inclus"],
  ["Présentation par email / newsletter", "Non incluse", "Incluse"],
  ["Visibilité renforcée", "Non incluse", "Selon la pertinence pour le voyageur"],
  ["Notifications géolocalisées", "Non incluses", "Avec l’accord du membre et selon son parcours"],
  ["Notification événementielle", "Non incluse", "1 par an, après validation"],
  ["Exclusivité Excellence de même catégorie", "Non incluse", "Rayon de 15 km, sous réserve de disponibilité"],
  ["Statistiques avancées", "Non incluses", "Vues, clics et interactions mesurées"],
  ["Boost Excellence", "Non inclus", "1 temps fort de communication par an"],
] as const;
