import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";
import { KIT_ACCESS_COOKIE, hasValidKitAccess } from "@/lib/kit-access-token";
import {
  createMemberSessionToken,
  getMemberSessionCookieOptions,
  getMemberSessionState,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
  MEMBER_SESSION_POLICY_VALUE,
} from "@/lib/member-session";

const PUBLIC_ROUTES = [
  "/", "/explorer", "/le-label", "/labellisation", "/devenir-membre",
  "/member-login", "/membre", "/lieux", "/lieux-reperes", "/mentions-legales",
  "/admin-login",
  "/politique-confidentialite", "/blog", "/evenements",
  "/road-trips", "/guide-achat", "/offline",
  "/desinscription",
  "/recommander-un-lieu",
  "/verifier-carte",
  "/kit-communication-2027",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function isSensitivePath(pathname: string): boolean {
  return ["/member", "/admin", "/pro", "/kit-communication-2027", "/kits"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

function strictContentSecurityPolicy(nonce: string): string {
  const scripts = process.env.NODE_ENV === "production"
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`
    : `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`;
  return [
    "default-src 'self'",
    scripts,
    "script-src-attr 'none'",
    "style-src 'self' 'unsafe-inline'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob: https://*.vercel.app https://tile.openstreetmap.org https://api.bienvenue-a-la-ferme.com",
    "font-src 'self' data:",
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
  ].join("; ");
}

function withDeploymentHeaders(
  response: NextResponse,
  request: NextRequest,
  contentSecurityPolicy?: string,
): NextResponse {
  if (request.nextUrl.hostname.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  if (isSensitivePath(request.nextUrl.pathname)) {
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }
  if (contentSecurityPolicy) {
    response.headers.set("Content-Security-Policy", contentSecurityPolicy);
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const sensitive = isSensitivePath(request.nextUrl.pathname);
  const nonce = sensitive ? crypto.randomUUID().replaceAll("-", "") : "";
  const contentSecurityPolicy = sensitive ? strictContentSecurityPolicy(nonce) : undefined;
  const requestHeaders = new Headers(request.headers);
  if (contentSecurityPolicy) {
    requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
    requestHeaders.set("x-nonce", nonce);
  }

  const nextResponse = () => NextResponse.next({ request: { headers: requestHeaders } });
  if (request.nextUrl.pathname.startsWith("/kits/")) {
    const authorized = hasValidKitAccess(request.cookies.get(KIT_ACCESS_COOKIE)?.value);
    if (!authorized) {
      return withDeploymentHeaders(
        NextResponse.redirect(new URL("/kit-communication-2027", request.url)),
        request,
        contentSecurityPolicy,
      );
    }
    return withDeploymentHeaders(nextResponse(), request, contentSecurityPolicy);
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (sensitive) {
      return withDeploymentHeaders(
        NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 }),
        request,
        contentSecurityPolicy,
      );
    }
    return withDeploymentHeaders(nextResponse(), request, contentSecurityPolicy);
  }

  let response = nextResponse();
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = nextResponse();
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const adminPreview = isAdminPreviewCookie(request.cookies.get(ADMIN_PREVIEW_COOKIE)?.value);
  if (isPublicPath(pathname)) {
    await supabase.auth.getUser();
    return withDeploymentHeaders(response, request, contentSecurityPolicy);
  }

  const { data: { user } } = await supabase.auth.getUser();
  const protectedWithoutPreview = pathname === "/admin" || pathname.startsWith("/admin/")
    || pathname === "/pro" || pathname.startsWith("/pro/");
  const memberPath = pathname === "/member" || pathname.startsWith("/member/");
  const memberWithoutAccess = memberPath && !adminPreview;
  if (!user && (protectedWithoutPreview || memberWithoutAccess)) {
    const loginUrl = new URL("/member-login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withDeploymentHeaders(NextResponse.redirect(loginUrl), request, contentSecurityPolicy);
  }

  if (user && memberWithoutAccess) {
    const sessionState = getMemberSessionState(
      request.cookies.get(MEMBER_SESSION_COOKIE)?.value,
      request.cookies.get(MEMBER_SESSION_POLICY_COOKIE)?.value,
      user.id,
    );
    if (sessionState.kind === "expired") {
      return withDeploymentHeaders(
        NextResponse.redirect(new URL("/auth/session-expired", request.url)),
        request,
        contentSecurityPolicy,
      );
    }

    const rememberMe = sessionState.kind === "active" && sessionState.payload.rememberMe;
    const memberCookieOptions = getMemberSessionCookieOptions(rememberMe);
    response.cookies.set(
      MEMBER_SESSION_COOKIE,
      createMemberSessionToken(user.id, rememberMe),
      memberCookieOptions,
    );
    response.cookies.set(
      MEMBER_SESSION_POLICY_COOKIE,
      MEMBER_SESSION_POLICY_VALUE,
      memberCookieOptions,
    );
  }

  return withDeploymentHeaders(response, request, contentSecurityPolicy);
}

export const config = {
  matcher: [
    "/kits/:path*",
    "/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
