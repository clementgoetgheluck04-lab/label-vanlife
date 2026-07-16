"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Map,
  Route,
  Trophy,
  Star,
  Heart,
  Award,
  Compass,
  Sparkles,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const MEMBRE = {
  prenom: "Alex",
  niveau: "Explorateur",
  xp: 340,
  xpMax: 1000,
  dateExpiration: "15/08/2026",
  badges: 3,
  badgesTotal: 12,
  defis: 2,
  defisTotal: 5,
};

const ACTIVITE_RECENTE = [
  { icone: CheckCircle2, texte: "Check-in : Camping Les Pins", date: "Aujourd'hui", couleur: "text-emerald-500" },
  { icone: Award, texte: "Badge débloqué : « Routard »", date: "Hier", couleur: "text-amber-500" },
  { icone: MapPin, texte: "Avis laissé : Aire du Vercors", date: "Il y a 3 jours", couleur: "text-ocean-500" },
  { icone: Route, texte: "Road trip créé : « Bretagne Sud »", date: "Il y a 5 jours", couleur: "text-emerald-500" },
];

const FAVORIS = [
  { nom: "Camping Les Pins", region: "Bretagne", note: 4.8 },
  { nom: "Aire du Vercors", region: "Auvergne", note: 4.6 },
  { nom: "Domaine du Lac", region: "Nouvelle-Aquitaine", note: 4.9 },
  { nom: "Refuge du Mont", region: "Alpes", note: 4.7 },
];

const PARTENAIRES = [
  { nom: "Van Equip", description: "-15% sur l'équipement", badge: "Nouveau" },
  { nom: "Roady", description: "-10% sur le carburant", badge: "Exclusif" },
];

// ─── CODE D'ACCÈS ────────────────────────────────────────────────────────────

const ACCESS_CODE = "LABEL2026";

// ─── PAGE ────────────────────────────────────────────────────────────────────

