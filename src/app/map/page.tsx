"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { SlidersHorizontal, X, Filter } from "lucide-react";
import { cn } from "@/lib/utils";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import Filters, { type FilterValues } from "@/components/explorer/Filters";
import LieuCard from "@/components/explorer/LieuCard";

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

export default function ExplorerPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("member-token");
    if (token !== "LABEL2026") {
      router.replace("/member-login");
    }
  }, [router]);

  const [filters, setFilters] = useState<FilterValues>(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const regions = useMemo(() => {
    const unique = new Set(ENRICHED_LIEUX.map((l) => l.region));
    return Array.from(unique).sort();
  }, []);

  const filtered = useMemo(() => {
    return ENRICHED_LIEUX.filter((lieu) => {
      if (filters.types.length > 0 && !filters.types.includes(lieu.type)) return false;
      if (filters.services.length > 0) {
        const hasService = filters.services.some((service) => lieu.services.includes(service));
        if (!hasService) return false;
      }
      if (filters.minNote > 0 && lieu.note < filters.minNote) return false;
      if (filters.region && lieu.region !== filters.region) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (
          !lieu.nom.toLowerCase().includes(q) &&
          !lieu.ville.toLowerCase().includes(q) &&
          !lieu.region.toLowerCase().includes(q) &&
          !lieu.description.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [filters]);

  const handleSelectLieu = (id: string) => {
    setSelectedId(id);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un lieu..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full h-10 pl-10 pr-4 text-sm bg-cream rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all text-charcoal placeholder:text-stone"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-xl border transition-all",
              showFilters
                ? "bg-sage text-white border-sage"
                : "bg-white text-stone border-border hover:border-sage hover:text-sage"
            )}
            aria-label="Filtres"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
        {/* Mobile filters panel */}
        {showFilters && (
          <div className="mt-3">
            <Filters
              regions={regions}
              selected={filters}
              onChange={setFilters}
            />
          </div>
        )}
      </div>

      {/* Desktop layout */}
      <div className="flex h-screen pt-16 lg:pt-20">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:flex lg:flex-col lg:w-[400px] xl:w-[440px] shrink-0 border-r border-border bg-white/50 backdrop-blur-sm">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-border/50">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-2xl font-bold text-charcoal font-serif">
                Explorer
              </h1>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "h-9 w-9 flex items-center justify-center rounded-lg border transition-all",
                  showFilters
                    ? "bg-sage text-white border-sage"
                    : "bg-white text-stone border-border hover:border-sage hover:text-sage"
                )}
                aria-label="Filtres"
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-stone">
              Trouve le lieu parfait pour ta prochaine aventure
            </p>
            {/* Result count */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs font-semibold text-sage bg-sage/10 px-3 py-1 rounded-full">
                {filtered.length} lieu{filtered.length !== 1 ? "x" : ""} trouv
                {filtered.length !== 1 ? "\u00e9s" : "\u00e9"}
              </span>
              {filtered.length !== ENRICHED_LIEUX.length && (
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-xs text-stone hover:text-charcoal transition-colors"
                >
                  R\u00e9initialiser
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="px-6 py-4 border-b border-border/50">
              <Filters
                regions={regions}
                selected={filters}
                onChange={setFilters}
              />
            </div>
          )}

          {/* Cards list */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {filtered.length > 0 ? (
              filtered.map((lieu) => (
                <LieuCard
                  key={lieu.id}
                  lieu={lieu}
                  className={cn(
                    selectedId === lieu.id && "ring-2 ring-sage"
                  )}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-charcoal mb-1">
                  Aucun lieu trouv\u00e9
                </p>
                <p className="text-sm text-stone max-w-[240px]">
                  Essaie de modifier tes filtres pour voir plus de r\u00e9sultats.
                </p>
              </div>
            )}
          </div>
        </aside>

        {/* Map */}
        <main className="flex-1 relative">
          <MapContainer
            lieux={filtered}
            selectedId={selectedId}
            onSelectLieu={handleSelectLieu}
            className="h-full w-full"
          >
            {/* Mobile bottom drawer result count */}
            <div className="lg:hidden absolute bottom-4 left-4 right-4 z-10">
              <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-charcoal">
                  {filtered.length} lieu{filtered.length !== 1 ? "x" : ""} trouv
                  {filtered.length !== 1 ? "\u00e9s" : "\u00e9"}
                </span>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-xs text-sage font-medium hover:text-sage-dark transition-colors"
                >
                  Voir la liste
                </button>
              </div>
            </div>
          </MapContainer>
        </main>
      </div>
    </div>
  );
}
