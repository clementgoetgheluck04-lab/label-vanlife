"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, MapPin, Star, Send, ChevronRight, Image } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function MemberJournalPage() {
  const membre = MOCK_MEMBRES[0];
  const [newEntry, setNewEntry] = useState("");
  const [entries, setEntries] = useState<{ lieuId: string; text: string; date: string }[]>([]);

  const stampsWithLieux = useMemo(() => {
    return membre.passeport.map((entry) => ({
      ...entry,
      lieu: ENRICHED_LIEUX.find((l) => l.id === entry.lieuId),
    }));
  }, [membre]);

  const handleAddEntry = () => {
    if (!newEntry.trim()) return;
    setEntries((prev) => [
      { lieuId: "", text: newEntry, date: new Date().toISOString() },
      ...prev,
    ]);
    setNewEntry("");
  };

  return (
    <div className="pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/member" className="lg:hidden">
            <ChevronRight className="h-5 w-5 text-neutral-400 rotate-180" />
          </Link>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Mon journal</h1>
            <p className="text-sm text-neutral-500">Note tes souvenirs de voyage</p>
          </div>
        </div>

        {/* New entry */}
        <Card className="p-5 space-y-3 border-emerald-100/50">
          <h2 className="text-sm font-semibold text-neutral-800">Nouvelle note</h2>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Qu'as-tu visité aujourd'hui ? Un super spot, une rencontre, un coucher de soleil..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 text-sm resize-none text-neutral-900 placeholder:text-neutral-400"
          />
          <div className="flex items-center justify-between">
            <p className="text-xs text-neutral-400">{newEntry.length} caractères</p>
            <Button variant="cta" size="sm" className="gap-1.5" onClick={handleAddEntry} disabled={!newEntry.trim()}>
              <Send className="h-4 w-4" /> Publier
            </Button>
          </div>
        </Card>

        {/* Timeline */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900">
            Mes souvenirs
            <span className="text-sm font-normal text-neutral-400 ml-2">({entries.length + stampsWithLieux.length})</span>
          </h2>

          {/* Entries from passeport */}
          {stampsWithLieux.map((entry, i) => (
            <div key={`stamp-${i}`} className="relative pl-8 before:absolute before:left-3 before:top-3 before:bottom-0 before:w-px before:bg-emerald-200 last:before:hidden">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />
              </div>
              <Card className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{entry.lieu?.nom || "Lieu visité"}</h3>
                    <p className="text-xs text-neutral-500">{entry.lieu?.ville}, {entry.lieu?.region}</p>
                    <p className="text-xs text-emerald-600 mt-1">{formatDate(entry.dateVisite)}</p>
                  </div>
                  {entry.note && (
                    <div className="flex gap-0.5 shrink-0">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className={`h-3 w-3 ${j < entry.note! ? "text-amber fill-amber" : "text-neutral-200"}`} />
                      ))}
                    </div>
                  )}
                </div>
                {entry.avis && (
                  <p className="text-sm text-neutral-600 mt-2 italic border-t border-neutral-100 pt-2">
                    &ldquo;{entry.avis}&rdquo;
                  </p>
                )}
              </Card>
            </div>
          ))}

          {/* Custom entries */}
          {entries.map((entry, i) => (
            <div key={`entry-${i}`} className="relative pl-8">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center">
                <Star className="h-3.5 w-3.5 text-amber-500" />
              </div>
              <Card className="p-4">
                <p className="text-sm text-neutral-800">{entry.text}</p>
                <p className="text-xs text-neutral-400 mt-2">{formatDate(entry.date)}</p>
              </Card>
            </div>
          ))}

          {/* Empty state */}
          {entries.length === 0 && stampsWithLieux.length === 0 && (
            <Card className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">Aucune note pour l'instant</p>
              <p className="text-sm text-neutral-400 mt-1">Commence par écrire ton premier souvenir !</p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}