import assert from "node:assert/strict";
import test from "node:test";
import { MAG_ROUTES } from "../src/data/mag-itineraries.ts";
import { MAG_LOCAL_STORIES } from "../src/data/mag-local-stories.ts";

test("every itinerary has its own substantial, sourced local story", () => {
  assert.deepEqual(Object.keys(MAG_LOCAL_STORIES).sort(), MAG_ROUTES.map(route => route.slug).sort());
  for (const route of MAG_ROUTES) {
    const story = MAG_LOCAL_STORIES[route.slug];
    assert.ok(story.title.length > 10, route.slug);
    assert.ok(story.text.length > 180, route.slug);
    assert.ok(story.sourceLabel.length > 5, route.slug);
    assert.equal(new URL(story.source).protocol, "https:");
  }
  assert.equal(new Set(Object.values(MAG_LOCAL_STORIES).map(story => story.text)).size, 20);
});

test("Corsican legends are explicitly distinguished from historical facts", () => {
  for (const slug of ["corse-porto-piana", "corse-bonifacio-sud"]) {
    assert.equal(MAG_LOCAL_STORIES[slug].kind, "Légende locale");
  }
});
