import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("original buying guide has public footer access, canonical and sitemap", () => {
  const page = readFileSync("src/app/guide-achat/page.tsx", "utf8");
  assert.match(page, /canonical: "\/guide-achat"/);
  assert.match(readFileSync("src/components/Footer.tsx", "utf8"), /Guide d’achat van & fourgon/);
  assert.ok(readFileSync("src/app/sitemap.ts", "utf8").includes("/guide-achat"));
  assert.ok(readFileSync("src/proxy.ts", "utf8").includes('"/guide-achat"'));
  assert.ok(!page.includes("134099696867572"));
  assert.match(page, /ni envoyées ni sauvegardées/);
  assert.match(page, /histovec.interieur.gouv.fr/);
  assert.match(page, /non|aucun modèle comme testé/);
  for (const id of ["besoins", "formats", "budget", "amenageur", "checklist"]) {
    assert.ok(page.includes(`id="${id}"`));
  }
});
