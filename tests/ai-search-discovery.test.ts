import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import robots from '../src/app/robots.ts';
import { MAG_ARTICLES } from '../src/data/mag.ts';
import { magArticleSchema } from '../src/lib/seo/mag-schema.ts';
import { MAG_LOCAL_STORIES } from '../src/data/mag-local-stories.ts';
import { ROUTE_VISITS } from '../src/data/mag-route-visits.ts';

test('search bots retain all private-path exclusions', () => {
  const rules = robots().rules;
  assert.ok(Array.isArray(rules));
  const generic = rules.find(rule => rule.userAgent === '*')!;
  for (const bot of ['OAI-SearchBot', 'PerplexityBot']) {
    const rule: { allow?: string | string[]; disallow?: string | string[] } = rules.find(candidate => Array.isArray(candidate.userAgent) && candidate.userAgent.includes(bot))!;
    assert.equal(rule.allow, '/');
    assert.deepEqual(rule.disallow, generic.disallow);
    for (const path of ['/member', '/admin', '/kits', '/trip/']) assert.ok(rule.disallow?.includes(path));
  }
});

test('article structured data matches visible content without invented dates or ratings', () => {
  for (const article of MAG_ARTICLES) {
    const schema = magArticleSchema(article);
    assert.equal(schema.headline, article.title);
    assert.ok(schema.mainEntityOfPage.endsWith(`/blog/${article.slug}`));
    const expected = [...new Set([
      ...(article.route ? [article.route.stay.source, ROUTE_VISITS[article.slug]?.source, MAG_LOCAL_STORIES[article.slug]?.source] : []),
      ...(article.resources ?? []).filter(resource => resource.href.startsWith('https://')).map(resource => resource.href),
    ].filter(Boolean))];
    assert.deepEqual(schema.citation ?? [], expected);
    assert.ok(!('aggregateRating' in schema));
    assert.ok(!('dateModified' in schema));
  }
});

test('editorial method is visible and linked from each article template', () => {
  const page = readFileSync('src/app/presse-et-partenaires/page.tsx', 'utf8');
  assert.ok(page.includes('id="methode-editoriale"'));
  assert.ok(page.includes('réalisées avec assistance d’IA'));
  assert.ok(page.includes('pas un compte rendu de voyages'));
  assert.ok(readFileSync('src/app/blog/[slug]/page.tsx', 'utf8').includes('/presse-et-partenaires#methode-editoriale'));
});

test('IndexNow public proof file matches the submission script', () => {
  const key = readFileSync('public/fa55196978c34d27ae22d5824db54190.txt', 'utf8').trim();
  assert.match(key, /^[a-f0-9]{32}$/);
  const script = readFileSync('scripts/submit-mag-indexnow.mjs', 'utf8');
  assert.ok(script.includes(key));
  assert.ok(script.includes("process.argv.includes('--submit')"));
});
