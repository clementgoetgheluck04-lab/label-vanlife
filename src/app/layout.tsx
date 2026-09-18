import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerInit from "@/components/ServiceWorkerInit";
import PwaInstall from "@/components/PwaInstall";
import { BRAND_ASSETS } from "@/config/brand-assets";
import RouteScrollToTop from "@/components/RouteScrollToTop";
import { OrganizationJsonLd, WebSiteJsonLd } from "@/components/seo/JsonLd";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import CookieConsent from "@/components/CookieConsent";

const BASE_URL = "https://www.labelvanlife.fr";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Label Vanlife | Vanlife France : spots, guides, communauté de vanlifers",
    template: "%s | Label Vanlife",
  },
  description:
    "Label Vanlife relie les voyageurs à des lieux engagés dans une charte d’accueil, avec des avantages membres indiqués clairement selon chaque partenaire.",
  keywords: [
    "vanlife",
    "vanlife france",
    "label vanlife",
    "spots vanlife",
    "camping van",
    "voyage en van",
    "itinérant",
    "road trip van",
    "vanlife communauté",
    "camping-car",
    "vanlife label",
    "camping vanlife",
    "lieux vanlife",
    "vanlife france label",
    "voyage itinérant",
    "vanlife reduction",
  ],
  authors: [{ name: "Label Vanlife", url: "https://www.labelvanlife.fr" }],
  creator: "Label Vanlife",
  publisher: "Label Vanlife",
  icons: {
    icon: [
      { url: BRAND_ASSETS.faviconVector, type: "image/svg+xml" },
      { url: BRAND_ASSETS.favicon, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: BRAND_ASSETS.favicon, sizes: "512x512", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Label Vanlife | Des lieux engagés pour accueillir les vanlifers",
    description:
      "Des lieux calmes, respectueux et adaptés à la vanlife, sélectionnés et labellisés, avec un avantage membre précisé sur chaque fiche.",
    url: BASE_URL,
    siteName: "Label Vanlife",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${BASE_URL}${BRAND_ASSETS.socialCover}`,
        width: 1640,
        height: 924,
        alt: "Label Vanlife — Des lieux engagés pour accueillir les vanlifers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Vanlife | Vanlife France",
    description:
      "La vanlife a son label : des lieux engagés, une MAP privée et un avantage membre précisé selon chaque partenaire.",
    images: [`${BASE_URL}${BRAND_ASSETS.socialCover}`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10B981",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <RouteScrollToTop />
        <AnalyticsProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorkerInit />
        <PwaInstall />
        <CookieConsent />
      </body>
    </html>
  );
}
