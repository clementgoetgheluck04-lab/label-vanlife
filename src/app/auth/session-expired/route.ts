import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  getClearedMemberSessionCookieOptions,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
} from "@/lib/member-session";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/member-login?expired=idle", request.url), 303);
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
  const clearedMemberCookieOptions = getClearedMemberSessionCookieOptions();
  response.cookies.set(MEMBER_SESSION_COOKIE, "", clearedMemberCookieOptions);
  response.cookies.set(MEMBER_SESSION_POLICY_COOKIE, "", clearedMemberCookieOptions);
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  return response;
}
