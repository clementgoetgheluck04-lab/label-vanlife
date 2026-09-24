import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

function metadata(path: string) {
  const source = readFileSync(new URL(`../src/app/${path}`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  });
  const exports = {} as { metadata: { robots: { index: boolean }; alternates: { canonical: string } } };
  new Function("exports", outputText)(exports);
  return exports.metadata;
}

test("checkout and confirmation are explicitly excluded from indexing", () => {
  for (const route of ["paiement", "success"]) {
    const value = metadata(`labellisation/${route}/layout.tsx`);
    assert.equal(value.robots.index, false);
    assert.equal(value.alternates.canonical, `/labellisation/${route}`);
  }
});

test("application has its own canonical instead of inheriting the offer URL", () => {
  assert.equal(metadata("labellisation/candidature/layout.tsx").alternates.canonical,
    "/labellisation/candidature");
});

test("sitemap does not invent modification dates", () => {
  const source = readFileSync(new URL("../src/app/sitemap.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /lastModified\s*:/);
});
