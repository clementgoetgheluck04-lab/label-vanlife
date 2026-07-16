import Link from "next/link";
import { LIEUX_LABELLISES, STATS, getVillages, getCampings } from "@/data/lieux-labellises";

export default function LieuxGrid() {
  const villages = getVillages();
  const campings = getCampings();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Nos Lieux
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-charcoal">
            Les {LIEUX_LABELLISES.length} lieux labellisés
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Des villages d&apos;exception et des campings sélectionnés pour leur accueil, leur calme et leur authenticité. 
            Présentez votre carte membre pour profiter de réductions exclusives.
          </p>
          <p className="text-sm text-sage font-medium">
            {LIEUX_LABELLISES.length} lieux labellisés · {STATS.regions} régions · {STATS.enCandidature} candidatures en cours 🎁
          </p>
        </div>

        {/* Villages section */}
        {villages.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-charcoal mb-6">
              <span className="text-sage">✦</span> Villages d&apos;exception
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {villages.map((lieu) => (
                <Link
                  key={lieu.id}
                  href={`/map/${lieu.id}`}
                  className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all block"
                >
                  <div className="h-48 bg-gradient-to-br from-sage/20 to-cream flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="text-6xl opacity-30">🏘️</span>
                    <span className="absolute top-3 left-3 text-xs font-semibold bg-sage text-white px-3 py-1 rounded-full">
                      Village labellisé
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs text-white bg-black/60 px-3 py-1.5 rounded-full group-hover:bg-black/80 transition-colors">
                      Voir le détail →
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-sage font-semibold tracking-wide uppercase mb-1">{lieu.type}</p>
                    <h3 className="text-lg font-bold text-charcoal mb-1">{lieu.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{lieu.location}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{lieu.description}</p>
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-semibold text-sage mb-2">
                        Réduction membres{" "}
                        <span className="text-2xl font-black text-sage">{lieu.reduction}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">sur votre séjour · réservé aux membres</p>
                      <span className="block w-full text-center text-sm font-semibold text-sage border-2 border-sage rounded-full py-2 hover:bg-sage hover:text-white transition-colors">
                        Réserver aux membres
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* Camping section */}
        {campings.length > 0 && (
          <>
            <h3 className="text-2xl font-bold text-charcoal mb-6">
              <span className="text-sage">✦</span> Campings & hébergements labellisés
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {campings.map((lieu) => (
                <Link
                  key={lieu.id}
                  href={`/map/${lieu.id}`}
                  className="group bg-white rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all block"
                >
                  <div className="h-48 bg-gradient-to-br from-sage/20 to-cream flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="text-6xl opacity-30">🏕️</span>
                    <span className="absolute top-3 left-3 text-xs font-semibold bg-sage text-white px-3 py-1 rounded-full">
                      Lieu labellisé
                    </span>
                    <span className="absolute bottom-3 right-3 text-xs text-white bg-black/60 px-3 py-1.5 rounded-full group-hover:bg-black/80 transition-colors">
                      Voir le détail →
                    </span>
                  </div>

                  <div className="p-5">
                    <p className="text-xs text-sage font-semibold tracking-wide uppercase mb-1">{lieu.type}</p>
                    <h3 className="text-lg font-bold text-charcoal mb-1">{lieu.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{lieu.location}</p>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{lieu.description}</p>
                    <div className="border-t border-border/50 pt-4">
                      <p className="text-sm font-semibold text-sage mb-2">
                        Réduction membres{" "}
                        <span className="text-2xl font-black text-sage">{lieu.reduction}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mb-3">sur votre séjour · réservé aux membres</p>
                      <span className="block w-full text-center text-sm font-semibold text-sage border-2 border-sage rounded-full py-2 hover:bg-sage hover:text-white transition-colors">
                        Réserver aux membres
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-center gap-4 mt-10">
          <Link
            href="/map"
            className="px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
          >
            Voir la carte interactive
          </Link>
          <Link
            href="/member-login"
            className="px-6 py-3 border-2 border-sage text-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-colors"
          >
            Accès membre
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16">
          <div className="grid sm:grid-cols-4 gap-6 mb-12">
            <div className="text-center bg-cream rounded-2xl p-6 border border-border/30">
              <p className="text-4xl font-bold text-sage">{STATS.totalIdentifies}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Lieux identifiés vanlife</p>
            </div>
            <div className="text-center bg-cream rounded-2xl p-6 border border-border/30">
              <p className="text-4xl font-bold text-sage">{STATS.enCandidature}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Lieux en candidature</p>
            </div>
            <div className="text-center bg-cream rounded-2xl p-6 border border-border/30">
              <p className="text-4xl font-bold text-sage">{LIEUX_LABELLISES.length}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Lieux labellisés</p>
            </div>
            <div className="text-center bg-cream rounded-2xl p-6 border border-border/30">
              <p className="text-4xl font-bold text-sage">{STATS.regions}</p>
              <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Régions couvertes</p>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-8 bg-cream rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <p className="text-lg italic font-serif text-charcoal/80 leading-relaxed">
            &ldquo;LABEL VANLIFE a changé notre façon de voyager. Plus de stress, plus de mauvaises surprises.&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold text-sage">— HELENE FAMILY VANLIFERS</p>
        </div>
      </div>
    </section>
  );
}