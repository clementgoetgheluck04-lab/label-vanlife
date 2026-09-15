import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Route, ShieldCheck, Sparkles } from "lucide-react";

import ShareTripButton from "@/components/roadtrip/ShareTripButton";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getPublicTrip(id: string) {
  if (!/^[a-zA-Z0-9_-]{8,64}$/.test(id)) return null;
  return getPrisma().roadTrip.findFirst({
    where: { id, isPublic: true },
    include: {
      etapes: {
        where: { place: { status: "PUBLISHED" } },
        select: {
          id: true,
          order: true,
          day: true,
          place: { select: { name: true, slug: true, city: true, region: true, country: true } },
        },
        orderBy: { order: "asc" },
      },
    },
  });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const trip = await getPublicTrip(id);
  if (!trip) return { title: "Road trip indisponible" };
  const summary = `${trip.duration} jour${trip.duration > 1 ? "s" : ""} · ${trip.etapes.length} étape${trip.etapes.length > 1 ? "s" : ""}${trip.distance ? ` · environ ${trip.distance} km` : ""}`;
  return {
    title: `${trip.title} — Vanlife Activity`,
    description: `${summary}. Un road trip partagé avec Label Vanlife.`,
    robots: { index: false, follow: true },
    openGraph: {
      title: trip.title,
      description: summary,
      type: "article",
    },
  };
}

export default async function PublicTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trip = await getPublicTrip(id);
  if (!trip) notFound();

  const places = trip.etapes.map((step) => step.place);
  const destination = places.length > 1
    ? `${places[0].city} → ${places.at(-1)?.city}`
    : places[0]?.city || "Road trip vanlife";
  const month = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(trip.updatedAt);

  return (
    <main className="min-h-screen bg-[#f5f1e8] px-4 pb-20 pt-28 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-7">
        <section className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-800 to-emerald-600 p-6 text-white shadow-2xl sm:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-100">Vanlife Activity</p>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs capitalize text-emerald-50">{month}</span>
          </div>
          <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-[#dfc59f]">Mon road trip</p>
          <h1 className="mt-2 text-4xl font-black leading-tight sm:text-6xl">{trip.title}</h1>
          <p className="mt-4 flex items-center gap-2 text-lg text-emerald-50"><Route className="h-5 w-5" />{destination}</p>
          <div className="mt-10 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-white/10 p-4"><strong className="block text-2xl sm:text-3xl">{trip.duration}</strong><span className="text-xs text-emerald-100">jour{trip.duration > 1 ? "s" : ""}</span></div>
            <div className="rounded-2xl bg-white/10 p-4"><strong className="block text-2xl sm:text-3xl">{trip.etapes.length}</strong><span className="text-xs text-emerald-100">étape{trip.etapes.length > 1 ? "s" : ""}</span></div>
            <div className="rounded-2xl bg-white/10 p-4"><strong className="block text-2xl sm:text-3xl">{trip.distance ?? "—"}</strong><span className="text-xs text-emerald-100">km indicatifs</span></div>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ShareTripButton tripId={trip.id} title={trip.title} />
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-100"><ShieldCheck className="h-4 w-4" />Aucune position privée publiée</span>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50"><MapPin className="h-5 w-5 text-emerald-700" /></span><div><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Itinéraire public</p><h2 className="text-xl font-black text-neutral-950">Les étapes Label Vanlife</h2></div></div>
          <div className="mt-7 space-y-0">
            {trip.etapes.map((step, index) => (
              <div key={step.id} className="relative flex gap-4 pb-7 last:pb-0">
                {index < trip.etapes.length - 1 && <span className="absolute left-5 top-10 h-[calc(100%-1.25rem)] w-px bg-emerald-200" />}
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-black text-white">{index + 1}</span>
                <div className="min-w-0 pt-1"><Link href={`/lieux/${step.place.slug}`} data-analytics-event="public_trip_place_click" data-analytics-entity-type="road_trip" data-analytics-entity-id={trip.id} className="font-black text-neutral-950 hover:text-emerald-700">{step.place.name}</Link><p className="mt-1 text-sm text-neutral-500">{step.place.city} · {step.place.region}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] bg-neutral-950 p-7 text-center text-white sm:p-10">
          <Sparkles className="mx-auto h-8 w-8 text-[#dfc59f]" />
          <h2 className="mt-4 text-2xl font-black">Créez votre prochain road trip</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-300">Préparez vos étapes, retrouvez les lieux qui accueillent vraiment les vans et transformez votre voyage en souvenir partageable.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href={`/devenir-membre?utm_source=public_trip&utm_medium=share&utm_campaign=vanlife_activity`} data-analytics-event="public_trip_signup" data-analytics-entity-type="road_trip" data-analytics-entity-id={trip.id} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#d0ad7d] px-5 text-sm font-black text-neutral-950">Découvrir la Carte membre <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/explorer" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-5 text-sm font-bold text-white">Explorer les lieux</Link>
          </div>
        </section>

        <p className="flex items-start gap-2 px-2 text-xs leading-5 text-neutral-500"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0" />Ce récapitulatif affiche seulement des établissements publics et une distance indicative entre étapes. Il ne publie ni trace GPS, ni position actuelle, ni lieu privé.</p>
      </div>
    </main>
  );
}
