import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carte des lieux vanlife — Spots labellisés France",
  description:
    "Explore notre carte interactive des lieux labellisés Label Vanlife en France. Campings, étapes nature et hébergements insolites sélectionnés pour une vanlife de qualité, avec réductions membres.",
  openGraph: {
    title: "Carte interactive — Lieux vanlife labellisés France",
    description:
      "Découvrez les lieux labellisés Label Vanlife sur notre carte interactive. Filtrez par région, type et services pour trouver le spot parfait pour votre van.",
    type: "website",
  },
};

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
