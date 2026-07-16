import Link from "next/link";
import { BRAND_ASSETS } from "@/config/brand-assets";

const CARDS = [
  {
    title: "Carte membre Label Vanlife",
    subtitle: "Un tarif unique pour 12 mois",
    oldPrice: "39€",
    price: "29€",
    period: "/12 mois",
    badge: "OFFRE ACTUELLE",
    features: ["10-20% de réduction", "Carte interactive", "Road trip planner", "Carte numérique"],
    image: BRAND_ASSETS.memberCardCouple,
  },
];

export default function MemberCards() {
  return (
    <section className="py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Carte Membre 2026
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-charcoal">
            Une seule carte, tous les avantages
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Bénéficiez d&apos;avantages exclusifs réservés à notre communauté : entre 10% et 20% d&apos;avantages sur les
            séjours et services chez nos partenaires labellisés.
          </p>
        </div>

        <div className="grid gap-8 max-w-xl mx-auto mb-16">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="bg-white rounded-3xl p-8 shadow-sm border border-border/50 hover:shadow-lg transition-shadow relative"
            >
              <span className="absolute top-4 right-4 text-xs font-semibold tracking-wider bg-sage text-white px-3 py-1 rounded-full">
                {card.badge}
              </span>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-cream rounded-2xl flex items-center justify-center shrink-0 overflow-hidden">
                  <span className="text-3xl">🚐</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-charcoal">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.subtitle}</p>
                </div>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-3xl font-bold text-sage">{card.price}</span>
                <span className="text-muted-foreground">{card.period}</span>
                <span className="text-sm text-muted-foreground line-through ml-2">{card.oldPrice}</span>
              </div>

              <ul className="space-y-2 mb-8">
                {card.features.map((f) => (
                  <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                    <svg className="w-4 h-4 text-sage shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/devenir-membre"
                className="block w-full text-center px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
              >
                Obtenir ma carte — 29€
              </Link>
            </div>
          ))}
        </div>

        {/* Payment info */}
        <div className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground text-center">
          <span className="flex items-center gap-1">
            <span className="text-sage">🔒</span> Paiement sécurisé
          </span>
          <span className="flex items-center gap-1">
            <span className="text-sage">📅</span> Carte valable 1 année civile
          </span>
          <span className="flex items-center gap-1">
            <span className="text-sage">🚫</span> Sans reconduction tacite
          </span>
          <span className="flex items-center gap-1">
            <span className="text-sage">⚡</span> Accès immédiat
          </span>
        </div>
      </div>
    </section>
  );
}
