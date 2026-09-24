import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const route of ["le-label", "recommander-un-lieu"]) {
  test(`${route} declares its own public canonical`, () => {
    const source = readFileSync(new URL(`../src/app/${route}/layout.tsx`, import.meta.url), "utf8");
    assert.ok(source.includes(`canonical: "https://www.labelvanlife.fr/${route}"`));
  });
}
