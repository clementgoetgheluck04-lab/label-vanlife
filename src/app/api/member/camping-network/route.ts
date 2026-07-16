import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import memberCampingNetwork from "@/data/member-camping-network.json";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";

export async function GET() {
  const cookieStore = await cookies();
  const isAdminPreview = isAdminPreviewCookie(cookieStore.get(ADMIN_PREVIEW_COOKIE)?.value);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isAdminPreview) {
    return NextResponse.json({ error: "Accès membre requis" }, {
      status: 401,
      headers: { "Cache-Control": "private, no-store" },
    });
  }

  return NextResponse.json({ places: memberCampingNetwork }, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
