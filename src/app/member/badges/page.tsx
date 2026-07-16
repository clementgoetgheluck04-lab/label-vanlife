"use client";

import { useMemo, type ComponentType } from "react";
import Link from "next/link";
import { Award, Lock, Check, ChevronRight, Trophy, Star, TreePine, Camera, Users, Moon, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge as UIBadge } from "@/components/ui/Badge";
import { MOCK_MEMBRES } from "@/data/mock-membres";
import { MOCK_BADGES } from "@/data/mock-badges";

type BadgeIconProps = { className?: string };

const ICON_MAP: Record<string, ComponentType<BadgeIconProps>> = {
  "📍": MapPin,
  "🌍": Globe,
  "🌱": TreePine,
  "📸": Camera,
  "🗣️": Users,
  "🌙": Moon,
  "👨‍👩‍👧‍👦": Users,
  "🏆": Trophy,
};

// Fallback emoji renderer
function EmojiIcon({ emoji, className }: { emoji: string; className?: string }) {
  return <span className={className}>{emoji}</span>;
}

function MapPin(props: BadgeIconProps) { return <span className={props.className}>📍</span>; }
function Globe(props: BadgeIconProps) { return <span className={props.className}>🌍</span>; }

export default function MemberBadgesPage() {
  const membre = MOCK_MEMBRES[0]; // Utilisateur connecté

  const badgesWithStatus = useMemo(() => {
    const obtainedIds = new Set(membre.badges.map((b) => b.id));
    return MOCK_BADGES.map((badge) => ({
      ...badge,
      obtained: obtainedIds.has(badge.id),
    }));
  }, [membre]);

  const obtained = badgesWithStatus.filter((b) => b.obtained);
  const locked = badgesWithStatus.filter((b) => !b.obtained);

  return (
    <div className="pb-24 px-4 lg:px-0 pt-4 lg:pt-0">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Link href="/member" className="lg:hidden">
              <ChevronRight className="h-5 w-5 text-neutral-400 rotate-180" />
            </Link>
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Mes badges</h1>
              <p className="text-sm text-neutral-500">
                {obtained.length}/{MOCK_BADGES.length} débloqués · {membre.points} pts
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className="p-5 bg-gradient-to-br from-amber-50 to-emerald-50 border-amber-100/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-neutral-700">Progression</span>
            <span className="text-xs font-medium text-emerald-600">{Math.round(obtained.length / MOCK_BADGES.length * 100)}%</span>
          </div>
          <div className="h-3 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-700"
              style={{ width: `${(obtained.length / MOCK_BADGES.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {locked.length > 0
              ? `Prochain badge : "${locked[0].nom}" — ${locked[0].description}`
              : "Tous les badges sont débloqués ! 🎉"}
          </p>
        </Card>

        {/* Badges obtenus */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Check className="h-5 w-5 text-emerald-500" />
            Débloqués
            <span className="text-sm font-normal text-neutral-400">({obtained.length})</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {obtained.map((badge) => (
              <div
                key={badge.id}
                className="relative bg-white rounded-xl p-4 border border-emerald-100 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="text-3xl mb-2">{badge.icone}</div>
                <p className="text-xs font-semibold text-neutral-800 leading-tight">{badge.nom}</p>
                <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{badge.description}</p>
                <UIBadge variant="success" className="mt-2 text-[10px]">
                  <Check className="h-2.5 w-2.5" /> Obtenu
                </UIBadge>
              </div>
            ))}
          </div>
        </section>

        {/* Badges à débloquer */}
        {locked.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Lock className="h-5 w-5 text-neutral-300" />
              À débloquer
              <span className="text-sm font-normal text-neutral-400">({locked.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {locked.map((badge) => (
                <div
                  key={badge.id}
                  className="relative bg-neutral-50 rounded-xl p-4 border border-neutral-100 text-center opacity-70"
                >
                  <div className="absolute top-2 right-2">
                    <Lock className="h-3.5 w-3.5 text-neutral-300" />
                  </div>
                  <div className="text-3xl mb-2 grayscale">{badge.icone}</div>
                  <p className="text-xs font-semibold text-neutral-500 leading-tight">{badge.nom}</p>
                  <p className="text-[10px] text-neutral-400 mt-1 line-clamp-2">{badge.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {badgesWithStatus.length === 0 && (
          <Card className="p-12 text-center">
            <Award className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 font-medium">Aucun badge disponible</p>
            <p className="text-sm text-neutral-400 mt-1">Les badges arrivent bientôt !</p>
          </Card>
        )}
      </div>
    </div>
  );
}
