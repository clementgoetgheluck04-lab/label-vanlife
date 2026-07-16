"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Sun,
  MapPin,
  Lock,
  Check,
  Star,
  Trophy,
  Award,
  Bell,
  BookOpen,
  Compass,
  Map,
  Route,
  Stamp,
  TrendingUp,
  QrCode,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge as UIBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { MOCK_BADGES } from "@/data/mock-badges";
import { MOCK_ROADTRIPS } from "@/data/mock-roadtrips";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { NIVEAUX, type NiveauMembre } from "@/lib/types";

// ─── Helpers ───────────────────────────────────────────────────

const NIVEAU_LABEL: Record<NiveauMembre, string> = {
  explorateur: "Explorateur",
  routard: "Routard",
  voyageur: "Voyageur",
  eclaireur: "Éclaireur",
  legende: "Légende",
};

const NIVEAU_ORDER: NiveauMembre[] = [
  "explorateur",
  "routard",
  "voyageur",
  "eclaireur",
  "legende",
];

function getNextNiveau(current: NiveauMembre): NiveauMembre | null {
  const idx = NIVEAU_ORDER.indexOf(current);
  return idx < NIVEAU_ORDER.length - 1 ? NIVEAU_ORDER[idx + 1] : null;
}

function getNiveauProgress(current: NiveauMembre, points: number): number {
  const currentMin = NIVEAUX[current].points;
  const next = getNextNiveau(current);
  if (!next) return 100;
  const nextMin = NIVEAUX[next].points;
  const range = nextMin - currentMin;
  if (range <= 0) return 100;
  return Math.min(100, Math.round(((points - currentMin) / range) * 100));
}

