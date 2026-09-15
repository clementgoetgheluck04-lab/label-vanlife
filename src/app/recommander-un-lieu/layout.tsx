import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommander un lieu accueillant pour les vans",
  description: "Recommandez en moins d’une minute un lieu qui accueille réellement les voyageurs en van. Chaque proposition est vérifiée par Label Vanlife.",
};

export default function RecommendPlaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
