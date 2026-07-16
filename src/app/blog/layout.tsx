import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Vanlife — Guides, conseils et actualités",
  description:
    "Le blog Label Vanlife : guides road trip, conseils vanlife, sélections de spots, charte responsable et actualités de la communauté. Inspirez-vous pour vos prochains voyages en van.",
  openGraph: {
    title: "Blog Vanlife — Guides, inspirations et actualités | Label Vanlife",
    description:
      "Découvrez les articles du blog Label Vanlife : top 10 des lieux en Bretagne, préparer son premier road trip, charte vanlife responsable et sélection Provence.",
    type: "website",
  },
  alternates: {
    types: {
      "application/rss+xml": "/blog/feed.xml",
    },
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
