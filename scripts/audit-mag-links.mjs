// Read-only link check. A blocked external request is not proof of a broken link.
import { MAG_ARTICLES } from '../src/data/mag.ts';
const base = 'https://www.labelvanlife.fr';
const targets = new Map();
for (const article of MAG_ARTICLES) {
  const stay = article.route?.stay;
  for (const path of [article.destination, stay?.id ? `/lieux/${stay.id}` : stay?.source].filter(Boolean)) {
    const url = new URL(path, base).href;
    targets.set(url, [...(targets.get(url) || []), article.slug]);
  }
}
const queue = [...targets];
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < queue.length) {
    const [url, articles] = queue[cursor++];
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
      const html = await response.text();
      results.push({ url, status: response.status, finalUrl: response.url, articles,
        warning: !response.ok ? 'Check manually: HTTP error or bot protection' : new URL(response.url).protocol !== 'https:' ? 'Insecure redirect' : null,
        ...(url.startsWith(`${base}/lieux/`) ? { hasPlaceHeading: /<h1\b/.test(html), hasLabelYear: /202[67]/.test(html) } : {}) });
    } catch (error) { results.push({ url, articles, warning: String(error) }); }
  }
}));
console.log(JSON.stringify({ articles: MAG_ARTICLES.length, targets: queue.length, results }, null, 2));
if (results.some(result => result.warning || result.hasPlaceHeading === false || result.hasLabelYear === false)) process.exitCode = 1;
