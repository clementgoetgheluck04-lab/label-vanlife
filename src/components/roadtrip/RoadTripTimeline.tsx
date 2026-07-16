"use client";

import Link from "next/link";
import { MapPin, Calendar, Clock, ArrowRight, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RoadTrip, RoadTripEtape } from "@/lib/types";

interface RoadTripTimelineProps {
  roadtrip: RoadTrip;
  className?: string;
}

export default function RoadTripTimeline({ roadtrip, className }: RoadTripTimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Vertical line */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-sage via-sage/50 to-sage/20" />

      <div className="space-y-0">
        {roadtrip.etapes.map((etape, index) => (
          <TimelineStep
            key={etape.ordre}
            etape={etape}
            isFirst={index === 0}
            isLast={index === roadtrip.etapes.length - 1}
          />
        ))}
      </div>

      {/* Summary footer */}
      <div className="mt-6 ml-12 pl-4 border-l-2 border-sage/20">
        <div className="flex flex-wrap gap-4 text-sm text-stone">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-sage" />
            <strong className="text-charcoal">{roadtrip.duree}</strong> jours
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-sage" />
            <strong className="text-charcoal">{roadtrip.distance}</strong> km
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-sage" />
            Budget <strong className="text-charcoal">{roadtrip.budget}€</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({
  etape,
  isFirst,
  isLast,
}: {
  etape: RoadTripEtape;
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <div className="relative flex gap-4 pb-8 last:pb-0">
      {/* Timeline dot */}
      <div className="relative z-10 flex-shrink-0">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
            "bg-white border-sage text-sage"
          )}
        >
          <span className="text-xs font-bold">{etape.ordre}</span>
        </div>
      </div>

      {/* Content card */}
      <div className="flex-1 min-w-0 bg-white rounded-xl border border-border/40 p-4 hover:border-sage/30 hover:shadow-sm transition-all duration-200">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sage bg-sage/10 px-2 py-0.5 rounded-full">
              <Calendar className="h-3 w-3" />
              Jour {etape.jour}
            </span>
          </div>
          <span className="text-xs text-stone flex items-center gap-1 shrink-0">
            <Clock className="h-3 w-3" />
            {etape.duree}
          </span>
        </div>

        <Link
          href={`/map/${etape.lieuId}`}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-charcoal hover:text-sage transition-colors mb-2"
        >
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{etape.lieuId}</span>
          <ArrowRight className="h-3 w-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all" />
        </Link>

        {etape.activites.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {etape.activites.map((activite, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[11px] text-stone bg-cream px-2 py-0.5 rounded-full"
              >
                <Activity className="h-3 w-3 text-sage/60" />
                {activite}
              </span>
            ))}
          </div>
        )}

        {etape.notes && (
          <p className="text-xs text-stone mt-2 italic leading-relaxed line-clamp-2">
            &ldquo;{etape.notes}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}