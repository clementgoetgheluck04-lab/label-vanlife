"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Stamp, ArrowLeft, MapPin, Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MemberPasseportPage() {
  const membre = MOCK_MEMBRES[0];

  const stamps = useMemo(() => {
    return membre.passeport.map((entry) => ({
      ...entry,
      lieu: ENRICHED_LIEUX.find((l) => l.id === entry.lieuId),
    }));
  }, [membre]);

  return (
    <div className="pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/member" className="lg:hidden">
            <ArrowLeft className="h-5 w-5 text-stone" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
              <Stamp className="h-6 w-6 text-amber" />
              Mon Passeport
            </h1>
            <p className="text-sm text-stone">
              {stamps.length} timbre{stamps.length !== 1 ? "s" : ""} récolté{stamps.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {stamps.length === 0 ? (
          <Card variant="default" className="text-center py-12">
            <Stamp className="h-12 w-12 text-stone/30 mx-auto" />
            <p className="text-stone text-base font-medium mt-4">Aucun timbre pour l&apos;instant</p>
            <p className="text-sm text-stone/60 mt-1">
              Visite des lieux labellisés pour collectionner les timbres de ton passeport
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-amber/5 border border-amber/10 rounded-xl px-4 py-3">
              <MapPin className="h-4 w-4 text-amber" />
              <p className="text-xs text-stone">
                {stamps.length} lieu{stamps.length !== 1 ? "x" : ""} visité{stamps.length !== 1 ? "s" : ""} sur {ENRICHED_LIEUX.length}
              </p>
            </div>

            <div className="space-y-3">
              {stamps.map((entry, i) => (
                <div key={i} className="bg-white rounded-xl border border-border/40 overflow-hidden">
                  {/* Stamp card */}
                  <div className="p-4 flex items-start gap-4">
                    {/* Timbre visuel */}
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-sage/20 to-amber/20 flex items-center justify-center shrink-0 border-2 border-sage/20">
                      <span className="text-2xl">📍</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-charcoal text-sm">
                        {entry.lieu?.nom ?? "Lieu inconnu"}
                      </h3>
                      <p className="text-xs text-stone">
                        {entry.lieu?.ville}, {entry.lieu?.region}
                      </p>
                      <p className="text-xs text-sage mt-0.5">
                        {formatDate(entry.dateVisite)}
                      </p>

                      {entry.note && (
                        <div className="flex items-center gap-0.5 mt-1">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <Star
                              key={j}
                              className={`h-3 w-3 ${
                                j < entry.note!
                                  ? "text-amber fill-amber"
                                  : "text-stone/20"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    <Badge variant="success" className="text-[10px] shrink-0">
                      Visité
                    </Badge>
                  </div>

                  {entry.avis && (
                    <div className="px-4 pb-4">
                      <div className="bg-cream rounded-lg p-3 flex items-start gap-2">
                        <Quote className="h-3.5 w-3.5 text-sage shrink-0 mt-0.5" />
                        <p className="text-xs text-stone italic">&ldquo;{entry.avis}&rdquo;</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}