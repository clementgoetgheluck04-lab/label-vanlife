import type { MetadataRoute } from "next";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { REGION_GUIDE_SLUGS } from "@/data/region-guides";
import { MAG_ARTICLES } from "@/data/mag";

const BLOG_POST_SLUGS = MAG_ARTICLES.map(article => article.slug);

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.labelvanlife.fr";
  // Omit lastModified until reliable content update dates are available.
  // Build time and legacy place creation dates do not describe page updates.

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/le-label`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/presse-et-partenaires`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/referentiel-label-vanlife`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/ecosysteme`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/explorer`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/labellisation`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/devenir-membre`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/guide-achat`, changeFrequency: "monthly" as const, priority: 0.6 },
    { url: `${baseUrl}/evenements`, changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/vanlife`, changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/philosophie-vanlife`, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/vanlife-famille`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/campings-van-friendly`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${baseUrl}/slow-travel-vanlife`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/recommander-un-lieu`, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/dormir-en-van`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vanlife-solo`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/vanlife-regions`, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/mentions-legales`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/conditions-generales-utilisation`, changeFrequency: "yearly" as const, priority: 0.2 },
    { url: `${baseUrl}/politique-confidentialite`, changeFrequency: "yearly" as const, priority: 0.2 },
  ];

  const lieuPages = ENRICHED_LIEUX.map((lieu) => ({
    url: `${baseUrl}/lieux/${lieu.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const regionPages = REGION_GUIDE_SLUGS.map((slug) => ({
    url: `${baseUrl}/vanlife-regions/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const blogPages = BLOG_POST_SLUGS.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages, ...regionPages, ...lieuPages];
}
