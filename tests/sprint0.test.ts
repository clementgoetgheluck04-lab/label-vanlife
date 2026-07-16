import test from "node:test";
import assert from "node:assert/strict";
import { PRODUCTS, getLabellisationProduct } from "../src/config/products.ts";
import { isSafeRedirectPath } from "../src/lib/urls.ts";
import { parseEmail, parseLabellisationPayload, parseText } from "../src/server/validation.ts";
import { ECOSYSTEM_PRODUCTS } from "../src/config/ecosystem.ts";
import { generateMemberAccessCode, hashMemberAccessCode, memberAccessCodeMatches } from "../src/server/member-access.ts";

test("the server catalog contains the approved one-time prices", () => {
  assert.equal(PRODUCTS.membership.amount, 2_900);
  assert.equal(PRODUCTS.membership.currency, "eur");
  assert.equal(PRODUCTS.labellisation.amount, 22_000);
  assert.equal(PRODUCTS.labellisation.currency, "eur");
  assert.equal(getLabellisationProduct(new Date("2026-12-31T12:00:00+01:00")).amount, 11_000);
  assert.equal(getLabellisationProduct(new Date("2027-01-01T00:00:01+01:00")).amount, 22_000);
});

test("the brand ecosystem has unique, stable product names", () => {
  assert.equal(ECOSYSTEM_PRODUCTS.length, 8);
  assert.equal(new Set(ECOSYSTEM_PRODUCTS.map((product) => product.name)).size, 8);
  assert.deepEqual(
    ECOSYSTEM_PRODUCTS.map((product) => product.name),
    ["Label Vanlife", "Carte membre", "Vanlife Places", "Vanlife Trips", "Vanlife Passport", "Vanlife Friendly", "Vanlife App", "Vanlife AI"],
  );
});

test("redirects stay inside the application", () => {
  assert.equal(isSafeRedirectPath("/member"), true);
  assert.equal(isSafeRedirectPath("/member?tab=card"), true);
  assert.equal(isSafeRedirectPath("//evil.example"), false);
  assert.equal(isSafeRedirectPath("https://evil.example"), false);
  assert.equal(isSafeRedirectPath(null), false);
});

test("email and text validation reject malformed or oversized input", () => {
  assert.equal(parseEmail(" USER@example.com "), "user@example.com");
  assert.equal(parseEmail("invalid"), null);
  assert.equal(parseText(" hello ", { min: 2, max: 10, required: true }), "hello");
  assert.equal(parseText("x".repeat(11), { max: 10 }), null);
});

test("member access codes are strong, normalized and never stored in clear text", () => {
  const code = generateMemberAccessCode();
  assert.match(code, /^\d{4}-\d{4}$/);
  const hash = hashMemberAccessCode("MEMBRE@example.com", code, "test-secret");
  assert.match(hash, /^[a-f0-9]{64}$/);
  assert.equal(memberAccessCodeMatches("membre@example.com", code, "test-secret", hash), true);
  assert.equal(memberAccessCodeMatches("membre@example.com", "0000-0000", "test-secret", hash), false);
});

test("labellisation payload is normalized and allow-listed", () => {
  const criteria = Object.fromEntries(Array.from({ length: 22 }, (_, index) => [
    `criterion${index + 1}`,
    { status: "yes", examples: ["Exemple"], detail: "" },
  ]));
  const result = parseLabellisationPayload({
    establishmentName: " Camping des Pins ",
    contactName: "Marie Dupont",
    email: "PRO@example.com",
    phone: "0600000000",
    website: "https://example.com",
    placeType: "CAMPING",
    address: "12 route des Pins",
    postalCode: "74000",
    city: "Annecy",
    region: "Auvergne-Rhône-Alpes",
    capacity: 25,
    services: ["eau", "electricite", "sanitaires", "vidange", "wifi"],
    discountPercent: 10,
    description: "Un lieu calme et verdoyant, spécialement adapté aux voyageurs en van.",
    motivation: "Nous souhaitons accueillir les voyageurs et rejoindre une communauté responsable.",
    siret: "12345678901234",
    criteria,
    planFileName: "plan-camping.pdf",
    welcomeMessage: "Nous proposons un accueil familial dans un environnement calme.",
    reservationModes: ["online", "phone"],
    acceptCharter: true,
  });
  assert.ok(result);
  assert.equal(result.establishmentName, "Camping des Pins");
  assert.equal(result.email, "pro@example.com");
  assert.equal(parseLabellisationPayload({ ...result, placeType: "ADMIN" }), null);
  assert.equal(parseLabellisationPayload({ ...result, website: "javascript:alert(1)" }), null);
  assert.equal(parseLabellisationPayload({ ...result, hasParityClause: true, publicPrice: 35, minimumAllowedPrice: 33, discountPercent: 10 }), null);
  assert.ok(parseLabellisationPayload({ ...result, hasParityClause: true, publicPrice: 35, minimumAllowedPrice: 19, discountPercent: 20 }));
});
