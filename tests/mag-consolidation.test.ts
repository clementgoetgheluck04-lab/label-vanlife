import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { MAG_EXTENSIONS } from "../src/data/mag-extensions.ts";
import { MAG_ROUTES } from "../src/data/mag-itineraries.ts";

test("retired road-trip pages redirect directly to Mag and leave its sitemap", () => {
  for (const path of ["src/app/road-trips/page.tsx", "src/app/blog/road-trips/page.tsx"]) {
    assert.match(readFileSync(path, "utf8"), /permanentRedirect\("\/blog#itineraires"\)/);
  }
  for (const path of ["src/app/sitemap.ts", "src/app/blog/page.tsx"]) {
    assert.ok(!readFileSync(path, "utf8").includes("/blog/road-trips"));
  }
});

test("all six former regional ideas are integrated into existing Mag itineraries", () => {
  assert.equal(Object.keys(MAG_EXTENSIONS).length, 6);
  for (const [slug, extension] of Object.entries(MAG_EXTENSIONS)) {
    assert.ok(MAG_ROUTES.some(route => route.slug === slug), slug);
    assert.ok(extension.text.length > 200);
  }
  const page = readFileSync("src/app/blog/[slug]/page.tsx", "utf8");
  assert.ok(page.includes("MAG_EXTENSIONS[slug].text"));
  assert.ok(page.includes("non inclus dans les liens GPS"));
});
