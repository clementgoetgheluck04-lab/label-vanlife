import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/server/auth";
import { apiError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId || sessionId.length > 255) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const order = await getPrisma().checkoutOrder.findFirst({
      where: { stripeCheckoutSessionId: sessionId, userId: user.id },
      select: { status: true, product: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "order-status");
  }
}
