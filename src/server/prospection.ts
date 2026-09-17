import "server-only";

import { Resend } from "resend";
import { Prisma, type Prospect, type ProspectStatus } from "@/generated/prisma/client";
import { SPOTTED_PLACES } from "@/data/spotted-places";
import { INTERNATIONAL_PROSPECTION_CANDIDATES } from "@/data/international-places";
import { getPrisma } from "@/lib/prisma";
import { labelVanlifeEmail } from "@/server/email-template";
import { getAppUrl, getBackOfficeEmails, getProspectionEmailFrom, getTransactionalEmailFrom, requireServerEnv } from "@/server/env";

const DAY = 24 * 60 * 60 * 1_000;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ACTIVE_STATUSES: ProspectStatus[] = ["NEW", "CONTACTED", "FOLLOW_UP_1", "ENGAGED"];
const MISSING_CONTACT_DIGEST_ACTION = "PROSPECTION_MISSING_CONTACTS_DIGEST";
const MISSING_CONTACT_DIGEST_SIZE = 15;
const DELIVERABILITY_ALERT_ACTION = "PROSPECTION_DELIVERABILITY_ALERT";
const DELIVERABILITY_WINDOW_DAYS = 30;
const MINIMUM_SAMPLE_FOR_BOUNCE_PAUSE = 100;
const MAXIMUM_BOUNCE_RATE = 0.04;

type ProspectSourcePlace = {
  id: string;
  name: string;
  contactName?: string | null;
  emails?: string[];
  website?: string | null;
  city?: string;
  region?: string;
  network: string;
  postalCode?: string;
  source?: string;
  sourceUrl?: string;
  country?: string;
  selectionNote?: string;
  publishAsSpotted?: boolean;
};

const internationalSourceIds = new Set(INTERNATIONAL_PROSPECTION_CANDIDATES.map((place) => place.id));
const PROSPECTION_PLACES: ProspectSourcePlace[] = [
  ...INTERNATIONAL_PROSPECTION_CANDIDATES.map((place) => ({
    ...place,
    emails: [place.email],
    postalCode: "",
  })),
  ...SPOTTED_PLACES.filter((place) => !internationalSourceIds.has(place.id)),
];

export type ProspectingStage =
  | "INITIAL"
  | "FOLLOW_UP_1"
  | "OFFER_3"
  | "VANLIFE_NEWS"
  | "VANLIFE_STATS"
  | "WILD_SPOTS"
  | "OFFER_7"
  | "DREAM"
  | "TESTIMONIAL"
  | "OFFER_10";

export function normalizeProspectEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isProspectingEnabled(): boolean {
  return process.env.PROSPECTION_AUTOMATION_ENABLED === "true";
}

export function prospectingDailyLimit(): number {
  const value = Number.parseInt(process.env.PROSPECTION_DAILY_LIMIT || "8", 10);
  return Number.isFinite(value) ? Math.min(Math.max(value, 1), 25) : 8;
}

export function getProspectionReplyTo(): string {
  return process.env.PROSPECTION_REPLY_TO || "contact@labelvanlife.com";
}

function stageForProspect(prospect: Prospect): ProspectingStage | null {
  if (prospect.status === "NEW") return "INITIAL";
  if (prospect.status === "CONTACTED") return "FOLLOW_UP_1";
  if (prospect.status === "FOLLOW_UP_1") return "OFFER_3";
  if (prospect.status === "ENGAGED") {
    const engagedStages: Record<number, ProspectingStage> = {
      1: "FOLLOW_UP_1",
      2: "OFFER_3",
      3: "VANLIFE_NEWS",
      4: "VANLIFE_STATS",
      5: "WILD_SPOTS",
      6: "OFFER_7",
      7: "DREAM",
      8: "TESTIMONIAL",
      9: "OFFER_10",
    };
    return engagedStages[prospect.followUpCount] || null;
  }
  return null;
}

function cleanName(value: string | null | undefined): string | null {
  const name = value?.trim();
  return name ? name.slice(0, 100) : null;
}

function greeting(prospect: Prospect): string {
  return prospect.contactName ? `Bonjour ${prospect.contactName},` : "Bonjour,";
}

type InitialVariant = "direction" | "opportunity";

function initialVariantFor(prospect: Prospect): InitialVariant {
  const score = [...prospect.email].reduce((total, character) => total + character.charCodeAt(0), 0);
  return score % 2 === 0 ? "direction" : "opportunity";
}

function unsubscribeUrl(prospect: Prospect): string {
  return `${getAppUrl()}/desinscription?token=${encodeURIComponent(prospect.unsubscribeToken)}`;
}

function candidatureUrl(prospect: Prospect): string {
  const url = new URL("/labellisation/candidature", getAppUrl());
  if (prospect.sourceId) url.searchParams.set("claim", prospect.sourceId);
  return url.href;
}

