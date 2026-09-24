import type { MagArticle } from "../../data/mag.ts";
import { MAG_LOCAL_STORIES } from "../../data/mag-local-stories.ts";
import { ROUTE_VISITS } from "../../data/mag-route-visits.ts";

const BASE = "https://www.labelvanlife.fr";

export function magArticleSchema(post: MagArticle) {
  const citations = [...new Set([
    post.route?.stay.source,
    post.route ? ROUTE_VISITS[post.slug]?.source : undefined,
    post.route ? MAG_LOCAL_STORIES[post.slug]?.source : undefined,
    ...(post.resources ?? []).filter(resource => resource.href.startsWith("https://")).map(resource => resource.href),
  ].filter((source): source is string => Boolean(source)))];
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE}/blog/${post.slug}#article`,
    headline: post.title,
    description: post.excerpt,
    mainEntityOfPage: `${BASE}/blog/${post.slug}`,
    image: `${BASE}${post.image}`,
    inLanguage: "fr-FR",
    articleSection: post.category,
    author: { "@type": "Organization", name: "La rédaction Label Vanlife", url: `${BASE}/presse-et-partenaires` },
    publisher: { "@type": "Organization", "@id": `${BASE}/#organization`, name: "Label Vanlife", url: BASE },
    ...(citations.length ? { citation: citations } : {}),
  };
}
