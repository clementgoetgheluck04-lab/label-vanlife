// Données des lieux labellisés Label Vanlife
// Compilées depuis les 24+ pages HTML des lieux partenaires

export interface Lieu {
  id: string;
  name: string;
  type: string;
  location: string;
  region: string;
  lat: number;
  lng: number;
  reduction: string;
  description: string;
  services?: string[];
  images?: string[];
  featured?: boolean;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export const LIEUX_LABELLISES: Lieu[] = [
  // ===== VILLAGES D'EXCEPTION (8) =====
  {
    id: "aiguines",
    name: "Aiguines",
    type: "Village",
    location: "Aiguines, Provence-Alpes-Côte d'Azur",
    region: "PACA",
    lat: 43.7758,
    lng: 6.2436,
    reduction: "-15%",
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
    description:
      "Adossé à une falaise sur les rives de la Dordogne, ce village pittoresque offre des maisons en pierre dorée et un climat exceptionnel. Une halte rêvée pour les vanlifers.",
    featured: true,
  },
  {
    id: "moustiers-sainte-marie",
    name: "Moustiers-Sainte-Marie",
    type: "Village",
    location: "Moustiers-Sainte-Marie, Provence-Alpes-Côte d'Azur",
    region: "PACA",
    lat: 43.8476,
    lng: 6.2216,
    reduction: "-15%",
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
    description:
      "Avec son château et son pont en pierre enjambant l'Aveyron, Belcastel est un village médiéval d'exception. Ses ruelles pavées invitent à la flânerie.",
    featured: true,
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
    description:
      "Capitale du Verdon, Castellane est le point de départ des gorges du Verdon. Une cité provençale animée entourée de montagnes, idéale pour les sportifs.",
    featured: true,
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
    description:
      "Étape majeure sur le chemin de Saint-Jacques-de-Compostelle, Conques est un village médiéval d'une beauté rare avec son abbatiale Sainte-Foy et son trésor d'orfèvrerie.",
    featured: true,
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
    description:
      "Cité sacrée accrochée à la falaise, Rocamadour est l'un des sites les plus visités de France. Son sanctuaire et ses ruelles médiévales en font une étape spirituelle et culturelle.",
    featured: true,
  },

  // ===== CAMPINGS LABELLISÉS =====
  {
    id: "camping-au-tylo-soleil",
    name: "Camping Au Tylo Soleil",
    type: "Camping",
    location: "Dauphin, Provence-Alpes",
    region: "Provence-Alpes",
    lat: 43.9,
    lng: 5.78,
    reduction: "-10%",
    description:
      "Camping 3 étoiles familial au creux d'un vallon arboré, entre Luberon et Verdon, à 10 minutes de Forcalquier. Emplacements van, caravane et camping-car sur terrain herbeux ombragé. Double espace piscine, piscine couverte chauffée, restaurant-brasserie, city park, tyrolienne, mini-club et animations.",
    services: ["Wifi", "Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "627 Route des Encontres - RD13, 04300 Dauphin",
  },
  {
    id: "camping-de-la-torche",
    name: "Camping de la Torche — Sites et Paysages",
    type: "Camping",
    location: "Plomeur, Bretagne",
    region: "Bretagne",
    lat: 47.85,
    lng: -4.35,
    reduction: "-10%",
    description:
      "Camping Sites & Paysages au pied de la Pointe de la Torche, spot mythique du surf breton. Emplacements spacieux de 80 à 100 m², électricité 6A, WiFi gratuit, piscine couverte chauffée, éolienne et panneaux solaires. Accueil vanlife soigné : carte manuscrite de bienvenue, arrivées tardives acceptées, concerts live et soirées brasero en été. À 500m de l'océan Atlantique.",
    services: ["Wifi", "Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "4 Roz an Tremen, 29120 Plomeur",
  },
  {
    id: "camping-le-coin-charmant",
    name: "Camping Le Coin Charmant",
    type: "Camping",
    location: "Chauzon, Ardèche",
    region: "Auvergne-Rhône-Alpes",
    lat: 44.48,
    lng: 4.36,
    reduction: "-10%",
    description:
      "Camping 4 étoiles en bord de rivière à Chauzon, en Ardèche. Cadre naturel exceptionnel avec accès direct à la rivière, piscine, espace aquatique. Emplacements spacieux pour vans et camping-cars. Ambiance familiale et authentique au cœur des gorges de l'Ardèche.",
    services: ["Wifi", "Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "Chauzon, Ardèche",
  },
  {
    id: "camping-bon-sejour",
    name: "Camping Bon Séjour",
    type: "Camping",
    location: "Le Grau-du-Roi, Occitanie",
    region: "Occitanie",
    lat: 43.52,
    lng: 4.14,
    reduction: "-10%",
    description:
      "Camping calme et familial au Grau du Roi, à deux pas de la plage de l'Espiguette. 365 emplacements spacieux pour vans, camping-cars et tentes. Bar-restaurant animé avec soirées, épicerie, laverie. Animaux acceptés. Démarche écologique avec bornes de tri sélectif.",
    services: ["Wifi", "Restauration", "Animaux acceptés"],
    address: "1730 route de l'Espiguette, 30240 Le Grau-du-Roi",
  },
  {
    id: "camping-les-terrasses",
    name: "Camping Les Terrasses",
    type: "Camping",
    location: "Saint-Chinian, Occitanie",
    region: "Occitanie",
    lat: 43.42,
    lng: 2.95,
    reduction: "-10%",
    description:
      "Camping 3 étoiles dans l'Hérault, au cœur du parc naturel régional du Haut-Languedoc. Emplacements spacieux et arborés avec vue sur les vignobles de Saint-Chinian. Piscine, snack, ambiance conviviale. Idéal pour les vanlifers en quête de nature et de tranquillité.",
    services: ["Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "Saint-Chinian, Occitanie",
  },
  {
    id: "camping-de-pont-augan",
    name: "Camping de Pont Augan",
    type: "Camping",
    location: "Baud, Bretagne",
    region: "Bretagne",
    lat: 47.874,
    lng: -2.997,
    reduction: "-10%",
    description:
      "Petit camping à taille humaine à la campagne, proche de la Bretagne intérieure. Calme assuré et nature préservée pour une étape vanlife sereine.",
    services: ["Wifi", "Animaux acceptés"],
  },
  {
    id: "camping-de-gracay",
    name: "Camping de Graçay",
    type: "Camping",
    location: "Graçay, Centre-Val de Loire",
    region: "Centre-Val de Loire",
    lat: 47.14,
    lng: 1.97,
    reduction: "-10%",
    description:
      "Camping en Berry dans les bocages du Cher. Région de George Sand, Nohant et châteaux de la Vallée Noire du Berry profond. Cadre paisible et authentique pour une étape nature.",
    services: [],
    address: "Graçay, Centre-Val de Loire",
  },
  {
    id: "mas-de-bouzou",
    name: "Mas de Bouzou",
    type: "Ferme",
    location: "Grèzes, Lot",
    region: "Occitanie",
    lat: 44.62,
    lng: 1.82,
    reduction: "-10%",
    description:
      "Ferme d'accueil paysan dans le Lot, Mas de Bouzou offre un cadre authentique et champêtre. Emplacements pour vans au calme, produits de la ferme, ambiance familiale. Une halte ressourçante au coeur du Parc Naturel des Causses du Quercy.",
    services: ["Animaux acceptés"],
    address: "Grèzes, Lot",
  },
  {
    id: "camping-paradis-les-amarines",
    name: "Camping Paradis Les Amarines",
    type: "Camping",
    location: "Cornillon, Occitanie",
    region: "Occitanie",
    lat: 44.22,
    lng: 4.49,
    reduction: "-10%",
    description:
      "Camping Paradis 4★ en bord de Cèze à Cornillon, dans le Gard. Emplacements spacieux et arborés avec électricité, accès direct à la rivière, piscine chauffée. Les villages de Cornillon et Goudargues sont accessibles à pied ou à vélo en moins d'1 km.",
    services: ["Wifi", "Piscine / baignade", "Restauration", "Animaux acceptés", "Élec. 10A", "Vidange"],
    address: "181 Route de Goudargues, 30630 Cornillon",
  },
  {
    id: "camping-le-patis",
    name: "Camping Le Pâtis",
    type: "Camping",
    location: "Les Aynans, Bourgogne-Franche-Comté",
    region: "Bourgogne-Franche-Comté",
    lat: 47.62,
    lng: 6.45,
    reduction: "Petit prix",
    description:
      "Camping associatif familial au bord de la rivière. Tarifs publics accessibles : 8 € pour 1 personne avec emplacement, 10 € avec véhicule et 13 € pour 2 personnes avec emplacement et véhicule. Pas de réduction membre supplémentaire.",
    services: ["Wifi", "Animaux acceptés"],
    address: "3 rue des Lavandières, 70200 Les Aynans",
  },
  {
    id: "camping-la-plage",
    name: "Camping La Plage",
    type: "Camping",
    location: "Saint-André-de-Roquepertuis, Occitanie",
    region: "Occitanie",
    lat: 44.23,
    lng: 4.45,
    reduction: "-10%",
    description:
      "Camping au bord de l'eau dans le Gard, offrant un accès direct à la rivière et des emplacements ombragés pour vans. Cadre naturel préservé, idéal pour la baignade et les activités nautiques. Ambiance familiale et décontractée.",
    services: ["Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "Saint-André-de-Roquepertuis, Occitanie",
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
    services: ["Wifi", "Piscine / baignade", "Animaux acceptés"],
    address: "Route de Saint Lambert, 12100 Millau",
  },
  {
    id: "camping-la-pindiere",
    name: "Camping la Pindière",
    type: "Camping",
    location: "Héric, Pays de la Loire",
    region: "Pays de la Loire",
    lat: 47.423,
    lng: -1.654,
    reduction: "-10%",
    description:
      "Camping familial à taille humaine à la campagne, proche de Nantes et de l'océan. Emplacements nus pour vans avec accès aux services.",
    services: ["Wifi", "Animaux acceptés"],
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
    services: ["Animaux acceptés"],
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
    services: ["Wifi", "Restauration", "Animaux acceptés"],
  },
  {
    id: "eco-camping-porte-autan",
    name: "Éco-Camping La Porte d'Autan",
    type: "Éco-Camping",
    location: "Saissac, Occitanie",
    region: "Occitanie",
    lat: 43.36,
    lng: 2.17,
    reduction: "-10%",
    description:
      "Éco-camping dans la Montagne Noire, à Saissac. Hébergements insolites et emplacements vans dans un cadre naturel préservé. Démarche écologique forte, panneaux solaires, compost, produits locaux. Idéal pour les vanlifers engagés dans une démarche respectueuse.",
    services: ["Wifi", "Animaux acceptés"],
    address: "Saissac, Occitanie",
  },
  {
    id: "camping-le-clos-de-la-lere",
    name: "Camping Le Clos de la Lère",
    type: "Camping",
    location: "Cayriech, Occitanie",
    region: "Occitanie",
    lat: 44.22,
    lng: 1.61,
    reduction: "-10%",
    description:
      "Camping familial dans le Tarn-et-Garonne, au cœur de la campagne quercynoise. Emplacements spacieux et arborés pour vans et camping-cars. Calme, ombragé, avec piscine. Proche des bastides et des vallées pittoresques du Quercy.",
    services: ["Piscine / baignade", "Animaux acceptés"],
    address: "Cayriech, Occitanie",
  },
  {
    id: "camping-de-l-aix",
    name: "Camping de l'Aix",
    type: "Camping",
    location: "Pommiers-en-Forez, Auvergne-Rhône-Alpes",
    region: "Auvergne-Rhône-Alpes",
    lat: 45.83,
    lng: 4.06,
    reduction: "-10%",
    description:
      "Au cœur du Forez, entre plaine et contreforts des Monts du Lyonnais, le Camping de l'Aix accueille les vanlifers dans un cadre verdoyant et familial. Grands emplacements de 120m², piscine de 240m² avec plages, snack Tiky, food truck.",
    services: ["Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "364 route du camping, Pommiers-en-Forez",
  },
  {
    id: "camping-les-drouihedes",
    name: "Camping Les Drouilhèdes",
    type: "Camping",
    location: "Peyremale, Occitanie",
    region: "Occitanie",
    lat: 44.28,
    lng: 4.3,
    reduction: "-10%",
    description:
      "Camping nature dans les Cévennes, au cœur du Gard. Emplacements spacieux pour vans dans un cadre de garrigue et de chênes verts. Ambiance conviviale, piscine, proximité des gorges de l'Ardèche et de la Cèze. Idéal pour les amoureux de nature.",
    services: ["Piscine / baignade", "Animaux acceptés"],
    address: "Peyremale, Occitanie",
  },
  {
    id: "ferme-pedagogique-solidor",
    name: "Ferme Pédagogique Solidor",
    type: "Ferme pédagogique",
    location: "Saint-Malo, Bretagne",
    region: "Bretagne",
    lat: 48.65,
    lng: -2.0,
    reduction: "-10%",
    description:
      "Ferme pédagogique à Saint-Malo proposant une expérience authentique aux vanlifers. Découverte des animaux de la ferme, produits locaux, emplacement van au calme. Une halte éducative et ressourçante en Bretagne.",
    services: ["Animaux acceptés"],
    address: "Saint-Malo, Bretagne",
  },
  {
    id: "flower-camping-des-lacs",
    name: "Flower Camping des Lacs",
    type: "Camping",
    location: "Pressignac, Charente",
    region: "Nouvelle-Aquitaine",
    lat: 45.82,
    lng: 0.73,
    reduction: "-10%",
    description:
      "Camping Flower au bord des lacs de Pressignac, en Charente. Emplacements spacieux pour vans et camping-cars avec accès direct aux plans d'eau. Baignade, pêche, paddle et pédalos. Cadre naturel préservé pour des vacances au calme.",
    services: ["Wifi", "Restauration", "Animaux acceptés"],
    address: "Pressignac, Charente",
  },
  {
    id: "camping-le-moulin-du-bel-air",
    name: "Camping Le Moulin du Bel-Air",
    type: "Camping",
    location: "Saint-Germain-du-Bel-Air, Occitanie",
    region: "Occitanie",
    lat: 44.64,
    lng: 1.43,
    reduction: "-10%",
    description:
      "Camping dans le Lot, au calme à Saint-Germain-du-Bel-Air. Emplacements pour vans et camping-cars dans un cadre verdoyant. Ambiance familiale et nature, proche des sites touristiques du Lot et de la vallée de la Dordogne.",
    services: ["Piscine / baignade", "Animaux acceptés"],
    address: "Saint-Germain-du-Bel-Air, Occitanie",
  },
  {
    id: "camping-des-bains",
    name: "Camping des Bains",
    type: "Camping",
    location: "Saint-Honoré-les-Bains, Bourgogne",
    region: "Bourgogne-Franche-Comté",
    lat: 46.9,
    lng: 3.84,
    reduction: "-10%",
    description:
      "Camping en Bourgogne, à Saint-Honoré-les-Bains, station thermale réputée. Emplacements spacieux pour vans à proximité des sources thermales. Cadre arboré et paisible, idéal pour une étape détente au cœur du Morvan.",
    services: ["Wifi", "Piscine / baignade", "Restauration", "Animaux acceptés"],
    address: "Saint-Honoré-les-Bains, Bourgogne",
  },
  {
    id: "domaine-de-mepillat",
    name: "Domaine de Mépillat",
    type: "Camping à la ferme",
    location: "Saint-Nizier-le-Bouchoux, Auvergne-Rhône-Alpes",
    region: "Auvergne-Rhône-Alpes",
    lat: 46.459,
    lng: 5.151,
    reduction: "-10%",
    description:
      "Camping à la ferme familial niché dans les collines de la Bresse. Calme, nature et produits locaux au rendez-vous. Emplacements spacieux pour vans et camping-cars.",
    services: ["Animaux acceptés"],
  },
  {
    id: "camping-de-fontenoy",
    name: "Camping de Fontenoy",
    type: "Camping",
    location: "Fontenoy-le-Château, Grand Est",
    region: "Grand Est",
    lat: 47.97,
    lng: 6.2,
    reduction: "-15%",
    description:
      "Camping au cœur du village médiéval de Fontenoy-le-Château dans les Vosges du Sud, vallée du Côney. 53 emplacements majoritairement ombragés pour camping-cars et vans, avec électricité et eau. Restaurant sur place. Personnel multilingue.",
    services: ["Wifi", "Restauration", "Animaux acceptés"],
    address: "11 Route de Saint-Loup, 88240 Fontenoy-le-Château",
  },
  {
    id: "camping-de-lann-hoedic",
    name: "Camping de Lann Hoëdic",
    type: "Camping",
    location: "Sarzeau, Bretagne",
    region: "Bretagne",
    lat: 47.53,
    lng: -2.77,
    reduction: "-15%",
    description:
      "Camping 3 étoiles de 3,6 hectares sur la presqu'île de Rhuys, entre Golfe du Morbihan et Atlantique, à 2,5 km de Sarzeau. 119 emplacements pour tentes, vans et camping-cars. Labellisé Green Key, Refuge LPO, certifié Accueil Vélo. Esprit camping authentique et convivial.",
    services: ["Wifi", "Restauration", "Animaux acceptés"],
    address: "Rue Jean de la Fontaine, 56370 Sarzeau",
  },
  {
    id: "camping-du-pont-augan",
    name: "Camping du Pont Augan",
    type: "Camping",
    location: "Baud, Bretagne",
    region: "Bretagne",
    lat: 47.87,
    lng: -3.0,
    reduction: "-10%",
    description:
      "Camping à taille humaine à Baud, en Bretagne, offrant un cadre calme et verdoyant pour les vanlifers. Emplacements spacieux pour vans et camping-cars, électricité, sanitaires modernes. Proche des chemins de randonnée et de la campagne bretonne. Idéal pour une étape paisible entre terre et mer, à 30 minutes des plages du Morbihan.",
    services: ["Wifi", "Animaux acceptés"],
    address: "Baud, Bretagne",
  },
];

// Obtenir les villages (featured)
export function getVillages(): Lieu[] {
  return LIEUX_LABELLISES.filter(l => l.type === "Village");
}

// Obtenir les campings
export function getCampings(): Lieu[] {
  return LIEUX_LABELLISES.filter(l => l.type !== "Village");
}

// Obtenir les lieux par région
export function getLieuxByRegion(region: string): Lieu[] {
  return LIEUX_LABELLISES.filter(l => l.region === region);
}

// Obtenir toutes les régions uniques
export function getAllRegions(): string[] {
  return Array.from(new Set(LIEUX_LABELLISES.map(l => l.region)));
}

// Obtenir un lieu par son ID
export function getLieuById(id: string): Lieu | undefined {
  return LIEUX_LABELLISES.find(l => l.id === id);
}

// Stats
export const STATS = {
  totalIdentifies: 220,
  enCandidature: 670,
  labellises: LIEUX_LABELLISES.length,
  regions: getAllRegions().length,
  membresFondateurs: 200,
};
