import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "member-notifications-read", 30, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });

    const result = await getPrisma().notification.updateMany({
      where: { userId: member.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true, updated: result.count });
  } catch (error) {
    return apiError(error, "member-notifications-read");
  }
}
