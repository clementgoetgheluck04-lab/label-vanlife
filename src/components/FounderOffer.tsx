import Link from "next/link";

export default function FounderOffer() {
  return (
    <section className="py-24 bg-gradient-to-b from-charcoal to-charcoal/95 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sand">
          Offre Fondateur — Places limitées
        </span>
        <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
          Deviens l&apos;un des
          <br />
          <span className="text-sage">200 Membres Fondateurs</span>
        </h2>
        <p className="text-white/70 max-w-2xl mx-auto text-lg leading-relaxed">
          Label Vanlife naît maintenant. Les 200 premiers membres bâtissent le réseau avec nous — et bénéficient
          d&apos;avantages exclusifs à vie que personne d&apos;autre n&apos;obtiendra jamais.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            href="/devenir-membre"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
          >
            Voir l&apos;offre
          </Link>
          <Link
            href="/devenir-membre"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
          >
            Rejoindre les Fondateurs
          </Link>
        </div>
      </div>
    </section>
  );
}