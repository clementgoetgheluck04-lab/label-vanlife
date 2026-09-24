import test from "node:test";
import assert from "node:assert/strict";
import { labelEditionSummary } from "../src/lib/label-edition.ts";

test("2026 alone is not presented as a confirmed 2027 label", () => {
  const edition = labelEditionSummary([2026]);
  assert.equal(edition.title, "Lieu labellisé 2026");
  assert.equal(edition.renewalPending, true);
  assert.match(edition.message, /pas garantis/);
});
test("confirmed renewals and unknown years never get the renewal appeal", () => {
  for (const years of [[2026, 2027], [2027], []]) {
    assert.equal(labelEditionSummary(years).renewalPending, false);
  }
  assert.equal(labelEditionSummary([]).title, "Millésime du label à vérifier");
});
