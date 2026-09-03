import { NextRequest, NextResponse } from "next/server";
import { getLabellisationProduct } from "@/config/products";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { getStripe } from "@/server/stripe";
import { parseLabellisationPayload } from "@/server/validation";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";
import { verifyDraftToken } from "@/server/labellisation-draft";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "labellisation-checkout", 10, 10 * 60 * 1_000);
    const payload = parseLabellisationPayload(await readJsonRequest(request, 150_000));
    if (!payload || !payload.draftId || !payload.draftToken || (payload.attachmentPaths?.length ?? 0) < 2) {
      return NextResponse.json({ error: "Invalid application data" }, { status: 400 });
    }
    const attachmentPaths = [...new Set(payload.attachmentPaths || [])];
    const expectedPrefix = `pending/${payload.draftId}/`;
    const proof = { draftId: payload.draftId, email: payload.email, attachmentPaths };
    if (
      attachmentPaths.length !== payload.attachmentPaths?.length
      || !attachmentPaths.every((path) => path.startsWith(expectedPrefix))
      || !verifyDraftToken(proof, payload.draftToken)
    ) {
      return NextResponse.json({ error: "Invalid or expired application proof" }, { status: 400 });
    }

    const product = getLabellisationProduct();
    const stripe = getStripe();
    const storedPayload = { ...payload };
    delete storedPayload.draftToken;

    const prisma = getPrisma();
    const order = await prisma.checkoutOrder.upsert({
      where: { labellisationDraftId: payload.draftId },
      update: {},
      create: {
        userId: null,
        product: product.code,
        amount: product.amount,
        currency: product.currency,
        payload: storedPayload,
        labellisationDraftId: payload.draftId,
      },
    });

    if (order.status === "PAID" || order.status === "REFUNDED") {
      return NextResponse.json({ error: "This application has already been processed" }, { status: 409 });
    }
    if (order.stripeCheckoutSessionId) {
      const existingSession = await stripe.checkout.sessions.retrieve(order.stripeCheckoutSessionId);
      if (existingSession.status === "open" && existingSession.url) {
        return NextResponse.json({ url: existingSession.url }, { headers: { "Cache-Control": "no-store" } });
      }
    }

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
      { idempotencyKey: `checkout_order_${order.id}_${order.stripeCheckoutSessionId || "initial"}` },
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
