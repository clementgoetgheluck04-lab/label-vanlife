import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
          "/auth",
          "/member",
          "/pro",
          "/labellisation/paiement",
        ],
      },
    ],
    sitemap: "https://www.labelvanlife.fr/sitemap.xml",
    host: "https://www.labelvanlife.fr",
  };
}
