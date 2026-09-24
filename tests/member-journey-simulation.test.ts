/* eslint-disable @typescript-eslint/no-explicit-any -- In-memory adapters mirror external SDKs for this isolated simulation. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server.js";
import * as products from "../src/config/products.ts";
import * as commercial from "../src/config/commercial.ts";
import * as validation from "../src/server/validation.ts";
import * as access from "../src/server/member-access.ts";

// Executes the actual route handlers; all external services are in-memory adapters.
// No network calls, credentials, real accounts, payments or emails are used.
test("isolated membership journey: signup, checkout, signed webhook, card and emails, duplicate delivery", async () => {
  const require = createRequire(import.meta.url);
  const origin = "https://simulation.example";
  const secret = "whsec_isolated_simulation_only";
  const codeSecret = "isolated-member-code-secret";
  const stripeSdk = new Stripe("sk_test_isolated_not_a_real_key");
  const emails: any[] = [];
  let user: any;
  let profile: any;
  let membership: any;
  let card: any;
  let order: any;
  let checkout: any;
  let paidRecord: any;
  let signupRequest: any;
  let analyticsCount = 0;
  const events = new Map<string, any>();
  const db: any = {
    user: {
      upsert: async ({ create }: any) => { user = { ...user, ...create }; return user; },
      findUnique: async () => ({ ...user, membership, checkoutOrders: [] }),
    },
    profile: { upsert: async ({ create }: any) => { profile = create; return profile; } },
    memberCompanion: { deleteMany: async () => {}, createMany: async () => {} },
    checkoutOrder: {
      create: async ({ data }: any) => { order = { id: "order_simulation", status: "PENDING", ...data }; return order; },
      findUnique: async ({ include }: any) => include ? { ...order, user: { ...user, profile, membership, memberCard: card, memberCompanions: [] } } : order,
      update: async ({ data }: any) => { Object.assign(order, data); return order; },
    },
    payment: { upsert: async ({ create }: any) => { paidRecord = create; return create; } },
    membership: { upsert: async ({ create }: any) => { membership = create; return create; } },
    memberCard: { upsert: async ({ create }: any) => { card = create; return create; } },
    analyticsEvent: { create: async () => { analyticsCount++; } },
    stripeEvent: {
      findUnique: async ({ where }: any) => events.get(where.id),
      create: async ({ data }: any) => { events.set(data.id, data); return data; },
      update: async ({ where, data }: any) => Object.assign(events.get(where.id), data),
      updateMany: async ({ where, data }: any) => { if (events.has(where.id)) Object.assign(events.get(where.id), data); return { count: 1 }; },
    },
    $transaction: async (run: any) => run(db),
  };
  const mocks: Record<string, any> = {
    "server-only": {},
    "next/server": { NextRequest, NextResponse },
    "@/config/products": products,
    "@/config/commercial": commercial,
    "@/server/validation": validation,
    "@/server/member-access": access,
    "@/lib/prisma": { getPrisma: () => db },
    "@/generated/prisma/client": { Prisma: { PrismaClientKnownRequestError: class extends Error {} } },
    "@/server/env": {
      getAppUrl: () => origin,
      getBackOfficeEmails: () => ["admin@example.com"],
      getTransactionalEmailFrom: () => "sender@example.com",
      requireServerEnv: () => "isolated-fake-key",
      requireSecretEnv: (name: string) => name === "STRIPE_WEBHOOK_SECRET" ? secret : codeSecret,
    },
    "@/server/http": { apiError: () => NextResponse.json({ error: "simulation handler error" }, { status: 500 }) },
    "@/lib/supabase/server": { createClient: async () => ({ auth: { signUp: async (input: any) => {
      signupRequest = input;
      user = { id: "user_simulation", email: input.email, identities: [{}], user_metadata: input.options.data };
      return { data: { user }, error: null };
    } } }) },
    "@/server/auth": { getAuthenticatedUser: async () => user, ensureAppUser: async () => {} },
    "@/server/stripe": { getStripe: () => ({
      webhooks: stripeSdk.webhooks,
      checkout: { sessions: { create: async (input: any) => {
        checkout = input;
        return { id: "cs_test_simulation", url: "https://checkout.example/simulation" };
      } } },
    }) },
    resend: { Resend: class { emails = { send: async (message: any) => { emails.push(message); return { data: { id: `sim_${emails.length}` }, error: null }; } }; } },
  };
  function load(path: string): any {
    const source = readFileSync(new URL(path, import.meta.url), "utf8");
    const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
    const exported = {};
    new Function("exports", "require", outputText)(exported, (name: string) => {
      if (name in mocks) return mocks[name];
      if (name.startsWith("node:")) return require(name);
      throw new Error(`Unmocked dependency blocked: ${name}`);
    });
    return exported;
  }
  mocks["@/server/request-security"] = load("../src/server/request-security.ts");
  mocks["@/server/email-template"] = load("../src/server/email-template.ts");
  const signup = load("../src/app/api/auth/signup/route.ts");
  const pay = load("../src/app/api/stripe/checkout/route.ts");
  const webhook = load("../src/app/api/stripe/webhook/route.ts");
  const request = (path: string, body: any, extra = {}) => new NextRequest(origin + path, {
    method: "POST", headers: { origin, "content-type": "application/json", ...extra }, body: JSON.stringify(body),
  });
  const signupResponse = await signup.POST(request("/api/auth/signup", {
    email: "simulation@example.com", password: "Simulation-isolated-only-2026!", firstName: "Test", lastName: "Simulation",
    age: 38, phone: "0600000000", addressLine1: "1 rue du Test", postalCode: "75001", city: "Paris", country: "France", companions: [],
  }));
  assert.equal(signupResponse.status, 200);
  assert.equal(profile.firstName, "Test");
  assert.match(signupRequest.options.emailRedirectTo, /auth\/callback\?next=/);
  // Authentication after email confirmation is supplied by the isolated auth adapter.
  const checkoutResponse = await pay.POST(request("/api/stripe/checkout", {}));
  assert.equal(checkoutResponse.status, 200);
  assert.equal(checkout.mode, "payment");
  assert.equal(checkout.line_items[0].price_data.unit_amount, 1900);
  assert.equal(order.status, "CHECKOUT_CREATED");
  assert.equal(membership, undefined);
  assert.equal(emails.length, 0);
  const event = { id: "evt_simulated_payment", type: "checkout.session.completed", data: { object: {
    id: "cs_test_simulation", metadata: checkout.metadata, payment_status: "paid", payment_intent: "pi_simulation", amount_total: 1900, currency: "eur",
  } } };
  const signed = () => request("/api/stripe/webhook", event, {
    "stripe-signature": stripeSdk.webhooks.generateTestHeaderString({ payload: JSON.stringify(event), secret }),
  });
  assert.equal((await webhook.POST(request("/api/stripe/webhook", event))).status, 400);
  assert.equal(membership, undefined);
  assert.equal((await webhook.POST(signed())).status, 200);
  assert.equal(order.status, "PAID");
  assert.equal(paidRecord.amount, 1900);
  const activatedMembership = (await db.user.findUnique({})).membership;
  assert.equal(activatedMembership.status, "ACTIVE");
  assert.equal(activatedMembership.expiresAt.toISOString(), new Date(commercial.MEMBER_EXPIRY_ISO).toISOString());
  assert.match(card.cardNumber, /^LV-[A-F0-9]{12}$/);
  assert.equal(emails.length, 3);
  assert.equal(emails[0].to[0], "admin@example.com");
  assert.equal(emails[1].to, "simulation@example.com");
  assert.match(emails[1].text, /paiement.*confirmé/);
  assert.match(emails[1].html, /Votre Carte membre est active/);
  const code = emails[2].text.match(/LV-(?:[A-F0-9]{4}-){3}[A-F0-9]{4}/)?.[0];
  assert.ok(code);
  assert.ok(access.memberAccessCodeMatches(user.email, code, codeSecret, order.payload.memberAccessCodeHash));
  assert.ok(order.payload.activationEmailSentAt);
  const duplicate = await webhook.POST(signed());
  assert.equal((await duplicate.json()).duplicate, true);
  assert.equal(emails.length, 3);
  assert.equal(analyticsCount, 1);
});
