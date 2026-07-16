import Link from "next/link";

export default function ValuesSection() {
  const values = [
    { title: "Calme", desc: "Des lieux paisibles, loin du tourisme de masse" },
    { title: "Respect", desc: "Des voyageurs conscients et discrets" },
    { title: "Qualité", desc: "Des rencontres authentiques et humaines" },
    { title: "Confiance", desc: "Un réseau vérifié et bienveillant" },
  ];

  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Values */}
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
                Nos valeurs
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold text-charcoal leading-tight">
                Une vanlife plus respectueuse
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                LABEL VANLIFE n&apos;est pas une carte à spots.{" "}
                <strong className="text-charcoal">C&apos;est une communauté de confiance</strong>, où voyageurs et lieux
                partagent les mêmes valeurs.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((v) => (
                <div key={v.title} className="bg-white rounded-xl p-5 border border-border/30">
                  <h3 className="font-bold text-charcoal mb-1">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>

            {/* For owners CTA */}
            <div className="bg-charcoal text-white rounded-2xl p-6 space-y-3">
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sage">Pour les propriétaires & directeurs</span>
              <p className="font-semibold">Accueillez les meilleurs voyageurs. Développez votre activité.</p>
              <Link
                href="/conseil-camping"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
              >
                Voir plus de détails →
              </Link>
            </div>
          </div>

          {/* Right: Manifesto with Founder Story */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-border/30 space-y-6">
              <h3 className="text-2xl font-bold text-charcoal">
                LABEL VANLIFE est né d&apos;un constat simple
              </h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <span className="text-xl">🚐</span> Les <strong className="text-charcoal">vanlifers</strong> cherchent des lieux où ils sont les bienvenus.
                </p>
                <p>
                  <span className="text-xl">🏡</span> Les <strong className="text-charcoal">propriétaires de lieux</strong> cherchent une clientèle respectueuse.
                </p>
                <p>Mais il n&apos;existait aucun pont entre les deux...</p>
              </div>
              <div className="border-t border-border/50 pt-4 space-y-2">
                <p className="text-sm font-semibold text-red-500/80">✦ Pas de label de confiance</p>
                <p className="text-sm font-semibold text-red-500/80">✦ Pas de réseau structuré</p>
                <p className="text-sm font-semibold text-red-500/80">✦ Pas de garantie</p>
              </div>
              <div className="bg-sage/5 rounded-xl p-5">
                <p className="text-sm font-medium text-charcoal">
                  <span className="text-xl">✨</span> <strong className="text-sage">LABEL VANLIFE</strong> crée ce lien. Un label qui sélectionne, vérifie et met
                  en relation des lieux engagés avec des vanlifers responsables.
                </p>
              </div>
              <div className="pt-2 space-y-1">
                <p className="text-xs text-muted-foreground">— Clément Goetgheluck</p>
                <p className="text-xs text-muted-foreground">Fondateur de LABEL VANLIFE — Vanlifer depuis +15 ans</p>
              </div>
              <Link
                href="/le-label"
                className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
              >
                Lire le manifeste →
              </Link>
            </div>

            {/* Founder Story */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-border/30 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vanlifer depuis +15 ans et ayant voyagé sur 5 continents, j&apos;ai vu les spots sauvages passer de
                propres à dégueulasses, les voisinages d&apos;accueillants à hostiles, les panneaux d&apos;interdiction
                fleurir partout. Et côté campings ? Souvent déçu... On préférait dormir sur un parking.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                C&apos;est de ce constat qu&apos;est né LABEL VANLIFE. Grâce également à mon expérience d&apos;ancien
                directeur de camping, j&apos;essaie de recréer cette harmonie pour le plaisir du voyage en van : une
                map de &ldquo;spots&rdquo; sélectionnés, vérifiés et accueillants.
              </p>
              <p className="text-xs font-semibold text-sage">— Clément Goetgheluck, Fondateur</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}