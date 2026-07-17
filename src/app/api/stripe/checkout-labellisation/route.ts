import { NextRequest, NextResponse } from "next/server";
import { getLabellisationProduct } from "@/config/products";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { getStripe } from "@/server/stripe";
import { parseLabellisationPayload } from "@/server/validation";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "labellisation-checkout", 10, 10 * 60 * 1_000);
    const payload = parseLabellisationPayload(await request.json());
    if (!payload || !payload.draftId || (payload.attachmentPaths?.length ?? 0) < 2) {
      return NextResponse.json({ error: "Invalid application data" }, { status: 400 });
    }

    const product = getLabellisationProduct();
    const stripe = getStripe();

    const prisma = getPrisma();
    const order = await prisma.checkoutOrder.create({
      data: {
        userId: null,
        product: product.code,
        amount: product.amount,
        currency: product.currency,
        payload,
      },
    });

    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [{
          price_data: {
            currency: product.currency,
            unit_amount: product.amount,
            product_data: { name: product.name },
          },
          quantity: 1,
        }],
        customer_email: payload.email,
        client_reference_id: order.id,
        metadata: { orderId: order.id, product: product.code, draftId: payload.draftId },
        payment_intent_data: { metadata: { orderId: order.id, product: product.code } },
        success_url: `${appUrl}/labellisation/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/labellisation/paiement?canceled=true`,
      },
      { idempotencyKey: `checkout_order_${order.id}` },
    );

    if (!session.url) throw new Error("Stripe Checkout did not return a URL");
    await prisma.checkoutOrder.update({
      where: { id: order.id },
      data: { status: "CHECKOUT_CREATED", stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ url: session.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    return apiError(error, "labellisation-checkout");
  }
}
