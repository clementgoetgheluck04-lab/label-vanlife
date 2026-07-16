import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace Vanlife — Équipements, vans et goodies",
  description:
    "La marketplace Label Vanlife : produits dérivés, équipements pour van, vans aménagés à vendre et bonnes affaires de la communauté des vanlifers.",
  openGraph: {
    title: "Marketplace Vanlife — Produits, vans et équipements | Label Vanlife",
    description:
      "Achetez et vendez entre vanlifers : goodies, équipements, vans aménagés. La marketplace de confiance de la communauté Label Vanlife.",
    type: "website",
  },
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
