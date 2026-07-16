"use client";

import { Search, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import type { Lieu, Service } from "@/lib/types";

export interface FilterValues {
  types: Lieu["type"][];
  services: Service[];
  minNote: number;
  region: string;
  search: string;
}

interface FiltersProps {
  regions: string[];
  selected: FilterValues;
  onChange: (filters: FilterValues) => void;
  className?: string;
}

const TYPE_OPTIONS = [
  { value: "camping", label: "Camping" },
  { value: "parking", label: "Parking" },
  { value: "etape_nature", label: "\u00c9tape Nature" },
  { value: "hebergement_insolite", label: "Insolite" },
] as const;

const SERVICE_OPTIONS = [
  { value: "wifi", label: "WiFi" },
  { value: "eau", label: "Eau" },
  { value: "douche", label: "Douche" },
  { value: "vidange", label: "Vidange" },
] as const;

const NOTE_OPTIONS = [
  { value: 0, label: "Toutes" },
  { value: 3, label: "3+" },
  { value: 4, label: "4+" },
  { value: 4.5, label: "4.5+" },
] as const;

export default function Filters({
  regions,
  selected,
  onChange,
  className,
}: FiltersProps) {
  const update = (patch: Partial<FilterValues>) => {
    onChange({ ...selected, ...patch });
  };

  const toggleType = (type: Lieu["type"]) => {
    const newTypes = selected.types.includes(type)
      ? selected.types.filter((t) => t !== type)
      : [...selected.types, type];
    update({ types: newTypes });
  };

  const toggleService = (service: Service) => {
    const newServices = selected.services.includes(service)
      ? selected.services.filter((s) => s !== service)
      : [...selected.services, service];
    update({ services: newServices });
  };

  const hasActiveFilters =
    selected.types.length > 0 ||
    selected.services.length > 0 ||
    selected.minNote > 0 ||
    selected.region !== "" ||
    selected.search !== "";

  const clearAll = () => {
    onChange({
      types: [],
      services: [],
      minNote: 0,
      region: "",
      search: "",
    });
  };

  return (
    <div className={cn("glass rounded-2xl p-4 space-y-4 overflow-x-auto", className)}>
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone pointer-events-none" />
        <input
          type="text"
          placeholder="Rechercher un lieu..."
          value={selected.search}
          onChange={(e) => update({ search: e.target.value })}
          className="w-full h-10 pl-10 pr-4 text-sm bg-white/80 rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage transition-all text-charcoal placeholder:text-stone"
        />
        {selected.search && (
          <button
            onClick={() => update({ search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone hover:text-charcoal"
            aria-label="Effacer la recherche"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Type filters */}
      <div>
        <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
          Type
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {TYPE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              variant={selected.types.includes(opt.value) ? "selected" : "filter"}
              onClick={() => toggleType(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Service filters */}
      <div>
        <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
          Services
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {SERVICE_OPTIONS.map((opt) => (
            <Chip
              key={opt.value}
              variant={selected.services.includes(opt.value) ? "selected" : "filter"}
              onClick={() => toggleService(opt.value)}
            >
              {opt.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* Min note + Region row */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[120px]">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
            Note minimum
          </p>
          <div className="flex gap-1.5">
            {NOTE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => update({ minNote: opt.value })}
                className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                  selected.minNote === opt.value
                    ? "bg-sage text-white border-sage"
                    : "bg-white text-stone border-border hover:border-sage hover:text-sage"
                )}
              >
                {opt.value > 0 && <Star className="h-3 w-3" />}
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[140px]">
          <p className="text-xs font-semibold text-charcoal uppercase tracking-wider mb-2">
            R\u00e9gion
          </p>
          <select
            value={selected.region}
            onChange={(e) => update({ region: e.target.value })}
            className="w-full h-9 px-3 text-sm bg-white rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-sage focus:border-sage text-charcoal transition-all appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "30px",
            }}
          >
            <option value="">Toutes les r\u00e9gions</option>
            {regions.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1.5 text-xs font-medium text-stone hover:text-charcoal transition-colors"
        >
          <X className="h-3 w-3" />
          R\u00e9initialiser les filtres
        </button>
      )}
    </div>
  );
}
