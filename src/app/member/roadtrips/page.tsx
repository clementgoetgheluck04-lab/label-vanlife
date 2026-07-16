"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Route, ChevronRight, Compass, Star, Plus } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { MOCK_ROADTRIPS } from "@/data/mock-roadtrips";

export default function MemberRoadTripsPage() {
  const membre = MOCK_MEMBRES[0];

  const roadTrips = useMemo(() => {
    return membre.roadTrips
      .map((id) => MOCK_ROADTRIPS.find((r) => r.id === id))
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [membre]);

  return (
    <div className="pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/member" className="lg:hidden">
            <ChevronRight className="h-5 w-5 text-neutral-400 rotate-180" />
          </Link>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Route className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Road Trips</h1>
            <p className="text-sm text-neutral-500">{roadTrips.length} itinéraires</p>
          </div>
        </div>

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