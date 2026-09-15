import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, RequestBodyError } from "@/server/request-security";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "roadtrip-delete", 20, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });
    const { id } = await params;
    if (!/^[a-zA-Z0-9_-]{8,64}$/.test(id)) throw new RequestBodyError("Invalid road trip", 400);

    const deleted = await getPrisma().roadTrip.deleteMany({ where: { id, userId: member.id } });
    if (deleted.count === 0) return NextResponse.json({ error: "Road trip not found" }, { status: 404 });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error, "roadtrip-delete");
  }
}
