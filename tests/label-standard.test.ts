import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { LABELLISATION_CRITERIA } from "../src/config/labellisation-criteria.ts";
import {
  LABEL_ELIGIBILITY_REQUIREMENTS,
  LABEL_REVIEW_CONTROLS,
  LABEL_STANDARD_VERSION,
  LABEL_VERIFICATION_LEVELS,
} from "../src/config/label-standard.ts";

function source(path: string): string {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("the 2027 public standard is complete, versioned and unambiguous", () => {
  assert.match(LABEL_STANDARD_VERSION, /^2027\.\d+$/);
  assert.equal(LABELLISATION_CRITERIA.length, 22);
  assert.equal(new Set(LABELLISATION_CRITERIA.map((criterion) => criterion.id)).size, 22);
  assert.equal(new Set(LABELLISATION_CRITERIA.map((criterion) => criterion.category)).size, 5);
  assert.equal(LABEL_ELIGIBILITY_REQUIREMENTS.length, 6);
  assert.equal(LABEL_REVIEW_CONTROLS.length, 6);
  assert.equal(LABEL_VERIFICATION_LEVELS.length, 3);

  const page = source("../src/app/referentiel-label-vanlife/page.tsx");
  assert.match(page, /label privé indépendant/);
  assert.match(page, /Le paiement ne vaut jamais acceptation/);
  assert.match(page, /LABELLISATION_CRITERIA/);
});

test("a label cannot be granted without traced controls and evidence access", () => {
  const api = source("../src/app/api/admin/labellisations/route.ts");
  const admin = source("../src/app/admin/labellisations/page.tsx");
  const validation = source("../src/server/validation.ts");

  assert.match(api, /LABEL_REVIEW_CONTROLS\.every/);
  assert.match(api, /createSignedUrls\(attachmentPaths/);
  assert.match(api, /standardVersion: LABEL_STANDARD_VERSION/);
  assert.match(api, /reviewNote/);
  assert.match(admin, /six contrôles tracés/);
  assert.match(validation, /input\.operatingAuthorization !== true/);
});
