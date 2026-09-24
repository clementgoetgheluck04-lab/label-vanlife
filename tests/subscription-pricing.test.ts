import test from "node:test";
import assert from "node:assert/strict";
import { billingAnniversary, loyaltyTier, isRecurringLaunchOpen, isWithinMemberPaymentGrace, isFounderPurchase, memberRenewalQuote, labelRenewalQuote } from "../src/lib/subscription-pricing.ts";

const start = new Date("2027-02-01T23:00:00Z");
const founderPayment = { product: "MEMBERSHIP", status: "PAID", currency: "eur", amount: 2900, paidAt: new Date("2026-09-23T12:00:00Z"), complimentary: false };

test("launch boundary is exactly midnight Paris on 2 February", () => {
  assert.equal(isRecurringLaunchOpen(new Date(start.getTime() - 1)), false);
  assert.equal(isRecurringLaunchOpen(start), true);
  assert.throws(() => isRecurringLaunchOpen(new Date("invalid")));
});
test("loyalty uses full anniversaries, handles leap days and rejects future starts", () => {
  assert.equal(loyaltyTier(start, new Date("2028-02-01T22:59:59Z")), 0);
  assert.equal(loyaltyTier(start, billingAnniversary(start, 1)), 1);
  assert.equal(loyaltyTier(start, billingAnniversary(start, 8)), 2);
  assert.equal(billingAnniversary(new Date("2028-02-29T12:00:00Z"), 1).toISOString(), "2029-02-28T12:00:00.000Z");
  assert.throws(() => loyaltyTier(start, new Date("2026-01-01")));
});
test("30 day grace expires precisely, not after cancellation", () => {
  assert.equal(isWithinMemberPaymentGrace(start, new Date(start.getTime() - 1)), false);
  assert.equal(isWithinMemberPaymentGrace(start, new Date(start.getTime() + 30 * 86400000 - 1)), true);
  assert.equal(isWithinMemberPaymentGrace(start, new Date(start.getTime() + 30 * 86400000)), false);
});
test("founder needs a paid non-gift purchase before launch", () => {
  assert.equal(isFounderPurchase(founderPayment), true);
  for (const patch of [{ status: "REFUNDED" }, { amount: 0 }, { complimentary: true }, { currency: "usd" }, { paidAt: start }, { paidAt: null }]) {
    assert.equal(isFounderPurchase({ ...founderPayment, ...patch }), false);
  }
});
test("annual-only loyalty, lifelong founder preservation and restart", () => {
  const base = { start, now: start, interval: "annual" as const, continuityBroken: false };
  assert.equal(memberRenewalQuote(base).amountCents, 3900);
  assert.equal(memberRenewalQuote({ ...base, now: billingAnniversary(start, 1) }).amountCents, 2900);
  assert.equal(memberRenewalQuote({ ...base, now: billingAnniversary(start, 2) }).amountCents, 1900);
  assert.equal(memberRenewalQuote({ ...base, founderPayment }).amountCents, 1900);
  assert.equal(memberRenewalQuote({ ...base, founderPayment: { ...founderPayment, amount: 1900 } }).amountCents, 1900);
  assert.equal(memberRenewalQuote({ ...base, founderPayment, continuityBroken: true, now: billingAnniversary(start, 3) }).amountCents, 1900);
  assert.throws(() => memberRenewalQuote({ ...base, interval: "quarterly" }), /annual billing only/);
  assert.throws(() => memberRenewalQuote({ ...base, founderPayment, interval: "quarterly" }), /annual billing only/);
  assert.throws(() => memberRenewalQuote({ ...base, continuityBroken: true, now: new Date("invalid") }));
  assert.throws(() => memberRenewalQuote({ ...base, continuityBroken: true, now: new Date("2026-01-01") }));
});
test("Excellence promotion is permanent and cumulative with loyalty", () => {
  const promoStart = new Date("2027-01-15T12:00:00Z");
  const amounts = [0, 1, 2, 8].map(years => labelRenewalQuote({ start: promoStart, now: billingAnniversary(promoStart, years), offer: "excellence", verifiedPromotionStartedAt: promoStart }).amountCents);
  assert.deepEqual(amounts, [4792, 4392, 3992, 3992]);
  assert.equal(labelRenewalQuote({ start, now: start, offer: "excellence", verifiedPromotionStartedAt: start }).amountCents, 5990);
  assert.equal(labelRenewalQuote({ start, now: start, offer: "essential", verifiedPromotionStartedAt: promoStart }).amountCents, 2490);
});
