import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function source(path: string) {
  return readFileSync(new URL(path, import.meta.url), "utf8");
}

test("prospection is disabled unless explicitly enabled and caps daily volume", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /PROSPECTION_AUTOMATION_ENABLED === "true"/);
  assert.match(engine, /Math\.min\(Math\.max\(value, 1\), 25\)/);
  assert.match(engine, /parisWeekday === "Sat" \|\| parisWeekday === "Sun"/);
  assert.match(engine, /alreadySentToday = await prisma\.prospectMessage\.count/);
  assert.match(engine, /remainingDailyCapacity = Math\.max\(0, prospectingDailyLimit\(\) - alreadySentToday\)/);
  assert.match(engine, /dailyLimitReached: true/);
  assert.match(engine, /take: remainingDailyCapacity/);
});

test("missing camping contacts are escalated once in manageable research batches", () => {
  const engine = source("../src/server/prospection.ts");
  const places = JSON.parse(source("../src/data/member-camping-network.json")) as Array<{
    id: string;
    emails?: string[];
  }>;
  const goutilier = places.find((place) => place.id === "bienvenue-ferme-camping-le-goutilier");
  const labau = places.find((place) => place.id === "bienvenue-ferme-camping-a-la-ferme-labau");
  const roumavagi = places.find((place) => place.id === "bienvenue-ferme-camping-a-la-ferme-roumavagi");
  const fontaine = places.find((place) => place.id === "papa-rtenaires-camping-la-fontaine-des-clercs");
  const spottedFontaine = places.find((place) => place.id === "label-repere-camping-la-fontaine-des-clercs-point-gps");
  const sorbier = places.find((place) => place.id === "papa-rtenaires-camping-le-sorbier");
  const auzerals = places.find((place) => place.id === "papa-rtenaires-camping-les-auzerals");
  const chesnets = places.find((place) => place.id === "label-repere-camping-mbs-les-chesnets-point-gps");
  const abeilleAuFruit = places.find((place) => place.id === "bienvenue-ferme-de-l-abeille-au-fruit-le-camping-du-verger");

  assert.equal(goutilier?.emails?.[0], "dufraisse.m@wanadoo.fr");
  assert.equal(labau?.emails?.[0], "guydelrieu@dartybox.com");
  assert.equal(roumavagi?.emails?.[0], "camping.roumavagi@gmail.com");
  assert.equal(fontaine?.emails?.[0], "contact@lafontainedesclercs.fr");
  assert.equal(spottedFontaine?.emails?.[0], "contact@lafontainedesclercs.fr");
  assert.equal(sorbier?.emails?.[0], "campinglesorbier@gmail.com");
  assert.equal(auzerals?.emails?.[0], "campinglesauzerals@gmail.com");
  assert.equal(chesnets?.emails?.[0], "mbsleschesnets@gmail.com");
  assert.equal(abeilleAuFruit?.emails?.[0], "delabeilleaufruit@gmail.com");
  assert.match(engine, /MISSING_CONTACT_DIGEST_SIZE = 15/);
  assert.match(engine, /PROSPECTION_MISSING_CONTACTS_DIGEST/);
  assert.match(engine, /alreadyNotified\.has\(place\.id\)/);
  assert.match(engine, /sendNeedHumanAlert\(`\$\{batch\.length\} campings sans adresse email`/);
  assert.match(engine, /researchRequested = await sendMissingProspectContactDigest\(\)/);
});

test("a newly verified email only replaces an untouched prospect contact", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /current\?\.status === "NEW" && current\.followUpCount === 0 && !current\.firstContactedAt/);
  assert.match(engine, /current\?\.status === "INVALID"/);
  assert.match(engine, /contactRevision: bounced \? currentRevision \+ 1 : currentRevision/);
  assert.match(engine, /campaignKey = `prospection:\$\{stage\.toLowerCase\(\)\}:\$\{prospect\.id\}\$\{contactRevision\}`/);
  assert.match(engine, /suppressed\.has\(email\)/);
});

test("silent prospects stop after message three and opposition controls remain available", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /ACTIVE_STATUSES[^\n]+"NEW", "CONTACTED", "FOLLOW_UP_1", "ENGAGED"/);
  assert.match(engine, /Sans clic ni réponse, aucune autre relance automatique/);
  assert.match(engine, /stage === "FOLLOW_UP_1"[\s\S]+"FOLLOW_UP_2"/);
  assert.match(engine, /List-Unsubscribe/);
  assert.match(engine, /List-Unsubscribe-Post/);
  assert.match(engine, /getProspectionEmailFrom/);
  assert.match(engine, /List-ID/);
  assert.match(engine, /Feedback-ID/);
  assert.match(engine, /prospectSuppression/);
  assert.match(engine, /idempotencyKey: campaignKey/);
});

