import { NextRequest, NextResponse } from "next/server";
import { KIT_ACCESS_COOKIE, signKitAccessToken, verifyKitAccessToken } from "@/lib/kit-access-token";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const destination = new URL("/kit-communication-2027", request.url);
  try {
    const token = request.nextUrl.searchParams.get("token") || "";
    const payload = verifyKitAccessToken(token);
    if (!payload || payload.kind !== "magic-link") {
      destination.searchParams.set("erreur", "lien-invalide");
      return NextResponse.redirect(destination);
    }

    const response = NextResponse.redirect(destination);
    response.cookies.set(KIT_ACCESS_COOKIE, signKitAccessToken({
      ...payload,
      kind: "access",
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1_000,
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60,
    });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    return response;
  } catch {
    destination.searchParams.set("erreur", "service-indisponible");
    return NextResponse.redirect(destination);
  }
}
