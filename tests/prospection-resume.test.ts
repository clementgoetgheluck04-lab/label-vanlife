import test from "node:test";
import assert from "node:assert/strict";
import { canResumeProspect } from "../src/lib/prospection-resume.ts";

test("restart allows only paused or failed prospects without suppression", () => {
  for (const status of ["PAUSED", "ERROR"]) {
    assert.equal(canResumeProspect(status, false), true);
    assert.equal(canResumeProspect(status, true), false);
  }
});

test("restart never reactivates exclusions, completed journeys or in-flight messages", () => {
  for (const status of ["NOT_INTERESTED", "UNSUBSCRIBED", "INVALID", "CONVERTED", "QUALIFIED", "SENDING", "NEW", "CONTACTED", "INTERESTED", "NEEDS_HUMAN", "UNKNOWN"]) {
    assert.equal(canResumeProspect(status, false), false, status);
    assert.equal(canResumeProspect(status, true), false, status);
  }
});
