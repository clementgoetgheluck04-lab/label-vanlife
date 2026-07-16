import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";

const PUBLIC_ROUTES = [
  "/", "/explorer", "/le-label", "/labellisation", "/devenir-membre",
  "/member-login", "/membre", "/lieux", "/mentions-legales",
  "/politique-confidentialite", "/blog", "/evenements", "/marketplace",
  "/road-trips", "/offline",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function withDeploymentHeaders(response: NextResponse, request: NextRequest): NextResponse {
  if (request.nextUrl.hostname.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}

export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return withDeploymentHeaders(NextResponse.next(), request);

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const pathname = request.nextUrl.pathname;
  const adminPreview = isAdminPreviewCookie(request.cookies.get(ADMIN_PREVIEW_COOKIE)?.value);
  if (isPublicPath(pathname)) {
    await supabase.auth.getUser();
    return withDeploymentHeaders(response, request);
  }

  const { data: { user } } = await supabase.auth.getUser();
  const protectedWithoutPreview = pathname.startsWith("/admin") || pathname.startsWith("/pro");
  const memberWithoutAccess = pathname.startsWith("/member") && !adminPreview;
  if (!user && (protectedWithoutPreview || memberWithoutAccess)) {
    const loginUrl = new URL("/member-login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return withDeploymentHeaders(NextResponse.redirect(loginUrl), request);
  }

  return withDeploymentHeaders(response, request);
}

export const config = {
  matcher: [
    "/((?!api|auth|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|sw.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico)$).*)",
  ],
};
