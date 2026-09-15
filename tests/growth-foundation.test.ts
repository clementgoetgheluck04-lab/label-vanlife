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

test("redirected legacy marketing and simulated AI code are removed", () => {
  const sitemap = read("../src/app/sitemap.ts");
  const vercelIgnore = read("../.vercelignore");

  assert.equal(existsSync(new URL("../src/app/membre/page.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/components/roadtrip/IaAssistant.tsx", import.meta.url)), false);
  assert.equal(existsSync(new URL("../src/data/mock-roadtrips.ts", import.meta.url)), false);
  assert.doesNotMatch(sitemap, /\$\{baseUrl\}\/membre|\$\{baseUrl\}\/manifeste/);
  assert.doesNotMatch(vercelIgnore, /dignamik/i);
});

test("the member card verification is signed and privacy limited", () => {
  const signer = read("../src/server/member-card-token.ts");
  const verifier = read("../src/app/verifier-carte/page.tsx");
  assert.match(signer, /createHmac\("sha256"/);
  assert.match(signer, /timingSafeEqual/);
  assert.doesNotMatch(verifier, /\.email|\.phone/);
});

test("Vanlife Activity is private by default and never publishes coordinates", () => {
  const api = read("../src/app/api/member/roadtrips/route.ts");
  const labelledPlaces = read("../src/server/labelled-place.ts");
  const publication = read("../src/app/api/member/roadtrips/[id]/publication/route.ts");
  const deletion = read("../src/app/api/member/roadtrips/[id]/route.ts");
  const publicTrip = read("../src/app/trip/[id]/page.tsx");
  assert.match(api, /isPublic:\s*false/);
  assert.match(api, /ensureLabelledPlaces/);
  assert.match(labelledPlaces, /ENRICHED_LIEUX/);
  assert.match(labelledPlaces, /status:\s*"PUBLISHED"/);
  assert.match(publication, /typeof body\.isPublic !== "boolean"/);
  assert.match(publicTrip, /where:\s*\{ id, isPublic: true \}/);
  assert.doesNotMatch(publicTrip, /select:\s*\{[^}]*lat:\s*true|select:\s*\{[^}]*lng:\s*true/);
  assert.match(publicTrip, /Aucune position privée publiée/);
  assert.match(deletion, /deleteMany\(\{ where: \{ id, userId: member\.id \} \}\)/);
});

test("Vanlife Activity measures the complete acquisition loop", () => {
  const provider = read("../src/components/AnalyticsProvider.tsx");
  const share = read("../src/components/roadtrip/ShareTripButton.tsx");
  assert.match(provider, /public_trip_view/);
  assert.match(share, /recap_shared/);
  for (const event of ["activity_created", "recap_generated", "public_trip_place_click", "public_trip_signup"]) {
    assert.equal(isAnalyticsEventName(event), true);
  }
});

test("the professional kit route uses the real secured 2027 kit", () => {
  const legacyProKit = read("../src/app/pro/kit-communication/page.tsx");
  const securedKit = read("../src/app/kit-communication-2027/page.tsx");

  assert.match(legacyProKit, /redirect\("\/kit-communication-2027"\)/);
  assert.doesNotMatch(legacyProKit, /download:\s*"#"|disabled/);
  assert.match(securedKit, /verifyKitAccessToken/);
  assert.match(securedKit, /profile\?\.status === "CERTIFIED" \|\| profile\?\.status === "ACTIVE"/);
});

test("the professional dashboard reports measured place activity", () => {
  const dashboard = read("../src/app/pro/dashboard/page.tsx");
  const publicPlace = read("../src/app/lieux/[id]/page.tsx");
  const memberMap = read("../src/app/member/map/page.tsx");
  const map = read("../src/components/explorer/MapContainer.tsx");

  assert.match(dashboard, /analyticsEvent\.groupBy/);
  assert.match(dashboard, /favorite\.count/);
  assert.match(dashboard, /Données réelles/);
  assert.doesNotMatch(dashboard, /const stats = \{ vues: 0, favoris: 0, clics: 0 \}/);
  for (const surface of [publicPlace, memberMap, map]) {
    assert.match(surface, /data-analytics-event="route_start"/);
    assert.match(surface, /data-analytics-entity-type/);
    assert.match(surface, /data-analytics-entity-id/);
  }
  assert.match(publicPlace, /data-analytics-event=\{memberHasAccess \? "benefit_view"/);
});

test("professionals can only edit their own real public places", () => {
  const page = read("../src/app/pro/fiche/page.tsx");
  const editor = read("../src/app/pro/fiche/ProProfileEditor.tsx");
  const endpoint = read("../src/app/api/pro/profile/route.ts");

  assert.match(page, /managedPlaces/);
  assert.doesNotMatch(page, /createClient|\.from\("establishment_profiles"\)/);
  assert.doesNotMatch(editor, /bientôt|Glisse tes photos ici/);
  assert.match(endpoint, /assertSameOrigin/);
  assert.match(endpoint, /enforceRateLimit/);
  assert.match(endpoint, /getAuthenticatedUser/);
  assert.match(endpoint, /where: \{ id: placeId, ownerId: pro\.id \}/);
  assert.match(endpoint, /\$transaction/);
  assert.match(read("../src/app/lieux/[id]/page.tsx"), /ownerId: \{ not: null \}/);
});

test("member favorites are persisted and removable", () => {
  const endpoint = read("../src/app/api/member/favorites/route.ts");
  const detail = read("../src/app/lieux/[id]/page.tsx");
  const favorites = read("../src/app/member/lieux/page.tsx");

  assert.match(endpoint, /assertSameOrigin/);
  assert.match(endpoint, /requireActiveMember/);
  assert.match(endpoint, /ensureLabelledPlaces/);
  assert.match(endpoint, /createMany\([\s\S]+skipDuplicates: true/);
  assert.match(endpoint, /deleteMany\(\{ where: \{ userId: member\.id, placeId: place\.id \} \}\)/);
  assert.match(endpoint, /name: "favorite_add"/);
  assert.match(detail, /FavoriteButton/);
  assert.match(favorites, /initialFavorite compact/);
});

test("legacy place links resolve to the canonical real place page", () => {
  const legacyPlace = read("../src/app/map/[id]/page.tsx");
  const timeline = read("../src/components/roadtrip/RoadTripTimeline.tsx");

  assert.match(legacyPlace, /redirect\(`\/lieux\/\$\{encodeURIComponent\(id\)\}`\)/);
  assert.doesNotMatch(legacyPlace, /Avis récents|Superbe étape|Alex L\./);
  assert.match(timeline, /href=\{`\/lieux\/\$\{etape\.lieuId\}`\}/);
  assert.doesNotMatch(timeline, /href=\{`\/map\//);
});

test("passport visits require a signed place QR and an active member", () => {
  const endpoint = read("../src/app/api/member/passport/stamp/route.ts");
  const visitPage = read("../src/app/visite/[slug]/page.tsx");
  const kit = read("../src/app/kit-communication-2027/page.tsx");

  assert.match(endpoint, /assertSameOrigin/);
  assert.match(endpoint, /enforceRateLimit/);
  assert.match(endpoint, /requireActiveMember/);
  assert.match(endpoint, /verifyPlaceCheckInToken/);
  assert.match(endpoint, /createMany\([\s\S]+skipDuplicates: true/);
  assert.match(endpoint, /firstConfirmation: inserted\.count === 1/);
  assert.match(visitPage, /Aucune position GPS personnelle n’est collectée ou publiée/);
  assert.match(kit, /createPlaceCheckInToken/);
  assert.match(kit, /Télécharger le QR de visite/);
  assert.equal(isAnalyticsEventName("visit_confirmed"), true);
});

test("passport memories are owner-scoped and feed the private journal", () => {
  const endpoint = read("../src/app/api/member/passport/stamps/[id]/route.ts");
  const passport = read("../src/app/member/passeport/page.tsx");
  const journal = read("../src/app/member/journal/page.tsx");

  assert.match(endpoint, /where: \{ id, userId: member\.id \}/);
  assert.match(endpoint, /comment\.length > 800/);
  assert.match(endpoint, /name: "review_submit"/);
  assert.match(passport, /StampMemoryForm/);
  assert.match(journal, /passportStamps\.filter\(\(stamp\) => Boolean\(stamp\.comment\)\)/);
});
