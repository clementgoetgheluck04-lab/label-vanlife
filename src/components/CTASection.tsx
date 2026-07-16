import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Call for vanlifers */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-border/50 space-y-6 text-center md:text-left">
            <div className="space-y-3">
              <span className="text-4xl">🚐</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-charcoal">
                Prêt à changer ta façon de vanlifer ?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Rejoins une communauté de vanlifers qui font le choix de la confiance, du respect et de
                l&apos;authenticité.
              </p>
            </div>
            <Link
              href="/devenir-membre"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
            >
              Devenir Membre
            </Link>
          </div>

          {/* Call for owners */}
          <div className="bg-charcoal rounded-3xl p-8 sm:p-10 text-white space-y-6 text-center md:text-left">
            <div className="space-y-3">
              <span className="text-4xl">🏡</span>
              <h3 className="text-2xl sm:text-3xl font-bold">
                Vous avez un lieu qui mérite d&apos;être labellisé ?
              </h3>
              <p className="text-white/70 leading-relaxed">
                Suggérez votre spot ou rejoignez le réseau des lieux labellisés pour accueillir une clientèle
                respectueuse.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/labellisation"
                className="px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
              >
                Devenir labellisé
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
