import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lieux Label Vanlife — Campings et accueils labellisés",
  description:
    "Découvrez les lieux Label Vanlife, leurs équipements, leurs photos et les avantages réservés aux détenteurs de la carte membre.",
  alternates: { canonical: "/explorer" },
  openGraph: {
    title: "Lieux Label Vanlife — La carte des accueils labellisés",
    description:
      "Explorez les lieux labellisés et les meilleures adresses repérées par Label Vanlife en France, en Belgique, en Suisse et au Luxembourg.",
    type: "website",
  },
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
