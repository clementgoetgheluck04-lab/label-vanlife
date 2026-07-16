import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const BLOG_POSTS = [
  {
    title: "Top 10 des lieux vanlife en Bretagne — Notre sélection 2025",
    excerpt:
      "De la Pointe du Raz au Golfe du Morbihan, découvrez notre sélection des meilleurs spots labellisés pour poser votre van en Bretagne.",
    date: "15 Juin 2025",
    readTime: "5 min",
    tags: ["Bretagne", "Road Trip", "Sélection"],
    slug: "top-10-lieux-vanlife-bretagne",
  },
  {
    title: "Comment bien préparer son premier road trip en van",
    excerpt:
      "Check-list, équipement indispensable, itinéraire : tout ce qu'il faut savoir pour que votre première aventure en van soit une réussite.",
    date: "2 Juin 2025",
    readTime: "8 min",
    tags: ["Guide", "Débutant", "Préparation"],
    slug: "preparer-premier-road-trip-van",
  },
  {
    title: "Label Vanlife : notre charte pour une vanlife responsable",
    excerpt:
      "Découvrez les 4 piliers de notre charte : calme, respect, sécurité, environnement. Ensemble, changeons la façon de voyager en van.",
    date: "20 Mai 2025",
    readTime: "4 min",
    tags: ["Label", "Charte", "Communauté"],
    slug: "charte-vanlife-responsable",
  },
  {
    title: "Les meilleurs spots vanlife en Provence pour l'été",
    excerpt:
      "Lavande, calanques, gorges du Verdon : notre sélection des lieux incontournables pour un road trip provençal réussi.",
    date: "10 Mai 2025",
    readTime: "6 min",
    tags: ["Provence", "Été", "Road Trip"],
    slug: "spots-vanlife-provence-ete",
  },
];

export default function BlogPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Blog
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-charcoal leading-tight">
            Le journal de la <span className="text-sage">Vanlife</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guides, inspirations, conseils et actualités pour vivre une vanlife plus responsable et sereine.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.slug}
                className="group bg-cream/50 rounded-2xl p-6 sm:p-8 border border-border/30 hover:border-sage/30 transition-all duration-300 hover:shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-stone/60">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {post.date}
                      </span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold text-charcoal group-hover:text-sage transition-colors leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-white text-stone px-3 py-1 rounded-full border border-border/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2">
                      <Link
                                            href={`/blog/${post.slug}`}
                                            className="inline-flex items-center gap-1 text-sm font-semibold text-sage group-hover:gap-2 transition-all"
                                          >
                                            Lire l&apos;article
                                            <ArrowRight className="h-4 w-4" />
                                          </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
            Prêt à vivre <span className="text-sage">l&apos;aventure</span> ?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto">
            Rejoins les membres Label Vanlife et accède à la carte interactive, aux réductions exclusives et à toute la communauté.
          </p>
          <Link
            href="/devenir-membre"
            className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
          >
            Devenir Membre
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}