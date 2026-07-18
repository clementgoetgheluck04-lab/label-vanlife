import assert from "node:assert/strict";
import test from "node:test";
import {
  getLabelledSourceIds,
  isSpottedDuplicateOfLabelled,
  LABELLED_DUPLICATE_COUNT,
} from "../src/data/place-deduplication.ts";

test("les doublons repérés sont rattachés à leur fiche labellisée canonique", () => {
  assert.equal(LABELLED_DUPLICATE_COUNT, 4);
  assert.deepEqual(getLabelledSourceIds("camping-de-gracay"), ["papa-rtenaires-camping-de-gracay"]);
  assert.deepEqual(getLabelledSourceIds("camping-la-communnion"), ["bienvenue-ferme-ferme-la-communion"]);
  assert.equal(isSpottedDuplicateOfLabelled("papa-rtenaires-camping-la-plage"), true);
  assert.equal(isSpottedDuplicateOfLabelled("papa-rtenaires-camping-le-moulin-du-bel-air"), true);
  assert.equal(isSpottedDuplicateOfLabelled("papa-rtenaires-camping-le-valenty"), false);
});
