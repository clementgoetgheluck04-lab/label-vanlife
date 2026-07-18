import assert from "node:assert/strict";
import test from "node:test";
import {
  getVerifiedPlaceGps,
  VERIFIED_PLACE_GPS_COUNT,
  VERIFIED_PLACE_GPS_IDS,
} from "../src/data/verified-place-gps.ts";
import {
  getVerifiedSpottedGps,
  VERIFIED_SPOTTED_GPS_COUNT,
  VERIFIED_SPOTTED_GPS_IDS,
} from "../src/data/verified-spotted-gps.ts";

function assertValidGpsPoint(point: { address: string; lat: number; lng: number; verifiedAt: string }) {
  assert.ok(point.address.length >= 8, "l'adresse doit être complète");
  assert.ok(Number.isFinite(point.lat) && point.lat >= 41 && point.lat <= 52, "latitude française invalide");
  assert.ok(Number.isFinite(point.lng) && point.lng >= -6 && point.lng <= 10, "longitude française invalide");
  assert.equal(point.verifiedAt, "2026-07-18");
}

test("les 26 lieux labellisés ont un point GPS établissement vérifié", () => {
  assert.equal(VERIFIED_PLACE_GPS_COUNT, 26);
  assert.equal(VERIFIED_PLACE_GPS_IDS.length, 26);
  for (const id of VERIFIED_PLACE_GPS_IDS) {
    const point = getVerifiedPlaceGps(id);
    assert.ok(point, `point GPS absent pour ${id}`);
    assertValidGpsPoint(point);
    assert.match(point.googleMapsUrl, /^https:\/\/maps\.app\.goo\.gl\//);
  }
});

test("les 39 campings Papa'rtenaires ont un point GPS vérifié et sourcé", () => {
  assert.equal(VERIFIED_SPOTTED_GPS_COUNT, 39);
  assert.equal(VERIFIED_SPOTTED_GPS_IDS.length, 39);
  for (const id of VERIFIED_SPOTTED_GPS_IDS) {
    const point = getVerifiedSpottedGps(id);
    assert.ok(point, `point GPS absent pour ${id}`);
    assertValidGpsPoint(point);
    assert.ok(point.source.length >= 8, `source GPS absente pour ${id}`);
  }
});

test("les corrections critiques ne retombent pas sur les centres-villes historiques", () => {
  assert.deepEqual(
    getVerifiedPlaceGps("camping-de-pont-augan") && {
      lat: getVerifiedPlaceGps("camping-de-pont-augan")?.lat,
      lng: getVerifiedPlaceGps("camping-de-pont-augan")?.lng,
    },
    { lat: 47.8827125, lng: -3.1070201 },
  );
  assert.deepEqual(
    getVerifiedPlaceGps("camping-le-moulin-du-bel-air") && {
      lat: getVerifiedPlaceGps("camping-le-moulin-du-bel-air")?.lat,
      lng: getVerifiedPlaceGps("camping-le-moulin-du-bel-air")?.lng,
    },
    { lat: 44.6493368, lng: 1.4350603 },
  );
  assert.equal(getVerifiedSpottedGps("papa-rtenaires-camping-le-valenty")?.lat, 44.488985126901675);
});
