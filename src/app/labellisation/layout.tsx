import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Labellisation — Offre 2026 à 110€",
  description:
    "Candidatez à la certification Label Vanlife. Offre fondateur 2026 à 110€, tarif public 2027 annoncé à 290€, dans la limite des places disponibles et remboursée intégralement si le lieu est déclaré non conforme.",
  openGraph: {
    title: "Labellisation Label Vanlife — Offre 2026 à 110€",
    description:
      "Offre fondateur 2026 à 110€, tarif public 2027 annoncé à 290€, dans la limite des places disponibles et avec remboursement si non-conforme.",
    type: "website",
  },
};

export default function LabellisationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
