import test from "node:test";
import assert from "node:assert/strict";
import { assessProspectForLabelVanlife } from "../src/lib/prospection-brain.ts";

test("prospection brain prioritizes documented vanlife-compatible accommodation", () => {
  const result = assessProspectForLabelVanlife({ name: "Camping nature du Vercors", network: "Camping à la ferme", website: "https://example.test", email: "contact@example.test", city: "Die", region: "Drôme" }, "2026-09-24T00:00:00.000Z");
  assert.equal(result.suitableForLabelVanlife, true);
  assert.equal(result.priority, "P1");
  assert.equal(result.nextStep, "AGENT_STANDING");
  assert.equal(result.handlingMode, "AGENT_STANDING");
  assert.equal(result.standingBrief.length, 3);
  assert.match(result.commercialArguments.join(" "), /sans commission/);
});

test("prospection brain keeps ordinary qualified prospects in standard automation", () => {
  const result = assessProspectForLabelVanlife({ name: "Camping nature du lac", website: "https://example.test", email: "contact@example.test", country: "Belgique" });
  assert.equal(result.priority, "P2");
  assert.equal(result.handlingMode, "STANDARD_AUTOMATION");
  assert.equal(result.nextStep, "PREPARER_APPROCHE");
  assert.deepEqual(result.standingBrief, []);
});

test("prospection brain does not invent a fit for an unrelated business", () => {
  const result = assessProspectForLabelVanlife({ name: "Cabinet comptable Martin", website: "https://example.test", email: "contact@example.test" });
  assert.equal(result.suitableForLabelVanlife, false);
  assert.equal(result.priority, "EXCLUDE");
  assert.equal(result.handlingMode, "EXCLUDE");
  assert.equal(result.nextStep, "NE_PAS_CONTACTER");
});

test("prospection brain holds incomplete evidence for verification", () => {
  const result = assessProspectForLabelVanlife({ name: "Camping de la rivière", email: "contact@example.test" });
  assert.equal(result.nextStep, "VERIFIER_ETABLISSEMENT");
  assert.equal(result.suitableForLabelVanlife, false);
});
