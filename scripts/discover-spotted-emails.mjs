import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src", "data", "member-camping-network.json");
const REPORT_DIR = path.join(ROOT, "artifacts");
const REPORT_PATH = path.join(REPORT_DIR, "spotted-email-discovery.json");
const BIENVENUE_ZIP = "C:\\Users\\cleme\\Desktop\\label vanlife\\FICHIERS data externes\\Bienvenue a la ferme.zip";
const APPLY = process.argv.includes("--apply");
const APPLY_REPORT = process.argv.includes("--apply-report");
const DUPLICATE_IDS = new Set([
  "papa-rtenaires-camping-de-gracay",
  "bienvenue-ferme-ferme-la-communion",
  "papa-rtenaires-camping-la-plage",
  "papa-rtenaires-camping-le-moulin-du-bel-air",
]);
const ROLE_PREFIXES = /^(accueil|admin|bonjour|booking|camping|commercial|communication|contact|courrier|direction|hello|info|office|reception|reservation|reservations|resa|secretariat|service|tourisme|vacances|webmaster)([._+-]|$)/i;
const FREE_DOMAINS = new Set([
  "gmail.com", "hotmail.com", "hotmail.fr", "orange.fr", "wanadoo.fr", "free.fr",
  "yahoo.com", "yahoo.fr", "outlook.com", "outlook.fr", "laposte.net", "sfr.fr",
]);
const BLOCKED_EMAILS = new Set([
  "annonceur@campingfrance.com",
  "bonjour@aube-champagne.com",
  "contact@agence-lillipop.com",
  "contact@hrz.fr",
  "contact@infolien.com",
  "contact@mysite.com",
  "hello@werocket.fr",
  "service@linkeo.com",
  "staff@team-helper.fr",
]);
const MANUAL_EMAILS = new Map([
  ["bienvenue-ferme-camping-du-lac-de-la-laure", { email: "roxane.verot@wanadoo.fr", sourceUrl: "https://ariege.chambres-agriculture.fr/fileadmin/user_upload/286_chambre_dagriculture_-_ariege/Interface/Documents/Illustration_du_site/CIRCUITS_COURTS/BAF-ARIEGE-2025.pdf" }],
  ["bienvenue-ferme-ferme-de-viescamp", { email: "lacaze@viescampers.com", sourceUrl: "https://www.viescampers.com/mentions-legales" }],
  ["bienvenue-ferme-ferme-du-bas-chalus", { email: "baschalus@orange.fr", sourceUrl: "https://www.bienvenue-a-la-ferme.com/provence-alpes-cote-d-azur/alpes-de-haute-provence/forcalquier/ferme/ferme-du-bas-chalus/92511" }],
  ["bienvenue-ferme-l-azaigouat", { email: "camping.azaigouat@orange.fr", sourceUrl: "http://azaigouat.waibe.fr" }],
  ["bienvenue-ferme-les-attelages-de-monsacou", { email: "accueil@aulezarddore.com", sourceUrl: "https://www.pays-bergerac-tourisme.com/en/diffusio/lamonzie-montastruc/les-attelages-de-monsacou_TFOLOIAQU024FS0004M" }],
  ["papa-rtenaires-camping-loliveraie", { email: "oliveraie.laurens@gmail.com", sourceUrl: "https://www.oliveraie.com/francais/contact-camping-herault" }],
  ["label-repere-camping-cote-d-albatre-76540", { email: "contact@campingcotedalbatre.fr", sourceUrl: "https://data.ffcc.fr/edit/sites/913/ffcc_boutique_produits/uploads/BA6B9C2F-4952-2EA7-B249-E45DF39D813E/file/file/guide-ffcc-2025-bd.pdf" }],
  ["label-repere-camping-le-bourgogne-point-gps", { email: "lebourgogne@orange.fr", sourceUrl: "https://www.cirkwi.com/fr/point-interet/3551325-camping-le-bourgogne" }],
  ["label-repere-camping-des-joyeux-campeurs-point-gps", { email: "campingdesjoyeuxcampeurs@laposte.net", sourceUrl: "https://www.campingdesjoyeuxcampeurs.com/nous-contacter" }],
  ["label-repere-camping-la-mine-d-argent-point-gps", { email: "le.camping.la.mine.dargent@gmail.com", sourceUrl: "https://www.paysdebarr.fr/visiter/fr/carte/detail/233001031" }],
  ["label-repere-caravaning-du-lac-point-gps", { email: "info@caravaningdulac.fr", sourceUrl: "https://caravaningdulac.com/informations-camping-du-nord-plan-acces-au-camping/" }],
]);

