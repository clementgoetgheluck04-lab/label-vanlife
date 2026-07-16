"use client";

import Link from "next/link";
import { Route, Star, Clock, MapPin, Euro, Heart, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadTrip } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface RoadTripCardProps {
  roadtrip: RoadTrip;
  className?: string;
}

export default function RoadTripCard({ roadtrip, className }: RoadTripCardProps) {
  const difficultyLabel = getDifficultyLabel(roadtrip.difficulte);
  const difficultyVariant = getDifficultyVariant(roadtrip.difficulte);
  const stars = renderStarsArray(roadtrip.likes);

  return (
    <Link
      href={`/road-trips/${roadtrip.id}`}
      className={cn(
        "group block bg-white rounded-2xl border border-border/50 overflow-hidden",
        "hover:shadow-lg hover:-translate-y-1 transition-all duration-300",
        className
      )}
    >
      {/* Photo placeholder with gradient */}
      <div className="relative h-44 bg-gradient-to-br from-sage/20 via-sage-light/10 to-amber/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Route className="h-12 w-12 text-sage/30 group-hover:scale-110 transition-transform duration-500" />
        </div>
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-sage-dark px-2.5 py-1 rounded-full">
          Road Trip
        </span>
        <span className={cn(
          "absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-sm",
          roadtrip.difficulte === "facile" ? "bg-sage/80" :
          roadtrip.difficulte === "moyen" ? "bg-amber/80" : "bg-stone/80"
        )}>
          {difficultyLabel}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2.5">
        {/* Title */}
        <h3 className="text-sm font-bold text-charcoal leading-tight group-hover:text-sage transition-colors line-clamp-2">
          {roadtrip.titre}
        </h3>

        {/* Author */}
        <p className="text-xs text-stone flex items-center gap-1">
          Par <span className="font-medium text-charcoal">{roadtrip.auteur}</span>
        </p>

        {/* Stats: duration, distance, budget */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            {roadtrip.duree} jours
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {roadtrip.distance} km
          </span>
          <span className="flex items-center gap-1">
            <Euro className="h-3 w-3 shrink-0" />
            {roadtrip.budget}€
          </span>
        </div>

        {/* Tags */}
        {roadtrip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {roadtrip.tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="info">
                {formatTag(tag)}
              </Badge>
            ))}
            {roadtrip.tags.length > 4 && (
              <span className="text-[10px] text-stone self-center">
                +{roadtrip.tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Likes & CTA */}
        <div className="flex items-center justify-between pt-1">
          <span className="flex items-center gap-1 text-xs text-stone">
            <Heart className="h-3 w-3 text-red/60" />
            {roadtrip.likes} likes
          </span>
          <ChevronRight className="h-4 w-4 text-sage group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

function getDifficultyLabel(difficulte: RoadTrip["difficulte"]): string {
  const labels: Record<RoadTrip["difficulte"], string> = {
    facile: "Facile",
    moyen: "Moyen",
    avance: "Avancé",
  };
  return labels[difficulte];
}

function getDifficultyVariant(difficulte: RoadTrip["difficulte"]): string {
  const variants: Record<RoadTrip["difficulte"], string> = {
    facile: "success",
    moyen: "warning",
    avance: "premium",
  };
  return variants[difficulte];
}

function renderStarsArray(likes: number): boolean[] {
  const stars: boolean[] = [];
  const level = Math.min(5, Math.max(1, Math.round(likes / 100)));
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= level);
  }
  return stars;
}

function formatTag(tag: string): string {
  return tag
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}