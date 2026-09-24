import test from "node:test";
import assert from "node:assert/strict";
import { optionalStorage } from "../src/lib/optional-storage.ts";

test("optional storage returns successful reads and writes", () => {
  assert.equal(optionalStorage(() => "draft"), "draft");
  assert.equal(optionalStorage(() => true), true);
});

test("blocked access, quota exhaustion and malformed JSON do not interrupt a form", () => {
  for (const name of ["SecurityError", "QuotaExceededError"]) {
    assert.equal(optionalStorage(() => { throw new DOMException("Unavailable", name); }), undefined);
  }
  assert.equal(optionalStorage(() => JSON.parse("invalid")), undefined);
});
