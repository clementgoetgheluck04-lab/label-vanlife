import assert from "node:assert/strict";
import { test } from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { MAG_ARTICLES, getMagArticle, getRelatedMagArticles } from "../src/data/mag.ts";

test("Les carnets liés restent pertinents, uniques et sans auto-lien", () => {
  assert.deepEqual(getRelatedMagArticles("absent"), []);
  assert.equal(getRelatedMagArticles("corse-balagne").length, 2);
  for (const article of MAG_ARTICLES) {
    const related = getRelatedMagArticles(article.slug);
    assert.ok(related.length <= 3);
    assert.equal(new Set(related.map(item => item.slug)).size, related.length);
    for (const item of related) {
      assert.notEqual(item.slug, article.slug);
      assert.ok(getMagArticle(item.slug));
      if (article.route) assert.equal(item.route?.area, article.route.area);
      else { assert.equal(item.route, undefined); assert.equal(item.category, article.category); }
    }
  }
});

test("Les suggestions externes ne sont pas présentées comme labellisées", () => {
  const page = readFileSync(new URL("../src/app/blog/[slug]/page.tsx", import.meta.url), "utf8");
  assert.ok(page.includes("Suggestion éditoriale · Non labellisée Label Vanlife"));
  assert.ok(page.includes("sans visite de contrôle Label Vanlife ni avantage carte membre garanti"));
  assert.ok(page.includes("getVisibleLabelYears(details)"));
  assert.ok(page.includes("edition.renewalPending"));
});

test("Le Mag préserve les quatre URL du blog", () => {
  for (const slug of ["top-10-lieux-vanlife-bretagne", "preparer-premier-road-trip-van", "charte-vanlife-responsable", "spots-vanlife-provence-ete"]) assert.ok(getMagArticle(slug));
  assert.equal(getMagArticle("absent"), undefined);
});

test("Chaque itinéraire possède sa propre illustration de camping", () => {
  const routes = MAG_ARTICLES.filter(post => post.route);
  assert.equal(new Set(routes.map(post => post.image)).size, routes.length);
  for (const post of routes) {
    assert.equal(post.image, `/images/mag/itineraires/${post.slug}.webp`);
    assert.ok(post.alt.includes(post.title));
    assert.ok(post.alt.includes("camping aménagé"));
  }
});

test("Chaque article dispose de sa propre illustration, sans doublon éditorial", () => {
  assert.equal(new Set(MAG_ARTICLES.map(post => post.image)).size, MAG_ARTICLES.length);
  assert.ok(!MAG_ARTICLES.some(post => post.image.endsWith("/guide-achat.webp")));
});

test("Toutes les illustrations du Mag sont des fichiers WebP légers", () => {
  for (const image of new Set(MAG_ARTICLES.map(post => post.image))) {
    assert.ok(image.endsWith(".webp"));
    const file = readFileSync(`public${image}`);
    assert.equal(file.toString("ascii", 0, 4), "RIFF");
    assert.equal(file.toString("ascii", 8, 12), "WEBP");
    assert.ok(file.length < 600_000, `${image} exceeds the image weight budget`);
  }
});

test("20 itinéraires dont 3 en Corse, chacun avec une base et trois étapes", () => {
  const routes = MAG_ARTICLES.filter(post => post.route);
  assert.equal(routes.length, 20);
  assert.equal(routes.filter(post => post.route?.area === "Corse").length, 3);
  assert.equal(new Set(MAG_ARTICLES.map(post => post.slug)).size, MAG_ARTICLES.length);
  for (const post of routes) {
    const route = post.route!;
    assert.equal(route.steps.length, 3);
    assert.ok(route.caution.length > 50);
    assert.ok(route.stay.name && route.stay.town && route.stay.reason);
    assert.ok(Boolean(route.stay.id) !== Boolean(route.stay.source));
    if (route.stay.source) assert.equal(new URL(route.stay.source).protocol, "https:");
  }
});

test("Chaque carnet dispose de contenu, d'une illustration et d'une destination réelle", () => {
  for (const post of MAG_ARTICLES) {
    assert.ok(post.sections.length >= 3);
    assert.ok(post.sections.every(section => section.text.length > 150));
    assert.ok(post.alt.length > 20);
    assert.ok(existsSync(`public${post.image}`));
    if (post.destination.startsWith("/vanlife-regions/")) {
      assert.ok(["bretagne", "provence"].includes(post.destination.split("/").at(-1)!));
    } else {
      assert.ok(existsSync(`src/app${post.destination}/page.tsx`));
    }
    assert.ok(!post.title.includes("Top 10"));
  }
});