function trackedProspectionUrl(
  prospect: Prospect,
  stage: ProspectingStage,
  href: string,
  action: string,
): string {
  const url = new URL(href, getAppUrl());
  const appUrl = new URL(getAppUrl());
  if (url.origin !== appUrl.origin) return url.href;
  const variant = stage === "INITIAL" ? initialVariantFor(prospect) : "standard";
  url.searchParams.set("utm_source", "label_vanlife");
  url.searchParams.set("utm_medium", "email");
  url.searchParams.set("utm_campaign", `prospection_2027_${stage.toLowerCase()}`);
  url.searchParams.set("utm_content", `${variant}_${action}`);
  return url.href;
}

function messageFor(prospect: Prospect, stage: ProspectingStage) {
  const city = prospect.city ? ` à ${prospect.city}` : "";
  const unsubscribe = unsubscribeUrl(prospect);
  const track = (href: string, action: string) => trackedProspectionUrl(prospect, stage, href, action);
  const concept = track("/le-label", "concept");
  const labellisation = track("/labellisation", "labellisation");
  const candidature = track(candidatureUrl(prospect), "candidature");
  const explorer = track("/explorer", "explorer");
  const legal = `Pourquoi cet email ? Les coordonnées professionnelles publiques de ${prospect.name} ont été utilisées uniquement pour présenter une offre en lien direct avec son activité d’accueil. Label Vanlife — 10 chemin des Écoles, 31260 Montsaunès — contact@labelvanlife.com.`;

  if (stage === "INITIAL") {
    const variant = initialVariantFor(prospect);
    const subject = variant === "direction"
      ? `À l’attention de la direction de ${prospect.name}`
      : `${prospect.name} : les vans de passage peuvent devenir des clients`;
    const paragraphs = [
      "Ce message concerne la direction ou la personne chargée du développement commercial. Si ce n’est pas vous, pourriez-vous simplement le lui transmettre ? Merci.",
      `Nous avons repéré ${prospect.name}${city} comme un lieu susceptible de bien accueillir les voyageurs en van. Beaucoup dorment encore sur un parking ou un spot sauvage voisin, non parce qu’ils refusent de payer, mais parce qu’ils ignorent qu’une adresse adaptée existe à quelques minutes.`,
      "Label Vanlife rend les établissements partenaires visibles au moment où ces voyageurs choisissent leur étape : fiche détaillée, présence sur la MAP privée et avantage réservé aux membres. Vous gardez vos tarifs, vos disponibilités et vos outils habituels ; nous ne prenons aucune commission sur les réservations.",
      "Puis-je vous laisser découvrir le concept en deux minutes et me dire simplement si cette clientèle peut vous intéresser pour 2027 ?",
    ];
    const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nDécouvrir le concept : ${concept}\nÉtudier la labellisation : ${candidature}\n\n${legal}\nDésinscription : ${unsubscribe}`;
    return {
      subject,
      text,
      html: labelVanlifeEmail({
        preheader: `Une proposition concrète à transmettre à la direction de ${prospect.name}`,
        eyebrow: "À L’ATTENTION DE LA DIRECTION",
        title: "Les vans qui passent près de chez vous peuvent devenir des clients.",
        greeting: greeting(prospect),
        paragraphs,
        action: { label: "Découvrir le concept", href: concept },
        secondaryAction: { label: "Étudier la labellisation", href: candidature },
        notice: "Aucun changement de logiciel, aucune commission et aucune promesse artificielle de réservation : nous travaillons la visibilité et la confiance.",
        legalFooter: legal,
        unsubscribeHref: unsubscribe,
        signature: "Clément — Label Vanlife",
      }),
    };
  }

  if (stage === "FOLLOW_UP_1") {
    const subject = `Direction de ${prospect.name} — dois-je vous présenter Label Vanlife ?`;
    const paragraphs = [
      `Je me permets un seul rappel au sujet de ${prospect.name}${city}. Mon précédent message était destiné à la direction ou à la personne qui développe les nuitées et les partenariats.`,
      "L’idée tient en une phrase : montrer votre établissement aux vanlifers avant qu’ils choisissent un parking ou un spot sauvage, sans commission et sans modifier votre façon de travailler.",
      "Un simple retour suffit : « à étudier », « pas cette année » ou « non merci ». Vous pouvez aussi consulter la présentation en deux minutes.",
    ];
    const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nDécouvrir Label Vanlife : ${concept}\n\n${legal}\nDésinscription : ${unsubscribe}`;
    return {
      subject,
      text,
      html: labelVanlifeEmail({
        preheader: "Un rappel court, sans engagement et sans commission",
        eyebrow: "LABEL VANLIFE 2027",
        title: "Est-ce un sujet utile pour votre direction ?",
        greeting: greeting(prospect),
        paragraphs,
        action: { label: "Découvrir Label Vanlife", href: concept },
        secondaryAction: { label: "Voir la labellisation", href: labellisation },
        legalFooter: legal,
        unsubscribeHref: unsubscribe,
        signature: "Clément — Label Vanlife",
      }),
    };
  }

  if (stage === "OFFER_3") {
    const subject = `${prospect.name} — la proposition Label Vanlife 2027 en chiffres`;
    const paragraphs = [
      `Pour permettre à la direction de ${prospect.name}${city} de décider rapidement, voici la proposition complète en chiffres.`,
      "La prévente 2027 est à 110 € au lieu de 290 €, dans la limite des places disponibles. Elle comprend l’étude, la fiche, la présence sur la MAP, le kit de communication et l’accompagnement jusqu’au 31 décembre 2027, avec 0 % de commission sur vos réservations.",
      "Sans clic ni réponse, je considérerai que le moment n’est pas le bon et les relances s’arrêteront ici. Si le sujet vous intéresse, le dossier se remplit directement en ligne.",
    ];
    const text = `${greeting(prospect)}\n\n${paragraphs.join("\n\n")}\n\nVoir la labellisation : ${labellisation}\n\n${legal}\nDésinscription : ${unsubscribe}`;
    return {
      subject,
      text,
      html: labelVanlifeEmail({
        preheader: "L’offre 2027 et les outils remis à chaque établissement",
        eyebrow: "OFFRE LABEL VANLIFE 2027",
        title: "À vous de choisir la suite",
        greeting: greeting(prospect),
        paragraphs,
        details: [
          { label: "Prévente 2027", value: "110 € au lieu de 290 €" },
          { label: "Commission", value: "0 % sur les réservations" },
          { label: "Validité", value: "Jusqu’au 31 décembre 2027" },
        ],
        action: { label: "Découvrir la labellisation", href: labellisation },
        secondaryAction: { label: "Déposer ma candidature", href: candidature },
        notice: "Sans clic ni réponse, aucune autre relance automatique ne sera envoyée.",
        legalFooter: legal,
        unsubscribeHref: unsubscribe,
        signature: "Clément — Label Vanlife",
      }),
    };
  }

  const editorial = {
    VANLIFE_NEWS: {
      subject: "La dynamique du plein air continue de progresser",
      eyebrow: "ACTUALITÉ VANLIFE",
      title: "Le voyage en plein air gagne encore du terrain",
      paragraphs: [
        "La saison 2025 a confirmé l’intérêt des voyageurs pour l’hôtellerie de plein air : 124,9 millions de nuitées ont été enregistrées entre juin et septembre, soit une progression de 3,2 % sur un an selon les données relayées par la FFCC à partir de l’INSEE.",
        `Pour ${prospect.name}, cette tendance représente une occasion concrète : être identifiable par les voyageurs mobiles avant qu’ils choisissent leur prochaine étape.`,
        "Label Vanlife travaille précisément sur ce moment de décision, avec une MAP, des fiches claires et une communauté de voyageurs responsables.",
      ],
      action: { label: "Lire l’actualité source", href: "https://ffcc.fr/actualite/le-camping-champion-indetronable-de-lete-2025/" },
      secondaryAction: { label: "Découvrir notre concept", href: concept },
      notice: "Cette donnée concerne l’hôtellerie de plein air dans son ensemble ; elle ne constitue pas une promesse individuelle de fréquentation.",
    },
    VANLIFE_STATS: {
      subject: "Près d’un million de voyageurs en véhicules de loisirs",
      eyebrow: "LE CHIFFRE À RETENIR",
      title: "Un marché mobile qui cherche ses prochaines étapes",
      paragraphs: [
        "La Direction générale des Entreprises indique que 600 000 camping-cars sont utilisés en France par près d’un million de personnes, représentant environ 27 millions de nuitées par an.",
        "Ces voyageurs ne cherchent pas tous la même chose, mais ils ont un besoin commun : comprendre rapidement où ils peuvent s’arrêter, ce qu’ils trouveront sur place et comment ils seront accueillis.",
        `C’est cette lisibilité que Label Vanlife veut apporter à des établissements comme ${prospect.name}.`,
      ],
      action: { label: "Consulter la source officielle", href: "https://www.entreprises.gouv.fr/espace-entreprises/s-informer-sur-la-reglementation/les-terrains-de-camping-amenages-et-parcs" },
      secondaryAction: { label: "Voir Label Vanlife", href: concept },
      notice: "Chiffres nationaux communiqués par la Direction générale des Entreprises ; aucune fréquentation individuelle n’est garantie.",
    },
    WILD_SPOTS: {
      subject: "Votre concurrent le plus discret est peut-être le parking voisin",
      eyebrow: "LE MANQUE À GAGNER INVISIBLE",
      title: "Les spots sauvages ne font aucune publicité — mais ils captent des voyageurs",
      paragraphs: [
        "Un van garé gratuitement sur un parking ou un spot sauvage à proximité n’est pas forcément un voyageur qui refuse de payer. Souvent, il ignore simplement qu’un lieu adapté existe à quelques minutes et qu’il y serait réellement bien accueilli.",
        `Pour ${prospect.name}, chaque étape non identifiée peut devenir un manque à gagner discret : une nuitée, un repas, une activité ou une recommandation qui n’aura pas lieu.`,
        "Label Vanlife ne promet pas de supprimer le sauvage. Le label donne une raison claire de choisir votre établissement : accueil vérifié, informations utiles, avantage membre et confiance avant l’arrivée.",
      ],
      action: { label: "Voir comment le label vous rend visible", href: labellisation },
      secondaryAction: { label: "Découvrir la MAP", href: explorer },
      notice: "Notre approche valorise un accueil responsable sans dénigrer la liberté de voyager.",
    },
    OFFER_7: {
      subject: "Rappel de l’offre Label Vanlife 2027 — 110 €",
      eyebrow: "OFFRE 2027 · PLACES LIMITÉES",
      title: "Une année complète pour installer votre visibilité",
      paragraphs: [
        `L’intégration de ${prospect.name} au réseau Label Vanlife 2027 est actuellement proposée à 110 € au lieu de 290 €.`,
        "Le prix comprend l’étude du dossier, une fiche détaillée, la présence sur la MAP membre, le kit de communication 2027 et l’accompagnement, sans commission sur les réservations.",
        "Le label est actif dès validation jusqu’au 31 décembre 2027. Si le dossier est déclaré non conforme après étude, le paiement est remboursé intégralement.",
      ],
      action: { label: "Je demande mon label 2027", href: candidature },
      secondaryAction: { label: "Relire toute l’offre", href: labellisation },
      notice: "Paiement unique · 0 % de commission · Aucun renouvellement automatique.",
    },
    DREAM: {
      subject: "Imaginez les bons voyageurs arriver en connaissant déjà votre lieu",
      eyebrow: "PROJECTION 2027",
      title: "Des vanlifers respectueux, informés avant leur arrivée",
      paragraphs: [
        "Imaginez des voyageurs qui découvrent votre fiche avant de prendre la route, comprennent vos règles, vos services et l’esprit de votre accueil, puis arrivent avec leur Carte membre Label Vanlife.",
        "Ils ne viennent pas par hasard : ils ont choisi un lieu qui partage leur envie de voyager proprement, calmement et avec respect. De votre côté, vous savez pourquoi ils viennent et ce qu’ils attendent.",
        `C’est la relation que nous voulons construire entre les membres et ${prospect.name} : moins de malentendus, plus de confiance et davantage de recommandations utiles.`,
      ],
      action: { label: "Projeter mon lieu dans le réseau", href: candidature },
      secondaryAction: { label: "Découvrir les lieux actuels", href: explorer },
      notice: "Le label sélectionne et informe ; il ne promet jamais un volume de réservations.",
    },
    TESTIMONIAL: {
      subject: "Ce qu’une vanlifeuse attend vraiment d’un lieu d’accueil",
      eyebrow: "PAROLE DE VANLIFER",
      title: "« Plus de stress, plus de mauvaises surprises »",
      paragraphs: [
        "« Label Vanlife a changé notre façon de voyager. Plus de stress, plus de mauvaises surprises. » — Hélène Family Vanlifers.",
        "Derrière ce témoignage, le besoin est très simple : savoir avant d’arriver qu’un établissement comprend la vanlife et accueille réellement ce type de voyageur.",
        `Une fiche précise de ${prospect.name}, reliée à une charte et à une Carte membre vérifiable, peut donner cette confiance au moment du choix.`,
      ],
      action: { label: "Comprendre la philosophie du label", href: concept },
      secondaryAction: { label: "Demander mon label", href: candidature },
      notice: "Témoignage déjà publié par Label Vanlife. Les expériences restent personnelles et ne garantissent pas un résultat identique.",
    },
    OFFER_10: {
      subject: `Dernière invitation 2027 pour ${prospect.name}`,
      eyebrow: "DERNIÈRE INVITATION",
      title: "110 € au lieu de 290 € pour rejoindre le réseau 2027",
      paragraphs: [
        `Je termine ici la série consacrée à ${prospect.name}. Si notre vision vous correspond, vous pouvez encore demander votre label 2027 au tarif de prévente de 110 € au lieu de 290 €, dans la limite des places disponibles.`,
        "Vous bénéficiez de la fiche, de la MAP membre, du kit de communication et de l’accompagnement jusqu’au 31 décembre 2027, avec 0 % de commission sur vos réservations.",
        "Sans réponse de votre part, aucun autre message automatique ne sera envoyé. Vous pourrez naturellement revenir vers nous lorsque le moment sera le bon.",
      ],
      action: { label: "Je demande mon label 2027", href: candidature },
      secondaryAction: { label: "Découvrir une dernière fois l’offre", href: labellisation },
      notice: "Fin définitive du parcours automatique après ce message.",
    },
  } satisfies Record<Exclude<ProspectingStage, "INITIAL" | "FOLLOW_UP_1" | "OFFER_3">, {
    subject: string;
    eyebrow: string;
    title: string;
    paragraphs: string[];
    action: { label: string; href: string };
    secondaryAction: { label: string; href: string };
    notice: string;
  }>;
  const content = editorial[stage];
  const text = `${greeting(prospect)}\n\n${content.paragraphs.join("\n\n")}\n\n${content.action.label} : ${content.action.href}\n${content.secondaryAction.label} : ${content.secondaryAction.href}\n\n${legal}\nDésinscription : ${unsubscribe}`;
  return {
    subject: content.subject,
    text,
    html: labelVanlifeEmail({
      preheader: content.title,
      eyebrow: content.eyebrow,
      title: content.title,
      greeting: greeting(prospect),
      paragraphs: content.paragraphs,
      action: content.action,
      secondaryAction: content.secondaryAction,
      notice: content.notice,
      legalFooter: legal,
      unsubscribeHref: unsubscribe,
      signature: "Clément — Label Vanlife",
    }),
  };
}

