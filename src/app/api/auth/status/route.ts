import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";

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
      const membership = await getPrisma().membership.findUnique({
        where: { userId: data.user.id },
        select: { status: true, expiresAt: true },
      });
      const memberActive = membership?.status === "ACTIVE"
        && (!membership.expiresAt || membership.expiresAt > new Date());
      return NextResponse.json({ authenticated: true, memberActive }, { headers: PRIVATE_HEADERS });
    } catch {
      return NextResponse.json({ authenticated: true, memberActive: false }, { headers: PRIVATE_HEADERS });
    }
  } catch {
    return NextResponse.json({ authenticated: false, memberActive: false }, { headers: PRIVATE_HEADERS });
  }
}