test("deliverability guard pauses on complaints or a sustained high bounce rate", () => {
  const engine = source("../src/server/prospection.ts");
  assert.match(engine, /MINIMUM_SAMPLE_FOR_BOUNCE_PAUSE = 100/);
  assert.match(engine, /MAXIMUM_BOUNCE_RATE = 0\.04/);
  assert.match(engine, /complaints > 0 \|\| \(sent >= MINIMUM_SAMPLE_FOR_BOUNCE_PAUSE/);
  assert.match(engine, /PROSPECTION_DELIVERABILITY_ALERT/);
  assert.match(engine, /safetyPaused: true/);
});

test("first contact is designed for decision makers and measures two variants", () => {
  const engine = source("../src/server/prospection.ts");
  const dashboardApi = source("../src/app/api/admin/prospection/route.ts");
  const dashboardPage = source("../src/app/admin/prospection/page.tsx");
  assert.match(engine, /À l’attention de la direction/);
  assert.match(engine, /personne chargée du développement commercial/);
  assert.match(engine, /pourriez-vous simplement le lui transmettre/);
  assert.match(engine, /initialVariantFor/);
  assert.match(engine, /name: "variant"/);
  assert.match(engine, /0 % de commission/);
  assert.match(engine, /utm_source", "label_vanlife"/);
  assert.match(engine, /utm_medium", "email"/);
  assert.match(engine, /utm_campaign", `prospection_2027_\$\{stage\.toLowerCase\(\)\}`/);
  assert.match(engine, /utm_content", `\$\{variant\}_\$\{action\}`/);
  assert.match(dashboardApi, /initialSubject/);
  assert.match(dashboardApi, /clickers: clickers\.size/);
  assert.match(dashboardPage, /Test des objets du premier email/);
  assert.match(dashboardPage, /30 envois par variante et 5 engagements cumulés/);
});

test("engaged prospects receive the complete ten-message editorial journey", () => {
  const engine = source("../src/server/prospection.ts");
  for (const stage of ["VANLIFE_NEWS", "VANLIFE_STATS", "WILD_SPOTS", "OFFER_7", "DREAM", "TESTIMONIAL", "OFFER_10"]) {
    assert.match(engine, new RegExp(stage));
  }
  assert.match(engine, /prospect\.status === "ENGAGED"/);
  assert.match(engine, /progress >= 10[\s\S]+"FOLLOW_UP_2"/);
  assert.match(engine, /Fin définitive du parcours automatique après ce message/);
});

test("Resend inbound webhook is signed and escalates ambiguous replies", () => {
  const webhook = source("../src/app/api/webhooks/resend/route.ts");
  assert.match(webhook, /resend\.webhooks\.verify/);
  assert.match(webhook, /RESEND_WEBHOOK_SECRET/);
  assert.match(webhook, /email\.received/);
  assert.match(webhook, /email\.clicked/);
  assert.match(webhook, /status: "ENGAGED"/);
  assert.match(webhook, /clickEventIds/);
  assert.match(webhook, /lastClickedPath/);
  assert.match(webhook, /lastEmailClickAction/);
  assert.match(webhook, /webhookEventId/);
  assert.match(webhook, /labelvanlife\\\.\(fr\|com\)/);
  assert.match(webhook, /\["CONTACTED", "FOLLOW_UP_1", "FOLLOW_UP_2"\]/);
  assert.match(webhook, /NEEDS_HUMAN/);
  assert.match(webhook, /sendNeedHumanAlert/);
  assert.match(webhook, /email\.bounced/);
  assert.match(webhook, /Adresse invalide pour \$\{message\.prospect\.name\}/);
  assert.match(webhook, /email\.complained/);
});

test("professional email click measurement is transparent and distinct from consented site analytics", () => {
  const privacy = source("../src/app/politique-confidentialite/page.tsx");
  assert.match(privacy, /Événements techniques des emails professionnels/);
  assert.match(privacy, /clic des emails de prospection/);
  assert.match(privacy, /ne dépose pas de cookie publicitaire/);
  assert.match(privacy, /navigation détaillée[\s\S]+choix de statistiques/);
});

test("labellisation and payment feed the sales pipeline", () => {
  const draft = source("../src/app/api/labellisation/submit-draft/route.ts");
  const stripe = source("../src/app/api/stripe/webhook/route.ts");
  assert.match(draft, /status: "QUALIFIED"/);
  assert.match(stripe, /status: "CONVERTED"/);
});

test("refusals and opt-outs remove spotted places from every visible catalogue", () => {
  const visibility = source("../src/server/spotted-visibility.ts");
  const publicCatalog = source("../src/app/api/public/catalog/route.ts");
  const memberNetwork = source("../src/app/api/member/camping-network/route.ts");
  const spottedPage = source("../src/app/lieux-reperes/[id]/page.tsx");

  assert.match(visibility, /"NOT_INTERESTED", "UNSUBSCRIBED"/);
  assert.match(visibility, /return \[\]/);
  assert.match(publicCatalog, /getVisibleSpottedPlaces/);
  assert.match(publicCatalog, /private, no-store/);
  assert.match(memberNetwork, /getVisibleSpottedPlaces/);
  assert.match(spottedPage, /getVisibleSpottedPlace/);
});
