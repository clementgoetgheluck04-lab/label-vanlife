// Données des lieux labellisés Label Vanlife
// Issues des KML du desktop et enrichies avec les contenus du site original

export interface Lieu {
  id: string;
  name: string;
  type: "Camping" | "Camping à la ferme" | "Camping municipal" | "Village" | "Camping nature";
  location: string;
  region: string;
  lat: number;
  lng: number;
  reduction: string;
  image?: string;
  villageImage?: string;
  description: string;
  featured?: boolean;
}

export const LIEUX_LABELLISES: Lieu[] = [
  {
    id: "aiguines",
    name: "Aiguines",
    type: "Village",
    location: "Aiguines, Provence-Alpes-Côte d'Azur",
    region: "PACA",
    lat: 43.7758,
    lng: 6.2436,
    reduction: "-15%",
    villageImage: "/images/villages/Aiguines.png",
    description:
      "Perché au bord des gorges du Verdon, Aiguines est un village provençal authentique avec vue imprenable sur le lac de Sainte-Croix. Point de départ idéal pour explorer les gorges en van.",
    featured: true,
  },
  {
    id: "cordes-sur-ciel",
    name: "Cordes-sur-Ciel",
    type: "Village",
    location: "Cordes-sur-Ciel, Occitanie",
    region: "Occitanie",
    lat: 44.0644,
    lng: 1.9483,
    reduction: "-15%",
    villageImage: "/images/villages/Cordes-sur-Ciel.png",
    description:
      "Classé parmi les Plus Beaux Villages de France, Cordes-sur-Ciel domine la vallée du Cérou. Ses ruelles médiévales et ses artisans en font une étape incontournable.",
    featured: true,
  },
  {
    id: "eguisheim",
    name: "Eguisheim",
    type: "Village",
    location: "Eguisheim, Grand Est",
    region: "Grand Est",
    lat: 48.0431,
    lng: 7.3064,
    reduction: "-15%",
    villageImage: "/images/villages/Eguisheim.png",
    description:
      "Élu Village Préféré des Français, Eguisheim est un joyau alsacien entouré de vignobles. Ses ruelles colorées et son patrimoine viticole en font une étape de charme.",
    featured: true,
  },
  {
    id: "la-roque-gageac",
    name: "La Roque-Gageac",
    type: "Village",
    location: "La Roque-Gageac, Nouvelle-Aquitaine",
    region: "Nouvelle-Aquitaine",
    lat: 44.8269,
    lng: 1.1836,
    reduction: "-15%",
    villageImage: "/images/villages/La Roque-Gageac.png",
    description:
      "Adossé à une falaise sur les rives de la Dordogne, ce village pittoresque offre des maisons en pierre dorée et un climat exceptionnel. Une halte rêvée pour les vanlifers.",
    featured: true,
  },
  {
    id: "moustier",
    name: "Moustiers-Sainte-Marie",
    type: "Village",
    location: "Moustiers-Sainte-Marie, Provence-Alpes-Côte d'Azur",
    region: "PACA",
    lat: 43.8476,
    lng: 6.2216,
    reduction: "-15%",
    villageImage: "/images/villages/Moustier.png",
    description:
      "Célèbre pour sa faïence et son étoile suspendue entre deux falaises, Moustiers est la porte des Gorges du Verdon. Un cadre exceptionnel pour les amoureux de nature.",
    featured: true,
  },
  {
    id: "najac",
    name: "Najac",
    type: "Village",
    location: "Najac, Occitanie",
    region: "Occitanie",
    lat: 44.2167,
    lng: 1.9667,
    reduction: "-15%",
    villageImage: "/images/villages/Najac.png",
    description:
      "Dominé par sa forteresse royale, Najac est un village médiéval perché sur une crête de l'Aveyron. Ses panoramas et sa tranquillité séduisent les voyageurs en quête d'authenticité.",
    featured: true,
  },
  {
    id: "riquewihr",
    name: "Riquewihr",
    type: "Village",
    location: "Riquewihr, Grand Est",
    region: "Grand Est",
    lat: 48.1686,
    lng: 7.2989,
    reduction: "-15%",
    villageImage: "/images/villages/Riquewihr.png",
    description:
      "Au cœur de la Route des Vins d'Alsace, Riquewihr est un véritable décor de conte de fées avec ses maisons à colombages et ses remparts préservés.",
    featured: true,
  },
  {
    id: "yvoire",
    name: "Yvoire",
    type: "Village",
    location: "Yvoire, Auvergne-Rhône-Alpes",
    region: "Auvergne-Rhône-Alpes",
    lat: 46.3714,
    lng: 6.3267,
    reduction: "-15%",
    villageImage: "/images/villages/YVOIRE.png",
    description:
      "Perle de la rive française du Léman, Yvoire est un village médiéval fleuri classé parmi les Plus Beaux Villages de France. Une escale romantique sur les bords du lac.",
    featured: true,
  },
  {
    id: "belcastel",
    name: "Belcastel",
    type: "Village",
    location: "Belcastel, Occitanie",
    region: "Occitanie",
    lat: 44.3833,
    lng: 2.3333,
    reduction: "-15%",
    villageImage: "/images/villages/belcastel.png",
    description:
      "Avec son château et son pont en pierre enjambant l'Aveyron, Belcastel est un village médiéval d'exception. Ses ruelles pavées invitent à la flânerie.",
    featured: false,
  },
  {
    id: "castellane",
    name: "Castellane",
    type: "Village",
    location: "Castellane, Provence-Alpes-Côte d'Azur",
    region: "PACA",
    lat: 43.8469,
    lng: 6.5131,
    reduction: "-15%",
    villageImage: "/images/villages/castellane.png",
    description:
      "Capitale du Verdon, Castellane est le point de départ des gorges du Verdon. Une cité provençale animée entourée de montagnes, idéale pour les sportifs.",
    featured: false,
  },
  {
    id: "conques",
    name: "Conques",
    type: "Village",
    location: "Conques, Occitanie",
    region: "Occitanie",
    lat: 44.6028,
    lng: 2.3972,
    reduction: "-15%",
    villageImage: "/images/villages/conques.png",
    description:
      "Étape majeure sur le chemin de Saint-Jacques-de-Compostelle, Conques est un village médiéval d'une beauté rare avec son abbatiale Sainte-Foy et son trésor d'orfèvrerie.",
    featured: false,
  },
  {
    id: "rocamadour",
    name: "Rocamadour",
    type: "Village",
    location: "Rocamadour, Occitanie",
    region: "Occitanie",
    lat: 44.7997,
    lng: 1.6186,
    reduction: "-15%",
    villageImage: "/images/villages/rocamadour.png",
    description:
      "Cité sacrée accrochée à la falaise, Rocamadour est l'un des sites les plus visités de France. Son sanctuaire et ses ruelles médiévales en font une étape spirituelle et culturelle.",
    featured: false,
  },
  {
    id: "domaine-mepillat",
    name: "Domaine de Mépillat",
    type: "Camping à la ferme",
    location: "Saint-Nizier-le-Bouchoux, Auvergne-Rhône-Alpes",
    region: "Auvergne-Rhône-Alpes",
    lat: 46.459,
    lng: 5.151,
    reduction: "-10%",
    description:
      "Camping à la ferme familial niché dans les collines de la Bresse. Calme, nature et produits locaux au rendez-vous. Emplacements spacieux pour vans et camping-cars.",
  },
  {
    id: "pont-augan",
    name: "Camping de Pont Augan",
    type: "Camping",
    location: "Baud, Bretagne",
    region: "Bretagne",
    lat: 47.874,
    lng: -2.997,
    reduction: "-10%",
    description:
      "Petit camping à taille humaine à la campagne, proche de la Bretagne intérieure. Calme assuré et nature préservée pour une étape vanlife sereine.",
  },
  {
    id: "camping-pindiere",
    name: "Camping la Pindière",
    type: "Camping",
    location: "Héric, Pays de la Loire",
    region: "Pays de la Loire",
    lat: 47.423,
    lng: -1.654,
    reduction: "-10%",
    description:
      "Camping familial à taille humaine à la campagne, proche de Nantes et de l'océan. Emplacements nus pour vans avec accès aux services.",
  },
  {
    id: "git-communion",
    name: "Gîte & Camping La Communion",
    type: "Camping à la ferme",
    location: "Latour, Occitanie",
    region: "Occitanie",
    lat: 43.167,
    lng: 1.283,
    reduction: "-10%",
    description:
      "Nichée dans les collines verdoyantes de la Haute-Garonne, cadre authentique avec animaux de ferme et produits du terroir. Ambiance familiale garantie.",
  },
  {
    id: "camping-le-verger",
    name: "Camping Le Verger",
    type: "Camping",
    location: "Dompierre-sur-Mer, Charente-Maritime",
    region: "Nouvelle-Aquitaine",
    lat: 46.188,
    lng: -1.062,
    reduction: "-10%",
    description:
      "À deux pas de La Rochelle et de l'île de Ré, le Camping Le Verger incarne une philosophie rare : ici, vous n'êtes pas des clients — vous êtes les invités de leur jardin. Petit, familial, authentique. Un foodtruck différent chaque soir, wifi gratuit, animaux bienvenus.",
  },
  {
    id: "camping-saint-lambert",
    name: "Camping Saint Lambert",
    type: "Camping",
    location: "Millau, Occitanie",
    region: "Occitanie",
    lat: 44.097,
    lng: 3.078,
    reduction: "-10%",
    description:
      "Camping 3 étoiles au cœur de l'Aveyron, à proximité immédiate des gorges du Tarn et du viaduc de Millau. Cadre naturel exceptionnel entre causses et rivières. Emplacements spacieux ombragés, sanitaires modernes, accueil chaleureux.",
  },
];

// Obtenir les lieux en vedette (featured)
export function getFeaturedLieux(): Lieu[] {
  return LIEUX_LABELLISES.filter(l => l.featured);
}

// Obtenir les lieux par région
export function getLieuxByRegion(region: string): Lieu[] {
  return LIEUX_LABELLISES.filter(l => l.region === region);
}

// Obtenir toutes les régions uniques
export function getAllRegions(): string[] {
  return Array.from(new Set(LIEUX_LABELLISES.map(l => l.region)));
}

// Stats
export const STATS = {
  totalIdentifies: 216,
  enCandidature: 670,
  labellises: 18,
};
