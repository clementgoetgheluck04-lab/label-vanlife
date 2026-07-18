"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { X, Filter, MapPin, Percent, ArrowLeft, BadgeCheck, TentTree, Building2, ExternalLink, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import Filters, { type FilterValues } from "@/components/explorer/Filters";
import LieuCard from "@/components/explorer/LieuCard";
import type { MemberCampingPoint } from "@/components/explorer/MapContainer";
import { classifySpottedPlace, normalizeExternalWebsite, PLACE_UNIVERSE_LABELS, type PlaceUniverse } from "@/data/spotted-places";

const MapContainer = dynamic(
  () => import("@/components/explorer/MapContainer"),
  { ssr: false }
);

const DEFAULT_FILTERS: FilterValues = {
  types: [],
  services: [],
  minNote: 0,
  region: "",
  search: "",
};

export default function MemberMapPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) { setAuthed(true); return; }
      const response = await fetch("/api/auth/admin-preview", { cache: "no-store" });
      const preview = response.ok ? await response.json() as { active?: boolean } : {};
      if (preview.active) setAuthed(true);
      else router.replace("/member-login?redirect=/member/map");
    });
  }, [router]);

  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [showLabelled, setShowLabelled] = useState(true);
  const [showMemberAddresses, setShowMemberAddresses] = useState(true);
  const [memberOnlyPlaces, setMemberOnlyPlaces] = useState<MemberCampingPoint[]>([]);
  const [universe, setUniverse] = useState<PlaceUniverse>("tous");
  const [visibleMemberPlaces, setVisibleMemberPlaces] = useState(24);

  // Compute available regions from data
  const regions = useMemo(() => {
    const unique = new Set(ENRICHED_LIEUX.map((l) => l.region));
    memberOnlyPlaces.forEach((place) => unique.add(place.region));
    return Array.from(unique).sort();
  }, [memberOnlyPlaces]);

  const filteredLieux = useMemo(() => {
    return ENRICHED_LIEUX.filter((lieu) => {
      if (universe !== "tous") {
        const inferred = classifySpottedPlace({ name: lieu.nom, network: "" });
        const labelledUniverse = lieu.type === "camping" ? "camping"
          : lieu.type === "activite" ? "activite"
          : lieu.type === "hebergement_insolite" ? "hebergement"
          : inferred;
        if (labelledUniverse !== universe) return false;
      }
      if (filters.types.length > 0 && !filters.types.includes(lieu.type)) return false;
      if (filters.services.length > 0 && !filters.services.some((service) => lieu.services.includes(service))) return false;
      if (filters.minNote > 0 && lieu.note < filters.minNote) return false;
      if (filters.region && lieu.region !== filters.region) return false;
      if (filters.search && !lieu.nom.toLowerCase().includes(filters.search.toLowerCase()) && !lieu.ville.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters, universe]);

  const filteredMemberPlaces = useMemo(() => memberOnlyPlaces.filter((place) => {
    if (universe !== "tous" && classifySpottedPlace(place) !== universe) return false;
    if (filters.region && place.region !== filters.region) return false;
    if (filters.search) {
      const query = filters.search.toLocaleLowerCase("fr");
      if (![place.name, place.city, place.region].some((value) => value.toLocaleLowerCase("fr").includes(query))) return false;
    }
    return true;
  }), [filters.region, filters.search, memberOnlyPlaces, universe]);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/member/camping-network", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Accès aux adresses membres refusé");
        return response.json() as Promise<{ places: MemberCampingPoint[] }>;
      })
      .then(({ places }) => setMemberOnlyPlaces(places))
      .catch(() => setMemberOnlyPlaces([]));
  }, [authed]);

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/member" className="text-neutral-400 hover:text-neutral-600">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-neutral-900">MAP des lieux</h1>
              <p className="text-xs text-neutral-500">
                {filteredLieux.length} lieux labellisés · {filteredMemberPlaces.length} lieux repérés disponibles
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              showFilters
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 border border-transparent"
            )}
          >
            <Filter className="h-4 w-4" />
            Filtres
            {showFilters && <X className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="border-b border-neutral-100 bg-neutral-50/50">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Filters
              selected={filters}
              onChange={setFilters}
              regions={regions}
            />
          </div>
        </div>
      )}

      {/* Discount strip */}
      <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border-b border-amber-100">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-center gap-2 text-sm">
          <Percent className="h-4 w-4 text-amber-500" />
          <span className="text-neutral-700">
            Réductions membres de <strong className="text-emerald-600">-10% à -20%</strong> chez tous les partenaires labellisés
          </span>
        </div>
      </div>

      {/* Map + Cards */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setShowLabelled((value) => !value)}
            aria-pressed={showLabelled}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
              showLabelled ? "border-emerald-200 bg-emerald-50" : "border-neutral-200 bg-white opacity-60"
            )}
          >
            <span className="h-4 w-4 shrink-0 rounded-full bg-emerald-600 ring-4 ring-white shadow" />
            <span>
              <span className="flex items-center gap-1.5 font-bold text-neutral-900"><BadgeCheck className="h-4 w-4 text-emerald-600" /> Lieux labellisés</span>
              <span className="text-xs text-neutral-600">Accueil vérifié et avantages Label Vanlife</span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setShowMemberAddresses((value) => !value)}
            aria-pressed={showMemberAddresses}
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
              showMemberAddresses ? "border-[#c39960]/40 bg-[#c39960]/10" : "border-neutral-200 bg-white opacity-60"
            )}
          >
            <span className="h-4 w-4 shrink-0 rounded-full bg-[#c39960] ring-4 ring-white shadow" />
            <span>
              <span className="flex items-center gap-1.5 font-bold text-neutral-900"><TentTree className="h-4 w-4 text-[#9a7547]" /> Lieux repérés</span>
              <span className="text-xs text-neutral-600">Optionnels · plus discrets · site visible pour réserver directement</span>
            </span>
          </button>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">Filtrer par univers</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(PLACE_UNIVERSE_LABELS) as PlaceUniverse[]).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setUniverse(value)}
                aria-pressed={universe === value}
                className={cn(
                  "min-h-11 shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  universe === value
                    ? "border-emerald-700 bg-emerald-700 text-white"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:border-emerald-300 hover:text-emerald-800",
                )}
              >
                {PLACE_UNIVERSE_LABELS[value]}
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
          <MapContainer
            lieux={showLabelled ? filteredLieux : []}
            memberOnlyPlaces={showMemberAddresses ? filteredMemberPlaces : []}
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">
              Résultats
              <span className="text-sm font-normal text-neutral-400 ml-2">({filteredLieux.length + (showMemberAddresses ? filteredMemberPlaces.length : 0)})</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <BadgeCheck className="h-5 w-5 text-emerald-600" />
            <h3 className="font-bold text-neutral-900">Lieux labellisés en priorité</h3>
            <span className="text-xs text-neutral-400">({filteredLieux.length})</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredLieux.map((lieu) => (
              <LieuCard key={lieu.id} lieu={lieu} />
            ))}
          </div>
          {filteredLieux.length === 0 && (
            <div className="text-center py-12 text-neutral-400">
              <MapPin className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aucun lieu trouvé</p>
              <p className="text-sm">Essaie de modifier tes filtres.</p>
            </div>
          )}

          {showMemberAddresses && (
            <div className="space-y-4 border-t border-neutral-200 pt-7">
              <div className="flex items-center gap-2">
                <TentTree className="h-5 w-5 text-neutral-400" />
                <h3 className="font-bold text-neutral-700">Lieux repérés non labellisés</h3>
                <span className="text-xs text-neutral-400">({filteredMemberPlaces.length})</span>
              </div>
              <p className="text-xs text-neutral-500">Ces lieux sont affichés à titre informatif. Leur accueil et leurs conditions n&apos;ont pas encore été vérifiés par Label Vanlife.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMemberPlaces.slice(0, visibleMemberPlaces).map((place) => {
                  const website = normalizeExternalWebsite(place.website);
                  return (
                    <article key={place.id} className="flex min-h-56 flex-col rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 opacity-80 transition hover:opacity-100">
                      <div className="flex items-start justify-between gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-200 text-neutral-500"><Building2 className="h-5 w-5" /></span>
                        <span className="rounded-full bg-neutral-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-600">Non labellisé</span>
                      </div>
                      <h4 className="mt-4 line-clamp-2 font-bold text-neutral-800">{place.name}</h4>
                      <p className="mt-2 flex items-start gap-1.5 text-sm text-neutral-500"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{place.city} · {place.region}</p>
                      <p className="mt-2 text-xs text-neutral-400">{PLACE_UNIVERSE_LABELS[classifySpottedPlace(place)]} · Repéré par Label Vanlife</p>
                      <div className="mt-auto flex flex-col gap-2 pt-5">
                        <Link href={`/lieux-reperes/${place.id}`} className="flex min-h-11 items-center justify-center rounded-xl border border-neutral-300 bg-white px-3 py-2 text-center text-xs font-bold text-neutral-700 hover:border-neutral-400">Voir la fiche</Link>
                        {website && <a href={website} target="_blank" rel="noreferrer nofollow" className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-[#c39960] px-3 py-2 text-center text-xs font-bold text-white hover:bg-[#ad8250]">Réserver sur le site <ExternalLink className="h-3.5 w-3.5" /></a>}
                        <div className="grid grid-cols-2 gap-2">
                          <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-emerald-50 px-2 text-xs font-bold text-emerald-800 hover:bg-emerald-100"><Navigation className="h-3.5 w-3.5" /> Maps</a>
                          <a href={`https://waze.com/ul?ll=${place.lat}%2C${place.lng}&navigate=yes`} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-1 rounded-xl bg-blue-50 px-2 text-xs font-bold text-blue-700 hover:bg-blue-100"><Navigation className="h-3.5 w-3.5" /> Waze</a>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
              {visibleMemberPlaces < filteredMemberPlaces.length && (
                <div className="text-center">
                  <button type="button" onClick={() => setVisibleMemberPlaces((current) => current + 24)} className="min-h-11 rounded-full border border-neutral-300 bg-white px-5 py-2 text-sm font-bold text-neutral-700 hover:border-emerald-400 hover:text-emerald-800">
                    Afficher 24 lieux supplémentaires
                  </button>
                </div>
              )}
              {filteredMemberPlaces.length === 0 && <p className="rounded-2xl border border-dashed border-neutral-300 py-10 text-center text-sm text-neutral-400">Aucun lieu repéré pour ces filtres.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
