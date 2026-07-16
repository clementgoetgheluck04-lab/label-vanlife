import Link from "next/link";

const GUIDES = [
  {
    emoji: "🚐",
    title: "Guide Vanlife France",
    desc: "Tout ce qu'il faut savoir pour se lancer dans la vanlife en France.",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    title: "Vanlife en famille",
    desc: "Voyager en van avec des enfants : conseils, itinéraires, lieux adaptés.",
  },
  {
    emoji: "🏕️",
    title: "Campings van-friendly",
    desc: "Les critères d'un bon camping pour vanlifers et notre sélection labellisée.",
  },
  {
    emoji: "🌿",
    title: "Slow travel & vanlife",
    desc: "Voyager moins vite pour profiter davantage — la philosophie du slow travel.",
  },
  {
    emoji: "🗺️",
    title: "Road trips en van",
    desc: "Les meilleurs itinéraires van à travers toute la France.",
  },
  {
    emoji: "🌙",
    title: "Dormir en van en France",
    desc: "Où dormir légalement, les aires, campings et spots les plus beaux.",
  },
  {
    emoji: "🧭",
    title: "Vanlife solo",
    desc: "Voyager seul(e) en van : sécurité, choix du van, communauté et itinéraires.",
  },
];

const REGIONS = [
  { emoji: "🌊", name: "Bretagne" },
  { emoji: "🌻", name: "Provence" },
  { emoji: "🏞️", name: "Ardèche" },
  { emoji: "⛰️", name: "Pyrénées" },
  { emoji: "🏄", name: "Landes" },
  { emoji: "🏔️", name: "Alpes" },
];

export default function GuidesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Guides & Destinations
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-charcoal">
            Tout pour votre vanlife
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conseils pratiques, destinations, itinéraires — nos guides complets pour vivre la vanlife sereinement.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((guide) => (
            <div
              key={guide.title}
              className="bg-cream rounded-2xl p-6 border border-border/30 hover:border-sage/30 hover:shadow-sm transition-all"
            >
              <span className="text-3xl block mb-3">{guide.emoji}</span>
              <h3 className="font-bold text-charcoal mb-1">{guide.title}</h3>
              <p className="text-sm text-muted-foreground">{guide.desc}</p>
            </div>
          ))}
        </div>

        {/* Vanlife by region */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-charcoal text-center mb-8">Vanlife par région</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {REGIONS.map((region) => (
              <Link
                key={region.name}
                href="/conseil-camping"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-cream border border-border/50 rounded-full text-sm font-medium text-charcoal hover:border-sage/50 hover:text-sage hover:bg-sage/5 transition-colors"
              >
                <span>{region.emoji}</span>
                {region.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}