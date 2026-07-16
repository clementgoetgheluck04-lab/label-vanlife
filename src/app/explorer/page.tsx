"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ChevronLeft, Sparkles, X, Building2 } from "lucide-react";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

type FilterTab = "tous" | "camping" | "etape_nature" | "hebergement_insolite";

export default function ExplorerPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("tous");
  const [claimModal, setClaimModal] = useState<{ nom: string; id: string } | null>(null);

  const ALL_LIEUX = ENRICHED_LIEUX.filter((lieu) => lieu.status === "actif");

  const lieuxFiltres = ALL_LIEUX.filter((lieu) => {
    if (tab !== "tous" && lieu.type !== tab) return false;
    if (search && !lieu.nom.toLowerCase().includes(search.toLowerCase()) && !lieu.ville.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-24">
      {/* Top Bar */}
      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3">
            <Link href="/" className="shrink-0">
              <ChevronLeft className="h-5 w-5 text-neutral-500" />
            </Link>
            <h1 className="text-lg font-semibold text-neutral-800 flex-1" style={{ fontFamily: "Outfit, sans-serif" }}>
              Lieux Label Vanlife
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un lieu, une ville..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 sm:w-64 pl-9 pr-3 py-2 text-sm bg-neutral-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 placeholder:text-neutral-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Présentation du réseau */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-500" />
            <span className="text-xs font-semibold tracking-[0.15em] uppercase text-emerald-600">26 établissements labellisés</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 font-serif">Des lieux vérifiés, accueillants et engagés</h2>
          <p className="text-sm text-neutral-500 leading-relaxed">
            Consultez librement les lieux et leur pourcentage d&apos;avantage. Les modalités et éventuels codes restent réservés aux membres connectés.
          </p>

        </div>

        {/* Filtres tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "tous", label: "Tous", count: ALL_LIEUX.length },
            { key: "camping", label: "Campings", count: ALL_LIEUX.filter((l) => l.type === "camping").length },
            { key: "etape_nature", label: "Étapes nature", count: ALL_LIEUX.filter((l) => l.type === "etape_nature").length },
            { key: "hebergement_insolite", label: "Hébergements", count: ALL_LIEUX.filter((l) => l.type === "hebergement_insolite").length },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as FilterTab)}
              className={`shrink-0 px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
                tab === t.key
                  ? "bg-emerald-500 text-white"
                  : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {lieuxFiltres.map((lieu) => {
            const typeLabel: Record<string, string> = {
              camping: "Camping",
              parking: "Parking",
              etape_nature: "Étape Nature",
              hebergement_insolite: "Insolite",
            };

            return (
              <Link
                href={`/lieux/${lieu.id}`}
                key={lieu.id}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 block"
              >
                {/* Photo */}
                <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-neutral-50 overflow-hidden">
                  {lieu.photoUrl ? (
                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${lieu.photoUrl})` }} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-10 w-10 text-emerald-300" />
                    </div>
                  )}
                  {/* Type badge */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold uppercase tracking-wider text-emerald-700 px-2.5 py-1 rounded-full shadow-sm">
                    {typeLabel[lieu.type] || lieu.type}
                  </span>
                  {/* Discount badge */}
                  {lieu.discountPercent > 0 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      -{lieu.discountPercent}%
                    </span>
                  )}
                  {lieu.discountPercent === 0 && lieu.priceHighlight && (
                    <span className="absolute top-3 right-3 bg-[#c39960] text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      Petit prix
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Logo + Title row */}
                  <div className="flex items-start gap-3">
                    {lieu.logoUrl ? (
                      <Image src={lieu.logoUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-xl object-contain bg-white border border-neutral-200 p-1 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-base shrink-0 shadow-sm border border-emerald-100">
                        {lieu.nom.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">{lieu.nom}</h3>
                      <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {lieu.ville}{lieu.region ? `, ${lieu.region}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{lieu.description}</p>

                  {/* Vanlife infos (services) */}
                  {lieu.services && lieu.services.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {lieu.services.slice(0, 5).map((s) => (
                        <span key={s} className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
                              </Link>
                                          );
                                        })}
                                      </div>

                                      {lieuxFiltres.length === 0 && (
          <div className="text-center py-20">
            <MapPin className="h-12 w-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">Aucun lieu trouvé</p>
          </div>
        )}
      </div>

      {/* Claim modal */}
      {claimModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setClaimModal(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-bold text-neutral-900 line-clamp-1">{claimModal.nom}</h3>
              </div>
              <button onClick={() => setClaimModal(null)} className="p-1 hover:bg-neutral-100 rounded-lg"><X className="h-4 w-4" /></button>
            </div>
            <p className="text-xs text-neutral-500">C&apos;est mon établissement. Je souhaite :</p>
            <div className="space-y-2">
              <button onClick={() => { setClaimModal(null); router.push("/labellisation/candidature"); }}
                className="w-full p-3 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-sm hover:bg-emerald-100 transition-colors text-left">
                Demander la labellisation 📋
              </button>
              <button onClick={() => { setClaimModal(null); alert("Merci, nous allons examiner votre demande de suppression."); }}
                className="w-full p-3 rounded-xl bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100 transition-colors text-left">
                Faire supprimer ce lieu 🗑️
              </button>
            </div>
            <p className="text-[10px] text-neutral-400 text-center">Nous vous recontacterons sous 48h par email.</p>
          </div>
        </div>
      )}
    </div>
  );
}
