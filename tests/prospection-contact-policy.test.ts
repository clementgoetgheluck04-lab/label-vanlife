import test from "node:test";
import assert from "node:assert/strict";
import { canReplaceProspectAddress } from "../src/lib/prospection-contact-policy.ts";

test("address replacement cannot circumvent an opposition or an in-flight send", () => {
  for (const status of ["NOT_INTERESTED", "UNSUBSCRIBED", "CONVERTED", "QUALIFIED", "SENDING", "NEEDS_HUMAN"]) {
    assert.equal(canReplaceProspectAddress(status), false);
  }
  for (const reason of ["complaint", "unsubscribe", "manual", "refusal"]) {
    assert.equal(canReplaceProspectAddress("NEW", reason), false);
    assert.equal(canReplaceProspectAddress("INVALID", reason), false);
  }
});

test("only an invalid address may be replaced after a bounce", () => {
  assert.equal(canReplaceProspectAddress("INVALID", "bounce"), true);
  assert.equal(canReplaceProspectAddress("NEW", "bounce"), false);
  assert.equal(canReplaceProspectAddress("NEW"), true);
});
