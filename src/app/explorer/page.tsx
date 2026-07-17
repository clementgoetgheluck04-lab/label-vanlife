"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, MapPin, ChevronLeft, Sparkles, Building2, ArrowRight, ShieldQuestion } from "lucide-react";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { SPOTTED_PLACES } from "@/data/spotted-places";

type FilterTab = "tous" | "camping" | "etape_nature" | "hebergement_insolite";

export default function ExplorerPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("tous");
  const [visibleSpottedPlaces, setVisibleSpottedPlaces] = useState(12);

  const ALL_LIEUX = ENRICHED_LIEUX.filter((lieu) => lieu.status === "actif");

  const lieuxFiltres = ALL_LIEUX.filter((lieu) => {
    if (tab !== "tous" && lieu.type !== tab) return false;
    if (search && !lieu.nom.toLowerCase().includes(search.toLowerCase()) && !lieu.ville.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const normalizedSearch = search.trim().toLocaleLowerCase("fr");
  const spottedPlaces = SPOTTED_PLACES.filter((place) => {
    if (!normalizedSearch) return true;
    return [place.name, place.city, place.region, place.network]
      .some((value) => value.toLocaleLowerCase("fr").includes(normalizedSearch));
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-16 pb-24">
      {/* Top Bar */}
      <div className="fixed left-0 right-0 top-16 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-3 py-3">
            <Link href="/" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-neutral-100" aria-label="Retour à l'accueil">
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
                className="h-11 w-48 rounded-full border-none bg-neutral-100 pl-9 pr-3 text-sm placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6 pt-24 space-y-6">
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
              className={`min-h-11 shrink-0 px-4 py-1.5 text-xs font-medium rounded-full transition-all whitespace-nowrap ${
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
          {lieuxFiltres.map((lieu, index) => {
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
                className="group animate-stagger-in bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 block"
                style={{ animationDelay: `${Math.min(index, 9) * 45}ms` }}
              >
                {/* Photo */}
                <div className="relative h-44 bg-gradient-to-br from-emerald-50 to-neutral-50 overflow-hidden">
                  {lieu.photoUrl ? (
                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 ease-out group-hover:scale-[1.04]" style={{ backgroundImage: `url(${lieu.photoUrl})` }} />
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

        <section className="space-y-6 border-t border-neutral-200 pt-10" aria-labelledby="spotted-places-title">
          <div className="overflow-hidden rounded-3xl border border-[#c39960]/35 bg-gradient-to-br from-[#fbf7f0] via-white to-[#f4efe7] p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 text-[#8b673d]">
                  <ShieldQuestion className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-[0.14em]">Réseau en construction</span>
                </div>
                <h2 id="spotted-places-title" className="mt-3 text-2xl font-bold text-neutral-900 sm:text-3xl">
                  Lieux repérés, mais pas encore labellisés : on a besoin de vous
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600 sm:text-base">
                  Ces établissements ont été repérés dans des réseaux d&apos;accueil van et camping. Ils ne sont pas encore partenaires de Label Vanlife : leurs informations restent à confirmer et aucun avantage membre n&apos;est garanti.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl bg-white px-5 py-4 text-center shadow-sm ring-1 ring-[#c39960]/20">
                <strong className="block text-3xl text-[#8b673d]">{SPOTTED_PLACES.length}</strong>
                <span className="text-xs font-medium text-neutral-500">lieux à vérifier</span>
              </div>
            </div>
          </div>

          {spottedPlaces.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {spottedPlaces.slice(0, visibleSpottedPlaces).map((place, index) => (
                <Link
                  href={`/lieux-reperes/${place.id}`}
                  key={place.id}
                  className="group animate-stagger-in flex min-h-56 flex-col rounded-2xl border border-[#c39960]/30 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c39960] hover:shadow-elevated"
                  style={{ animationDelay: `${Math.min(index, 9) * 40}ms` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f7f1e8] text-[#8b673d]">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                      Non labellisé
                    </span>
                  </div>
                  <h3 className="mt-4 line-clamp-2 text-base font-bold text-neutral-900">{place.name}</h3>
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-neutral-500">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#c39960]" />
                    <span>{place.city}{place.region ? ` · ${place.region}` : ""}</span>
                  </p>
                  <p className="mt-3 text-xs text-neutral-400">Repéré via {place.network}</p>
                  <span className="mt-auto flex items-center gap-2 pt-5 text-sm font-bold text-[#8b673d]">
                    Voir et revendiquer la fiche <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-neutral-300" />
              <p className="mt-3 text-sm text-neutral-500">Aucun lieu repéré ne correspond à cette recherche.</p>
            </div>
          )}

          {visibleSpottedPlaces < spottedPlaces.length && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setVisibleSpottedPlaces((current) => current + 24)}
                className="min-h-12 rounded-full border border-[#c39960] bg-white px-6 py-3 text-sm font-bold text-[#8b673d] transition-colors hover:bg-[#f7f1e8]"
              >
                Afficher plus de lieux ({spottedPlaces.length - visibleSpottedPlaces} restants)
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
