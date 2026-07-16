import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir membre — Carte membre à 29€ cette année",
  description:
    "La carte membre donne accès pendant 12 mois aux lieux sélectionnés, à la map interactive et aux avantages Label Vanlife. Offre actuelle à 29€ au lieu de 39€, sans renouvellement automatique.",
  openGraph: {
    title: "Devenir membre Label Vanlife — 29€ cette année",
    description:
      "Carte membre à 29€ au lieu de 39€ pour 12 mois : map interactive, lieux, avantages, Trips et Passport.",
    type: "website",
  },
};

export default function DevenirMembreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
