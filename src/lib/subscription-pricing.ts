// Preparation for recurring billing. Not connected to live Checkout yet.
// Inputs must come from verified server-side payment/subscription records, never a browser claim.
import { MEMBER_LOYALTY_TIERS, MEMBER_FOUNDER_ANNUAL_CENTS, MEMBER_OFFERS_START_ISO, MEMBER_PAYMENT_GRACE_DAYS } from "../config/member-offers.ts";
import { LABEL_LOYALTY_TIERS, EXCELLENCE_DISCOUNT_PERCENT } from "../config/label-offers.ts";

function timestamp(date: Date): number {
  const value = date.getTime();
  if (!Number.isFinite(value)) throw new Error("Invalid billing date");
  return value;
}

/** UTC anniversary with end-of-month clamp (29 February becomes 28 February). */
export function billingAnniversary(start: Date, years: number): Date {
  timestamp(start);
  if (!Number.isInteger(years) || years < 0) throw new Error("Invalid anniversary offset");
  const result = new Date(start);
  const year = start.getUTCFullYear() + years;
  const lastDay = new Date(Date.UTC(year, start.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCFullYear(year, start.getUTCMonth(), Math.min(start.getUTCDate(), lastDay));
  return result;
}

export function loyaltyTier(start: Date, now: Date): 0 | 1 | 2 {
  if (timestamp(now) < timestamp(start)) throw new Error("Subscription has not started");
  if (now >= billingAnniversary(start, 2)) return 2;
  if (now >= billingAnniversary(start, 1)) return 1;
  return 0;
}

export function isRecurringLaunchOpen(now: Date): boolean {
  return timestamp(now) >= new Date(MEMBER_OFFERS_START_ISO).getTime();
}

export function isWithinMemberPaymentGrace(failedAt: Date, now: Date): boolean {
  const elapsed = timestamp(now) - timestamp(failedAt);
  return elapsed >= 0 && elapsed < MEMBER_PAYMENT_GRACE_DAYS * 24 * 60 * 60 * 1000;
}

type FounderPayment = { product: string; status: string; currency: string; amount: number; paidAt: Date | null; complimentary: boolean };

export function isFounderPurchase(payment: FounderPayment): boolean {
  return payment.product === "MEMBERSHIP" && payment.status === "PAID"
    && payment.currency === "eur" && [MEMBER_FOUNDER_ANNUAL_CENTS, 2900].includes(payment.amount)
    && !payment.complimentary && payment.paidAt !== null
    && timestamp(payment.paidAt) < new Date(MEMBER_OFFERS_START_ISO).getTime();
}

export function memberRenewalQuote(input: {
  start: Date; now: Date; interval: "annual" | "quarterly";
  founderPayment?: FounderPayment; continuityBroken: boolean;
}) {
  // A restart must have its own subscription start date; an old start cannot restore loyalty.
  const elapsedTier = loyaltyTier(input.start, input.now);
  const tier = input.continuityBroken ? 0 : elapsedTier;
  const founder = Boolean(input.founderPayment && isFounderPurchase(input.founderPayment));
  if (input.interval !== "annual") {
    throw new Error("Membership is available with annual billing only");
  }
  return {
    amountCents: founder ? MEMBER_FOUNDER_ANNUAL_CENTS : MEMBER_LOYALTY_TIERS[tier][input.interval],
    currency: "eur" as const,
    intervalMonths: 12,
    tier, founder,
    nextDiscountAt: founder || tier === 2 || input.continuityBroken ? null : billingAnniversary(input.start, tier + 1),
  };
}

export function labelRenewalQuote(input: {
  start: Date; now: Date; offer: "essential" | "excellence";
  verifiedPromotionStartedAt?: Date;
}) {
  const tier = loyaltyTier(input.start, input.now);
  const promotion = input.offer === "excellence" && input.verifiedPromotionStartedAt !== undefined
    && timestamp(input.verifiedPromotionStartedAt) <= timestamp(input.now)
    && timestamp(input.verifiedPromotionStartedAt) < new Date(MEMBER_OFFERS_START_ISO).getTime();
  const base = LABEL_LOYALTY_TIERS[tier][input.offer];
  return {
    amountCents: promotion ? Math.round(base * (100 - EXCELLENCE_DISCOUNT_PERCENT) / 100) : base,
    tier, promotion, currency: "eur" as const, intervalMonths: 1,
    nextDiscountAt: tier === 2 ? null : billingAnniversary(input.start, tier + 1),
  };
}
