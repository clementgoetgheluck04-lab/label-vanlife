"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Route, Star, Plus, ArrowLeft, MapPin, Navigation, Trash2, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { MOCK_ROADTRIPS } from "@/data/mock-roadtrips";

type RoadTripDraftPlace = {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  href: string;
  kind: "labelled" | "spotted";
};

const ROADTRIP_DRAFT_STORAGE_KEY = "label-vanlife-roadtrip-draft";

function mapsUrl(place: RoadTripDraftPlace) {
  return `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`;
}

function wazeUrl(place: RoadTripDraftPlace) {
  return `https://waze.com/ul?ll=${place.lat}%2C${place.lng}&navigate=yes`;
}

export default function MemberRoadTripsPage() {
  const membre = MOCK_MEMBRES[0];
  const [draftPlaces, setDraftPlaces] = useState<RoadTripDraftPlace[]>([]);

  const roadTrips = useMemo(() => {
    return membre.roadTrips
      .map((id) => MOCK_ROADTRIPS.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [membre]);

  useEffect(() => {
    let nextDraft: RoadTripDraftPlace[] = [];
    try {
      const saved = window.localStorage.getItem(ROADTRIP_DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as RoadTripDraftPlace[];
        if (Array.isArray(parsed)) nextDraft = parsed.filter((place) => place.id && place.name);
      }
    } catch {
      nextDraft = [];
    }
    queueMicrotask(() => setDraftPlaces(nextDraft));
  }, []);

  function removeDraftPlace(id: string) {
    setDraftPlaces((current) => {
      const next = current.filter((place) => place.id !== id);
      try {
        window.localStorage.setItem(ROADTRIP_DRAFT_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Le brouillon reste utilisable pendant la session.
      }
      return next;
    });
  }

  function clearDraft() {
    setDraftPlaces([]);
    try {
      window.localStorage.removeItem(ROADTRIP_DRAFT_STORAGE_KEY);
    } catch {
      // Sans effet si le stockage local est indisponible.
    }
  }

  return (
    <div className="pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/member" className="flex min-h-10 min-w-10 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700" aria-label="Retour à l’espace membre">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Route className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Road Trips</h1>
            <p className="text-sm text-neutral-500">{roadTrips.length} itinéraires · {draftPlaces.length} destination{draftPlaces.length > 1 ? "s" : ""} en préparation</p>
          </div>
        </div>

        <Card className="overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-[#f7f1e8] p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Brouillon de road trip</p>
              <h2 className="mt-1 text-lg font-bold text-neutral-900">Construisez votre itinéraire depuis la MAP</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-600">Ajoutez des étapes depuis les fiches de la MAP, puis ouvrez directement la prochaine destination dans Google Maps ou Waze.</p>
            </div>
            <Link href="/member/map">
              <Button variant="cta" size="sm" className="w-full gap-1.5 sm:w-auto">
                <Plus className="h-4 w-4" />
                Ajouter depuis la MAP
              </Button>
            </Link>
          </div>
        </Card>

        {draftPlaces.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bold text-neutral-900">Mes destinations ajoutées</h2>
              <button type="button" onClick={clearDraft} className="text-xs font-semibold text-neutral-400 transition-colors hover:text-red-500">Vider</button>
            </div>
            <div className="space-y-3">
              {draftPlaces.map((place, index) => (
                <Card key={place.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700">{index + 1}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-neutral-900">{place.name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${place.kind === "labelled" ? "bg-emerald-50 text-emerald-700" : "bg-neutral-100 text-neutral-500"}`}>
                          {place.kind === "labelled" ? "Labellisé" : "Repéré"}
                        </span>
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-neutral-500"><MapPin className="h-3.5 w-3.5" /> {place.city} · {place.region}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-4">
                        <a href={mapsUrl(place)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100"><Navigation className="h-3.5 w-3.5" /> Maps</a>
                        <a href={wazeUrl(place)} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100"><Navigation className="h-3.5 w-3.5" /> Waze</a>
                        <Link href={place.href} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-700 hover:border-neutral-300"><ExternalLink className="h-3.5 w-3.5" /> Fiche</Link>
                        <button type="button" onClick={() => removeDraftPlace(place.id)} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-bold text-neutral-400 hover:border-red-200 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /> Retirer</button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Road trips list */}
        {roadTrips.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <Route className="h-12 w-12 text-neutral-300 mx-auto" />
            <div>
              <p className="text-neutral-500 font-medium">Aucun road trip pour l'instant</p>
              <p className="text-sm text-neutral-400 mt-1">
                Explore la carte et ajoute des lieux en favori pour créer ton itinéraire
              </p>
            </div>
            <Link href="/member/map">
              <Button variant="cta" size="sm" className="gap-1.5">Explorer les lieux</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {roadTrips.map((rt) => (
              <Card key={rt.id} variant="interactive" className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-base">{rt.titre}</h3>
                    <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{rt.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="info">{rt.duree} jours</Badge>
                  <Badge variant="info">{rt.distance} km</Badge>
                  <Badge variant="info">{rt.budget}€</Badge>
                  <Badge variant="premium"><Star className="h-3 w-3 fill-amber" /> {rt.likes}</Badge>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rt.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">#{tag}</span>
                  ))}
                </div>
              </Card>
            ))}
            <Link href="/member/map">
              <Button variant="secondary-dark" size="sm" className="w-full gap-1.5">
                <Plus className="h-4 w-4" /> Ajouter un lieu à mon road trip
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
