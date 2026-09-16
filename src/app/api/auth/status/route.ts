import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";
import {
  createMemberSessionToken,
  getClearedMemberSessionCookieOptions,
  getMemberSessionCookieOptions,
  getMemberSessionState,
  MEMBER_SESSION_COOKIE,
  MEMBER_SESSION_POLICY_COOKIE,
  MEMBER_SESSION_POLICY_VALUE,
} from "@/lib/member-session";

const PRIVATE_HEADERS = { "Cache-Control": "private, no-store, max-age=0" };

export async function GET() {
  const store = await cookies();
  if (isAdminPreviewCookie(store.get(ADMIN_PREVIEW_COOKIE)?.value)) {
    return NextResponse.json({ authenticated: true, memberActive: true }, { headers: PRIVATE_HEADERS });
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ authenticated: false, memberActive: false }, { headers: PRIVATE_HEADERS });
    }

    try {
      const sessionState = getMemberSessionState(
        store.get(MEMBER_SESSION_COOKIE)?.value,
        store.get(MEMBER_SESSION_POLICY_COOKIE)?.value,
        data.user.id,
      );
      if (sessionState.kind === "expired") {
        await supabase.auth.signOut();
        const expiredResponse = NextResponse.json(
          { authenticated: false, memberActive: false },
          { headers: PRIVATE_HEADERS },
        );
        const clearedMemberCookieOptions = getClearedMemberSessionCookieOptions();
        expiredResponse.cookies.set(MEMBER_SESSION_COOKIE, "", clearedMemberCookieOptions);
        expiredResponse.cookies.set(MEMBER_SESSION_POLICY_COOKIE, "", clearedMemberCookieOptions);
        return expiredResponse;
      }

      const membership = await getPrisma().membership.findUnique({ where: { userId: data.user.id } });
      const memberActive = membership?.status === "ACTIVE"
        && (!membership.expiresAt || membership.expiresAt > new Date());
      const response = NextResponse.json(
        { authenticated: true, memberActive },
        { headers: PRIVATE_HEADERS },
      );
      if (memberActive && sessionState.kind === "legacy") {
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
    } catch {
      return NextResponse.json({ authenticated: true, memberActive: false }, { headers: PRIVATE_HEADERS });
    }
  } catch {
    return NextResponse.json({ authenticated: false, memberActive: false }, { headers: PRIVATE_HEADERS });
  }
}
