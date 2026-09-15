import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { isSafeRedirectPath } from "../src/lib/urls.ts";
import { serializeJsonLd } from "../src/lib/seo/json-ld.ts";

test("redirects stay on the application origin", () => {
  assert.equal(isSafeRedirectPath("/member"), true);
  assert.equal(isSafeRedirectPath("/member?tab=carte"), true);
  assert.equal(isSafeRedirectPath("//attacker.example/path"), false);
  assert.equal(isSafeRedirectPath("/\\attacker.example/path"), false);
  assert.equal(isSafeRedirectPath("/%2fattacker.example/path"), false);
  assert.equal(isSafeRedirectPath("https://attacker.example"), false);
  assert.equal(isSafeRedirectPath("javascript:alert(1)"), false);
});

test("JSON-LD serialization cannot terminate its script element", () => {
  const serialized = serializeJsonLd({ value: "</script><script>alert(1)</script>&" });
  assert.equal(serialized.includes("</script>"), false);
  assert.match(serialized, /\\u003c\/script\\u003e/);
  assert.match(serialized, /\\u0026/);
});

test("the service worker never precaches private account pages", () => {
  const worker = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
  const precache = worker.slice(worker.indexOf("const PRECACHE_URLS"), worker.indexOf("const PUBLIC_DOCUMENTS"));
  assert.equal(precache.includes('"/compte"'), false);
  assert.match(worker, /PRIVATE_PREFIXES[^\n]+"\/api"[^\n]+"\/auth"[^\n]+"\/member"[^\n]+"\/admin"[^\n]+"\/pro"/);
  assert.match(worker, /private\|no-store\|no-cache/);
});

test("the former public admin grant endpoint is removed", () => {
  assert.equal(existsSync(new URL("../src/app/api/admin/members/grant/route.ts", import.meta.url)), false);
});

test("the founder role migration targets one exact account and fails closed", () => {
  const migration = readFileSync(
    new URL("../prisma/migrations/20260915000300_founder_admin_role/migration.sql", import.meta.url),
    "utf8",
  );

  assert.match(migration, /lower\("email"\) = lower\('clement\.goetgheluck@hotmail\.fr'\)/);
  assert.match(migration, /matched_count <> 1/);
  assert.match(migration, /RAISE EXCEPTION/);
  assert.match(migration, /SET "role" = 'ADMIN'/);
});

test("member-only place data is enforced server-side", () => {
  const memberLayout = readFileSync(new URL("../src/app/member/layout.tsx", import.meta.url), "utf8");
  const memberNetwork = readFileSync(new URL("../src/app/api/member/camping-network/route.ts", import.meta.url), "utf8");
  const explorer = readFileSync(new URL("../src/app/explorer/page.tsx", import.meta.url), "utf8");
  const spottedPage = readFileSync(new URL("../src/app/lieux-reperes/[id]/page.tsx", import.meta.url), "utf8");
  const roadTripButton = readFileSync(new URL("../src/components/roadtrip/AddToRoadTripButton.tsx", import.meta.url), "utf8");

  assert.match(memberLayout, /requireActiveMember\(\)/);
  assert.match(memberNetwork, /hasActiveMemberAccess\(\)/);
  assert.match(memberNetwork, /status: 403/);
  assert.doesNotMatch(explorer, /@\/data\/(?:enriched-lieux|spotted-places)/);
  assert.match(spottedPage, /memberHasAccess && <MemberRoadTripPanel/);
  assert.doesNotMatch(spottedPage, /member=1|member-query/);
  assert.doesNotMatch(roadTripButton, /member-query/);
});

test("the navigation reflects an authenticated session and hides the purchase CTA", () => {
  const navbar = readFileSync(new URL("../src/components/Navbar.tsx", import.meta.url), "utf8");
  assert.match(navbar, /\/api\/auth\/status/);
  assert.match(navbar, /Vous êtes connecté/);
  assert.match(navbar, /authenticated === true/);
  assert.match(navbar, /authenticated === false/);
});
