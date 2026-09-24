export type ProspectPriority = "P1" | "P2" | "P3" | "EXCLUDE";
export type ProspectCategory = "COEUR_DE_CIBLE" | "A_EXPLORER" | "DONNEES_A_VERIFIER" | "HORS_CIBLE";
export type ProspectNextStep = "AGENT_STANDING" | "PREPARER_APPROCHE" | "VERIFIER_ETABLISSEMENT" | "REVUE_HUMAINE" | "NE_PAS_CONTACTER";
export type ProspectHandlingMode = "AGENT_STANDING" | "STANDARD_AUTOMATION" | "MANUAL_REVIEW" | "EXCLUDE";

export type ProspectBrainInput = {
  name: string;
  network?: string | null;
  website?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  email?: string | null;
  selectionNote?: string | null;
};

export type ProspectBrainAssessment = {
  version: 2;
  assessedAt: string;
  score: number;
  priority: ProspectPriority;
  category: ProspectCategory;
  suitableForLabelVanlife: boolean;
  reasons: string[];
  commercialArguments: string[];
  nextStep: ProspectNextStep;
  handlingMode: ProspectHandlingMode;
  standingBrief: string[];
};

const normalize = (value: string | null | undefined) => (value || "")
  .normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

/** A conservative, explainable pre-qualification. It never asserts amenities not evidenced by the source. */
export function assessProspectForLabelVanlife(input: ProspectBrainInput, assessedAt = new Date().toISOString()): ProspectBrainAssessment {
  const haystack = normalize([input.name, input.network, input.selectionNote].filter(Boolean).join(" "));
  const accommodation = /camping|camp |aire naturelle|emplacement|ferme|vignobl|gite|chambre|auberge|hebergement|domaine/.test(haystack);
  const vanFit = /van|camping|plein air|nature|ferme|vignobl|rural/.test(haystack);
  const clearlyUnrelated = /comptable|assurance|banque|immobilier|avocat|notaire|garage automobile/.test(haystack);
  const hasWebsite = Boolean(input.website?.trim());
  const hasEmail = Boolean(input.email?.trim());
  const isFrance = !input.country || normalize(input.country).includes("france");
  const reasons: string[] = [];
  let score = 0;

  if (accommodation) { score += 40; reasons.push("activité d’accueil ou d’hébergement identifiée"); }
  if (vanFit) { score += 20; reasons.push("univers compatible avec les voyageurs itinérants"); }
  if (hasWebsite) { score += 15; reasons.push("site de l’établissement disponible pour vérification"); }
  if (hasEmail) { score += 15; reasons.push("contact professionnel renseigné"); }
  if (input.city && input.region) { score += 5; reasons.push("implantation géographique documentée"); }
  if (isFrance) score += 5;
  score = Math.min(score, 100);

  const suitableForLabelVanlife = accommodation && vanFit && hasWebsite && hasEmail && score >= 60;
  const category: ProspectCategory = clearlyUnrelated ? "HORS_CIBLE" : suitableForLabelVanlife
    ? "COEUR_DE_CIBLE"
    : accommodation ? "A_EXPLORER"
      : hasWebsite || hasEmail ? "DONNEES_A_VERIFIER" : "HORS_CIBLE";
  const priority: ProspectPriority = !suitableForLabelVanlife ? (category === "HORS_CIBLE" ? "EXCLUDE" : "P3")
    : score >= 100 ? "P1" : score >= 70 ? "P2" : "P3";
  const commercialArguments = suitableForLabelVanlife
    ? [
      "Rendre l’établissement identifiable par les vanlifers au moment où ils choisissent leur étape.",
      "Présenter une fiche claire, les règles d’accueil et les informations pratiques avant l’arrivée.",
      "Mettre en avant le réseau Label Vanlife sans commission sur les réservations ni changement d’outil.",
    ]
    : ["Vérifier l’offre d’accueil et les conditions d’accès avant de présenter le label."];
  const handlingMode: ProspectHandlingMode = priority === "P1" && suitableForLabelVanlife
    ? "AGENT_STANDING"
    : priority === "P2" && suitableForLabelVanlife && hasWebsite && hasEmail
      ? "STANDARD_AUTOMATION"
      : priority === "EXCLUDE" ? "EXCLUDE" : "MANUAL_REVIEW";
  const nextStep: ProspectNextStep = handlingMode === "AGENT_STANDING"
    ? "AGENT_STANDING"
    : !hasWebsite || !hasEmail
    ? "VERIFIER_ETABLISSEMENT"
    : handlingMode === "STANDARD_AUTOMATION" ? "PREPARER_APPROCHE"
      : suitableForLabelVanlife ? "REVUE_HUMAINE" : "NE_PAS_CONTACTER";
  const standingBrief = handlingMode === "AGENT_STANDING"
    ? [
      `Analyser en profondeur ${input.name} à partir de son site et des données disponibles, sans inventer d’équipement ni de service.`,
      `Rédiger un email commercial unique pour ${input.name}, fondé sur des éléments vérifiés de l’établissement et non sur le modèle générique.`,
      "Traiter explicitement les ambiguïtés ou enjeux complexes avant toute prise de contact.",
    ]
    : [];

  return { version: 2, assessedAt, score, priority, category, suitableForLabelVanlife, reasons, commercialArguments, nextStep, handlingMode, standingBrief };
}
