import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { requireAdminUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";

const STATUSES = new Set(["PENDING", "VALIDATED", "REJECTED", "CONVERTED"]);

export async function GET() {
  try {
    await requireAdminUser();
    const recommendations = await getPrisma().placeRecommendation.findMany({
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
    });
    return NextResponse.json({ recommendations }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "admin-recommendations-list");
  }
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "admin-recommendations", 120, 10 * 60 * 1_000);
    const admin = await requireAdminUser();
    const body = await readJsonRequest(request, 4_096) as Record<string, unknown>;
    const id = typeof body.id === "string" ? body.id : "";
    const status = typeof body.status === "string" ? body.status : "";
    if (!id || !STATUSES.has(status)) return NextResponse.json({ error: "Action invalide" }, { status: 400 });
    const updated = await getPrisma().placeRecommendation.update({
      where: { id },
      data: {
        status: status as "PENDING" | "VALIDATED" | "REJECTED" | "CONVERTED",
        reviewedAt: status === "PENDING" ? null : new Date(),
        reviewedBy: status === "PENDING" ? null : admin.id,
      },
    });
    return NextResponse.json({ success: true, recommendation: updated });
  } catch (error) {
    return apiError(error, "admin-recommendations-update");
  }
}
