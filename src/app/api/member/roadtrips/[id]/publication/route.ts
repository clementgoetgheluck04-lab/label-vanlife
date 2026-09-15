import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "roadtrip-publication", 30, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });
    const { id } = await params;
    if (!/^[a-zA-Z0-9_-]{8,64}$/.test(id)) throw new RequestBodyError("Invalid road trip", 400);
    const body = await readJsonRequest(request, 2_000) as Record<string, unknown>;
    if (typeof body.isPublic !== "boolean") throw new RequestBodyError("Invalid publication status", 400);
    const isPublic = body.isPublic;

    const prisma = getPrisma();
    const existing = await prisma.roadTrip.findFirst({
      where: { id, userId: member.id },
      select: { id: true, isPublic: true },
    });
    if (!existing) return NextResponse.json({ error: "Road trip not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.roadTrip.update({ where: { id }, data: { isPublic } });
      if (isPublic && !existing.isPublic) {
        await tx.analyticsEvent.create({
          data: {
            name: "recap_generated",
            userId: member.id,
            entityType: "road_trip",
            entityId: id,
            path: "/member/roadtrips",
            properties: { privacy: "public_places_only" },
          },
        });
      }
    });

    return NextResponse.json({
      isPublic,
      sharePath: isPublic ? `/trip/${id}` : null,
    });
  } catch (error) {
    return apiError(error, "roadtrip-publication");
  }
}
