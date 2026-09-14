import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("prospection is disabled unless explicitly enabled and caps daily volume", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /PROSPECTION_AUTOMATION_ENABLED === "true"/);
  assert.match(engine, /Math\.min\(Math\.max\(value, 1\), 25\)/);
  assert.match(engine, /parisWeekday === "Sat" \|\| parisWeekday === "Sun"/);
});

test("prospection stops after two follow-ups and includes working opposition controls", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /ACTIVE_STATUSES[^\n]+"NEW", "CONTACTED", "FOLLOW_UP_1"/);
  assert.match(engine, /Sans réponse, aucune autre relance automatique/);
  assert.match(engine, /List-Unsubscribe/);
  assert.match(engine, /List-Unsubscribe-Post/);
  assert.match(engine, /prospectSuppression/);
  assert.match(engine, /idempotencyKey: campaignKey/);
});

test("Resend inbound webhook is signed and escalates ambiguous replies", () => {
  const webhook = source("../src/app/api/webhooks/resend/route.ts");
  assert.match(webhook, /resend\.webhooks\.verify/);
  assert.match(webhook, /RESEND_WEBHOOK_SECRET/);
  assert.match(webhook, /email\.received/);
  assert.match(webhook, /NEEDS_HUMAN/);
  assert.match(webhook, /sendNeedHumanAlert/);
  assert.match(webhook, /email\.bounced/);
  assert.match(webhook, /email\.complained/);
});

test("labellisation and payment feed the sales pipeline", () => {
  const draft = source("../src/app/api/labellisation/submit-draft/route.ts");
  const stripe = source("../src/app/api/stripe/webhook/route.ts");
  assert.match(draft, /status: "QUALIFIED"/);
  assert.match(stripe, /status: "CONVERTED"/);
});