export async function syncSpottedProspects(): Promise<number> {
  const prisma = getPrisma();
  const unique = new Map<string, ProspectSourcePlace>();
  for (const place of PROSPECTION_PLACES) {
    const email = normalizeProspectEmail(place.emails?.[0] || "");
    if (!EMAIL_PATTERN.test(email) || unique.has(email)) continue;
    unique.set(email, place);
  }

  const existing = await prisma.prospect.findMany({
    select: {
      id: true,
      sourceId: true,
      email: true,
      status: true,
      followUpCount: true,
      firstContactedAt: true,
      metadata: true,
    },
  });
  const known = new Set(existing.map((item) => item.email));
  const bySourceId = new Map(existing.flatMap((item) => item.sourceId ? [[item.sourceId, item] as const] : []));
  const suppressed = new Set((await prisma.prospectSuppression.findMany({
    where: { email: { in: [...unique.keys()] } },
    select: { email: true },
  })).map((item) => item.email));

  const updates = [...unique.entries()].flatMap(([email, place]) => {
    const current = bySourceId.get(place.id);
    const untouched = current?.status === "NEW" && current.followUpCount === 0 && !current.firstContactedAt;
    const bounced = current?.status === "INVALID";
    if (
      !current
      || current.email === email
      || (!untouched && !bounced)
      || known.has(email)
      || suppressed.has(email)
    ) return [];
    known.add(email);
    const metadata = current.metadata && typeof current.metadata === "object" && !Array.isArray(current.metadata)
      ? { ...(current.metadata as Record<string, unknown>) }
      : {};
    const currentRevision = typeof metadata.contactRevision === "number" ? metadata.contactRevision : 0;
    return [{
      id: current.id,
      email,
      place,
      reactivated: bounced,
      metadata: {
        ...metadata,
        previousEmail: current.email,
        contactRevision: bounced ? currentRevision + 1 : currentRevision,
        contactEmailReplacedAt: new Date().toISOString(),
      } as Prisma.InputJsonObject,
    }];
  });

  const rows = [...unique.entries()]
    .filter(([email, place]) => !known.has(email) && !bySourceId.has(place.id) && !suppressed.has(email))
    .map(([email, place]) => ({
      sourceId: place.id,
      name: place.name.slice(0, 180),
      contactName: cleanName(place.contactName),
      email,
      website: place.website,
      city: place.city || null,
      region: place.region || null,
      sourceLabel: place.source || "Repérage Label Vanlife",
      sourceUrl: place.sourceUrl || place.website,
      nextActionAt: new Date(),
      metadata: {
        network: place.network,
        postalCode: place.postalCode,
        country: place.country,
        selectionNote: place.selectionNote,
        publishAsSpotted: place.publishAsSpotted,
      },
    }));
  if (!rows.length && !updates.length) return 0;
  const operations = updates.map(({ id, email, place, reactivated, metadata }) => prisma.prospect.update({
    where: { id },
    data: {
      email,
      name: place.name.slice(0, 180),
      contactName: cleanName(place.contactName),
      website: place.website,
      city: place.city || null,
      region: place.region || null,
      sourceLabel: place.source || "Repérage Label Vanlife",
      sourceUrl: place.sourceUrl || place.website,
      metadata,
      ...(reactivated ? {
        status: "NEW" as const,
        followUpCount: 0,
        firstContactedAt: null,
        lastContactedAt: null,
        nextActionAt: new Date(),
      } : {}),
    },
  }));
  const result = rows.length
    ? await prisma.$transaction([...operations, prisma.prospect.createMany({ data: rows, skipDuplicates: true })])
    : await prisma.$transaction(operations);
  const created = rows.length ? (result.at(-1) as { count: number }).count : 0;
  return updates.length + created;
}

