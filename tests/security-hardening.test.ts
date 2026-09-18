import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { isSafeRedirectPath } from "../src/lib/urls.ts";
import { serializeJsonLd } from "../src/lib/seo/json-ld.ts";
import {
  createMemberSessionToken,
  getMemberSessionCookieOptions,
  getMemberSessionState,
  MEMBER_IDLE_TIMEOUT_MS,
  MEMBER_SESSION_POLICY_VALUE,
} from "../src/lib/member-session.ts";

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

test("admin access uses a distinct role-gated login instead of falling back to a member space", () => {
  const auth = readFileSync(new URL("../src/server/auth.ts", import.meta.url), "utf8");
  const adminLayout = readFileSync(new URL("../src/app/admin/layout.tsx", import.meta.url), "utf8");
  const adminLogin = readFileSync(new URL("../src/app/api/auth/admin-login/route.ts", import.meta.url), "utf8");
  const proxy = readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf8");

  assert.match(auth, /requireAdminPage/);
  assert.match(auth, /redirect\("\/admin-login\?error=forbidden"\)/);
  assert.match(adminLayout, /requireAdminPage\(\)/);
  assert.match(adminLogin, /role: "ADMIN"/);
  assert.match(adminLogin, /shouldCreateUser: false/);
  assert.match(adminLogin, /enforceRateLimit\(request, "admin-login"/);
  assert.match(adminLogin, /signOut\(\{ scope: "local" \}\)/);
  assert.match(proxy, /"\/admin-login"/);
  assert.match(proxy, /pathname === "\/admin" \|\| pathname\.startsWith\("\/admin\/"\)/);
});

test("only an administrator sees the dashboard entry inside the member space", () => {
  const member = readFileSync(new URL("../src/app/member/page.tsx", import.meta.url), "utf8");
  const adminLayout = readFileSync(new URL("../src/app/admin/layout.tsx", import.meta.url), "utf8");
  assert.match(member, /!member\.preview && member\.role === "ADMIN"/);
  assert.match(member, /href="\/admin"/);
  assert.match(member, /Dashboard administrateur/);
  assert.match(adminLayout, /requireAdminPage/);
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
  const status = readFileSync(new URL("../src/app/api/auth/status/route.ts", import.meta.url), "utf8");
  assert.match(navbar, /\/api\/auth\/status/);
  assert.match(navbar, /Vous êtes connecté/);
  assert.match(navbar, /href="\/member"[^>]+aria-label="Vous êtes connecté — ouvrir mon espace membre"/);
  assert.match(navbar, /<a href="\/member"[^>]+aria-label="Vous êtes connecté — ouvrir mon espace membre"/);
  assert.doesNotMatch(navbar, /<Link href="\/member"[^>]+aria-label="Vous êtes connecté — ouvrir mon espace membre"/);
  assert.doesNotMatch(navbar, /<Link href="\/member"><Button/);
  assert.match(navbar, /status\.memberActive/);
  assert.match(navbar, /Se déconnecter/);
  assert.match(navbar, /authenticated === true/);
  assert.match(navbar, /authenticated === false/);
  assert.match(status, /getMemberSessionState/);
  assert.match(status, /supabase\.auth\.signOut/);
});

test("member sessions are optional, revocable and expire after ten inactive days", () => {
  const login = readFileSync(new URL("../src/app/member-login/LoginContent.tsx", import.meta.url), "utf8");
  const verify = readFileSync(new URL("../src/app/api/auth/verify-member-code/route.ts", import.meta.url), "utf8");
  const confirm = readFileSync(new URL("../src/app/auth/confirm/route.ts", import.meta.url), "utf8");
  const auth = readFileSync(new URL("../src/server/auth.ts", import.meta.url), "utf8");
  const proxy = readFileSync(new URL("../src/proxy.ts", import.meta.url), "utf8");
  const logout = readFileSync(new URL("../src/app/auth/logout/route.ts", import.meta.url), "utf8");

  assert.match(login, /Rester connecté sur cet appareil/);
  assert.match(login, /rememberMe/);
  assert.match(verify, /remember=\$\{rememberMe \? "1" : "0"\}/);
  assert.match(confirm, /rememberMe \? options : sessionOptions/);
  assert.match(confirm, /createMemberSessionToken/);
  assert.match(auth, /getMemberSessionState/);
  assert.match(auth, /\/auth\/session-expired/);
  assert.match(proxy, /createMemberSessionToken/);
  assert.match(logout, /MEMBER_SESSION_COOKIE/);

  const now = Date.UTC(2026, 8, 16);
  const secret = "member-session-test-secret-that-is-long-enough";
  const token = createMemberSessionToken("member-1", true, now, secret);
  const active = getMemberSessionState(
    token,
    MEMBER_SESSION_POLICY_VALUE,
    "member-1",
    now + MEMBER_IDLE_TIMEOUT_MS - 1,
    secret,
  );
  assert.equal(active.kind, "active");
  assert.equal(active.kind === "active" && active.payload.rememberMe, true);
  assert.equal(
    getMemberSessionState(token, MEMBER_SESSION_POLICY_VALUE, "member-1", now + MEMBER_IDLE_TIMEOUT_MS, secret).kind,
    "expired",
  );
  assert.equal(getMemberSessionState(token, MEMBER_SESSION_POLICY_VALUE, "another-member", now, secret).kind, "expired");
  assert.equal(getMemberSessionState(undefined, undefined, "member-1", now, secret).kind, "legacy");
  assert.equal("maxAge" in getMemberSessionCookieOptions(false), false);
  assert.equal("maxAge" in getMemberSessionCookieOptions(true), true);
});

test("the downloadable member card replaces the personal QR without exposing contact data publicly", () => {
  const page = readFileSync(new URL("../src/app/member/carte/page.tsx", import.meta.url), "utf8");
  const interactiveCard = readFileSync(new URL("../src/app/member/carte/MemberCardInteractive.tsx", import.meta.url), "utf8");
  const profileEndpoint = readFileSync(new URL("../src/app/api/member/profile/route.ts", import.meta.url), "utf8");
  const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");

  assert.doesNotMatch(page, /QRCode|createMemberCardToken|verifier-carte/);
  assert.match(page, /MemberCardInteractive/);
  assert.match(interactiveCard, /Télécharger ma carte membre/);
  assert.match(interactiveCard, /props\.people/);
  assert.match(interactiveCard, /props\.email/);
  assert.match(interactiveCard, /props\.phone/);
  assert.match(interactiveCard, /props\.address/);
  assert.match(profileEndpoint, /requireActiveMember/);
  assert.match(profileEndpoint, /assertSameOrigin/);
  assert.match(profileEndpoint, /enforceRateLimit/);
  assert.match(schema, /addressLine1 String\?/);
  assert.match(schema, /postalCode\s+String\?/);
});
