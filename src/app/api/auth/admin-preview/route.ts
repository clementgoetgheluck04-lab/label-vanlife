import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_PREVIEW_COOKIE, isAdminPreviewCookie } from "@/server/admin-preview";

export async function GET() {
  const store = await cookies();
  const active = isAdminPreviewCookie(store.get(ADMIN_PREVIEW_COOKIE)?.value);
  return NextResponse.json({ active }, { headers: { "Cache-Control": "no-store" } });
}
