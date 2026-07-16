/**
 * JsonLd — Composant générique pour injecter des données structurées JSON-LD
 * dans le <head> via un <script type="application/ld+json>.
 */

export interface JsonLdProps {
  data: Record<string, unknown>;
  id?: string;
}

export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      {...(id ? { id } : {})}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

/**
 * Organization (Label Vanlife)
 */
export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Label Vanlife",
    url: "https://label-vanlife-v1.vercel.app",
    logo: "https://label-vanlife-v1.vercel.app/icons/icon-192.svg",
    description:
      "Le premier label pour vanlifers. Lieux calmes, respectueux et adaptés à la vanlife.",
    sameAs: [
      "https://www.instagram.com/labelvanlife",
      "https://www.facebook.com/labelvanlife",
    ],
    foundingDate: "2024",
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@labelvanlife.com",
      contactType: "customer service",
      availableLanguage: ["French", "English"],
    },
  };

  return <JsonLd data={data} />;
}

/**
 * WebSite avec SearchAction (recherche en place)
 */
export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Label Vanlife",
    url: "https://label-vanlife-v1.vercel.app",
    description:
      "Le premier label pour vanlifers. Lieux calmes, respectueux et adaptés à la vanlife.",
    inLanguage: "fr-FR",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate:
          "https://label-vanlife-v1.vercel.app/map?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return <JsonLd data={data} />;
}

/**
 * LocalBusiness — Pour un lieu labellisé
 */
export function LocalBusinessJsonLd({
  name,
  description,
  url,
  image,
  telephone,
  addressCity,
  addressRegion,
  addressCountry,
  latitude,
  longitude,
  priceRange,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  telephone?: string;
  addressCity: string;
  addressRegion: string;
  addressCountry: string;
  latitude: number;
  longitude: number;
  priceRange?: string;
}) {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url,
    image: image ?? undefined,
    telephone: telephone ?? undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: addressCity,
      addressRegion,
      addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude,
      longitude,
    },
    ...(priceRange ? { priceRange } : {}),
  };

  return <JsonLd data={data} />;
}

/**
 * Product — Pour les offres d'abonnement membre
 */
export function ProductJsonLd({
  name,
  description,
  price,
  priceCurrency = "EUR",
  url,
  priceValidUntil,
}: {
  name: string;
  description: string;
  price: string;
  priceCurrency?: string;
  url: string;
  priceValidUntil?: string;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency,
      url,
      availability: "https://schema.org/InStock",
      ...(priceValidUntil ? { priceValidUntil } : {}),
    },
  };

  return <JsonLd data={data} />;
}
