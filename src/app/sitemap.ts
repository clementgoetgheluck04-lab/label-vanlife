import type { MetadataRoute } from "next";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://labelvanlife.com";

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1.0 },
    { url: `${baseUrl}/le-label`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/ecosysteme`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/manifeste`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/explorer`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/labellisation`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/devenir-membre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/membre`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
    { url: `${baseUrl}/vanlife`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${baseUrl}/vanlife-famille`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${baseUrl}/campings-van-friendly`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  ];

  const lieuPages = ENRICHED_LIEUX.map((lieu) => ({
    url: `${baseUrl}/lieux/${lieu.id}`,
    lastModified: new Date(lieu.created_at || Date.now()),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...lieuPages];
}
