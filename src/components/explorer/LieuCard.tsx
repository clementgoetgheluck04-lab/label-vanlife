"use client";

import Link from "next/link";
import { MapPin, Star, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lieu } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface LieuCardProps {
  lieu: Lieu;
  className?: string;
}

export default function LieuCard({ lieu, className }: LieuCardProps) {
  const typeLabel = getTypeLabel(lieu.type);
  const stars = renderStarsArray(lieu.note);

  return (
    <Link
      href={`/lieux/${lieu.id}`}
      className={cn(
        "group block bg-white rounded-2xl border border-border/50 overflow-hidden",
        "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {/* Photo */}
      <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-emerald-50 overflow-hidden">
        {lieu.photoUrl ? (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${lieu.photoUrl})` }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-10 w-10 text-emerald-300" />
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-emerald-700 px-2.5 py-1 rounded-full">
          {typeLabel}
        </span>
        {(lieu.discountPercent > 0 || lieu.priceHighlight) && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            {lieu.discountPercent > 0 ? `-${lieu.discountPercent}%` : "Petit prix"}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-1">
            {lieu.nom}
          </h3>
          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
            <MapPin className="h-3 w-3 shrink-0" />
            {lieu.ville}, {lieu.region}
          </p>
        </div>

        {/* Stars + distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1" aria-label={`Note : ${lieu.note} sur 5`}>
            {stars.map((filled, i) => (
              <Star
                key={i}
                className={cn("h-3 w-3", filled ? "text-amber fill-amber" : "text-neutral-200")}
              />
            ))}
            <span className="text-[11px] text-neutral-400 ml-1">({lieu.avisCount})</span>
          </div>
          {typeof lieu.distance === "number" && (
            <span className="text-[11px] text-neutral-400">{lieu.distance.toFixed(1)} km</span>
          )}
        </div>

        {/* Labels */}
        {lieu.labels.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {lieu.labels.slice(0, 3).map((label) => (
              <Badge key={label} variant="info">
                {formatLabel(label)}
              </Badge>
            ))}
            {lieu.labels.length > 3 && (
              <span className="text-[10px] text-neutral-400 self-center">
                +{lieu.labels.length - 3}
              </span>
            )}
          </div>
        )}

        {/* CTA hint */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-emerald-600">
            {lieu.discountPercent > 0
              ? `Jusqu'à -${lieu.discountPercent}% pour les membres`
              : lieu.priceHighlight || "Lieu labellisé Label Vanlife"}
          </span>
          <ChevronRight className="h-4 w-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    camping: "Camping",
    parking: "Parking",
    etape_nature: "Étape Nature",
    hebergement_insolite: "Insolite",
  };
  return labels[type] || type;
}

function renderStarsArray(note: number): boolean[] {
  const stars: boolean[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= Math.round(note));
  }
  return stars;
}

function formatLabel(label: string): string {
  const labels: Record<string, string> = {
    "label-vanlife": "Label Vanlife",
    "green-key": "Green Key",
    "accueil-velo": "Accueil Vélo",
  };
  return labels[label] || label.replace(/-/g, " ");
}
