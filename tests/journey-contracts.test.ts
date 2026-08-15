import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("membership journey keeps confirmation, Stripe and activation connected", () => {
  const signup = source("../src/app/api/auth/signup/route.ts");
  const joinPage = source("../src/app/devenir-membre/page.tsx");
  const checkout = source("../src/app/api/stripe/checkout/route.ts");
  const webhook = source("../src/app/api/stripe/webhook/route.ts");
  const contact = source("../src/config/contact.ts");

  assert.match(signup, /devenir-membre\?checkout=ready/);
  assert.match(joinPage, /checkout.*ready/);
  assert.match(joinPage, /\/api\/stripe\/checkout/);
  assert.match(checkout, /adhesion\/success\?session_id=\{CHECKOUT_SESSION_ID\}/);
  assert.match(webhook, /checkout\.session\.completed/);
  assert.match(webhook, /memberCard\.upsert/);
  assert.match(webhook, /activationEmailSentAt/);
  assert.match(webhook, /getBackOfficeEmail\(\)/);
  assert.match(contact, /contact@labelvanlife\.fr/);
  assert.doesNotMatch(webhook, /contact@labelvanlife\.com/);
});

test("labellisation journey keeps dossier, Stripe, webhook and both emails connected", () => {
  const candidature = source("../src/app/labellisation/candidature/page.tsx");
  const checkout = source("../src/app/api/stripe/checkout-labellisation/route.ts");
  const webhook = source("../src/app/api/stripe/webhook/route.ts");
  const contact = source("../src/config/contact.ts");

  assert.match(candidature, /\/api\/labellisation\/submit-draft/);
  assert.match(candidature, /\/api\/stripe\/checkout-labellisation/);
  assert.match(candidature, /photoFiles\.length >= 1/);
  assert.match(checkout, /labellisation\/success\?session_id=\{CHECKOUT_SESSION_ID\}/);
  assert.match(webhook, /sendLabellisationPaymentConfirmation/);
  assert.match(webhook, /getBackOfficeEmail\(\)/);
  assert.match(webhook, /to: candidateEmail/);
  assert.match(contact, /contact@labelvanlife\.fr/);
  assert.doesNotMatch(webhook, /contact@labelvanlife\.com/);
});
