import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Label Vanlife — Pour une vanlife responsable et sereine",
  description:
    "Découvrez la charte Label Vanlife, son processus de sélection et les engagements demandés aux lieux d'accueil.",
  openGraph: {
    title: "Le Label Vanlife — Pour une vanlife responsable",
    description:
      "Label Vanlife ne cherche pas à répertorier tous les spots. Nous labellisons des lieux après étude d’un référentiel public. Découvrez notre méthode et rejoignez le mouvement.",
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