function loadBienvenueCanonicalUrls() {
  const command = [
    "$ErrorActionPreference='Stop'",
    `Add-Type -AssemblyName System.IO.Compression.FileSystem; $z=[IO.Compression.ZipFile]::OpenRead('${BIENVENUE_ZIP.replaceAll("'", "''")}')`,
    "$out=@(); foreach($e in $z.Entries){ $sr=[IO.StreamReader]::new($e.Open()); $txt=$sr.ReadToEnd(); $sr.Dispose(); $m=[regex]::Match($txt,'(?i)rel=\"canonical\"\\s+href=\"([^\"]+)\"'); if($m.Success){$out += $m.Groups[1].Value} }; $z.Dispose(); $out | ConvertTo-Json -Compress",
  ].join("; ");
  try {
    const raw = execFileSync("powershell.exe", ["-NoProfile", "-Command", command], { encoding: "utf8", maxBuffer: 10_000_000 }).trim();
    const urls = JSON.parse(raw || "[]");
    const map = new Map();
    for (const value of Array.isArray(urls) ? urls : [urls]) {
      try {
        const url = new URL(value);
        const parts = url.pathname.split("/").filter(Boolean);
        const numericIndex = parts.findLastIndex((part) => /^\d+$/.test(part));
        if (numericIndex > 0) map.set(`bienvenue-ferme-${parts[numericIndex - 1]}`, url.href);
      } catch {}
    }
    return map;
  } catch (error) {
    console.warn(`Could not read Bienvenue à la ferme canonical URLs: ${error.message}`);
    return new Map();
  }
}

