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
  return (
    <>
      <form action="/auth/logout" method="post" className="fixed right-4 top-20 z-40">
        <button
          type="submit"
          className="rounded-full border border-neutral-200 bg-white/95 px-4 py-2 text-xs font-semibold text-neutral-700 shadow-sm backdrop-blur transition hover:border-neutral-300 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
        >
          Se déconnecter
        </button>
      </form>
      {children}
    </>
  );
}
