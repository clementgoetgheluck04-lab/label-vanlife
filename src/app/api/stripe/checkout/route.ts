import { NextRequest, NextResponse } from "next/server";
import { PRODUCTS } from "@/config/products";
import { getPrisma } from "@/lib/prisma";
import { ensureAppUser, getAuthenticatedUser } from "@/server/auth";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { assertStripePrice, getStripe } from "@/server/stripe";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import type { User } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function readMetadataText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function readMetadataInteger(value: unknown, min: number, max: number) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

async function syncMemberProfileFromMetadata(user: User) {
  const firstName = readMetadataText(user.user_metadata?.firstName, 80);
  const lastName = readMetadataText(user.user_metadata?.lastName, 100);
  const phone = readMetadataText(user.user_metadata?.phone, 30);
  const age = readMetadataInteger(user.user_metadata?.age, 18, 120);
  if (!firstName || !lastName || !phone || age === null) return;

  const rawCompanions = Array.isArray(user.user_metadata?.companions)
    ? user.user_metadata.companions
    : [];
  const companions = rawCompanions.slice(0, 7).map((raw) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const companion = raw as Record<string, unknown>;
    const companionFirstName = readMetadataText(companion.firstName, 80);
    const companionLastName = readMetadataText(companion.lastName, 100);
    const companionAge = readMetadataInteger(companion.age, 0, 120);
    if (!companionFirstName || !companionLastName || companionAge === null) return null;
    return { firstName: companionFirstName, lastName: companionLastName, age: companionAge };
  }).filter((companion): companion is { firstName: string; lastName: string; age: number } => Boolean(companion));

  const prisma = getPrisma();
  await prisma.$transaction(async (tx) => {
    await tx.profile.upsert({
      where: { userId: user.id },
      create: { userId: user.id, firstName, lastName, phone, age },
      update: { firstName, lastName, phone, age },
    });
    await tx.memberCompanion.deleteMany({ where: { userId: user.id } });
    if (companions.length > 0) {
      await tx.memberCompanion.createMany({
        data: companions.map((companion) => ({ ...companion, userId: user.id })),
      });
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "membership-checkout", 10, 10 * 60 * 1_000);
    const user = await getAuthenticatedUser();
    await ensureAppUser(user);
    await syncMemberProfileFromMetadata(user);

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
