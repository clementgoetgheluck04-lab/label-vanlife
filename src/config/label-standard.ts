export const LABEL_STANDARD_VERSION = "2027.1";
export const LABEL_STANDARD_EFFECTIVE_DATE = "17 septembre 2026";

export const LABEL_ELIGIBILITY_REQUIREMENTS = [
  {
    id: "professional_identity",
    title: "Identité professionnelle vérifiable",
    description: "Le lieu fournit un SIRET, un contact responsable, une adresse et un site permettant de vérifier son activité.",
  },
  {
    id: "legal_operation",
    title: "Exploitation déclarée",
    description: "Le candidat confirme disposer des autorisations nécessaires à son activité et à l’accueil proposé.",
  },
  {
    id: "complete_application",
    title: "Dossier complet et cohérent",
    description: "Les 22 indicateurs sont renseignés, avec un plan, au moins une photo et des informations pratiques contrôlables.",
  },
  {
    id: "member_benefit",
    title: "Avantage membre applicable",
    description: "Le lieu s’engage sur un avantage de 10 à 20 %, avec des conditions compréhensibles et compatibles avec ses contraintes tarifaires.",
  },
  {
    id: "charter_commitment",
    title: "Charte d’accueil acceptée",
    description: "Le lieu s’engage sur la sincérité des informations, l’accueil respectueux, la sécurité, l’environnement et le suivi des incidents.",
  },
  {
    id: "evidence_review",
    title: "Éléments de preuve examinés",
    description: "Label Vanlife étudie les informations et pièces transmises et peut demander des justificatifs ou un contrôle complémentaire.",
  },
] as const;
export const LABEL_REVIEW_CONTROLS = [
  { id: "identity_checked", label: "Identité, SIRET, adresse et présence en ligne contrôlés" },
  { id: "operation_checked", label: "Déclaration d’exploitation et cohérence de l’activité contrôlées" },
  { id: "application_checked", label: "Dossier complet et 22 indicateurs relus" },
  { id: "evidence_checked", label: "Plan, photos et autres éléments de preuve examinés" },
  { id: "benefit_checked", label: "Avantage membre et conditions tarifaires vérifiés" },
  { id: "charter_checked", label: "Engagement à la charte et capacité d’accueil confirmés" },
] as const;

export type LabelReviewControlId = (typeof LABEL_REVIEW_CONTROLS)[number]["id"];

export const LABEL_VERIFICATION_LEVELS = [
  {
    title: "Déclaré par le lieu",
    description: "Information fournie par le responsable de l’établissement dans sa candidature.",
  },
  {
    title: "Contrôlé sur dossier",
    description: "Information relue et confrontée aux pièces et sources disponibles par Label Vanlife.",
  },
  {
    title: "Confirmé sur le terrain",
    description: "Information confirmée lors d’une visite, d’un passage membre documenté ou d’un contrôle complémentaire.",
  },
] as const;
