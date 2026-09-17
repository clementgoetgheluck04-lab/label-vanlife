import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = new URL("..", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function sourceFiles(path: string): string[] {
  const directory = new URL(path, root);
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(fileURLToPath(directory), entry.name);
    return entry.isDirectory() ? sourceFiles(`${path}/${entry.name}`) : [full];
  });
}

test("SEO essentials, social preview, favicon, sitemap and robots are present", () => {
  const layout = read("src/app/layout.tsx");
  const sitemap = read("src/app/sitemap.ts");
  const robots = read("src/app/robots.ts");
  assert.match(layout, /title:\s*\{/);
  assert.match(layout, /description:/);
  assert.match(layout, /openGraph:/);
  assert.match(layout, /twitter:/);
  assert.match(layout, /BRAND_ASSETS\.socialCover/);
  assert.match(layout, /BRAND_ASSETS\.favicon/);
  assert.match(sitemap, /conditions-generales-utilisation/);
  assert.match(sitemap, /top-10-lieux-vanlife-bretagne/);
  assert.match(robots, /sitemap: "https:\/\/www\.labelvanlife\.fr\/sitemap\.xml"/);
  assert.doesNotMatch(read("next.config.ts"), /fonts\.googleapis|fonts\.gstatic/);
  assert.doesNotMatch(layout, /google-site-verification":\s*""/);
});

test("privacy, legal notices and terms are reachable from the footer", () => {
  const footer = read("src/components/Footer.tsx");
  for (const path of ["mentions-legales", "politique-confidentialite", "conditions-generales-utilisation"]) {
    assert.equal(existsSync(new URL(`src/app/${path}/page.tsx`, root)), true);
    assert.match(footer, new RegExp(`/${path}`));
  }
  assert.match(footer, /Gérer mes cookies/);
});

test("optional analytics waits for consent and refusal clears its identifiers", () => {
  const analytics = read("src/lib/analytics/browser.ts");
  const consent = read("src/components/CookieConsent.tsx");
  assert.match(analytics, /readAnalyticsConsent\(\) !== "accepted"/);
  assert.match(consent, /Tout refuser/);
  assert.match(consent, /Accepter les statistiques/);
  assert.match(consent, /localStorage\.removeItem/);
  assert.match(consent, /sessionStorage\.removeItem/);
});

test("secret server variables are never referenced by client modules", () => {
  const forbidden = /DATABASE_URL|SUPABASE_SERVICE_ROLE_KEY|STRIPE_SECRET_KEY|STRIPE_WEBHOOK_SECRET|RESEND_API_KEY|CRON_SECRET/;
  for (const file of sourceFiles("src")) {
    if (![".ts", ".tsx"].includes(extname(file))) continue;
    const source = readFileSync(file, "utf8");
    if (source.startsWith('"use client"') || source.startsWith("'use client'")) {
      assert.doesNotMatch(source, forbidden, file);
    }
  }
});

test("every Next image has an alternative or an explicit decorative alternative", () => {
  for (const file of sourceFiles("src")) {
    if (extname(file) !== ".tsx") continue;
    const source = readFileSync(file, "utf8");
    for (const image of source.match(/<Image\b[\s\S]*?\/>/g) || []) {
      assert.match(image, /\balt=/, file);
    }
  }
});

test("high-impact raster images have substantially smaller WebP versions", () => {
  for (const [original, optimized] of [
    ["public/images/hero-label-vanlife.png", "public/images/hero-label-vanlife.webp"],
    ["public/images/home/camping-vanlife.png", "public/images/home/camping-vanlife.webp"],
    ["public/images/people/helene-family-vanlifers.png", "public/images/people/helene-family-vanlifers.webp"],
  ]) {
    assert.ok(statSync(new URL(optimized, root)).size < statSync(new URL(original, root)).size * 0.25, optimized);
  }
});

test("known internal broken links and the missing RSS reference are removed", () => {
  const sources = sourceFiles("src").filter((file) => [".ts", ".tsx"].includes(extname(file))).map((file) => readFileSync(file, "utf8")).join("\n");
  assert.doesNotMatch(sources, /href=["']\/conseil-camping/);
  assert.doesNotMatch(sources, /\/blog\/feed\.xml/);
});

test("the home hero explains the inclusive vanlife philosophy and links to its indexed page", () => {
  const home = read("src/app/page.tsx");
  const philosophy = read("src/app/philosophie-vanlife/page.tsx");
  const sitemap = read("src/app/sitemap.ts");
  assert.match(home, /href="\/philosophie-vanlife"/);
  assert.match(home, /Philosophie vanlife/);
  assert.match(home, /Van, fourgon, tente de toit, caravane ou camping-car/);
  assert.match(philosophy, /La vanlife n’est pas un véhicule/);
  assert.match(philosophy, /Van rétro/);
  assert.match(philosophy, /Consommer local/);
  assert.match(sitemap, /\/philosophie-vanlife/);
});

test("public labelled place pages survive a database outage", () => {
  const page = read("src/app/lieux/[id]/page.tsx");
  assert.match(page, /export async function generateMetadata/);
  assert.match(page, /alternates: \{ canonical: `\/lieux\/\$\{lieu\.id\}` \}/);
  assert.match(page, /using the verified catalogue fallback/);
  assert.match(page, /rendering the public place view/);
  assert.match(page, /return null;/);
  assert.match(page, /const lieu = storedPlace \?/);
});

test("public write forms keep validation, origin checks, rate limits and honeypots", () => {
  for (const route of [
    "src/app/api/newsletter/route.ts",
    "src/app/api/place-recommendations/route.ts",
    "src/app/api/labellisation/submit-draft/route.ts",
  ]) {
    const source = read(route);
    assert.match(source, /assertSameOrigin\(request\)/, route);
    assert.match(source, /enforceRateLimit\(request/, route);
    assert.match(source, /companyWebsite/, route);
  }
});
