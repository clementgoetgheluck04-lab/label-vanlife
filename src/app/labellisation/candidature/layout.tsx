import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidature au Label Vanlife 2027",
  description: "Présentez votre camping ou lieu d'accueil et ses engagements pour les voyageurs itinérants. Complétez votre dossier de candidature au Label Vanlife 2027.",
  alternates: { canonical: "/labellisation/candidature" },
};

export default function CandidatureLayout({ children }: { children: React.ReactNode }) {
  return children;
}
