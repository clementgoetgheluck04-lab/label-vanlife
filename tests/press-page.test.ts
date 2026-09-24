import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("press resource is discoverable and has its own share metadata", () => {
  const page = read("src/app/presse-et-partenaires/page.tsx");
  assert.match(page, /canonical: "\/presse-et-partenaires"/);
  assert.match(page, /openGraph:/);
  assert.match(page, /twitter:/);
  assert.match(read("src/app/sitemap.ts"), /\/presse-et-partenaires/);
  assert.match(read("src/components/Footer.tsx"), /\/presse-et-partenaires/);
});

test("press resource preserves truthful status and protected kit", () => {
  const page = read("src/app/presse-et-partenaires/page.tsx");
  assert.match(page, /pas une certification publique/);
  assert.match(page, /pas l’annonce de partenariats déjà conclus/);
  assert.match(page, /réservés aux établissements autorisés/);
  assert.match(page, /CONTACT_MAILTO/);
  assert.doesNotMatch(page, /contact@labelvanlife\.fr|href=.*\.zip/);
});
