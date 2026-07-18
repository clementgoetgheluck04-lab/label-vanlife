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
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSources,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://*.vercel.app https://*.basemaps.cartocdn.com https://api.bienvenue-a-la-ferme.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.vercel.app https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "manifest-src 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
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
        source: "/membre-login",
        destination: "/member-login",
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
