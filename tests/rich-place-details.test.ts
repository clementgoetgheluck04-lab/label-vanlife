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

test("la fiche enrichie de La Porte d'Autan contient l'offre et les informations de séjour", () => {
  const details = getRichPlaceDetails("eco-camping-la-porte-dautan");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.promoCode, "labelvanlife");
  assert.equal(details.discountInstructions?.length, 3);
  assert.equal(details.openingMonths?.length, 7);
  assert.equal(details.activities?.length, 8);
  assert.deepEqual(details.bookingMethods, ["En ligne", "Par email", "Par téléphone"]);
  assert.ok(details.venueQuote);
  assert.ok(details.otherInfo?.[0].includes("Éco-camping engagé"));
});
