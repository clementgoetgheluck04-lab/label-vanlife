import type { Metadata } from "next";
import { requireActiveMember } from "@/server/auth";

export const metadata: Metadata = {
  title: "Espace membre — Carte, MAP et avantages",
  description:
    "Découvrez les road trips vanlife sélectionnés par Label Vanlife. Itinéraires détaillés, lieux d'étape labellisés, budgets et conseils pour voyager en van.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireActiveMember();
  return <>{children}</>;
}
