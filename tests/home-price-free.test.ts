import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("home and navigation invite discovery without displaying membership prices", () => {
  for (const file of ["src/app/page.tsx", "src/components/Navbar.tsx", "src/components/Footer.tsx"]) {
    const source = readFileSync(file, "utf8");
    assert.doesNotMatch(source, /MEMBER_(?:CTA_LABEL|SHORT_LABEL|PRICE\w*)|\d+\s*€/u, file);
    assert.ok(source.includes('href: "/devenir-membre"') || source.includes('href="/devenir-membre"'), file);
  }
  const commercial = readFileSync("src/config/commercial.ts", "utf8");
  assert.match(commercial, /export const MEMBER_PRICE = 19;/);
});
