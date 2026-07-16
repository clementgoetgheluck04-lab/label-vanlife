import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Labellisation — Offre 2026 à 110€ | Label Vanlife",
  description:
    "Candidatez à la certification Label Vanlife. Offre 2026 à 110€ au lieu de 220€, remboursée intégralement si le lieu est déclaré non conforme.",
  openGraph: {
    title: "Labellisation Label Vanlife — Offre 2026 à 110€",
    description:
      "Candidature et étude du dossier à 110€ au lieu de 220€ jusqu'au 31 décembre 2026, avec remboursement si non-conforme.",
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
