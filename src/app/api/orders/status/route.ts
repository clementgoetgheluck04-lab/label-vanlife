import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/server/auth";
import { apiError } from "@/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get("session_id");
    if (!sessionId || sessionId.length > 255) {
      return NextResponse.json({ error: "Invalid session" }, { status: 400 });
    }

    const order = await getPrisma().checkoutOrder.findFirst({
      where: { stripeCheckoutSessionId: sessionId },
      select: { status: true, product: true, userId: true },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    if (order.product === "MEMBERSHIP") {
      const user = await getAuthenticatedUser();
      if (order.userId !== user.id) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ status: order.status, product: order.product }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "order-status");
  }
}
