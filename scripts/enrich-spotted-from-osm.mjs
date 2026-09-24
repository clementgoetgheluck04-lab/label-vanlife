import fs from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const DATA_PATH = path.join(ROOT, "src", "data", "member-camping-network.json");
const REPORT_PATH = path.join(ROOT, "artifacts", "spotted-osm-enrichment.json");
const APPLY = process.argv.includes("--apply");
const APPLY_REPORT = process.argv.includes("--apply-report");
const DUPLICATE_IDS = new Set([
  "papa-rtenaires-camping-de-gracay",
  "bienvenue-ferme-ferme-la-communion",
  "papa-rtenaires-camping-la-plage",
  "papa-rtenaires-camping-le-moulin-du-bel-air",
]);
const GENERIC = new Set(["a", "au", "aux", "camp", "camping", "de", "des", "du", "la", "le", "les", "l", "municipal", "site"]);

if (APPLY_REPORT) {
  const places = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
  const report = JSON.parse(await fs.readFile(REPORT_PATH, "utf8"));
  const existingEmails = new Set(places.flatMap((place) => place.emails ?? []).map((email) => String(email).toLowerCase()));
  let emailCount = 0;
  let websiteCount = 0;
  let skippedExistingEmail = 0;
  const byId = new Map(report.results.map((item) => [item.id, item]));
  for (const place of places) {
    const result = byId.get(place.id);
    if (!result) continue;
    if (result.email && (!Array.isArray(place.emails) || place.emails.length === 0)) {
      if (existingEmails.has(result.email.toLowerCase())) {
        skippedExistingEmail += 1;
      } else {
        place.emails = [result.email];
        existingEmails.add(result.email.toLowerCase());
        emailCount += 1;
      }
    }
    if (result.website && !place.website) {
      place.website = result.website;
      websiteCount += 1;
    }
  }
  await fs.writeFile(DATA_PATH, `${JSON.stringify(places, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ emailCount, websiteCount, skippedExistingEmail, sourceReport: REPORT_PATH }, null, 2));
  process.exit(0);
}

function normalized(value) {
  return String(value ?? "").normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function tokens(value) {
  return new Set(normalized(value).split(/\s+/).filter((token) => token.length > 1 && !GENERIC.has(token)));
}

function similarity(left, right) {
  const a = tokens(left);
  const b = tokens(right);
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
}

function distanceMeters(aLat, aLng, bLat, bLng) {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(bLat - aLat);
  const dLng = radians(bLng - aLng);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(radians(aLat)) * Math.cos(radians(bLat)) * Math.sin(dLng / 2) ** 2;
  return 6_371_000 * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function normalizeEmail(value) {
  return String(value ?? "").replace(/^mailto:/i, "").split(/[;,\s]+/)[0].trim().toLowerCase();
}

function validEmail(value) {
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)
    && !/^(example|test|demo|noreply|no-reply)@/i.test(value);
}

function validWebsite(value) {
  if (!value?.trim()) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(value.trim()) ? value.trim() : `https://${value.trim()}`);
    if (!/^https?:$/.test(url.protocol)) return null;
    return url.href;
  } catch {
    return null;
  }
}

