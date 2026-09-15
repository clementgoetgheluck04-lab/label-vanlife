import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "passport-memory", 20, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });
    const { id } = await params;
    if (!/^[a-z0-9_-]{8,64}$/i.test(id)) throw new RequestBodyError("Tampon invalide", 400);

    const body = await readJsonRequest(request, 4_096) as Record<string, unknown>;
    const note = body.note === null ? null : typeof body.note === "number" && Number.isInteger(body.note) && body.note >= 1 && body.note <= 5 ? body.note : undefined;
    const comment = typeof body.comment === "string" ? body.comment.trim().replace(/\s+/g, " ") : undefined;
    if (note === undefined || comment === undefined || comment.length > 800) throw new RequestBodyError("La note ou le souvenir est invalide", 400);

    const prisma = getPrisma();
    const stamp = await prisma.passportStamp.findFirst({
      where: { id, userId: member.id },
      select: { id: true, place: { select: { slug: true } } },
    });
    if (!stamp) return NextResponse.json({ error: "Tampon introuvable" }, { status: 404 });

    await prisma.$transaction([
      prisma.passportStamp.update({ where: { id: stamp.id }, data: { note, comment: comment || null } }),
      prisma.analyticsEvent.create({
        data: {
          name: "review_submit",
          userId: member.id,
          entityType: "lieux",
          entityId: stamp.place.slug,
          path: "/member/passeport",
          properties: { hasComment: Boolean(comment), note },
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "passport-memory");
  }
}
