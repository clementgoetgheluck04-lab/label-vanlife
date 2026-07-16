import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Événements vanlife 2025 — Rassemblements et salons | Label Vanlife",
  description:
    "Tous les événements vanlife, rassemblements VW, salons camping-car et rencontres de la communauté Label Vanlife en France. Calendrier 2025-2026.",
  openGraph: {
    title: "Événements vanlife — Calendrier des rassemblements | Label Vanlife",
    description:
      "Découvrez tous les événements vanlife, rassemblements et salons partenaires Label Vanlife. Rasso COMBICOX, VW Dream & Troc, Valence Aircooled Show et plus.",
    type: "website",
  },
};

export default function EvenementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}