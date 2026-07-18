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

test("la fiche enrichie du Clos de la Lère contient la réduction et les services saisonniers", () => {
  const details = getRichPlaceDetails("camping-le-clos-de-la-lere");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.discountInstructions?.length, 2);
  assert.equal(details.openingMonths?.length, 9);
  assert.equal(details.activities?.length, 9);
  assert.equal(details.bookingMethods?.length, 4);
  assert.match(details.facebookUrl ?? "", /^https:\/\/www\.facebook\.com\//);
  assert.ok(details.swimming?.includes("juin à septembre"));
  assert.ok(details.dining?.includes("Snack"));
});

test("la fiche enrichie du Camping de l'Aix contient le gérant et les informations van", () => {
  const details = getRichPlaceDetails("camping-de-laix");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.match(details.contactName ?? "", /Olivier Bakanyi/);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 5);
  assert.deepEqual(details.bookingMethods, ["Par email", "Par téléphone", "Sur place"]);
  assert.ok(details.vanSpecifics?.includes("120 m²"));
  assert.ok(details.swimming?.includes("240 m²"));
  assert.ok(details.otherInfo?.[0].includes("animaux non acceptés"));
});

test("la fiche enrichie des Drouilhèdes contient la rivière et les labels environnementaux", () => {
  const details = getRichPlaceDetails("camping-les-drouihedes");
  assert.ok(details);
  assert.equal(details.labelYear, 2026);
  assert.equal(details.openingMonths?.length, 6);
  assert.equal(details.activities?.length, 7);
  assert.deepEqual(details.bookingMethods, ["En ligne", "Par email", "Par téléphone"]);
  assert.ok(details.vanSpecifics?.includes("plage privée"));
  assert.ok(details.swimming?.includes("La Cèze"));
  assert.ok(details.otherInfo?.[0].includes("Refuge LPO"));
});
