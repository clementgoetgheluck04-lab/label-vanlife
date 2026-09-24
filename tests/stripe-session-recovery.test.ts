import test from "node:test";
import assert from "node:assert/strict";
import { retrievePreviousCheckout } from "../src/lib/stripe-session-recovery.ts";

const missing = { type: "StripeInvalidRequestError", code: "resource_missing", statusCode: 404 };
test("a missing test checkout can be replaced with a live checkout", async () => {
  for (const key of ["sk_live_placeholder", "rk_live_placeholder"]) {
    assert.equal(await retrievePreviousCheckout("cs_test_previous", key, async () => { throw missing; }), null);
  }
});
test("existing sessions are retained", async () => {
  const session = { status: "open", url: "https://checkout.stripe.com/example" };
  assert.equal(await retrievePreviousCheckout("cs_live_existing", "sk_live_placeholder", async () => session), session);
});
test("never hide live-session errors, authentication failures or network errors", async () => {
  for (const [id, key, error] of [
    ["cs_live_existing", "sk_live_placeholder", missing],
    ["cs_test_previous", "sk_test_placeholder", missing],
    ["cs_test_previous", "", missing],
    ["cs_test_previous", "sk_live_placeholder", { type: "StripeAuthenticationError", statusCode: 401 }],
    ["cs_test_previous", "sk_live_placeholder", new Error("Network error")],
  ] as const) {
    await assert.rejects(retrievePreviousCheckout(id, key, async () => { throw error; }), (caught) => caught === error);
  }
});