export default function ComptePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("compte_access") === ACCESS_CODE;
    }
    return false;
  });
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const handleAccess = () => {
    if (code === ACCESS_CODE) {
      setIsAuthenticated(true);
      setCodeError("");
      sessionStorage.setItem("compte_access", ACCESS_CODE);
    } else {
      setCodeError("Code invalide. Réessaie ou deviens membre.");
    }
  };

  // Si pas authentifié, montrer l'écran de verrouillage
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-20 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-50 text-emerald-500">
            <LockIcon className="h-8 w-8" />
          </div>
          <div className="space-y-3">
            <h1 className="text-h1 text-neutral-800">Espace Membre</h1>
            <p className="text-sm font-semibold text-neutral-800">
                            Découvre la carte membre — 29€ au lieu de 39€ / 12 mois
                          </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
            <input
              type="text"
              placeholder="Code d'accès"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAccess()}
              className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 placeholder:text-neutral-300"
            />
            {codeError && (
              <p className="text-xs text-red-500">{codeError}</p>
            )}
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleAccess}
            >
              Accéder à mon espace
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-neutral-400">Pas encore membre ?</p>
            <Link href="/devenir-membre">
              <Button variant="cta" size="md" className="gap-2">
                Obtenir ma carte membre — 29€
                <ArrowRightIcon className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard membre
  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-h2 text-neutral-800">
              Bonjour {MEMBRE.prenom} ☀️
            </h1>
            <p className="text-body-sm text-neutral-500 mt-1">
              Niveau {MEMBRE.niveau} · {MEMBRE.xp}/{MEMBRE.xpMax} XP
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" aria-label="Déconnexion" onClick={() => {
              sessionStorage.removeItem("compte_access");
              setIsAuthenticated(false);
            }}>
              <LogOut className="h-4 w-4 text-red-400" />
            </Button>
          </div>
        </div>

        {/* ===== BARRE XP ===== */}
        <div className="bg-white rounded-xl p-4 border border-neutral-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-500">Progression</span>
            <span className="text-xs font-semibold text-emerald-600">{MEMBRE.xp}/{MEMBRE.xpMax} XP</span>
          </div>
          <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${(MEMBRE.xp / MEMBRE.xpMax) * 100}%` }}
            />
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            Prochain niveau : « Routier » — encore {MEMBRE.xpMax - MEMBRE.xp} XP
          </p>
        </div>

        {/* ===== CARTE MEMBRE ===== */}
        <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-700 rounded-2xl p-6 shadow-lg text-white overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest opacity-70">
                Label Vanlife
              </span>
              <Badge variant="success" className="bg-white/20 text-white border-white/30 text-[10px]">
                Membre Premium
              </Badge>
            </div>

            {/* QR Code simulé */}
            <div className="flex justify-center py-2">
              <div className="w-20 h-20 bg-white rounded-lg p-1.5 flex items-center justify-center">
                <div className="grid grid-cols-5 gap-0.5 w-full h-full">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-[1px]",
                        [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24].includes(i)
                          ? "bg-emerald-800"
                          : i % 3 === 0
                          ? "bg-emerald-800/60"
                          : "bg-white"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-lg font-semibold">{MEMBRE.prenom} · Niveau {MEMBRE.niveau}</p>
              <p className="text-xs opacity-70">Expire le : {MEMBRE.dateExpiration}</p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <Button disabled title="Disponible prochainement" variant="secondary" size="sm" className="text-[10px] h-8 px-3 rounded-full disabled:cursor-not-allowed disabled:opacity-60">
                <Wallet className="h-3 w-3" />
                Apple Wallet — bientôt
              </Button>
              <Button disabled title="Disponible prochainement" variant="secondary" size="sm" className="text-[10px] h-8 px-3 rounded-full disabled:cursor-not-allowed disabled:opacity-60">
                <Smartphone className="h-3 w-3" />
                Google Wallet — bientôt
              </Button>
            </div>
          </div>
        </div>

        {/* ===== WIDGETS DASHBOARD (2×2) ===== */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link href="/map">
            <Card variant="hover" className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <Map className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Ma carte</CardTitle>
                  <CardDescription className="text-xs">Voir la carte →</CardDescription>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-br from-emerald-50 to-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-emerald-300" />
              </div>
            </Card>
          </Link>

          <Link href="/road-trips">
            <Card variant="hover" className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Route className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Mes road trips</CardTitle>
                  <CardDescription className="text-xs">2 itinéraires →</CardDescription>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-br from-amber-50 to-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                <Compass className="h-5 w-5 text-amber-300" />
              </div>
            </Card>
          </Link>

          <Link href="/member/passeport">
            <Card variant="hover" className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Mes badges</CardTitle>
                  <CardDescription className="text-xs">{MEMBRE.badges}/{MEMBRE.badgesTotal} débloqués →</CardDescription>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-br from-amber-50 to-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                <Award className="h-5 w-5 text-amber-300" />
              </div>
            </Card>
          </Link>

          <Link href="/member/lieux">
            <Card variant="hover" className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-ocean-50/50 flex items-center justify-center text-ocean-500">
                  <Star className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Mes défis</CardTitle>
                  <CardDescription className="text-xs">{MEMBRE.defis}/{MEMBRE.defisTotal} complétés →</CardDescription>
                </div>
              </div>
              <div className="h-16 bg-gradient-to-br from-ocean-50/50 to-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-ocean-300" />
              </div>
            </Card>
          </Link>
        </div>

        {/* ===== ACTIVITÉ RÉCENTE ===== */}
        <Card className="p-5">
          <h3 className="text-sm font-semibold text-neutral-800 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-emerald-500" />
            Activité récente
          </h3>
          <div className="space-y-4">
            {ACTIVITE_RECENTE.map((act, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", act.couleur.replace("text-", "bg-").replace("500", "50") + " " + act.couleur)}>
                  <act.icone className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-800">{act.texte}</p>
                  <p className="text-xs text-neutral-400">{act.date}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ===== FAVORIS ===== */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-400" />
              Mes lieux favoris
            </h3>
            <Link href="/map" className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
              Voir tout →
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {FAVORIS.map((fav) => (
              <div key={fav.nom} className="shrink-0 w-36 bg-neutral-50 rounded-xl p-3 border border-neutral-200">
                <p className="text-xs font-semibold text-neutral-800 line-clamp-1">{fav.nom}</p>
                <p className="text-[10px] text-neutral-400 mt-0.5">{fav.region}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                  <span className="text-[10px] font-medium text-neutral-600">{fav.note}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* ===== PARTENAIRES ===== */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-neutral-800 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Nouveautés pour toi
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {PARTENAIRES.map((p) => (
              <div key={p.nom} className="flex items-center gap-3 bg-neutral-50 rounded-xl p-3 border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                  <Share2 className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-neutral-800">{p.nom}</p>
                    <Badge variant="warning" className="text-[9px] px-1.5 py-0">{p.badge}</Badge>
                  </div>
                  <p className="text-xs text-neutral-500">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── ICONS (inline to avoid import issues) ───────────────────────────────────

function LockIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