function decodeHtml(value) {
  return value
    .replace(/&commat;|&#64;|&#x40;/gi, "@")
    .replace(/&period;|&#46;|&#x2e;/gi, ".")
    .replace(/&amp;/gi, "&")
    .replace(/\s+(?:\[at\]|\(at\)|at)\s+/gi, "@")
    .replace(/\s+(?:\[dot\]|\(dot\)|dot)\s+/gi, ".");
}

function normalizeEmail(raw) {
  return decodeHtml(raw)
    .replace(/^mailto:/i, "")
    .split(/[?&#]/)[0]
    .trim()
    .replace(/^[<('"\s]+|[>)'",;:\s]+$/g, "")
    .toLowerCase();
}

function validEmail(email) {
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(email)) return false;
  if (email.length > 254 || email.includes("..")) return false;
  if (/^(example|test|demo|noreply|no-reply|donotreply)@/i.test(email)) return false;
  if (/\.(png|jpe?g|gif|svg|webp|css|js|ico)$/i.test(email)) return false;
  return true;
}

function cfDecode(encoded) {
  if (!/^[0-9a-f]+$/i.test(encoded) || encoded.length < 4 || encoded.length % 2) return null;
  const key = Number.parseInt(encoded.slice(0, 2), 16);
  let result = "";
  for (let index = 2; index < encoded.length; index += 2) {
    result += String.fromCharCode(Number.parseInt(encoded.slice(index, index + 2), 16) ^ key);
  }
  return result;
}

function websiteUrl(value) {
  if (!value?.trim()) return null;
  try {
    return new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
  } catch {
    return null;
  }
}

function rootDomain(hostname) {
  const clean = hostname.toLowerCase().replace(/^www\./, "");
  const parts = clean.split(".");
  return parts.length > 2 ? parts.slice(-2).join(".") : clean;
}

function extractCandidates(html, pageUrl, siteHost) {
  const decoded = decodeHtml(html);
  const candidates = new Map();
  const add = (raw, sourceType) => {
    const email = normalizeEmail(raw);
    if (!validEmail(email)) return;
    const [local, domain] = email.split("@");
    let score = sourceType === "mailto" ? 100 : sourceType === "cloudflare" ? 95 : 75;
    if (ROLE_PREFIXES.test(local)) score += 15;
    if (rootDomain(domain) === rootDomain(siteHost)) score += 25;
    if (FREE_DOMAINS.has(domain)) score -= 5;
    const previous = candidates.get(email);
    if (!previous || score > previous.score) candidates.set(email, { email, score, sourceType, sourceUrl: pageUrl });
  };

  for (const match of decoded.matchAll(/mailto:([^"'<>\s]+)/gi)) add(match[1], "mailto");
  for (const match of decoded.matchAll(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}/gi)) add(match[0], "visible");
  for (const match of html.matchAll(/data-cfemail=["']([0-9a-f]+)["']/gi)) {
    const email = cfDecode(match[1]);
    if (email) add(email, "cloudflare");
  }
  return [...candidates.values()];
}

function extractContactLinks(html, baseUrl) {
  const urls = new Set();
  for (const match of html.matchAll(/href\s*=\s*["']([^"'#]+)["']/gi)) {
    const href = decodeHtml(match[1]).trim();
    if (!/(contact|nous-contacter|contactez|mentions-legales|mentions_l[eé]gales|legal|impressum)/i.test(href)) continue;
    try {
      const url = new URL(href, baseUrl);
      if (url.origin === new URL(baseUrl).origin && /^https?:$/.test(url.protocol)) {
        url.hash = "";
        urls.add(url.href);
      }
    } catch {}
  }
  return [...urls].slice(0, 4);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(12_000),
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; LabelVanlifeContactResearch/1.0; +https://labelvanlife.fr)",
      accept: "text/html,application/xhtml+xml",
      "accept-language": "fr-FR,fr;q=0.9,en;q=0.5",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const type = response.headers.get("content-type") ?? "";
  if (!type.includes("text/html") && !type.includes("application/xhtml+xml")) throw new Error(`Unsupported ${type || "content type"}`);
  return { html: (await response.text()).slice(0, 2_000_000), finalUrl: response.url };
}

async function inspectPlace(place) {
  const start = websiteUrl(place.website);
  if (!start) return { id: place.id, name: place.name, website: place.website, status: "invalid_website", candidates: [] };
  const pages = [];
  const errors = [];
  try {
    const home = await fetchHtml(start.href);
    pages.push(home);
    for (const link of extractContactLinks(home.html, home.finalUrl)) {
      if (pages.length >= 5) break;
      try { pages.push(await fetchHtml(link)); } catch (error) { errors.push(`${link}: ${error.message}`); }
    }
  } catch (error) {
    errors.push(`${start.href}: ${error.message}`);
  }

  const candidates = new Map();
  for (const page of pages) {
    const host = new URL(page.finalUrl).hostname;
    for (const candidate of extractCandidates(page.html, page.finalUrl, host)) {
      const previous = candidates.get(candidate.email);
      if (!previous || candidate.score > previous.score) candidates.set(candidate.email, candidate);
    }
  }
  const ranked = [...candidates.values()].sort((a, b) => b.score - a.score || a.email.localeCompare(b.email));
  const accepted = ranked.filter((item) => item.score >= 90 && !BLOCKED_EMAILS.has(item.email));
  return {
    id: place.id,
    name: place.name,
    city: place.city,
    website: place.website,
    status: accepted.length ? "found" : pages.length ? "not_found" : "fetch_failed",
    selectedEmail: accepted[0]?.email ?? null,
    candidates: ranked,
    pagesChecked: pages.map((page) => page.finalUrl),
    errors,
  };
}

async function mapConcurrent(items, limit, worker) {
  const results = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (true) {
      const index = cursor++;
      if (index >= items.length) return;
      results[index] = await worker(items[index]);
      process.stdout.write(`\rChecked ${index + 1}/${items.length}`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  process.stdout.write("\n");
  return results;
}

const raw = await fs.readFile(DATA_PATH, "utf8");
const places = JSON.parse(raw);
if (APPLY_REPORT) {
  const report = JSON.parse(await fs.readFile(REPORT_PATH, "utf8"));
  const selectedById = new Map(
    report.results
      .filter((item) => item.selectedEmail && !BLOCKED_EMAILS.has(item.selectedEmail))
      .map((item) => [item.id, item.selectedEmail]),
  );
  for (const [id, manual] of MANUAL_EMAILS) selectedById.set(id, manual.email);
  let appliedCount = 0;
  for (const place of places) {
    const email = selectedById.get(place.id);
    if (email && (!Array.isArray(place.emails) || place.emails.length === 0)) {
      place.emails = [email];
      appliedCount += 1;
    }
  }
  await fs.writeFile(DATA_PATH, `${JSON.stringify(places, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ appliedCount, sourceReport: REPORT_PATH }, null, 2));
  process.exit(0);
}
const bienvenueCanonicalUrls = loadBienvenueCanonicalUrls();
const targets = places
  .filter((place) => !DUPLICATE_IDS.has(place.id) && (!Array.isArray(place.emails) || place.emails.length === 0))
  .map((place) => ({ ...place, researchWebsite: place.website || bienvenueCanonicalUrls.get(place.id) || null }))
  .filter((place) => websiteUrl(place.researchWebsite));
const results = await mapConcurrent(targets, 8, (place) => inspectPlace({ ...place, website: place.researchWebsite }));
for (const item of results) {
  const manual = MANUAL_EMAILS.get(item.id);
  if (!manual) continue;
  item.status = "manual_verified";
  item.selectedEmail = manual.email;
  item.candidates.unshift({ email: manual.email, score: 200, sourceType: "manual_verified", sourceUrl: manual.sourceUrl });
}
const found = results.filter((item) => item.selectedEmail);
const emailOwners = new Map();
for (const item of found) {
  if (!emailOwners.has(item.selectedEmail)) emailOwners.set(item.selectedEmail, []);
  emailOwners.get(item.selectedEmail).push(item.id);
}
const duplicates = new Set([...emailOwners].filter(([, ids]) => ids.length > 1).map(([email]) => email));
for (const item of found) {
  if (duplicates.has(item.selectedEmail)) {
    item.status = "duplicate_email";
    item.selectedEmail = null;
  }
}

if (APPLY) {
  const byId = new Map(results.filter((item) => item.selectedEmail).map((item) => [item.id, item.selectedEmail]));
  for (const place of places) {
    const email = byId.get(place.id);
    if (email) place.emails = [email];
  }
  await fs.writeFile(DATA_PATH, `${JSON.stringify(places, null, 2)}\n`, "utf8");
}

await fs.mkdir(REPORT_DIR, { recursive: true });
await fs.writeFile(REPORT_PATH, `${JSON.stringify({
  generatedAt: new Date().toISOString(),
  applied: APPLY,
  targetCount: targets.length,
  foundCount: results.filter((item) => item.selectedEmail).length,
  duplicateEmailCount: duplicates.size,
  notFoundCount: results.filter((item) => item.status === "not_found").length,
  fetchFailedCount: results.filter((item) => item.status === "fetch_failed").length,
  results,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  targetCount: targets.length,
  foundCount: results.filter((item) => item.selectedEmail).length,
  duplicateEmailCount: duplicates.size,
  notFoundCount: results.filter((item) => item.status === "not_found").length,
  fetchFailedCount: results.filter((item) => item.status === "fetch_failed").length,
  applied: APPLY,
  report: REPORT_PATH,
}, null, 2));
