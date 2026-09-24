import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
import { NextRequest } from "next/server.js";
import type * as Security from "../src/server/request-security.ts";

// Execute the real module, replacing only Next's server-only import marker.
function loadSecurity(): typeof Security {
  const require = createRequire(import.meta.url);
  const source = readFileSync(new URL("../src/server/request-security.ts", import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const exports = {};
  new Function("exports", "require", outputText)(exports, (name: string) => {
    if (name === "server-only") return {};
    if (name === "next/server") return { NextRequest };
    return require(name);
  });
  return exports as typeof Security;
}

function request(body = '{}', headers: Record<string, string> = {}) {
  return new NextRequest("https://labelvanlife.example/api/test", {
    method: "POST", body,
    headers: { "content-type": "application/json", ...headers },
  });
}

test("JSON accepts parameters but rejects MIME prefix lookalikes", async () => {
  const security = loadSecurity();
  assert.deepEqual(await security.readJsonRequest(request('{}', { 'content-type': 'application/json; charset=utf-8' })), {});
  for (const type of ['application/jsonp', 'application/json-evil', 'text/plain']) {
    await assert.rejects(security.readJsonRequest(request('{}', { 'content-type': type })), { status: 415 });
  }
});

test("body limit is enforced without trusting Content-Length", async () => {
  const security = loadSecurity();
  await assert.rejects(security.readJsonRequest(request('"123456789"'), 8), { status: 413 });
  await assert.rejects(security.readJsonRequest(request('"123456789"', { 'content-length': '2' }), 8), { status: 413 });
  await assert.rejects(security.readJsonRequest(request('{invalid')), { status: 400 });
});

test("cross-site and missing origins are rejected", () => {
  const security = loadSecurity();
  security.assertSameOrigin(request('{}', { origin: 'https://labelvanlife.example', 'sec-fetch-site': 'same-origin' }));
  const invalidHeaders: Record<string, string>[] = [{}, { origin: 'https://attacker.example' }, { origin: 'https://labelvanlife.example', 'sec-fetch-site': 'cross-site' }];
  for (const headers of invalidHeaders) {
    assert.throws(() => security.assertSameOrigin(request('{}', headers)), security.OriginError);
  }
});

test("signed webhook text is preserved exactly and bounded without Content-Length", async () => {
  const security = loadSecurity();
  const payload = '{\n  "label": "été 🌿", "number": 1.00\n}\n';
  assert.equal(await security.readTextRequest(request(payload), 1024), payload);
  await assert.rejects(security.readTextRequest(request(payload), 8), { status: 413 });
  for (const route of ['stripe/webhook', 'webhooks/resend']) {
    const source = readFileSync(new URL(`../src/app/api/${route}/route.ts`, import.meta.url), 'utf8');
    assert.match(source, /readTextRequest\(request, 2 \* 1024 \* 1024\)/);
    assert.doesNotMatch(source, /await request\.text\(\)/);
  }
});

test("rate limits keep live counters, cap memory and recover after expiry", () => {
  const security = loadSecurity();
  const first = request('{}', { 'x-forwarded-for': '10.0.0.1' });
  security.enforceRateLimit(first, 'test', 1, 60_000);
  assert.throws(() => security.enforceRateLimit(first, 'test', 1, 60_000), security.RateLimitError);
  for (let index = 1; index < 10_000; index++) {
    security.enforceRateLimit(request('{}', { 'x-forwarded-for': `2001:db8::${index.toString(16)}` }), 'test', 1, 60_000);
  }
  assert.throws(() => security.enforceRateLimit(request('{}', { 'x-forwarded-for': '192.0.2.1' }), 'test', 1, 60_000), security.RateLimitError);
  assert.throws(() => security.enforceRateLimit(first, 'test', 1, 60_000), security.RateLimitError);
  security.clearExpiredRateLimits(Date.now() + 61_000);
  security.enforceRateLimit(first, 'test', 1, 60_000);
});
