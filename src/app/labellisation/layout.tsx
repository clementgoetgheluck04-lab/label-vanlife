import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Labellisation 2027 — Offre de lancement à 110€",
  description:
    "Candidatez au Label Vanlife 2027. Offre de lancement à 110€ au lieu de 290€, active dès validation, sans commission et remboursée intégralement si le lieu est déclaré non conforme.",
  alternates: { canonical: "/labellisation" },
  openGraph: {
    title: "Labellisation Label Vanlife 2027 — 110€ au lieu de 290€",
    description:
      "Prévente 2027 à 110€ au lieu de 290€, active dès validation, dans la limite des places disponibles et avec remboursement si non-conforme.",
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
