// Types principaux pour Label Vanlife

// ===== LIEUX & SERVICES =====

export type Service =
  | "wifi"
  | "eau"
  | "electricite"
  | "douche"
  | "vidange"
  | "lave-linge"
  | "animal_accepted"
  | "accessible"
  | "parking"
  | "restaurant"
  | "epicerie"
  | "piscine"
  | "borne-electrique"
  | "animal_accepted"
  | "animaux"
  | "plage";

// Lieu (établissement labellisé ou partenaire)
export interface Lieu {
  id: string;
  nom: string;
  type: "camping" | "parking" | "etape_nature" | "hebergement_insolite" | "restaurant" | "activite";
  description: string;
  photoUrl: string;
    photos?: string[];
    logoUrl?: string;
    region: string;
  ville: string;
  pays: string;
  coordonnees: { lat: number; lng: number };
  services: Service[];
  labels: string[]; // ids des labels obtenus
  note: number; // 1-5
  avisCount: number;
  discountPercent: number; // % de réduction membre (ex: 15 pour -15%)
  priceHighlight?: string; // avantage tarifaire public sans réduction membre
  address?: string;
  siteWeb?: string;
  telephone?: string;
  email?: string;
  horaires?: string;
  tags: string[];
  distance?: number; // km depuis position utilisateur
  favoris: number;
  status: "actif" | "inactif";
  created_at: string;
}

// ===== LABELS =====

export interface Label {
  id: string;
  code: string;
  nom: string;
  description: string;
  organisme: string;
  icone: string;
}

// ===== MEMBRES =====

export type NiveauMembre =
  | "explorateur"
  | "routard"
  | "voyageur"
  | "eclaireur"
  | "legende";

export const NIVEAUX: Record<NiveauMembre, { points: number; avantage: string }> = {
  explorateur: { points: 0, avantage: "Accès à la carte" },
  routard: { points: 100, avantage: "-5% réductions" },
  voyageur: { points: 500, avantage: "-10% + accès anticipé" },
  eclaireur: { points: 1000, avantage: "-15% + contenu exclusif" },
  legende: { points: 2500, avantage: "-20% + parrainage" },
};

export interface Membre {
  id: string;
  prenom: string;
  nom?: string;
  email: string;
  motDePasse?: string; // hash, jamais en clair
  photoUrl?: string;
  niveau: NiveauMembre;
  points: number;
  badges: Badge[];
  defisEnCours: Defi[];
  favoris: string[]; // ids des lieux favoris
  roadTrips: string[]; // ids des road trips
  passeport: PasseportEntry[];
  dateInscription: string;
  dateExpiration?: string;
  stripeCustomerId?: string;
  offre: "mensuel" | "annuel";
}

// ===== BADGES & DÉFIS =====

export interface Badge {
  id: string;
  nom: string;
  description: string;
  icone: string;
  dateObtention: string;
  niveau: "bronze" | "argent" | "or";
}

export interface Defi {
  id: string;
  titre: string;
  description: string;
  recompense: number; // points
  type: "visite" | "avis" | "partage" | "parrainage";
  progression: number; // 0-100
  termine: boolean;
}

// ===== PASSEPORT =====

export interface PasseportEntry {
  lieuId: string;
  dateVisite: string;
  timbreUrl?: string;
  avis?: string;
  note?: number;
}

// ===== ROAD TRIPS =====

export interface RoadTrip {
  id: string;
  titre: string;
  description: string;
  auteur: string; // membre id
  etapes: RoadTripEtape[];
  duree: number; // jours
  budget: number; // € estimé
  distance: number; // km
  difficulte: "facile" | "moyen" | "avance";
  tags: string[];
  likes: number;
  favoris: number;
  created_at: string;
}

export interface RoadTripEtape {
  ordre: number;
  lieuId: string;
  jour: number;
  duree: string; // "1 nuit", "2h"
  activites: string[];
  notes?: string;
}

// ===== PROFESSIONNELS =====

export interface Professionnel {
  id: string;
  etablissement: string;
  email: string;
  telephone: string;
  type: "camping" | "hotel" | "restaurant" | "activite";
  status: "prospect" | "audit" | "certifie" | "actif";
  score: number; // 0-100
  revenuProjete: number;
  dateInscription: string;
  derniereConnexion: string;
}

export interface AuditEtablissement {
  id: string;
  proId: string;
  etablissement: string;
  date: string;
  score: number;
  recommandations: string[];
  priorite: "haute" | "moyenne" | "basse";
  statut: "a_faire" | "en_cours" | "termine";
}