function getNiveauPointsToNext(current: NiveauMembre, points: number): number {
  const next = getNextNiveau(current);
  if (!next) return 0;
  const nextMin = NIVEAUX[next].points;
  return Math.max(0, nextMin - points);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getLieuById(id: string) {
  return ENRICHED_LIEUX.find((l) => l.id === id) ?? null;
}

function getRoadTripById(id: string) {
  return MOCK_ROADTRIPS.find((r) => r.id === id) ?? null;
}

// ─── Main Component ────────────────────────────────────────────

export default function MemberDashboard() {
  const membre = MOCK_MEMBRES[0];

  const progressPct = useMemo(
    () => getNiveauProgress(membre.niveau, membre.points),
    [membre]
  );
  const nextNiveau = useMemo(() => getNextNiveau(membre.niveau), [membre]);
  const pointsToNext = useMemo(
    () => getNiveauPointsToNext(membre.niveau, membre.points),
    [membre]
  );
  const nextNiveauLabel = nextNiveau ? NIVEAU_LABEL[nextNiveau] : null;
  const currentNiveauLabel = NIVEAU_LABEL[membre.niveau];

  // Badges — all from MOCK_BADGES, mark obtained
  const badgesWithStatus = useMemo(() => {
    const obtainedIds = new Set(membre.badges.map((b) => b.id));
    return MOCK_BADGES.map((badge) => ({
      ...badge,
      obtained: obtainedIds.has(badge.id),
    }));
  }, [membre]);

  // Favoris — resolve enriched lieux
  const favorisWithDetails = useMemo(() => {
    return membre.favoris
      .map((id) => getLieuById(id))
      .filter((l): l is NonNullable<typeof l> => l !== null);
  }, [membre]);

  // Road trips
  const roadTripsWithDetails = useMemo(() => {
    return membre.roadTrips
      .map((id) => getRoadTripById(id))
      .filter((r): r is NonNullable<typeof r> => r !== null);
  }, [membre]);

  // Passeport — visited stamps
  const passeportStamps = useMemo(() => {
    return membre.passeport.map((entry) => ({
      ...entry,
      lieu: getLieuById(entry.lieuId),
    }));
  }, [membre]);

  // Recent activity
  const recentActivity = useMemo(() => {
    const activities: {
      type: "badge" | "defi" | "visite";
      label: string;
      date: string;
      icon: string;
    }[] = [];

    for (const badge of membre.badges) {
      activities.push({
        type: "badge",
        label: `Badge "${badge.nom}" obtenu`,
        date: badge.dateObtention,
        icon: badge.icone,
      });
    }

    for (const defi of membre.defisEnCours) {
      if (defi.termine) {
        activities.push({
          type: "defi",
          label: `Défi "${defi.titre}" complété`,
          date: "2024-12-01",
          icon: "✅",
        });
      }
    }

    for (const entry of membre.passeport) {
      const lieu = getLieuById(entry.lieuId);
      if (lieu) {
        activities.push({
          type: "visite",
          label: `${lieu.nom} visité`,
          date: entry.dateVisite,
          icon: "📍",
        });
      }
    }

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 8);
  }, [membre]);

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div className="min-h-screen pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* ── En-tête ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={membre.photoUrl}
                initials={membre.prenom[0]}
                size="lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-charcoal flex items-center gap-2">
                  Bonjour {membre.prenom} ☀️
                </h1>
                <p className="text-sm text-stone flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5 text-amber" />
                  <span className="font-medium text-amber">
                    {currentNiveauLabel}
                  </span>
                  <span className="text-stone/60">·</span>
                  <span>{membre.points} pts</span>
                </p>
              </div>
            </div>
            <Sun className="h-8 w-8 text-amber opacity-70" />
          </div>

          {nextNiveauLabel && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone">
                <span>{currentNiveauLabel}</span>
                <span>
                  {pointsToNext} pts vers {nextNiveauLabel}
                </span>
              </div>
              <div className="h-2.5 bg-sand/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sage to-forest rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </section>

        {/* ── Ma carte membre ── */}
        <section>
          <Link href="/member/carte" className="block" aria-label="Afficher ma carte membre à présenter aux lieux">
          <div
            className="group relative h-[200px] rounded-2xl overflow-hidden bg-gradient-to-br from-sage to-forest p-6 text-white shadow-lg transition-all duration-500 hover:shadow-xl cursor-pointer focus-visible:ring-2 focus-visible:ring-[#c39960]"
            style={{ transform: "perspective(800px)", transformStyle: "preserve-3d" }}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width - 0.5;
              const y = (e.clientY - rect.top) / rect.height - 0.5;
              e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg)";
            }}
          >
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/5" />
            <div className="absolute -bottom-6 -left-6 h-28 w-28 rounded-full bg-white/5" />

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-white/60 font-mono tracking-wider">
                    LAB-VL-{membre.id.split("-")[1]?.toUpperCase() ?? "0000"}
                  </p>
                  <p className="text-xs text-white/70 mt-0.5">
                    {membre.offre === "annuel" ? "Abonnement annuel" : "Abonnement mensuel"}
                  </p>
                </div>
                <div className="text-right">
                  <UIBadge
                    variant="premium"
                    className="bg-white/20 text-white border-white/30 text-[10px] uppercase tracking-wider"
                  >
                    {membre.dateExpiration
                      ? `Valide jusqu'au ${formatDate(membre.dateExpiration)}`
                      : "Actif"}
                  </UIBadge>
                </div>
              </div>

              <div className="space-y-0.5">
                <p className="text-2xl font-bold tracking-wide drop-shadow-sm">
                  {[membre.prenom, membre.nom].filter(Boolean).join(" ").toUpperCase()}
                </p>
                <p className="text-sm text-white/80 font-serif italic">
                  Membre Label Vanlife
                </p>
              </div>

              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-white/70" />
                  <span className="text-xs text-white/60">
                    {currentNiveauLabel} · {membre.points} pts
                  </span>
                </div>
                <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-inner">
                  <QrCode className="h-8 w-8 text-forest" />
                </div>
              </div>
            </div>
          </div>
          <p className="mt-2 text-center text-xs font-medium text-sage">Touchez la carte pour l’agrandir et la présenter au lieu</p>
          </Link>
        </section>

        {/* ── Quick links ── */}
        <section className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          <Link href="/member/map">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <Map className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">MAP</span>
            </Card>
          </Link>
          <Link href="/member/lieux">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <MapPin className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Favoris</span>
              <span className="text-[10px] text-stone">{membre.favoris.length}</span>
            </Card>
          </Link>
          <Link href="/member/roadtrips">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <Route className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Road Trips</span>
              <span className="text-[10px] text-stone">{membre.roadTrips.length}</span>
            </Card>
          </Link>
          <Link href="/member/passeport">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <Stamp className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Passeport</span>
              <span className="text-[10px] text-stone">{membre.passeport.length} timbres</span>
            </Card>
          </Link>
          <Link href="/member/badges">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <Award className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Badges</span>
              <span className="text-[10px] text-stone">{membre.badges.length}/{MOCK_BADGES.length}</span>
            </Card>
          </Link>
          <Link href="/member/journal">
            <Card variant="interactive" className="p-4 text-center space-y-1.5">
              <BookOpen className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Journal</span>
            </Card>
          </Link>
          <Link href="/member/notifications">
            <Card variant="interactive" className="p-4 text-center space-y-1.5 relative">
              <Bell className="h-6 w-6 text-sage mx-auto" />
              <span className="text-xs font-semibold text-charcoal block">Alertes</span>
            </Card>
          </Link>
        </section>

        {/* ── Badges ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber" />
            <h2 className="text-lg font-semibold text-charcoal">Badges</h2>
            <span className="text-xs text-stone/60 font-medium">
              {membre.badges.length}/{MOCK_BADGES.length}
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {badgesWithStatus.slice(0, 4).map((badge, i) => (
              <div
                key={badge.id}
                className={`relative rounded-xl p-4 border text-center transition-all duration-500 ${
                  badge.obtained
                    ? "bg-white border-sage/30 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                    : "bg-cream/60 border-border/40 opacity-60"
                }`}
              >
                {!badge.obtained && (
                  <div className="absolute top-2 right-2">
                    <Lock className="h-3.5 w-3.5 text-stone/40" />
                  </div>
                )}
                <div className={`text-2xl mb-2 ${badge.obtained ? "" : "grayscale"}`}>
                  {badge.icone}
                </div>
                <p className="text-xs font-semibold text-charcoal leading-tight">
                  {badge.nom}
                </p>
                {badge.obtained && (
                  <div className="mt-2">
                    <UIBadge variant="success" className="text-[10px]">
                      <Check className="h-2.5 w-2.5" />
                      Obtenu
                    </UIBadge>
                  </div>
                )}
              </div>
            ))}
          </div>
          {badgesWithStatus.length > 4 && (
            <div className="mt-2 text-center">
              <span className="text-xs text-stone/60">
                +{badgesWithStatus.length - 4} autres badges
              </span>
            </div>
          )}
        </section>

        {/* ── Défis ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber" />
              <h2 className="text-lg font-semibold text-charcoal">Défis</h2>
            </div>
          </div>
          <div className="space-y-3">
            {membre.defisEnCours.length === 0 ? (
              <Card variant="default" className="text-center py-8">
                <p className="text-stone text-sm">Aucun défi en cours.</p>
                <p className="text-xs text-stone/60 mt-1">Reviens bientôt pour de nouveaux défis !</p>
              </Card>
            ) : (
              membre.defisEnCours.slice(0, 2).map((defi) => (
                <Card key={defi.id} variant="default" className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {defi.termine && (
                          <span className="shrink-0 h-5 w-5 rounded-full bg-sage flex items-center justify-center">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                        <h3 className="text-sm font-semibold text-charcoal">{defi.titre}</h3>
                      </div>
                      <p className="text-xs text-stone/70 mt-1 line-clamp-2">{defi.description}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-bold text-amber">+{defi.recompense} pts</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-stone/60">
                      <span>Progression</span>
                      <span>{defi.progression}%</span>
                    </div>
                    <div className="h-2 bg-sand/60 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          defi.termine ? "bg-sage" : "bg-gradient-to-r from-sage to-amber"
                        }`}
                        style={{ width: `${defi.progression}%` }}
                      />
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* ── Activité récente ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-sage" />
            <h2 className="text-lg font-semibold text-charcoal">Activité récente</h2>
          </div>
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-stone text-center py-4">Aucune activité récente.</p>
            ) : (
              recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-border/40"
                >
                  <span className="text-lg">{activity.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">{activity.label}</p>
                  </div>
                  <span className="text-xs text-stone/60 shrink-0">{activity.date}</span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── Carte et communauté ── */}
        <section className="flex flex-col sm:flex-row gap-3">
          <Link href="/map" className="flex-1">
            <Card variant="interactive" className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-sage/10 flex items-center justify-center shrink-0">
                <Map className="h-6 w-6 text-sage" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-charcoal text-sm">Explorer les lieux</h3>
                <p className="text-xs text-stone">26 lieux labellisés</p>
              </div>
              <ArrowRight className="h-4 w-4 text-sage" />
            </Card>
          </Link>
          <Link href="/member/passeport" className="flex-1">
            <Card variant="interactive" className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                <Stamp className="h-6 w-6 text-amber" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-charcoal text-sm">Mon passeport</h3>
                <p className="text-xs text-stone">{membre.passeport.length} timbres</p>
              </div>
              <ArrowRight className="h-4 w-4 text-amber" />
            </Card>
          </Link>
        </section>
      </div>
    </div>
  );
}
