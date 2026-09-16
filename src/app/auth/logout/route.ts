import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { ADMIN_PREVIEW_COOKIE } from "@/server/admin-preview";
import { apiError } from "@/server/http";
import { assertSameOrigin } from "@/server/request-security";
import {
  getClearedMemberSessionCookieOptions,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
} from "@/lib/member-session";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    const response = NextResponse.redirect(new URL("/", request.url), 303);
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

    await supabase.auth.signOut();
    response.cookies.set(ADMIN_PREVIEW_COOKIE, "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
    const clearedMemberCookieOptions = getClearedMemberSessionCookieOptions();
    response.cookies.set(MEMBER_SESSION_COOKIE, "", clearedMemberCookieOptions);
    response.cookies.set(MEMBER_SESSION_POLICY_COOKIE, "", clearedMemberCookieOptions);
    response.headers.set("Cache-Control", "private, no-store, max-age=0");
    response.headers.set("Clear-Site-Data", '"cache", "cookies"');
    return response;
  } catch (error) {
    return apiError(error, "logout");
  }
}
