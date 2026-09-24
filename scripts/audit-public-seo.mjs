// Read-only audit of the public sitemap. Never traverses private member URLs.
const base = 'https://www.labelvanlife.fr';
const sitemap = await fetch(`${base}/sitemap.xml`, { signal: AbortSignal.timeout(20000) });
if (!sitemap.ok) throw new Error(`Sitemap HTTP ${sitemap.status}`);
const xml = await sitemap.text();
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const results = [];
let cursor = 0;
await Promise.all(Array.from({ length: 3 }, async () => {
  while (cursor < urls.length) {
    const url = urls[cursor++];
    if (new URL(url).origin !== base) throw new Error('Unexpected sitemap origin');
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      const html = await response.text();
      const tags = [...html.matchAll(/<(?:meta|link)\b[^>]*>/gi)].map(match => match[0]);
      const canonicalTag = tags.find(tag => /rel="canonical"/.test(tag)) || '';
      const canonical = canonicalTag.match(/href="([^"]+)"/)?.[1];
      const title = html.match(/<title>(.*?)<\/title>/s)?.[1] || '';
      const description = tags.find(tag => /name="description"/.test(tag));
      const noindex = /noindex/i.test(response.headers.get('x-robots-tag') || '') || tags.some(tag => /name="(?:robots|googlebot)"/.test(tag) && /noindex/i.test(tag));
      const h1 = (html.match(/<h1\b/gi) || []).length;
      results.push({ url, status: response.status, redirected: response.url !== url, canonical, title, issues: [!response.ok && `HTTP ${response.status}`, noindex && 'noindex', !title && 'missing title', !description && 'missing description', canonical !== url && 'canonical mismatch', h1 !== 1 && `${h1} H1`].filter(Boolean) });
    } catch (error) { results.push({ url, issues: [String(error)] }); }
  }
}));
const duplicates = results.filter((item, index) => item.title && results.findIndex(other => other.title === item.title) !== index).map(item => item.url);
console.log(JSON.stringify({ checked: results.length, failures: results.filter(item => item.issues.length), duplicateTitles: duplicates }, null, 2));
if (results.some(item => item.issues.length) || duplicates.length) process.exitCode = 1;
