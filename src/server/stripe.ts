import Stripe from "stripe";
import { requireServerEnv } from "@/server/env";

let stripeClient: Stripe | undefined;

export function getStripe(): Stripe {
  stripeClient ??= new Stripe(requireServerEnv("STRIPE_SECRET_KEY"));
  return stripeClient;
}

export async function assertStripePrice(
  stripe: Stripe,
  priceId: string,
  expectedAmount: number,
  expectedCurrency: string,
): Promise<void> {
  const price = await stripe.prices.retrieve(priceId);
  if (
    !price.active ||
    price.type !== "one_time" ||
    price.unit_amount !== expectedAmount ||
    price.currency !== expectedCurrency
  ) {
    throw new Error("Stripe price does not match the server product catalog");
  }
}
