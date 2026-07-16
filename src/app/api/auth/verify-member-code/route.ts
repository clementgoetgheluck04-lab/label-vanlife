import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { hashMemberAccessLookupCode, memberAccessCodeMatches, normalizeMemberAccessCode } from "@/server/member-access";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { ADMIN_PREVIEW_COOKIE, adminPreviewCodeMatches, getAdminPreviewCookieValue, isLocalPreviewHost } from "@/server/admin-preview";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-access-code", 8, 15 * 60 * 1_000);
    const body = await request.json() as Record<string, unknown>;
    const rawCode = typeof body.code === "string" ? body.code : "";
    const requestHost = (request.headers.get("host") || "").split(":")[0];
    const localAdminPreview = isLocalPreviewHost(request.nextUrl.hostname) || isLocalPreviewHost(requestHost);
    const validAdminPreviewCode = adminPreviewCodeMatches(rawCode);
    if (validAdminPreviewCode) {
      const response = NextResponse.json({ url: "/member", preview: true }, { headers: { "Cache-Control": "no-store" } });
      response.cookies.set(ADMIN_PREVIEW_COOKIE, getAdminPreviewCookieValue(), {
        httpOnly: true,
        sameSite: "strict",
        secure: !localAdminPreview,
        path: "/",
        maxAge: 8 * 60 * 60,
      });
      return response;
    }
    const code = normalizeMemberAccessCode(rawCode);
    if (code.length !== 18) {
      return NextResponse.json({ error: "Code invalide" }, { status: 400 });
    }

    const prisma = getPrisma();
    const secret = requireServerEnv("MEMBER_ACCESS_CODE_SECRET");
    const lookupHash = hashMemberAccessLookupCode(code, secret);
    const order = await prisma.checkoutOrder.findFirst({
      where: {
        product: "MEMBERSHIP",
        status: "PAID",
        payload: { path: ["memberAccessCodeLookupHash"], equals: lookupHash },
      },
      include: {
        user: { include: { membership: true } },
      },
      orderBy: { paidAt: "desc" },
    });
    const user = order?.user;
    const payload = order?.payload && typeof order.payload === "object" && !Array.isArray(order.payload)
      ? { ...(order.payload as Record<string, unknown>) }
      : null;
    const expectedHash = typeof payload?.memberAccessCodeHash === "string" ? payload.memberAccessCodeHash : "";
    const expiresAt = typeof payload?.memberAccessCodeExpiresAt === "string" ? new Date(payload.memberAccessCodeExpiresAt) : null;
    const validMembership = user?.membership?.status === "ACTIVE"
      && (!user.membership.expiresAt || user.membership.expiresAt > new Date());
    const valid = Boolean(
      user && order && payload && validMembership
      && expiresAt && expiresAt > new Date() && expectedHash
      && memberAccessCodeMatches(user.email, code, secret, expectedHash),
    );
    if (!valid || !user || !order || !payload) {
      return NextResponse.json({ error: "Code invalide ou carte membre expirée" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.generateLink({
      type: "magiclink",
      email: user.email,
      options: { redirectTo: `${getAppUrl()}/auth/callback?next=/member` },
    });
    if (error || !data.properties?.action_link) throw error || new Error("Access link unavailable");

    await prisma.checkoutOrder.update({
      where: { id: order.id },
      data: {
        payload: {
          ...payload,
          memberAccessCodeLastUsedAt: new Date().toISOString(),
        } as Prisma.InputJsonObject,
      },
    });

    return NextResponse.json({ url: data.properties.action_link }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "verify-member-code");
  }
}
