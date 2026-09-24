// Public ownership key, deliberately hosted in public/. Not an API secret.
// Run after production deployment. Dry-run by default; --submit sends one batch.
import { MAG_ARTICLES } from '../src/data/mag.ts';
const base = 'https://www.labelvanlife.fr';
const key = 'fa55196978c34d27ae22d5824db54190';
const urlList = [`${base}/blog`, `${base}/guide-achat`, ...MAG_ARTICLES.map(post => `${base}/blog/${post.slug}`)];
const payload = { host: 'www.labelvanlife.fr', key, keyLocation: `${base}/${key}.txt`, urlList };
if (!process.argv.includes('--submit')) {
  console.log(JSON.stringify({ mode: 'dry-run', ...payload }, null, 2));
} else {
  const proof = await fetch(payload.keyLocation, { redirect: 'error', signal: AbortSignal.timeout(15000) });
  if (!proof.ok || (await proof.text()).trim() !== key) throw new Error('Ownership key not yet deployed; nothing submitted.');
  for (const url of urlList) {
    const response = await fetch(url, { redirect: 'error', signal: AbortSignal.timeout(20000) });
    const html = await response.text();
    if (!response.ok || /noindex/i.test(response.headers.get('x-robots-tag') || '') || !html.includes('Le Mag')) {
      throw new Error(`Page not ready for discovery: ${url}. Nothing submitted.`);
    }
  }
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(20000),
  });
  console.log(JSON.stringify({ status: response.status, submitted: urlList.length, body: await response.text() }));
  if (![200, 202].includes(response.status)) process.exitCode = 1;
  // Accepted means notified, never proof of indexing or AI citations.
}
