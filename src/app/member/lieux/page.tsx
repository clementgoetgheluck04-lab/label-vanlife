"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Heart, MapPin, ArrowLeft, Compass } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

export default function MemberLieuxPage() {
  const membre = MOCK_MEMBRES[0];

  const favoris = useMemo(() => {
    return membre.favoris
      .map((id) => ENRICHED_LIEUX.find((l) => l.id === id))
      .filter((l): l is NonNullable<typeof l> => l !== null);
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
              <Heart className="h-6 w-6 text-red-400" />
              Mes lieux favoris
            </h1>
            <p className="text-sm text-stone">
              {favoris.length} lieu{favoris.length !== 1 ? "x" : ""} sauvegardé{favoris.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {favoris.length === 0 ? (
          <Card variant="default" className="text-center py-12 space-y-4">
            <Compass className="h-12 w-12 text-stone/30 mx-auto" />
            <div>
              <p className="text-stone text-base font-medium">Aucun favori pour l&apos;instant</p>
              <p className="text-sm text-stone/60 mt-1">
                Explore la carte et ajoute tes premiers lieux en favoris
              </p>
            </div>
            <Link href="/map">
              <Button variant="primary" size="sm">
                Explorer les lieux
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {favoris.map((lieu) => (
              <Link key={lieu.id} href={`/map/${lieu.id}`}>
                <Card variant="interactive" className="flex items-center gap-4 p-4">
                  <div className="h-14 w-14 rounded-xl bg-sage/10 flex items-center justify-center shrink-0 overflow-hidden">
                    <MapPin className="h-6 w-6 text-sage" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-charcoal text-sm truncate">{lieu.nom}</h3>
                    <p className="text-xs text-stone truncate">{lieu.ville}, {lieu.region}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-medium text-amber bg-amber/10 px-2 py-0.5 rounded-full">
                        -{lieu.discountPercent}%
                      </span>
                      <span className="text-[10px] text-stone/60">★ {lieu.note}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}