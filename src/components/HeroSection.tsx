"use client";

import Link from "next/link";
import { LIEUX_LABELLISES, STATS } from "@/data/lieux-labellises";
import { useState } from "react";

export default function HeroSection() {
  const [showFounder, setShowFounder] = useState(true);
  const villageCount = LIEUX_LABELLISES.filter(l => l.type === "Village").length;

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/homepage-inspiration.png"
          alt="Van aménagé au coucher du soleil — Label Vanlife, communauté vanlife France"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Founder Banner */}
      {showFounder && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-full max-w-lg px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold tracking-wider text-amber-200/80">
                Fondateur · Membre Fondateur
              </p>
              <p className="text-xs text-white/60">Places limitées</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/devenir-membre"
                className="text-xs font-semibold text-white bg-sage/80 px-3 py-1.5 rounded-full hover:bg-sage transition-colors"
              >
                Voir l&apos;offre
              </Link>
              <button
                onClick={() => setShowFounder(false)}
                className="text-white/50 hover:text-white transition-colors text-xs"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
        <div className="max-w-2xl space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-200/80 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            1er label pour vanlifer
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-white">
            La vanlife a enfin
            <br />
            <span className="text-amber-300">son label.</span>
          </h1>

          <p className="text-lg text-white/80 leading-relaxed max-w-lg">
            Des lieux calmes, respectueux et vraiment adaptés à la vanlife
            <br />
            <span className="text-white/60">
              — Sélectionnés & Labellisés, offrant entre 10 à 20 % de réduction pour nos membres.
            </span>
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
                      <Link
                        href="/devenir-membre"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-charcoal font-semibold rounded-full hover:bg-amber-400 transition-colors shadow-lg"
                      >
                        Devenir membre
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                      <Link
                        href="/le-label"
                        className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/40 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/60 transition-colors backdrop-blur-sm"
                      >
                        Découvrir le label
                      </Link>
                    </div>

          {/* Stats */}
          <div className="flex items-center gap-8 pt-6">
            <div>
              <p className="text-3xl font-bold text-amber-300">{LIEUX_LABELLISES.length}</p>
              <p className="text-sm text-white/60">lieux labellisés</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <p className="text-3xl font-bold text-amber-300">{STATS.enCandidature}+</p>
              <p className="text-sm text-white/60">lieux en cours</p>
            </div>
          </div>

          {/* Scroll hint */}
          <p className="text-xs tracking-[0.2em] uppercase text-white/30 pt-4">
            DÉCOUVRIR
          </p>
        </div>
      </div>
    </section>
  );
}