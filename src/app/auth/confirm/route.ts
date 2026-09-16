import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";
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
  const tokenHash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "magiclink") as EmailOtpType;
  const requestedNext = searchParams.get("next");
  const next = isSafeRedirectPath(requestedNext) ? requestedNext : "/member";
  const rememberMe = searchParams.get("remember") === "1";

  if (!tokenHash) {
    return NextResponse.redirect(`${origin}/member-login?error=auth_failed`);
  }

  const response = NextResponse.redirect(new URL(next, origin));
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            const sessionOptions = { ...options };
            delete sessionOptions.maxAge;
            delete sessionOptions.expires;
            const effectiveOptions = rememberMe ? options : sessionOptions;
            request.cookies.set(name, value);
            response.cookies.set(name, value, effectiveOptions);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (!error && data.user) {
    const memberCookieOptions = getMemberSessionCookieOptions(rememberMe);
    response.cookies.set(
      MEMBER_SESSION_COOKIE,
      createMemberSessionToken(data.user.id, rememberMe),
      memberCookieOptions,
    );
    response.cookies.set(
      MEMBER_SESSION_POLICY_COOKIE,
      MEMBER_SESSION_POLICY_VALUE,
      memberCookieOptions,
    );
    return response;
  }

  return NextResponse.redirect(`${origin}/member-login?error=auth_failed`);
}
