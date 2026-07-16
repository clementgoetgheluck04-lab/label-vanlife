import type { Metadata } from "next";
import { requireActiveMember } from "@/server/auth";

export const metadata: Metadata = {
  title: "Road Trips Vanlife — Itinéraires et idées de voyage | Label Vanlife",
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
