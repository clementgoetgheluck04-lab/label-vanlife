import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { ensureLabelledPlaces } from "@/server/labelled-place";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-favorite", 60, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });
    const body = await readJsonRequest(request, 2_048) as Record<string, unknown>;
    const slug = typeof body.slug === "string" ? body.slug.trim() : "";
    if (!/^[a-z0-9-]{2,120}$/.test(slug) || typeof body.favorite !== "boolean") throw new RequestBodyError("Favori invalide", 400);

    const prisma = getPrisma();
    const places = await ensureLabelledPlaces(prisma, [slug]);
    const place = places?.[0];
    if (!place || place.slug !== slug) return NextResponse.json({ error: "Lieu labellisé introuvable" }, { status: 404 });

    if (body.favorite) {
      const created = await prisma.favorite.createMany({ data: [{ userId: member.id, placeId: place.id }], skipDuplicates: true });
      if (created.count === 1) {
        await prisma.analyticsEvent.create({ data: { name: "favorite_add", userId: member.id, entityType: "lieux", entityId: slug, path: `/lieux/${slug}` } });
      }
    } else {
      await prisma.favorite.deleteMany({ where: { userId: member.id, placeId: place.id } });
    }

    return NextResponse.json({ success: true, favorite: body.favorite });
  } catch (error) {
    return apiError(error, "member-favorite");
  }
}
