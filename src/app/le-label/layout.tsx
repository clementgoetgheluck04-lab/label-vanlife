import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Label Vanlife — Pour une vanlife responsable et sereine",
  description:
    "Label Vanlife est le 1er label pour vanlifers en France. Découvrez pourquoi nous avons tout repensé : réseau de confiance, charte de qualité, sélection rigoureuse des lieux d'accueil.",
  openGraph: {
    title: "Le Label Vanlife — Pour une vanlife responsable",
    description:
      "Label Vanlife ne cherche pas à répertorier tous les spots. Nous choisissons de certifier les bons. Découvrez notre charte et rejoignez le mouvement.",
    type: "website",
  },
};

export default function LeLabelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}