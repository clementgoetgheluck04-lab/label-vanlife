import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EcosystemGrid } from "@/components/EcosystemGrid";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "L’écosystème Label Vanlife",
  description: "Découvrez la carte membre, Places, Trips, Passport, Friendly, App et AI : l’écosystème mondial Label Vanlife.",
  alternates: { canonical: "/ecosysteme" },
};

export default function EcosystemPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pt-28 pb-20">
      <section className="mx-auto max-w-4xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Un écosystème, une promesse</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight text-neutral-900 sm:text-6xl">Tout l’univers de la vanlife de confiance.</h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-neutral-500">Label Vanlife est la marque mère d’un ensemble de produits simples et connectés, conçus pour accompagner chaque voyage et chaque lieu partenaire.</p>
      </section>
      <section className="mx-auto mt-14 max-w-6xl px-6"><EcosystemGrid /></section>
      <section className="mx-auto mt-16 max-w-2xl px-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Commencer avec la carte membre</h2>
        <p className="mt-3 text-neutral-500">Le point d’entrée voyageur vers Places, Trips et Passport.</p>
        <Link href="/devenir-membre"><Button variant="cta" size="lg" className="mt-6 gap-2">Découvrir la carte membre — 29€ au lieu de 39€ <ArrowRight className="h-4 w-4" /></Button></Link>
      </section>
    </div>
  );
}
