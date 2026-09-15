import Link from "next/link";
import { BarChart3, ChevronRight, Download, Eye, Heart, MapPin, Navigation, Settings } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { getPrisma } from "@/lib/prisma";
import { requirePageUser } from "@/server/auth";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Actif",
  CERTIFIED: "Certifié",
  AUDIT: "En audit",
  PROSPECT: "Candidature à finaliser",
  SUSPENDED: "Suspendu",
};

export default async function ProDashboard() {
  const user = await requirePageUser();
  const prisma = getPrisma();
  const pro = await prisma.establishmentProfile.findUnique({
    where: { userId: user.id },
    include: {
      managedPlaces: {
        select: { id: true, slug: true, name: true, city: true, region: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!pro) {
    return (
      <main className="min-h-screen bg-neutral-50 px-4 py-16">
        <Card className="mx-auto max-w-xl p-8 text-center">
          <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
          <h1 className="mt-4 text-2xl font-bold text-neutral-900">Aucun espace établissement associé</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
            Déposez une candidature pour créer la fiche de votre lieu. L’espace professionnel sera activé après l’étude du dossier.
          </p>
          <Link href="/labellisation/candidature" className="mt-6 inline-flex">
            <Button variant="cta">Demander mon label 2027</Button>
          </Link>
        </Card>
      </main>
    );
  }

  const placeIds = pro.managedPlaces.map((place) => place.id);
  const placeSlugs = pro.managedPlaces.map((place) => place.slug);
  // This dynamic server report intentionally snapshots a rolling 30-day window.
  // eslint-disable-next-line react-hooks/purity
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1_000);
  const activity = placeSlugs.length
    ? await prisma.analyticsEvent.groupBy({
        by: ["name"],
        where: {
          createdAt: { gte: thirtyDaysAgo },
          entityType: "lieux",
          entityId: { in: placeSlugs },
          name: { in: ["place_view", "route_start", "benefit_view"] },
        },
        _count: { _all: true },
      })
    : [];
  const favorites = placeIds.length
    ? await prisma.favorite.count({ where: { placeId: { in: placeIds } } })
    : 0;
  const byEvent = Object.fromEntries(activity.map((entry) => [entry.name, entry._count._all]));
  const stats = [
    { icon: Eye, label: "Vues de fiche", value: byEvent.place_view ?? 0, detail: "30 derniers jours", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Navigation, label: "Départs GPS", value: byEvent.route_start ?? 0, detail: "Maps + Waze · 30 jours", color: "text-emerald-700", bg: "bg-emerald-50" },
    { icon: Heart, label: "Favoris", value: favorites, detail: "Total enregistré", color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <main className="min-h-screen bg-neutral-50 pb-24">
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-4xl space-y-2 px-4 py-6">
          <p className="text-sm font-semibold text-emerald-700">Espace professionnel</p>
          <h1 className="text-2xl font-bold text-neutral-900">{pro.establishmentName}</h1>
          <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            {STATUS_LABELS[pro.status] || pro.status}
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div><h2 className="text-lg font-bold text-neutral-900">Résultats mesurés</h2><p className="mt-1 text-xs text-neutral-500">Uniquement les actions enregistrées sur vos fiches Label Vanlife.</p></div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-neutral-500">Données réelles</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => <Card key={stat.label} className="p-5"><div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}><stat.icon className={`h-5 w-5 ${stat.color}`} /></div><p className="mt-4 text-3xl font-black text-neutral-950">{stat.value}</p><p className="mt-1 text-sm font-bold text-neutral-800">{stat.label}</p><p className="mt-1 text-xs text-neutral-500">{stat.detail}</p></Card>)}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900">Mes lieux</h2>
          {pro.managedPlaces.length === 0 ? (
            <Card className="p-8 text-center"><MapPin className="mx-auto h-10 w-10 text-neutral-300" /><p className="mt-3 font-medium text-neutral-600">Aucune fiche publiée n’est encore rattachée à ce compte.</p><p className="mt-1 text-sm text-neutral-400">Nous finalisons ce rattachement lors de la validation du label.</p></Card>
          ) : pro.managedPlaces.map((place) => (
            <Link key={place.id} href={`/lieux/${place.slug}`} className="block"><Card className="flex items-center justify-between p-5 transition-shadow hover:shadow-md"><div className="flex items-center gap-4"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50"><MapPin className="h-6 w-6 text-emerald-700" /></span><span><strong className="block text-neutral-900">{place.name}</strong><span className="text-sm text-neutral-500">{place.city} · {place.region}</span></span></div><ChevronRight className="h-5 w-5 text-neutral-300" /></Card></Link>
          ))}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link href="/pro/fiche"><Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50"><Settings className="h-6 w-6 text-emerald-700" /></span><span><strong className="block text-neutral-900">Ma fiche</strong><span className="text-sm text-neutral-500">Vérifier mes informations</span></span></Card></Link>
          <Link href="/pro/kit-communication"><Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50"><Download className="h-6 w-6 text-amber-700" /></span><span><strong className="block text-neutral-900">Kit de communication 2027</strong><span className="text-sm text-neutral-500">Logos et fichiers officiels sécurisés</span></span></Card></Link>
          {pro.status !== "ACTIVE" && pro.status !== "CERTIFIED" ? <Link href="/labellisation"><Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-md"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50"><BarChart3 className="h-6 w-6 text-blue-700" /></span><span><strong className="block text-neutral-900">Finaliser mon label</strong><span className="text-sm text-neutral-500">Consulter le parcours de labellisation</span></span></Card></Link> : null}
        </section>
      </div>
    </main>
  );
}
