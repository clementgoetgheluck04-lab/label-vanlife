import assert from "node:assert/strict";
import test from "node:test";
import { getLabelledPlaceByEmail } from "../src/data/place-contacts.ts";
import { signKitAccessToken, verifyKitAccessToken } from "../src/lib/kit-access-token.ts";

const SECRET = "test-secret-with-more-than-thirty-two-characters";

test("le kit reconnaît uniquement les adresses professionnelles labellisées", () => {
  assert.equal(getLabelledPlaceByEmail(" CAMPINGLECOINCHARMANT@GMAIL.COM ")?.placeId, "camping-le-coin-charmant");
  assert.equal(getLabelledPlaceByEmail("CONTACT@CAMPINGLEVERGER17.COM")?.contact.contactName, "Élise");
  const porteAutan = getLabelledPlaceByEmail(" CONTACT@LAPORTEDAUTAN.FR ");
  assert.equal(porteAutan?.placeId, "eco-camping-la-porte-dautan");
  assert.equal(porteAutan?.contact.contactName, "Jean-Louis");
  assert.match(porteAutan?.contact.kitEmailSubject ?? "", /renouvellement 2027/);
  assert.ok(porteAutan?.contact.kitEmailParagraphs?.some((paragraph) => paragraph.includes("aucune visite identifiée")));
  assert.equal(getLabelledPlaceByEmail("inconnu@example.com"), undefined);
});

test("les liens du kit sont signés, temporaires et résistants à la modification", () => {
  const now = Date.parse("2026-09-10T10:00:00Z");
  const token = signKitAccessToken({
    version: 1,
    kind: "magic-link",
    email: "campinglecoincharmant@gmail.com",
    placeId: "camping-le-coin-charmant",
    expiresAt: now + 15 * 60 * 1_000,
  }, SECRET);

  assert.equal(verifyKitAccessToken(token, SECRET, now)?.placeId, "camping-le-coin-charmant");
  assert.equal(verifyKitAccessToken(`${token}x`, SECRET, now), null);
  assert.equal(verifyKitAccessToken(token, SECRET, now + 16 * 60 * 1_000), null);
});
