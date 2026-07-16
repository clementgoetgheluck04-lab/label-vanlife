import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceWorkerInit from "@/components/ServiceWorkerInit";
import PwaInstall from "@/components/PwaInstall";
import { BRAND_ASSETS } from "@/config/brand-assets";
import RouteScrollToTop from "@/components/RouteScrollToTop";

const BASE_URL = "https://labelvanlife.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Label Vanlife | Vanlife France : spots, guides, communauté de vanlifers",
    template: "%s | Label Vanlife",
  },
  description:
    "Label Vanlife est le 1er label pour vanlifers en France. Découvrez des lieux calmes, respectueux et vraiment adaptés à la vanlife — sélectionnés et labellisés, avec 10 à 20% de réduction pour nos membres. Rejoignez la communauté.",
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
  authors: [{ name: "Label Vanlife", url: "https://labelvanlife.com" }],
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
    title: "Label Vanlife | Vanlife France : le 1er label pour vanlifers",
    description:
      "La vanlife a enfin son label. Des lieux calmes, respectueux et vraiment adaptés à la vanlife — sélectionnés et labellisés, avec 10 à 20% de réduction pour nos membres.",
    url: BASE_URL,
    siteName: "Label Vanlife",
    locale: "fr_FR",
    type: "website",
    images: [
      {
        url: `${BASE_URL}${BRAND_ASSETS.socialCover}`,
        width: 1640,
        height: 924,
        alt: "Label Vanlife — Le 1er label pour vanlifers en France",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Label Vanlife | Vanlife France",
    description:
      "La vanlife a enfin son label. Des lieux calmes, respectueux et adaptés à la vanlife, avec 10 à 20% de réduction membres.",
    images: [`${BASE_URL}${BRAND_ASSETS.socialCover}`],
    creator: "@labelvanlife",
  },
  other: {
    "google-site-verification": "",
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
        {/* Outfit — Titres */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="alternate" type="application/rss+xml" title="Label Vanlife Blog" href="/blog/feed.xml" />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <RouteScrollToTop />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ServiceWorkerInit />
        <PwaInstall />
      </body>
    </html>
  );
}
