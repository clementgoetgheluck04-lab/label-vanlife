import assert from "node:assert/strict";
import test from "node:test";
import { MAG_ROUTES } from "../src/data/mag-itineraries.ts";
import { getRouteDetails } from "../src/data/mag-route-details.ts";
import { ROUTE_VISITS } from "../src/data/mag-route-visits.ts";
import { googleMapsRoute, wazeDestination } from "../src/lib/mag-navigation.ts";

test("all twenty routes have three substantial, separately navigable step descriptions", () => {
  assert.equal(MAG_ROUTES.length, 20);
  for (const route of MAG_ROUTES) {
    const details = getRouteDetails(route.slug);
    const visit = ROUTE_VISITS[route.slug];
    assert.ok(visit && visit.step >= 0 && visit.step < details.length, route.slug);
    assert.equal(new URL(visit.source).protocol, "https:");
    assert.equal(details.length, route.steps.length, route.slug);
    for (const day of details) {
      assert.ok(day.destination.endsWith("France"));
      assert.ok(day.morning.length > 120 && day.afternoon.length > 120, route.slug);
      assert.ok(day.pause.length > 50 && day.alternative.length > 50, route.slug);
    }
    const maps = new URL(googleMapsRoute(details.map(day => day.destination)));
    assert.equal(maps.hostname, "www.google.com");
    assert.equal(maps.searchParams.get("api"), "1");
    assert.equal(maps.searchParams.get("origin"), details[0].destination);
    assert.equal(maps.searchParams.get("waypoints"), details[1].destination);
    assert.equal(maps.searchParams.get("destination"), details[2].destination);
    assert.ok(maps.href.length < 2048);
  }
});

test("individual navigation retains accents and omits a fabricated starting position", () => {
  const destination = "L’Île-Rousse, Haute-Corse, France";
  const maps = new URL(googleMapsRoute([destination]));
  assert.equal(maps.searchParams.get("destination"), destination);
  assert.equal(maps.searchParams.has("origin"), false);
  assert.equal(maps.searchParams.has("waypoints"), false);
  const waze = new URL(wazeDestination(destination));
  assert.equal(waze.hostname, "www.waze.com");
  assert.equal(waze.searchParams.get("q"), destination);
  assert.equal(waze.searchParams.has("ll"), false);
  assert.throws(() => googleMapsRoute([]));
  assert.throws(() => googleMapsRoute(Array(6).fill("Paris")));
  assert.throws(() => wazeDestination(" "));
});
