"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { ArrowRight, Check, Compass, MapPin, Sparkles, Shield, Lock, Mail, Loader2, AlertCircle, Star, Route, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function MembrePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<"vanlife" | "future" | null>(null);

  const problems = [
    { icon: "🚫", title: "Spots bondés ou panneaux d'interdiction", desc: "Vous cherchez un endroit tranquille, vous tombez sur un parking saturé ou un panneau 'Stationnement interdit aux camping-cars'. Encore." },
    { icon: "💸", title: "Plein tarif dans des campings qui ne comprennent pas la vanlife", desc: "Tarif normal, emplacement standard, aucun regard particulier. Vous payez comme tout le monde — sans jamais être vraiment accueillis." },
    { icon: "😶", title: "Vous ne savez jamais si vous êtes bienvenus ou juste tolérés", desc: "Certains gérants acceptent, d'autres font la grimace. L'incertitude à chaque arrivée, c'est épuisant." },
  ];

  const steps = [
    { icon: "🗺️", title: "Votre espace membre", desc: "Vous ouvrez votre espace membre et la MAP Label Vanlife. Tous les lieux labellisés sur une carte interactive. Filtrez par région, type d'accueil, équipements. Des spots vérifiés, pas un annuaire." },
    { icon: "📍", title: "Road trip & GPS", sub: "App en PWA", desc: "Vous sélectionnez un ou plusieurs lieux pour créer votre road trip. Composez votre itinéraire étape par étape. Exportable directement sur votre GPS — et bientôt sur notre application native." },
    { icon: "🤝", title: "Accueil garanti", desc: "Vous arrivez ou réservez avec votre code ou votre carte membre. Montrez votre carte à l'accueil ou communiquez votre code lors de la réservation. Vous êtes attendu — pas simplement toléré." },
    { icon: "💚", title: "Réduction immédiate", desc: "Vous payez 10 à 20% de moins. La réduction s'applique automatiquement chez tous les lieux partenaires. Ce soir, demain soir, et tous les soirs de la saison." },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ===== HERO ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden pt-28 sm:pt-32">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 to-white" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-8">
          <span className="inline-block px-4 py-1.5 bg-amber-50 rounded-full text-amber-700 text-xs font-semibold tracking-wide">Adhésion Officielle 2026</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            La carte qui ouvre<br />
            <span className="text-emerald-500">toutes les portes.</span>
          </h1>
          <p className="text-lg text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Des lieux qui vous attendent vraiment. Des réductions qui se remboursent en 2 nuits. Une communauté qui protège la liberté de voyager.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/devenir-membre">
              <Button variant="cta" size="lg" className="gap-2 text-base px-8 shadow-xl shadow-amber-500/20">
                Devenir membre <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/member-login">
              <Button variant="secondary-dark" size="lg" className="text-base px-8 border-2">Déjà membre</Button>
            </Link>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-amber-100 max-w-sm mx-auto shadow-sm">
            <p className="text-xs font-semibold text-amber-700">Offre Fondateur</p>
            <p className="text-xs text-neutral-500 mt-1">Tarif bloqué à vie · Badge exclusif · Accès prioritaire</p>
            <Link href="/devenir-membre" className="text-xs text-emerald-600 font-semibold mt-1 inline-block hover:underline">En savoir plus →</Link>
          </div>
        </div>
      </section>

      {/* ===== AVANT TOUT ===== */}
      <section className="py-12 sm:py-16 bg-neutral-50">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Vous voyagez en van ?</h2>
          <p className="text-sm text-neutral-500">Votre réponse nous aide à vous montrer ce qui compte pour vous.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setSelected("vanlife")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${selected === "vanlife" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300"}`}
            >
              Oui, je voyage en van 🚐
            </button>
            <button
              onClick={() => setSelected("future")}
              className={`px-6 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${selected === "future" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-neutral-200 bg-white text-neutral-600 hover:border-emerald-300"}`}
            >
              Je prévois de commencer 🗺️
            </button>
          </div>
        </div>
      </section>

      {/* ===== PROBLÈMES ===== */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Vous reconnaissez-vous ?</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800 mt-2" style={{ fontFamily: "Outfit, sans-serif" }}>Ce que vivent la plupart des vanlifers</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {problems.map((p) => (
              <Card key={p.title} className="p-5 space-y-2">
                <span className="text-2xl block">{p.icon}</span>
                <h3 className="text-sm font-bold text-neutral-900">{p.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{p.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION ÉTAPES ===== */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Imaginez votre prochain road trip</h2>
            <p className="text-sm text-neutral-500 mt-2">En 4 étapes, du canapé à la nuit parfaite.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {steps.map((s, i) => (
              <Card key={i} className="p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900">{s.title}</h3>
                    {s.sub && <span className="text-[10px] text-emerald-500 font-semibold">{s.sub}</span>}
                  </div>
                </div>
                <p className="text-xs text-neutral-500 leading-relaxed">{s.desc}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-lg font-semibold text-emerald-600">Et si votre prochain arrêt vous coûtait 10 à 20% de moins ?</p>
          <p className="text-center text-sm text-neutral-500">C&apos;est exactement ce que fait la carte membre. Dès la première nuit.</p>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <p className="text-4xl font-bold text-neutral-900">27</p>
              <p className="text-xs text-neutral-500 mt-1">Lieux labellisés</p>
              <p className="text-[10px] text-neutral-400">Visités, vérifiés, validés par notre équipe</p>
            </div>
            <div className="w-px h-16 bg-neutral-200" />
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-500">150</p>
              <p className="text-xs text-neutral-500 mt-1">Candidatures en cours</p>
              <p className="text-[10px] text-neutral-400">Lieux qui rejoindront le réseau prochainement</p>
            </div>
          </div>
          <div className="mt-8 bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
            <p className="text-xs text-neutral-600 leading-relaxed">
              <strong className="text-emerald-700">💡</strong> Nous ne sommes pas une map à spots. Chaque lieu est sélectionné pour vous — évalué, labellisé, et visité par un membre fondateur qui vérifie pour une labellisation étoile. Nos membres nous disent souvent qu&apos;ils auraient dû nous découvrir avant.
            </p>
          </div>
        </div>
      </section>

      {/* ===== CARTE MEMBRE ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50/30 to-white">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Tarif de lancement · saison 2026</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Carte MEMBRE</h2>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-xl text-neutral-400 line-through">39€</span>
            <span className="text-5xl sm:text-6xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>29€</span>
            <span className="text-lg text-neutral-400 font-medium">/12 mois</span>
          </div>
          <p className="text-xs text-neutral-500">Tarif de lancement · saison 2026</p>
          <ul className="space-y-3 max-w-sm mx-auto text-left">
            {[
              "Carte exclusive des lieux certifiés",
              "10% à 20% de réduction chez nos partenaires",
              "Accès à la communauté engagée",
              "Soutien à la préservation de la liberté",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-neutral-600">
                <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
              </li>
            ))}
          </ul>
          <Link href="/devenir-membre">
            <Button variant="cta" size="lg" className="gap-2 text-base px-10 shadow-xl shadow-amber-500/20">
              Obtenir ma carte — 29€ <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
