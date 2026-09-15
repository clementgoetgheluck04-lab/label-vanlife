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
