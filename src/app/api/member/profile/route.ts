import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";
import { parseText } from "@/server/validation";

export async function PATCH(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-profile", 10, 10 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Compte membre requis" }, { status: 403 });

    const body = await readJsonRequest(request, 8_000) as Record<string, unknown>;
    const phone = parseText(body.phone, { min: 6, max: 30, required: true });
    const addressLine1 = parseText(body.addressLine1, { min: 2, max: 180, required: true });
    const addressLine2 = parseText(body.addressLine2, { max: 180 });
    const postalCode = parseText(body.postalCode, { min: 2, max: 20, required: true });
    const city = parseText(body.city, { min: 2, max: 100, required: true });
    const country = parseText(body.country, { min: 2, max: 80, required: true });
    if (!phone || !addressLine1 || addressLine2 === null || !postalCode || !city || !country) {
      return NextResponse.json({ error: "Coordonnées incomplètes ou invalides" }, { status: 400 });
    }

    await getPrisma().profile.update({
      where: { userId: member.id },
      data: { phone, addressLine1, addressLine2: addressLine2 || null, postalCode, city, country },
    });
    return NextResponse.json({ success: true }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    return apiError(error, "member-profile");
  }
}
