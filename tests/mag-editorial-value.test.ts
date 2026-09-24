import assert from 'node:assert/strict';
import test from 'node:test';
import { MAG_ARTICLES, getMagArticle } from '../src/data/mag.ts';
import { getRouteDetails } from '../src/data/mag-route-details.ts';
import { ROUTE_VISITS } from '../src/data/mag-route-visits.ts';
import { MAG_LOCAL_STORIES } from '../src/data/mag-local-stories.ts';

test('les quatre guides de lecture disposent de sections distinctes et de contenu développé', () => {
  const guides = MAG_ARTICLES.filter(post => !post.route);
  assert.equal(guides.length, 4);
  for (const guide of guides) {
    assert.ok(guide.sections.length >= 6, guide.slug);
    assert.equal(new Set(guide.sections.map(section => section.title)).size, guide.sections.length);
    assert.ok(guide.sections.map(section => section.text).join(' ').split(/\s+/).length >= 350, guide.slug);
    for (const resource of guide.resources ?? []) {
      if (resource.href.startsWith('/blog/')) assert.ok(getMagArticle(resource.href.slice(6)), resource.href);
      else assert.equal(new URL(resource.href).protocol, 'https:');
    }
  }
});

test('Provence apporte deux choix de séjour, des visites sourcées et un budget explicitement indicatif', () => {
  const post = getMagArticle('spots-vanlife-provence-ete')!;
  const content = post.sections.map(section => section.text).join(' ');
  for (const phrase of ['Roussillon', 'Salagon', 'Dauphin', '120 €', 'sans valeur de tarif local']) assert.ok(content.includes(phrase));
  assert.equal(post.resources?.filter(resource => resource.href.startsWith('https://')).length, 3);
});

test('les vingt itinéraires conservent leurs étapes, visite précise, anecdote et base de nuitée', () => {
  for (const post of MAG_ARTICLES.filter(post => post.route)) {
    assert.equal(getRouteDetails(post.slug).length, 3, post.slug);
    assert.ok(ROUTE_VISITS[post.slug]?.source, post.slug);
    assert.ok(MAG_LOCAL_STORIES[post.slug]?.source, post.slug);
    assert.ok(post.route?.stay.name, post.slug);
  }
});
