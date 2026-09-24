import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import * as commercial from "../src/config/commercial.ts";
import * as offers from "../src/config/label-offers.ts";
import { LABEL_PRICE, MEMBER_PRICE, MEMBER_AUTO_RENEW, MEMBER_EXPIRY_ISO } from "../src/config/commercial.ts";
import { ESSENTIAL_MONTHLY_CENTS, EXCELLENCE_MONTHLY_CENTS, EXCELLENCE_PROMO_MONTHLY_CENTS, LABEL_OFFERS_START, EXCELLENCE_PROMO_END, formatOfferEuros } from "../src/config/label-offers.ts";

test("future offers do not alter existing prices or validity", () => {
  assert.equal(LABEL_PRICE, 110);
  assert.equal(MEMBER_PRICE, 19);
  assert.equal(MEMBER_AUTO_RENEW, false);
  assert.equal(MEMBER_EXPIRY_ISO, "2027-12-31T23:59:59+01:00");
  assert.equal(LABEL_OFFERS_START, "02/02/2027");
  assert.equal(EXCELLENCE_PROMO_END, "01/02/2027");
});

test("offer amounts use integer cents and exact promotional totals", () => {
  assert.equal(ESSENTIAL_MONTHLY_CENTS * 12, 29880);
  assert.equal(EXCELLENCE_MONTHLY_CENTS * 12, 71880);
  assert.equal(EXCELLENCE_PROMO_MONTHLY_CENTS, 4792);
  assert.deepEqual(offers.EXCELLENCE_PROMO_LOYALTY_CENTS, [4792, 4392, 3992]);
  assert.equal(formatOfferEuros(EXCELLENCE_PROMO_MONTHLY_CENTS * 12), "575,04");
});

test("interest is optional, recorded and does not select a checkout product", () => {
  const form = readFileSync(new URL("../src/app/labellisation/candidature/page.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../src/app/api/labellisation/submit-draft/route.ts", import.meta.url), "utf8");
  assert.match(form, /excellenceContactRequested: false/);
  assert.match(route, /excellenceContact: payload.excellenceContactRequested/);
  assert.match(route, /Contact Excellence demandé/);
});

test("Facebook follow is an external link, not a subscription declaration", () => {
  const form = readFileSync(new URL("../src/app/labellisation/candidature/page.tsx", import.meta.url), "utf8");
  const route = readFileSync(new URL("../src/app/api/labellisation/submit-draft/route.ts", import.meta.url), "utf8");
  assert.match(form, /href="https:\/\/www.facebook.com\/labelvanlife" target="_blank" rel="noopener noreferrer"/);
  assert.match(form, /Suivre Label Vanlife sur Facebook/);
  assert.doesNotMatch(form, /checked=\{form.followFacebook\}/);
  assert.doesNotMatch(route, /Suit la page Facebook/);
});

test("comparison renders an unchecked opt-in and keeps entered selection", () => {
  const source = readFileSync(new URL("../src/components/labellisation/OfferInterest.tsx", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } });
  const actualRequire = createRequire(import.meta.url);
  const exported = {} as { OfferInterest: ComponentType<{ checked: boolean; onChange: (checked: boolean) => void }> };
  new Function("exports", "require", outputText)(exported, (name: string) => {
    if (name === "@/config/commercial") return commercial;
    if (name === "@/config/label-offers") return offers;
    return actualRequire(name);
  });
  const html = renderToStaticMarkup(createElement(exported.OfferInterest, { checked: false, onChange: () => {} }));
  assert.match(html, /<details/);
  assert.match(html, /Comparer Essentiel et Excellence/);
  assert.match(html, /02\/02\/2027/);
  assert.match(html, /47,92/);
  assert.match(html, /575,04/);
  assert.match(html, /conservée aux renouvellements/);
  assert.deepEqual(offers.LABEL_LOYALTY_TIERS.map(tier => tier.essential), [2490, 1990, 1490]);
  assert.deepEqual(offers.LABEL_LOYALTY_TIERS.map(tier => tier.excellence), [5990, 5490, 4990]);
  const comparison = html.slice(html.indexOf("<details"), html.indexOf("data-offer-pricing"));
  assert.doesNotMatch(comparison, /€|\/ mois/);
  assert.doesNotMatch(html, /<details[^>]*\bopen(?:[= >])/);
  assert.match(html, /Voir les tarifs des offres disponibles à partir du/);
  assert.match(html, /Les offres disponibles début 2027/);
  assert.ok(html.indexOf('name="excellenceContactRequested"') > html.indexOf("Intéressé par Excellence avant le"));
  assert.equal((html.match(/name="excellenceContactRequested"/g) || []).length, 1);
  assert.match(html, /19,90/);
  assert.match(html, /14,90/);
  assert.match(html, /54,90/);
  assert.match(html, /49,90/);
  assert.doesNotMatch(html, /checked=""|required=""/);
  const selected = renderToStaticMarkup(createElement(exported.OfferInterest, { checked: true, onChange: () => {} }));
  assert.match(selected, /checked=""/);
});
