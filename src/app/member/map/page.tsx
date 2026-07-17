"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { X, Filter, MapPin, Percent, ArrowLeft, BadgeCheck, TentTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import Filters, { type FilterValues } from "@/components/explorer/Filters";
import LieuCard from "@/components/explorer/LieuCard";
import type { MemberCampingPoint } from "@/components/explorer/MapContainer";

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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showLabelled, setShowLabelled] = useState(true);
  const [showMemberAddresses, setShowMemberAddresses] = useState(true);
  const [memberOnlyPlaces, setMemberOnlyPlaces] = useState<MemberCampingPoint[]>([]);

  // Compute available regions from data
  const regions = useMemo(() => {
    const unique = new Set(ENRICHED_LIEUX.map((l) => l.region));
    return Array.from(unique).sort();
  }, []);

  const filteredLieux = useMemo(() => {
    return ENRICHED_LIEUX.filter((lieu) => {
      if (filters.types.length > 0 && !filters.types.includes(lieu.type)) return false;
      if (filters.services.length > 0 && !filters.services.some((service) => lieu.services.includes(service))) return false;
      if (filters.minNote > 0 && lieu.note < filters.minNote) return false;
      if (filters.region && lieu.region !== filters.region) return false;
      if (filters.search && !lieu.nom.toLowerCase().includes(filters.search.toLowerCase()) && !lieu.ville.toLowerCase().includes(filters.search.toLowerCase())) return false;
      return true;
    });
  }, [filters]);

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
                {filteredLieux.length} lieux labellisés · {memberOnlyPlaces.length} lieux repérés
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
            Réductions membres de <strong className="text-emerald-600">-8% à -15%</strong> chez tous les partenaires
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
              <span className="text-xs text-neutral-600">Non labellisés · site visible pour réserver directement</span>
            </span>
          </button>
        </div>

        {/* Map */}
        <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg border border-neutral-100">
          <MapContainer
            lieux={showLabelled ? filteredLieux : []}
            memberOnlyPlaces={showMemberAddresses ? memberOnlyPlaces : []}
            selectedId={selectedId}
            onSelectLieu={setSelectedId}
          />
        </div>

        {/* Results */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-900">
              Résultats
              <span className="text-sm font-normal text-neutral-400 ml-2">({filteredLieux.length})</span>
            </h2>
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
        </div>
      </div>
    </div>
  );
}
