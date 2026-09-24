import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Évènements vanlife — Agenda des salons et rencontres",
  description: "Une sélection de salons et rendez-vous du voyage itinérant, avec dates, lieux et liens vers les organisateurs.",
  alternates: { canonical: "/evenements" },
  openGraph: {
    title: "Évènements vanlife — Agenda | Label Vanlife",
    description: "Salons et rencontres vanlife : dates annoncées et informations officielles pour préparer votre visite.",
    url: "https://www.labelvanlife.fr/evenements",
    type: "website",
  },
};
export default function EvenementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
