// Données fictives — Membres Label Vanlife
import type { Membre, Badge, Defi, PasseportEntry } from "@/lib/types";

// Quelques badges réutilisables
const badgesExplorateur: Badge[] = [
  {
    id: "badge-premiere-visite",
    nom: "Première Étape",
    description: "Premier lieu visité avec Label Vanlife",
    icone: "📍",
    dateObtention: "2024-06-15",
    niveau: "bronze",
  },
  {
    id: "badge-eco",
    nom: "Éco-Responsable",
    description: "5 nuits en éco-campings",
    icone: "🌱",
    dateObtention: "2024-09-20",
    niveau: "argent",
  },
];

const badgesRoutard: Badge[] = [
  {
    id: "badge-premiere-visite",
    nom: "Première Étape",
    description: "Premier lieu visité avec Label Vanlife",
    icone: "📍",
    dateObtention: "2023-03-01",
    niveau: "argent",
  },
  {
    id: "badge-globe-trotteur",
    nom: "Globe-Trotteur",
    description: "Visité 5 régions différentes",
    icone: "🌍",
    dateObtention: "2024-01-10",
    niveau: "argent",
  },
  {
    id: "badge-photographe",
    nom: "Photographe",
    description: "10 photos partagées sur la communauté",
    icone: "📸",
    dateObtention: "2024-04-05",
    niveau: "argent",
  },
];

const badgesVoyageur: Badge[] = [
  {
    id: "badge-bienvenue",
    nom: "Première Étape",
    description: "Premier lieu visité avec Label Vanlife",
    icone: "📍",
    dateObtention: "2023-06-01",
    niveau: "or",
  },
  {
    id: "badge-globe-trotteur",
    nom: "Globe-Trotteur",
    description: "Visité 10 régions différentes",
    icone: "🌍",
    dateObtention: "2024-02-15",
    niveau: "or",
  },
  {
    id: "badge-eco",
    nom: "Éco-Responsable",
    description: "10 nuits en éco-campings",
    icone: "🌱",
    dateObtention: "2024-06-20",
    niveau: "or",
  },
  {
    id: "badge-photographe",
    nom: "Photographe",
    description: "30 photos partagées sur la communauté",
    icone: "📸",
    dateObtention: "2024-08-12",
    niveau: "argent",
  },
  {
    id: "badge-local",
    nom: "Local",
    description: "A déposé 15 avis sur des lieux visités",
    icone: "🗣️",
    dateObtention: "2024-09-01",
    niveau: "argent",
  },
];

const defisVoyageur: Defi[] = [
  {
    id: "defi-3-nuits",
    titre: "Week-end en van",
    description: "Passez 3 nuits dans 3 campings différents en une semaine",
    recompense: 150,
    type: "visite",
    progression: 100,
    termine: true,
  },
  {
    id: "defi-avis-5",
    titre: "Donnez votre avis",
    description: "Laissez 5 avis sur les lieux que vous avez visités",
    recompense: 100,
    type: "avis",
    progression: 80,
    termine: false,
  },
  {
    id: "defi-partage",
    titre: "Ambassadeur vanlife",
    description: "Partagez votre road trip sur les réseaux sociaux avec #LabelVanlife",
    recompense: 200,
    type: "partage",
    progression: 100,
    termine: true,
  },
];

const defisRoutard: Defi[] = [
  {
    id: "defi-3-nuits",
    titre: "Week-end en van",
    description: "Passez 3 nuits dans 3 campings différents en une semaine",
    recompense: 150,
    type: "visite",
    progression: 100,
    termine: true,
  },
  {
    id: "defi-avis-5",
    titre: "Donnez votre avis",
    description: "Laissez 5 avis sur les lieux que vous avez visités",
    recompense: 100,
    type: "avis",
    progression: 100,
    termine: true,
  },
];

