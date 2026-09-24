import test from "node:test";
import assert from "node:assert/strict";
import { MEMBER_LOYALTY_TIERS, MEMBER_BILLING_INTERVALS, MEMBER_PAYMENT_GRACE_DAYS, MEMBER_REJOIN_RESETS_LOYALTY, MEMBER_OFFERS_START_ISO } from "../src/config/member-offers.ts";
import { MEMBER_PRICE, MEMBER_AUTO_RENEW } from "../src/config/commercial.ts";
import { MEMBER_FOUNDER_ANNUAL_CENTS, MEMBER_FOUNDER_REQUIRES_CONTINUITY } from "../src/config/member-offers.ts";

test("membership uses annual billing only and a permanent founder rate", () => {
  assert.equal(MEMBER_PRICE, 19);
  assert.equal(MEMBER_AUTO_RENEW, false);
  assert.deepEqual(MEMBER_BILLING_INTERVALS, ["annual"]);
  assert.equal(new Date(MEMBER_OFFERS_START_ISO).toISOString(), "2027-02-01T23:00:00.000Z");
  assert.equal(MEMBER_PAYMENT_GRACE_DAYS, 30);
  assert.equal(MEMBER_REJOIN_RESETS_LOYALTY, true);
  assert.equal(MEMBER_FOUNDER_ANNUAL_CENTS, 1900);
  assert.equal(MEMBER_FOUNDER_REQUIRES_CONTINUITY, false);
  assert.deepEqual(MEMBER_LOYALTY_TIERS.map(tier => tier.annual), [3900, 2900, 1900]);
  for (const tier of MEMBER_LOYALTY_TIERS) {
    assert.ok(!('quarterly' in tier));
    assert.ok(!('monthlyEquivalent' in tier));
  }
});
