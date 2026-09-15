import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getPrisma } from "@/lib/prisma";
import { requirePageUser } from "@/server/auth";
import { ProProfileEditor } from "./ProProfileEditor";

export const dynamic = "force-dynamic";

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

export default async function ProFichePage() {
  const user = await requirePageUser();
  const pro = await getPrisma().establishmentProfile.findUnique({
    where: { userId: user.id },
    include: {
      managedPlaces: {
        select: {
          id: true, name: true, slug: true, description: true, shortDesc: true,
          phone: true, email: true, website: true, addressLine1: true, city: true,
          postalCode: true, region: true, services: true, status: true,
        },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!pro) {
    return <main className="min-h-screen bg-neutral-50 px-4 py-16"><Card className="mx-auto max-w-xl p-8 text-center"><MapPin className="mx-auto h-12 w-12 text-neutral-300" /><h1 className="mt-4 text-2xl font-bold text-neutral-900">Aucun établissement associé</h1><p className="mt-2 text-sm leading-6 text-neutral-500">Votre espace professionnel sera créé après la validation de votre candidature.</p><Link href="/labellisation/candidature" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#d0ad7d] px-6 text-sm font-bold text-neutral-950">Déposer une candidature</Link></Card></main>;
  }

  return (
    <main className="min-h-screen bg-neutral-50 pb-24">
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <Link href="/pro/dashboard" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-neutral-800"><ArrowLeft className="h-4 w-4" /> Retour au tableau de bord</Link>
        <header><p className="text-sm font-semibold text-emerald-700">Espace professionnel sécurisé</p><h1 className="mt-1 text-3xl font-black text-neutral-950">Mes informations</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-600">Vérifiez les coordonnées administratives de votre établissement et le contenu visible par les voyageurs. Seuls les lieux rattachés à votre compte peuvent être modifiés.</p></header>
        <ProProfileEditor
          establishment={{ establishmentName: pro.establishmentName, phone: pro.phone, website: pro.website ?? "", addressLine1: pro.addressLine1, city: pro.city, postalCode: pro.postalCode, region: pro.region }}
          places={pro.managedPlaces.map((place) => ({ ...place, shortDesc: place.shortDesc ?? "", phone: place.phone ?? "", email: place.email ?? "", website: place.website ?? "", addressLine1: place.addressLine1 ?? "", postalCode: place.postalCode ?? "", services: stringList(place.services) }))}
        />
      </div>
    </main>
  );
}