function missingContactKey(place: (typeof SPOTTED_PLACES)[number]): string {
  try {
    const hostname = new URL(place.website || "").hostname.toLowerCase().replace(/^www\./, "");
    if (hostname && !/bienvenue-a-la-ferme\.com|facebook\.com/.test(hostname)) return `host:${hostname}`;
  } catch {
    // Fall back to the establishment identity below.
  }
  const identity = `${place.name}|${place.city}`
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");
  return `place:${identity}`;
}

export async function sendMissingProspectContactDigest(): Promise<number> {
  const prisma = getPrisma();
  const previousDigests = await prisma.adminLog.findMany({
    where: { adminId: "system:prospection", action: MISSING_CONTACT_DIGEST_ACTION },
    select: { metadata: true },
  });
  const alreadyNotified = new Set(previousDigests.flatMap((entry) => {
    if (!entry.metadata || typeof entry.metadata !== "object" || Array.isArray(entry.metadata)) return [];
    const sourceIds = (entry.metadata as Record<string, unknown>).sourceIds;
    return Array.isArray(sourceIds) ? sourceIds.filter((value): value is string => typeof value === "string") : [];
  }));

  const unique = new Map<string, (typeof SPOTTED_PLACES)[number]>();
  for (const place of SPOTTED_PLACES) {
    const email = normalizeProspectEmail(place.emails?.[0] || "");
    const value = `${place.name} ${place.network}`
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
    if (EMAIL_PATTERN.test(email) || !/camping|camp |caravan|bivouac|aire naturelle|glamping/.test(value)) continue;
    if (/^https?:\/\//i.test(place.name) || alreadyNotified.has(place.id)) continue;
    const key = missingContactKey(place);
    if (!unique.has(key)) unique.set(key, place);
  }

  const batch = [...unique.values()].slice(0, MISSING_CONTACT_DIGEST_SIZE);
  if (!batch.length) return 0;
  const details = [
    "Je n’ai pas trouvé d’adresse email professionnelle fiable pour les campings ci-dessous. Pouvez-vous rechercher leurs coordonnées et répondre à ce message avec les adresses trouvées ?",
    "",
    ...batch.flatMap((place, index) => [
      `${index + 1}. ${place.name}${place.city ? ` — ${place.city}` : ""}${place.website ? `\n${place.website}` : ""}`,
      "",
    ]),
  ].join("\n");
  await sendNeedHumanAlert(`${batch.length} campings sans adresse email`, details);
  await prisma.adminLog.create({
    data: {
      adminId: "system:prospection",
      action: MISSING_CONTACT_DIGEST_ACTION,
      target: batch.map((place) => place.id).join(",").slice(0, 2_000),
      metadata: { sourceIds: batch.map((place) => place.id) },
    },
  });
  return batch.length;
}

export async function suppressProspect(email: string, reason: string, source: string): Promise<void> {
  const prisma = getPrisma();
  const normalized = normalizeProspectEmail(email);
  if (!EMAIL_PATTERN.test(normalized)) return;
  const status: ProspectStatus = reason === "bounce" ? "INVALID" : reason === "unsubscribe" || reason === "complaint" ? "UNSUBSCRIBED" : "NOT_INTERESTED";
  await prisma.$transaction([
    prisma.prospectSuppression.upsert({
      where: { email: normalized },
      create: { email: normalized, reason: reason.slice(0, 200), source: source.slice(0, 100) },
      update: { reason: reason.slice(0, 200), source: source.slice(0, 100) },
    }),
    prisma.prospect.updateMany({
      where: { email: normalized },
      data: { status, nextActionAt: null },
    }),
  ]);
}

async function sendOne(prospect: Prospect): Promise<"sent" | "skipped" | "failed"> {
  const stage = stageForProspect(prospect);
  if (!stage) return "skipped";
  const prisma = getPrisma();
  const suppression = await prisma.prospectSuppression.findUnique({ where: { email: prospect.email } });
  if (suppression) {
    await prisma.prospect.update({ where: { id: prospect.id }, data: { status: "UNSUBSCRIBED", nextActionAt: null } });
    return "skipped";
  }

  const metadata = prospect.metadata && typeof prospect.metadata === "object" && !Array.isArray(prospect.metadata)
    ? prospect.metadata as Record<string, unknown>
    : {};
  const contactRevision = typeof metadata.contactRevision === "number" && metadata.contactRevision > 0
    ? `:r${Math.floor(metadata.contactRevision)}`
    : "";
  const campaignKey = `prospection:${stage.toLowerCase()}:${prospect.id}${contactRevision}`;
  let record = await prisma.prospectMessage.findUnique({ where: { campaignKey } });
  if (record?.status === "SENT") return "skipped";

  const claimed = await prisma.prospect.updateMany({
    where: { id: prospect.id, status: prospect.status },
    data: { status: "SENDING" },
  });
  if (!claimed.count) return "skipped";

  const content = messageFor(prospect, stage);
  const variant = stage === "INITIAL" ? initialVariantFor(prospect) : "standard";
  record = record || await prisma.prospectMessage.create({
    data: {
      prospectId: prospect.id,
      direction: "OUTBOUND",
      kind: stage,
      campaignKey,
      subject: content.subject,
      text: content.text,
      metadata: { variant },
    },
  });

  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  let result;
  try {
    result = await resend.emails.send({
      from: getProspectionEmailFrom(),
      to: prospect.email,
      replyTo: getProspectionReplyTo(),
      subject: content.subject,
      text: content.text,
      html: content.html,
      headers: {
        "List-Unsubscribe": `<${getAppUrl()}/api/prospection/unsubscribe?token=${encodeURIComponent(prospect.unsubscribeToken)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "List-ID": "Prospection Label Vanlife <prospection.partenaires.labelvanlife.fr>",
        "Feedback-ID": `prospection:${stage.toLowerCase()}:labelvanlife:resend`,
      },
      tags: [
        { name: "category", value: "prospection" },
        { name: "stage", value: stage.toLowerCase() },
        { name: "variant", value: variant },
        { name: "prospect_id", value: prospect.id.slice(0, 256) },
      ],
    }, { idempotencyKey: campaignKey });
  } catch (error) {
    const message = (error instanceof Error ? error.message : "Échec réseau Resend").slice(0, 500);
    await prisma.$transaction([
      prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "FAILED", error: message } }),
      prisma.prospect.update({ where: { id: prospect.id }, data: { status: "ERROR", nextActionAt: null } }),
    ]);
    return "failed";
  }

  const now = new Date();
  if (result.error || !result.data?.id) {
    const error = (result.error?.message || result.error?.name || "Échec Resend").slice(0, 500);
    await prisma.$transaction([
      prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "FAILED", error } }),
      prisma.prospect.update({ where: { id: prospect.id }, data: { status: "ERROR", nextActionAt: null, metadata: { emailError: error } } }),
    ]);
    return "failed";
  }

  const stageNumber: Record<ProspectingStage, number> = {
    INITIAL: 1,
    FOLLOW_UP_1: 2,
    OFFER_3: 3,
    VANLIFE_NEWS: 4,
    VANLIFE_STATS: 5,
    WILD_SPOTS: 6,
    OFFER_7: 7,
    DREAM: 8,
    TESTIMONIAL: 9,
    OFFER_10: 10,
  };
  const progress = stageNumber[stage];
  const engaged = prospect.status === "ENGAGED";
  const nextStatus: ProspectStatus = progress >= 10
    ? "FOLLOW_UP_2"
    : engaged
      ? "ENGAGED"
      : stage === "INITIAL"
        ? "CONTACTED"
        : stage === "FOLLOW_UP_1"
          ? "FOLLOW_UP_1"
          : "FOLLOW_UP_2";
  const delayDays = progress === 1 ? 7 : progress === 2 ? 10 : 14;
  const nextActionAt = nextStatus === "ENGAGED" || nextStatus === "CONTACTED" || nextStatus === "FOLLOW_UP_1"
    ? new Date(now.getTime() + delayDays * DAY)
    : null;
  await prisma.$transaction([
    prisma.prospectMessage.update({ where: { id: record.id }, data: { status: "SENT", providerMessageId: result.data.id, sentAt: now } }),
    prisma.prospect.update({
      where: { id: prospect.id },
      data: {
        status: nextStatus,
        followUpCount: progress,
        firstContactedAt: prospect.firstContactedAt || now,
        lastContactedAt: now,
        nextActionAt,
      },
    }),
  ]);
  return "sent";
}

async function deliverabilitySafetyCheck(): Promise<{
  paused: boolean;
  sent: number;
  bounces: number;
  complaints: number;
  bounceRate: number;
}> {
  const prisma = getPrisma();
  const since = new Date(Date.now() - DELIVERABILITY_WINDOW_DAYS * DAY);
  const [sent, bounces, complaints] = await Promise.all([
    prisma.prospectMessage.count({
      where: {
        direction: "OUTBOUND",
        status: "SENT",
        kind: { not: "AUTO_REPLY" },
        sentAt: { gte: since },
      },
    }),
    prisma.prospectSuppression.count({ where: { reason: "bounce", createdAt: { gte: since } } }),
    prisma.prospectSuppression.count({ where: { reason: "complaint", createdAt: { gte: since } } }),
  ]);
  const bounceRate = sent > 0 ? bounces / sent : 0;
  const paused = complaints > 0 || (sent >= MINIMUM_SAMPLE_FOR_BOUNCE_PAUSE && bounceRate >= MAXIMUM_BOUNCE_RATE);
  return { paused, sent, bounces, complaints, bounceRate };
}

async function alertDeliverabilityPause(metrics: Awaited<ReturnType<typeof deliverabilitySafetyCheck>>): Promise<void> {
  const prisma = getPrisma();
  const day = new Date().toISOString().slice(0, 10);
  const existing = await prisma.adminLog.findFirst({
    where: { adminId: "system:prospection", action: DELIVERABILITY_ALERT_ACTION, target: day },
    select: { id: true },
  });
  if (existing) return;
  await sendNeedHumanAlert(
    "Prospection suspendue pour protéger la délivrabilité",
    `Les envois du jour ont été suspendus automatiquement. Sur les ${DELIVERABILITY_WINDOW_DAYS} derniers jours : ${metrics.sent} messages, ${metrics.bounces} rebond(s), ${metrics.complaints} plainte(s), taux de rebond ${(metrics.bounceRate * 100).toFixed(1)} %. Vérifiez les adresses et les métriques Resend avant de reprendre.`,
  );
  await prisma.adminLog.create({
    data: {
      adminId: "system:prospection",
      action: DELIVERABILITY_ALERT_ACTION,
      target: day,
      metadata: metrics,
    },
  });
}

export async function runProspectionBatch() {
  const imported = await syncSpottedProspects();
  if (!isProspectingEnabled()) return { enabled: false, imported, researchRequested: 0, sent: 0, failed: 0, skipped: 0 };
  const now = new Date();
  const parisWeekday = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" }).format(now);
  if (parisWeekday === "Sat" || parisWeekday === "Sun") {
    return { enabled: true, weekend: true, imported, researchRequested: 0, sent: 0, failed: 0, skipped: 0 };
  }

  const deliverability = await deliverabilitySafetyCheck();
  if (deliverability.paused) {
    await alertDeliverabilityPause(deliverability);
    return {
      enabled: true,
      safetyPaused: true,
      imported,
      researchRequested: 0,
      sent: 0,
      failed: 0,
      skipped: 0,
      deliverability,
    };
  }

  const prisma = getPrisma();
  let researchRequested = 0;
  try {
    researchRequested = await sendMissingProspectContactDigest();
  } catch {
    // A back-office digest must never block lawful prospect communication.
  }
  const startOfUtcDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const alreadySentToday = await prisma.prospectMessage.count({
    where: {
      direction: "OUTBOUND",
      status: "SENT",
      kind: { not: "AUTO_REPLY" },
      sentAt: { gte: startOfUtcDay },
    },
  });
  const remainingDailyCapacity = Math.max(0, prospectingDailyLimit() - alreadySentToday);
  if (remainingDailyCapacity === 0) {
    return {
      enabled: true,
      imported,
      researchRequested,
      dailyLimitReached: true,
      alreadySentToday,
      sent: 0,
      failed: 0,
      skipped: 0,
    };
  }
  const prospects = await prisma.prospect.findMany({
    where: { status: { in: ACTIVE_STATUSES }, nextActionAt: { lte: now } },
    orderBy: [{ nextActionAt: "asc" }, { createdAt: "asc" }],
    take: remainingDailyCapacity,
  });
  let sent = 0;
  let failed = 0;
  let skipped = 0;
  for (const prospect of prospects) {
    const result = await sendOne(prospect);
    if (result === "sent") sent += 1;
    else if (result === "failed") failed += 1;
    else skipped += 1;
  }

  if (failed > 0) {
    await sendNeedHumanAlert("La prospection automatique a rencontré des erreurs", `${failed} message(s) n’ont pas pu être envoyés. Consultez le tableau de bord avant de relancer.`);
  }
  return { enabled: true, imported, researchRequested, selected: prospects.length, sent, failed, skipped };
}

export async function sendNeedHumanAlert(subject: string, details: string): Promise<void> {
  const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
  const result = await resend.emails.send({
    from: getTransactionalEmailFrom(),
    to: getBackOfficeEmails(),
    subject: `[ACTION REQUISE] ${subject}`,
    text: `${details}\n\nTableau de bord : ${getAppUrl()}/admin/prospection`,
    html: labelVanlifeEmail({
      preheader: "Une décision humaine est nécessaire dans la prospection Label Vanlife",
      eyebrow: "ACTION REQUISE",
      title: subject,
      paragraphs: details.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean),
      action: { label: "Ouvrir le tableau de bord", href: `${getAppUrl()}/admin/prospection` },
      notice: "Aucun message automatique supplémentaire n’est envoyé au prospect tant que sa situation n’est pas traitée.",
    }),
  });
  if (result.error || !result.data?.id) {
    throw new Error(result.error?.message || result.error?.name || "Échec de l’alerte back-office");
  }
}
