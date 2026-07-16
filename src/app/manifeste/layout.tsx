import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifeste — Pour une vanlife responsable et sereine | Label Vanlife",
  description:
    "Lire le manifeste Label Vanlife. Notre vision d'une vanlife plus respectueuse : moins de spots sauvages, plus de confiance, de calme et de durabilité. Rejoignez le mouvement.",
  openGraph: {
    title: "Manifeste Label Vanlife — Changeons la façon de voyager",
    description:
      "Nous refusons la vanlife jetable et sans respect. Découvrez notre manifeste pour une vanlife responsable, authentique et sereine. Rejoignez le mouvement.",
    type: "website",
  },
};

export default function ManifesteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}