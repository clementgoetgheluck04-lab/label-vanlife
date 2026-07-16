import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lieux Label Vanlife — Campings et accueils labellisés",
  description:
    "Découvrez les lieux Label Vanlife, leurs équipements, leurs photos et les avantages réservés aux détenteurs de la carte membre.",
  openGraph: {
    title: "Lieux Label Vanlife — La carte des accueils labellisés",
    description:
      "Explorez les campings et accueils contrôlés par Label Vanlife partout en France.",
    type: "website",
  },
};

export default function ExplorerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
