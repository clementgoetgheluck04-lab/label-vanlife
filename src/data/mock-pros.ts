// Données fictives — Professionnels partenaires Label Vanlife
import type { Professionnel } from "@/lib/types";

export const MOCK_PROFESSIONNELS: Professionnel[] = [
  // ===== 1 — PROSPECT (en cours de démarchage) =====
  {
    id: "pro-01",
    etablissement: "Camping Les Rives du Lac",
    email: "contact@lesrivesdulac.fr",
    telephone: "+33450000000",
    type: "camping",
    status: "prospect",
    score: 65,
    revenuProjete: 4500,
    dateInscription: "2025-03-10",
    derniereConnexion: "2025-03-10",
  },
  // ===== 2 — EN AUDIT (en cours d'évaluation) =====
  {
    id: "pro-02",
    etablissement: "Domaine de la Source",
    email: "gilles@domainedelasource.com",
    telephone: "+33475000000",
    type: "camping",
    status: "audit",
    score: 82,
    revenuProjete: 12000,
    dateInscription: "2025-01-20",
    derniereConnexion: "2025-06-28",
  },
  // ===== 3 — CERTIFIÉ (partenaire actif labellisé) =====
  {
    id: "pro-03",
    etablissement: "Camping & SPA l'Océane",
    email: "contact@oceane-camping.fr",
    telephone: "+33546000000",
    type: "camping",
    status: "certifie",
    score: 94,
    revenuProjete: 28000,
    dateInscription: "2024-09-01",
    derniereConnexion: "2025-07-05",
  },
];