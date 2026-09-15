import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

import { isAnalyticsEventName } from "../src/lib/analytics/events.ts";

const read = (path: string) => readFileSync(new URL(path, import.meta.url), "utf8");

test("product analytics uses an explicit event allow-list", () => {
  assert.equal(isAnalyticsEventName("membership_purchase"), true);
  assert.equal(isAnalyticsEventName("label_purchase"), true);
  assert.equal(isAnalyticsEventName("place_recommend"), true);
  assert.equal(isAnalyticsEventName("arbitrary_personal_data"), false);
});

test("CRM, recommendations and analytics are server-only at database level", () => {
  const migration = read("../prisma/migrations/20260915000100_secure_prospection_and_analytics/migration.sql");
  for (const table of ["prospects", "prospect_messages", "prospect_suppressions", "analytics_events", "place_recommendations"]) {
    assert.match(migration, new RegExp(`ALTER TABLE \\\"${table}\\\" ENABLE ROW LEVEL SECURITY`, "i"));
  }
  assert.match(migration, /REVOKE ALL ON TABLE[\s\S]+FROM anon, authenticated/i);
});

test("member production pages no longer import demonstration profiles", () => {
  const pages = [
    "../src/app/member/page.tsx",
    "../src/app/member/lieux/page.tsx",
    "../src/app/member/badges/page.tsx",
    "../src/app/member/passeport/page.tsx",
    "../src/app/member/journal/page.tsx",
    "../src/app/member/notifications/page.tsx",
    "../src/app/member/roadtrips/page.tsx",
  ];
  for (const page of pages) {
    assert.doesNotMatch(read(page), /MOCK_|mock-membres|mock-roadtrips|mock-notifications/);
  }
});

test("the fake marketplace and backup page are not routable", () => {
  assert.equal(existsSync(new URL("../src/app/marketplace/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/app/_conseil-camping-backup/page.tsx", import.meta.url)), false);
  assert.match(read("../next.config.ts"), /source:\s*["']\/marketplace["'][\s\S]+destination:\s*["']\/ecosysteme["']/);
});

test("the member card verification is signed and privacy limited", () => {
  const signer = read("../src/server/member-card-token.ts");
  const verifier = read("../src/app/verifier-carte/page.tsx");
  assert.match(signer, /createHmac\("sha256"/);
  assert.match(signer, /timingSafeEqual/);
  assert.doesNotMatch(verifier, /\.email|\.phone/);
});
