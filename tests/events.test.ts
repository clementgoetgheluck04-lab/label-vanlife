import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { VANLIFE_EVENTS, EVENT_POSTERS, eventStatus } from "../src/data/events.ts";

test("official posters are local, credited and linked to their original source", () => {
  for (const [id, poster] of Object.entries(EVENT_POSTERS)) {
    assert.ok(VANLIFE_EVENTS.some(event => event.id === id));
    assert.ok(existsSync(`public${poster.src}`));
    assert.equal(new URL(poster.source).protocol, "https:");
    assert.ok(poster.credit && poster.width > 0 && poster.height > 0);
  }
  assert.ok(readFileSync("src/app/evenements/page.tsx", "utf8").includes("object-contain"));
});

test("events have unique IDs, valid dates and secure sources", () => {
  assert.equal(new Set(VANLIFE_EVENTS.map(event => event.id)).size, VANLIFE_EVENTS.length);
  for (const event of VANLIFE_EVENTS) {
    assert.ok(event.start <= event.end);
    assert.ok(Number.isFinite(Date.parse(event.start)));
    assert.equal(new URL(event.url).protocol, "https:");
  }
  assert.equal(VANLIFE_EVENTS.find(event => event.id === "bordeaux-2027")?.provisional, true);
});

test("events remain current through their final day", () => {
  const event = { start: "2026-09-26", end: "2026-10-04" };
  assert.equal(eventStatus(event, "2026-09-25"), "upcoming");
  assert.equal(eventStatus(event, "2026-09-26"), "ongoing");
  assert.equal(eventStatus(event, "2026-10-04"), "ongoing");
  assert.equal(eventStatus(event, "2026-10-05"), "past");
});

test("Mag and events links belong to footer navigation, not the main menu", () => {
  const navbar = readFileSync("src/components/Navbar.tsx", "utf8");
  const footer = readFileSync("src/components/Footer.tsx", "utf8");
  for (const path of ["/blog", "/evenements"]) {
    assert.ok(!navbar.includes(`href: "${path}"`));
    assert.ok(footer.includes(`href: "${path}"`));
  }
});
