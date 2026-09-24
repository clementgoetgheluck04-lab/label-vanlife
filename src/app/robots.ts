import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Crawling directives are not access controls. Authentication remains mandatory.
  // Repeat exclusions for named bots: specific groups do not inherit '*'.
  const disallow = [
    "/admin", "/api", "/auth", "/member", "/pro",
    "/labellisation/paiement", "/labellisation/success", "/adhesion/success",
    "/kit-communication-2027", "/kits", "/verifier-carte", "/visite/",
    "/desinscription", "/trip/",
  ];
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow,
      },
      {
        userAgent: ["OAI-SearchBot", "PerplexityBot"],
        allow: "/",
        disallow,
      },
    ],
    sitemap: "https://www.labelvanlife.fr/sitemap.xml",
    host: "https://www.labelvanlife.fr",
  };
}
