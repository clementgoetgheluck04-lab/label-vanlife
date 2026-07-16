import Link from "next/link";
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

const BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
}> = {
  "top-10-lieux-vanlife-bretagne": {
    title: "Top 10 des lieux vanlife en Bretagne — Notre sélection 2025",
    excerpt: "De la Pointe du Raz au Golfe du Morbihan, découvrez notre sélection des meilleurs spots labellisés pour poser votre van en Bretagne.",
    content:
      "La Bretagne est une terre d'élection pour les vanlifers. Avec ses côtes sauvages, ses villages de caractère et sa culture du voyage, c'est la destination idéale pour un road trip en van. Découvrez notre sélection des 10 meilleurs lieux labellisés Label Vanlife en Bretagne, sélectionnés pour leur cadre exceptionnel, leur accueil chaleureux et leur engagement pour une vanlife responsable.",
    date: "15 Juin 2025",
    readTime: "5 min",
    tags: ["Bretagne", "Road Trip", "Sélection"],
  },
  "preparer-premier-road-trip-van": {
    title: "Comment bien préparer son premier road trip en van",
    excerpt: "Check-list, équipement indispensable, itinéraire : tout ce qu'il faut savoir pour que votre première aventure en van soit une réussite.",
    content:
      "Vous avez votre van (ou vous l'avez loué), le grand départ approche. Mais par où commencer ? Préparer un road trip en van ne s'improvise pas totalement. De l'équipement essentiel à la planification d'itinéraire, en passant par les applications indispensables, suivez notre guide complet pour une première aventure réussie.",
    date: "2 Juin 2025",
    readTime: "8 min",
    tags: ["Guide", "Débutant", "Préparation"],
  },
  "charte-vanlife-responsable": {
    title: "Label Vanlife : notre charte pour une vanlife responsable",
    excerpt: "Découvrez les 4 piliers de notre charte : calme, respect, sécurité, environnement. Ensemble, changeons la façon de voyager en van.",
    content:
      "Chez Label Vanlife, nous croyons qu'une autre vanlife est possible. Notre charte repose sur 4 piliers fondamentaux : le calme et la sérénité, le respect des lieux et des riverains, la sécurité des voyageurs, et l'engagement environnemental. Chaque membre et chaque lieu labellisé s'engage à respecter ces principes pour une vanlife plus harmonieuse.",
    date: "20 Mai 2025",
    readTime: "4 min",
    tags: ["Label", "Charte", "Communauté"],
  },
  "spots-vanlife-provence-ete": {
    title: "Les meilleurs spots vanlife en Provence pour l'été",
    excerpt: "Lavande, calanques, gorges du Verdon : notre sélection des lieux incontournables pour un road trip provençal réussi.",
    content:
      "La Provence en été, c'est la promesse de paysages à couper le souffle : champs de lavande à perte de vue, calanques turquoise, villages perchés et marchés colorés. Découvrez notre sélection des meilleurs lieux labellisés pour profiter de la Provence en van, tout en respectant ces territoires d'exception.",
    date: "10 Mai 2025",
    readTime: "6 min",
    tags: ["Provence", "Été", "Road Trip"],
  },
};

export async function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return { title: "Article non trouvé | Label Vanlife" };
  }

  return {
    title: `${post.title} | Label Vanlife`,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | Label Vanlife`,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Label Vanlife`,
      description: post.excerpt,
    },
    keywords: post.tags.join(", "),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];

  if (!post) {
    return (
      <div className="pt-24 min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-charcoal">Article non trouvé</h1>
          <p className="text-muted-foreground">Cet article n&apos;existe pas ou a été déplacé.</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sage font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Article */}
      <article className="py-16 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-stone hover:text-sage transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au blog
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-4 text-xs text-stone/60">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-charcoal leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-white text-stone px-3 py-1 rounded-full border border-border/50"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 pt-4">
              <p className="text-lg font-medium text-charcoal">{post.excerpt}</p>
              {post.content.split("\n\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </article>

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