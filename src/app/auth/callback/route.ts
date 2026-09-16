import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isSafeRedirectPath } from "@/lib/urls";
import {
  createMemberSessionToken,
  getMemberSessionCookieOptions,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
  MEMBER_SESSION_POLICY_VALUE,
} from "@/lib/member-session";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next");
  const next = isSafeRedirectPath(requestedNext) ? requestedNext : "/member";
  const adminDestination = next === "/admin" || next.startsWith("/admin/");

  if (code) {
    const response = NextResponse.redirect(new URL(next, origin));
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              const sessionOptions = { ...options };
              delete sessionOptions.maxAge;
              delete sessionOptions.expires;
              request.cookies.set(name, value);
              response.cookies.set(name, value, sessionOptions);
            });
          },
        },
      },
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      if (!adminDestination) {
        const memberCookieOptions = getMemberSessionCookieOptions(false);
        response.cookies.set(
          MEMBER_SESSION_COOKIE,
          createMemberSessionToken(data.user.id, false),
          memberCookieOptions,
        );
        response.cookies.set(
          MEMBER_SESSION_POLICY_COOKIE,
          MEMBER_SESSION_POLICY_VALUE,
          memberCookieOptions,
        );
      }
      return response;
    }
  }

  return NextResponse.redirect(`${origin}${adminDestination ? "/admin-login" : "/member-login"}?error=auth_failed`);
}
