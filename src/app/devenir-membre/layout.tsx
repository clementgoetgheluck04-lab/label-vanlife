import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devenir membre — Carte membre Label Vanlife 2027 à 29 €",
  description:
    "La Carte membre Label Vanlife 2027 donne accès immédiatement à la MAP, aux lieux labellisés et aux avantages partenaires. 29 € jusqu'au 31 décembre 2027, sans renouvellement automatique.",
  alternates: { canonical: "/devenir-membre" },
  openGraph: {
    title: "Devenir membre Label Vanlife — Carte membre 2027 à 29 €",
    description:
      "Carte membre 2027 à 29 € : accès immédiat à la MAP Label Vanlife, lieux vérifiés, avantages membres et fiches détaillées.",
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
