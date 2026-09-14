import type { NextConfig } from "next";

const scriptSources = process.env.NODE_ENV === "production"
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Origin-Agent-Cluster", value: "?1" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSources,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "style-src-attr 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.vercel.app https://tile.openstreetmap.org https://api.bienvenue-a-la-ferme.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.vercel.app https://*.supabase.co wss://*.supabase.co https://*.stripe.com https://checkout.stripe.com",
      "frame-src 'self' https://checkout.stripe.com",
      "object-src 'none'",
      "media-src 'self'",
      "worker-src 'self' blob:",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "manifest-src 'self'",
      ...(process.env.NODE_ENV === "production" ? ["upgrade-insecure-requests"] : []),
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.bienvenue-a-la-ferme.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        ],
      },
      {
        source: "/manifest.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, must-revalidate" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/member/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/pro/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/manifeste",
        destination: "/le-label",
        permanent: true,
      },
      {
        source: "/membre",
        destination: "/devenir-membre",
        permanent: true,
      },
      {
        source: "/compte",
        destination: "/member-login",
        permanent: true,
      },
      {
        source: "/map",
        destination: "/explorer",
        permanent: true,
      },
      {
        source: "/map/:id",
        destination: "/lieux/:id",
        permanent: true,
      },
      {
        source: "/member-login",
        has: [
          {
            type: "query",
            key: "mode",
            value: "(?!login|register).+",
          },
        ],
        destination: "/member-login?mode=login",
        permanent: false,
      },
      {
        source: "/member-login",
        missing: [
          {
            type: "query",
            key: "mode",
          },
        ],
        destination: "/member-login?mode=login",
        permanent: false,
      },
      {
        source: "/membre-login",
        destination: "/member-login?mode=login",
        permanent: true,
      },
      {
        source: "/membre-login/:path*",
        destination: "/member-login/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