const boxes = [
  [46, -5.5, 51.6, 2.5],
  [46, 2.5, 51.6, 10],
  [41, -5.5, 46, 2.5],
  [41, 2.5, 46, 10],
];
const endpoints = ["https://overpass.kumi.systems/api/interpreter", "https://overpass-api.de/api/interpreter"];
const elements = [];
for (const box of boxes) {
  const bbox = box.join(",");
  const query = `[out:json][timeout:120];(
    nwr["tourism"="camp_site"]["email"](${bbox});
    nwr["tourism"="camp_site"]["contact:email"](${bbox});
    nwr["tourism"="camp_site"]["website"](${bbox});
    nwr["tourism"="camp_site"]["contact:website"](${bbox});
    nwr["tourism"="caravan_site"]["email"](${bbox});
    nwr["tourism"="caravan_site"]["contact:email"](${bbox});
    nwr["tourism"="caravan_site"]["website"](${bbox});
    nwr["tourism"="caravan_site"]["contact:website"](${bbox});
  );out center tags;`;
  let loaded = null;
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(150_000),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
          "user-agent": "LabelVanlifeContactResearch/1.0 (contact@labelvanlife.com)",
        },
        body: new URLSearchParams({ data: query }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`);
      loaded = await response.json();
      break;
    } catch (error) {
      lastError = error;
    }
  }
  if (!loaded) throw new Error(`Overpass failed for ${bbox}: ${lastError?.message}`);
  elements.push(...loaded.elements);
  console.log(`Loaded OSM box ${bbox}: ${loaded.elements.length} elements`);
}

const uniqueElements = new Map(elements.map((element) => [`${element.type}/${element.id}`, element]));
const candidates = [...uniqueElements.values()].map((element) => {
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  const tags = element.tags ?? {};
  const email = normalizeEmail(tags["contact:email"] || tags.email || tags["contact:mail"] || "");
  const website = validWebsite(tags["contact:website"] || tags.website || tags.url || "");
  return {
    osmType: element.type,
    osmId: element.id,
    lat,
    lng,
    name: tags.name || tags["official_name"] || "",
    email: validEmail(email) ? email : null,
    website,
    sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
  };
}).filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng) && (item.email || item.website));

const places = JSON.parse(await fs.readFile(DATA_PATH, "utf8"));
const targets = places.filter((place) => !DUPLICATE_IDS.has(place.id) && (!Array.isArray(place.emails) || place.emails.length === 0) && Number.isFinite(place.lat) && Number.isFinite(place.lng));
const results = [];
for (const place of targets) {
  const nearby = candidates
    .map((candidate) => ({ ...candidate, distance: distanceMeters(place.lat, place.lng, candidate.lat, candidate.lng), nameSimilarity: similarity(place.name, candidate.name) }))
    .filter((candidate) => candidate.distance <= 1_200)
    .sort((a, b) => a.distance - b.distance || b.nameSimilarity - a.nameSimilarity);
  const accepted = nearby.find((candidate) =>
    (candidate.distance <= 120 && candidate.nameSimilarity >= 0.15)
    || (candidate.distance <= 350 && candidate.nameSimilarity >= 0.3)
    || (candidate.distance <= 1_200 && candidate.nameSimilarity >= 0.6));
  if (!accepted) continue;
  results.push({
    id: place.id,
    name: place.name,
    city: place.city,
    matchedName: accepted.name,
    distanceMeters: Math.round(accepted.distance),
    nameSimilarity: Number(accepted.nameSimilarity.toFixed(3)),
    email: accepted.email,
    website: accepted.website,
    sourceUrl: accepted.sourceUrl,
  });
}

const emailCounts = new Map();
for (const item of results) if (item.email) emailCounts.set(item.email, (emailCounts.get(item.email) ?? 0) + 1);
for (const item of results) if (item.email && emailCounts.get(item.email) > 1) item.email = null;

if (APPLY) {
  const byId = new Map(results.map((item) => [item.id, item]));
  for (const place of places) {
    const result = byId.get(place.id);
    if (!result) continue;
    if (result.email && (!Array.isArray(place.emails) || place.emails.length === 0)) place.emails = [result.email];
    if (result.website && !place.website) place.website = result.website;
  }
  await fs.writeFile(DATA_PATH, `${JSON.stringify(places, null, 2)}\n`, "utf8");
}

await fs.mkdir(path.dirname(REPORT_PATH), { recursive: true });
await fs.writeFile(REPORT_PATH, `${JSON.stringify({ generatedAt: new Date().toISOString(), applied: APPLY, osmCandidates: candidates.length, targetCount: targets.length, matchCount: results.length, emailCount: results.filter((item) => item.email).length, websiteOnlyCount: results.filter((item) => !item.email && item.website).length, results }, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ osmCandidates: candidates.length, targetCount: targets.length, matchCount: results.length, emailCount: results.filter((item) => item.email).length, websiteOnlyCount: results.filter((item) => !item.email && item.website).length, applied: APPLY, report: REPORT_PATH }, null, 2));
