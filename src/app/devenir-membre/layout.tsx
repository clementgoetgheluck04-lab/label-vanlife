import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir membre — Carte membre Label Vanlife 2026 à 29€",
  description:
    "La Carte membre Label Vanlife 2026 donne accès à la MAP réservée aux membres, aux lieux labellisés et aux avantages partenaires. 29€ jusqu'au 31 décembre 2026, sans renouvellement automatique.",
  openGraph: {
    title: "Devenir membre Label Vanlife — Carte membre 2026 à 29€",
    description:
      "Carte membre 2026 à 29€ : MAP Label Vanlife, lieux vérifiés, avantages membres et fiches détaillées.",
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