const passeportExplorateur: PasseportEntry[] = [
  {
    lieuId: "camping-le-verger",
    dateVisite: "2024-06-15",
    avis: "Accueil incroyablement chaleureux, foodtruck délicieux !",
    note: 5,
  },
];
const passeportRoutard: PasseportEntry[] = [
  {
    lieuId: "camping-la-torche",
    dateVisite: "2023-03-10",
    timbreUrl: "/images/timbres/torche.png",
    avis: "Spot de surf de rêve, camping parfaitement adapté aux vans.",
    note: 5,
  },
  {
    lieuId: "camping-lann-hoedic",
    dateVisite: "2023-07-22",
    avis: "Magnifique presqu'île, camping très bien équipé.",
    note: 4,
  },
  {
    lieuId: "camping-ardechoise",
    dateVisite: "2024-01-05",
    avis: "Superbe camping en bord d'Ardèche, je recommande !",
    note: 5,
  },
  {
    lieuId: "camping-les-oliviers",
    dateVisite: "2024-05-18",
    avis: "Le cadre des Alpilles est magnifique, camping au calme.",
    note: 4,
  },
];
const passeportVoyageur: PasseportEntry[] = [
  {
    lieuId: "camping-saint-lambert",
    dateVisite: "2023-06-15",
    avis: "Super vue sur le viaduc de Millau, personnel adorable.",
    note: 5,
  },
  {
    lieuId: "camping-lac-annecy",
    dateVisite: "2023-08-01",
    avis: "Le plus beau lac de France, camping de luxe pour vans.",
    note: 5,
  },
  {
    lieuId: "camping-la-torche",
    dateVisite: "2023-09-12",
    avis: "Bretagne sauvage, j'ai adoré le coucher de soleil.",
    note: 4,
  },
  {
    lieuId: "camping-dune-pyla",
    dateVisite: "2024-03-05",
    avis: "La dune du Pilat au coucher du soleil, à faire une fois dans sa vie.",
    note: 5,
  },
  {
    lieuId: "parking-cap-ferret",
    dateVisite: "2024-03-06",
    avis: "Cap Ferret authentique, huîtres et coucher de soleil.",
    note: 4,
  },
  {
    lieuId: "etape-vercors",
    dateVisite: "2024-06-20",
    avis: "Halte nature parfaite après une journée de randonnée.",
    note: 4,
  },
  {
    lieuId: "camping-pyrenees",
    dateVisite: "2024-08-10",
    avis: "Les Pyrénées vues du van, un rêve éveillé.",
    note: 5,
  },
  {
    lieuId: "parking-etretat",
    dateVisite: "2024-10-01",
    avis: "Les falaises d'Étretat en automne, magnifique.",
    note: 4,
  },
];

export const MOCK_MEMBRES: Membre[] = [
  // ===== MEMBRE 1 — EXPLORATEUR (débutant) =====
  {
    id: "membre-01",
    prenom: "Clément",
    nom: "Goetgheluck",
    email: "clement.goetgheluck@hotmail.fr",
    photoUrl: "/images/membres/lea.jpg",
    niveau: "explorateur",
    points: 45,
    badges: badgesExplorateur,
    defisEnCours: [
      {
        id: "defi-3-nuits",
        titre: "Week-end en van",
        description: "Passez 3 nuits dans 3 campings différents en une semaine",
        recompense: 150,
        type: "visite",
        progression: 33,
        termine: false,
      },
      {
        id: "defi-avis-5",
        titre: "Donnez votre avis",
        description: "Laissez 5 avis sur les lieux que vous avez visités",
        recompense: 100,
        type: "avis",
        progression: 20,
        termine: false,
      },
    ],
    favoris: ["camping-le-verger", "camping-de-la-torche", "camping-saint-lambert"],
    roadTrips: [],
    passeport: passeportExplorateur,
    dateInscription: "2024-05-01",
    offre: "mensuel",
  },
  // ===== MEMBRE 2 — ROUTARD (intermédiaire) =====
  {
    id: "membre-02",
    prenom: "Maxime",
    email: "maxime.vanlife@example.com",
    photoUrl: "/images/membres/maxime.jpg",
    niveau: "routard",
    points: 350,
    badges: badgesRoutard,
    defisEnCours: defisRoutard,
    favoris: [
      "camping-la-torche",
      "camping-lann-hoedic",
      "camping-ardechoise",
      "camping-les-oliviers",
      "etape-vercors",
      "parking-cap-ferret",
    ],
    roadTrips: ["roadtrip-bretagne"],
    passeport: passeportRoutard,
    dateInscription: "2023-01-15",
    dateExpiration: "2025-01-15",
    stripeCustomerId: "cus_abc123def456",
    offre: "annuel",
  },
  // ===== MEMBRE 3 — VOYAGEUR (expérimenté) =====
  {
    id: "membre-03",
    prenom: "Camille",
    email: "camille.label@example.com",
    photoUrl: "/images/membres/camille.jpg",
    niveau: "voyageur",
    points: 850,
    badges: badgesVoyageur,
    defisEnCours: defisVoyageur,
    favoris: [
      "camping-saint-lambert",
      "camping-de-la-torche",
      "camping-la-torche",
      "camping-dune-pyla",
      "camping-pyrenees",
      "parking-cap-ferret",
      "parking-etretat",
      "cabane-pyrenees",
      "bulle-luberon",
      "etape-corse",
      "camping-dolomites",
      "camping-ardechoise",
    ],
    roadTrips: ["roadtrip-bretagne", "roadtrip-provence"],
    passeport: passeportVoyageur,
    dateInscription: "2023-06-01",
    dateExpiration: "2025-06-01",
    stripeCustomerId: "cus_xyz789ghi012",
    offre: "annuel",
  },
];
