export const PRODUCTS = {
  membership: {
    code: "MEMBERSHIP" as const,
    name: "Carte membre Label Vanlife — 12 mois",
    amount: 2_900,
    currency: "eur",
    priceEnv: "STRIPE_MEMBERSHIP_PRICE_ID" as const,
  },
  labellisation: {
    code: "LABELLISATION" as const,
    name: "Candidature Vanlife Friendly",
    amount: 22_000,
    currency: "eur",
  },
} as const;

export const LABELLISATION_PROMOTION = {
  discountPercent: 50,
  amount: 11_000,
  standardAmount: 22_000,
  endsAt: "2026-12-31T23:59:59+01:00",
} as const;

export function getLabellisationProduct(now = new Date()) {
  const promotionActive = now.getTime() <= new Date(LABELLISATION_PROMOTION.endsAt).getTime();
  return promotionActive
    ? {
        ...PRODUCTS.labellisation,
        name: "Labellisation Label Vanlife — offre 2026",
        amount: LABELLISATION_PROMOTION.amount,
      }
    : PRODUCTS.labellisation;
}

export function formatEuro(amountInCents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amountInCents / 100);
}
