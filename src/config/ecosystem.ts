export type EcosystemProduct = {
  name: string;
  role: string;
  description: string;
  icon: "globe" | "compass" | "pin" | "route" | "award" | "tent" | "phone" | "sparkles";
  href?: string;
  status: "available" | "beta" | "planned";
};

export const ECOSYSTEM_PRODUCTS: readonly EcosystemProduct[] = [
  { name: "Label Vanlife", role: "La marque et la communauté", description: "Le socle commun qui réunit voyageurs, établissements et partenaires autour d’une vanlife de confiance.", icon: "globe", href: "/le-label", status: "available" },
  { name: "Carte membre", role: "La carte membre numérique", description: "Un accès pendant 12 mois aux lieux sélectionnés, aux avantages, à la map interactive et à l’expérience membre en ligne.", icon: "compass", href: "/devenir-membre", status: "available" },
  { name: "Vanlife Places", role: "La carte mondiale des lieux labellisés", description: "Des lieux réellement accueillants, documentés et choisis pour leur qualité plutôt que pour leur quantité.", icon: "pin", href: "/explorer", status: "available" },
  { name: "Vanlife Trips", role: "Les road trips", description: "Des itinéraires inspirants reliés à des étapes Vanlife Friendly et adaptés aux voyageurs itinérants.", icon: "route", href: "/road-trips", status: "beta" },
  { name: "Vanlife Passport", role: "Les badges et tampons", description: "La mémoire des voyages, des lieux visités et des accomplissements de chaque membre.", icon: "award", href: "/member/passeport", status: "beta" },
  { name: "Vanlife Friendly", role: "La certification des établissements", description: "Le standard de confiance qui reconnaît les lieux engagés dans un accueil de qualité.", icon: "tent", href: "/labellisation", status: "available" },
  { name: "Vanlife App", role: "La PWA puis l’application mobile", description: "L’écosystème dans la poche, pensé pour les usages mobiles et les connexions irrégulières.", icon: "phone", status: "beta" },
  { name: "Vanlife AI", role: "Les assistants intelligents", description: "Des assistants encadrés pour préparer un voyage, enrichir les contenus et accompagner les partenaires.", icon: "sparkles", status: "planned" },
] as const;
