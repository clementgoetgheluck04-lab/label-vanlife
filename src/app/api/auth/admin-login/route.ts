import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import {
  getClearedMemberSessionCookieOptions,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
} from "@/lib/member-session";
import { ADMIN_PREVIEW_COOKIE } from "@/server/admin-preview";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";

const GENERIC_MESSAGE = "Si cette adresse correspond à l’administrateur Label Vanlife, un lien sécurisé vient d’être envoyé.";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "admin-login", 5, 15 * 60 * 1_000);
    const body = await readJsonRequest(request, 4_096) as { email?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set(name, value);
              response.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    await supabase.auth.signOut({ scope: "local" });
    const clearedMemberCookieOptions = getClearedMemberSessionCookieOptions();
    response.cookies.set(MEMBER_SESSION_COOKIE, "", clearedMemberCookieOptions);
    response.cookies.set(MEMBER_SESSION_POLICY_COOKIE, "", clearedMemberCookieOptions);
    response.cookies.set(ADMIN_PREVIEW_COOKIE, "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    const admin = await getPrisma().user.findFirst({
      where: { email: { equals: email, mode: "insensitive" }, role: "ADMIN" },
      select: { email: true },
    });
    if (!admin) return response;

    const { error } = await supabase.auth.signInWithOtp({
      email: admin.email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent("/admin")}`,
      },
    });
    if (error) console.error("[admin-login] secure link request failed", error.code || error.message);
    return response;
  } catch (error) {
    return apiError(error, "admin-login");
  }
}
