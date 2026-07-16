import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/config/products";
import { getPrisma } from "@/lib/prisma";
import { ensureAppUser, getAuthenticatedUser } from "@/server/auth";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { assertStripePrice, getStripe } from "@/server/stripe";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "membership-checkout", 10, 10 * 60 * 1_000);
    const user = await getAuthenticatedUser();
    await ensureAppUser(user);

    const product = PRODUCTS.membership;
    const stripe = getStripe();
    const priceId = requireServerEnv(product.priceEnv);
    await assertStripePrice(stripe, priceId, product.amount, product.currency);

    const prisma = getPrisma();
    const order = await prisma.checkoutOrder.create({
      data: {
        userId: user.id,
        product: product.code,
        amount: product.amount,
        currency: product.currency,
      },
    });

    const appUrl = getAppUrl();
    const session = await stripe.checkout.sessions.create(
      {
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: user.email ?? undefined,
        client_reference_id: order.id,
        metadata: { orderId: order.id, product: product.code, userId: user.id },
        payment_intent_data: { metadata: { orderId: order.id, product: product.code } },
        success_url: `${appUrl}/adhesion/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/devenir-membre?canceled=true`,
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
    return apiError(error, "membership-checkout");
  }
}
