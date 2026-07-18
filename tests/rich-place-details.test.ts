import assert from "node:assert/strict";
import test from "node:test";
import { getRichPlaceDetails } from "../src/data/rich-place-details.ts";

test("la fiche enrichie du Camping Le Verger contient toutes les informations validées", () => {
  const details = getRichPlaceDetails("camping-le-verger");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.displayAddress ?? "", /17139 Dompierre-sur-Mer/);
  assert.equal(details.discountInstructions?.length, 2);
  assert.equal(details.vanliferExperience?.length, 4);
  assert.ok(details.venueQuote);
  assert.ok(details.vanSpecifics);
  assert.ok(details.opening);
  assert.ok(details.dining);
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.match(details.reservationUrl ?? "", /^https:\/\//);
  assert.match(details.tourismUrl ?? "", /^https:\/\//);
});
