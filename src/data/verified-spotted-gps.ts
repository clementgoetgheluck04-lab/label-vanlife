export type VerifiedSpottedGps = {
  address: string;
  lat: number;
  lng: number;
  googleMapsUrl?: string;
  verifiedAt: string;
  source: string;
};

// Points des campings Papa'rtenaires contrôlés le 18 juillet 2026.
// La majorité a été vérifiée directement sur la fiche établissement Google Maps.
// En cas de fiche Maps ambiguë, la coordonnée publiée par le site officiel ou
// l'office de tourisme a été privilégiée.
const VERIFIED_SPOTTED_GPS: Record<string, VerifiedSpottedGps> = {
  "papa-rtenaires-camping-bois-toiles": { address: "317 Route de Sablons, 26140 Saint-Rambert-d'Albon", lat: 45.2998757, lng: 4.8080638, googleMapsUrl: "https://maps.app.goo.gl/bsjQx7Ya5aMyCSzD8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-de-lile-chambod": { address: "3232 Route du Port, 01250 Hautecourt-Romanèche", lat: 46.1276342, lng: 5.4273741, googleMapsUrl: "https://maps.app.goo.gl/97ZnbPPDZ6hc29127", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-de-mars": { address: "444 route du Camping, 42123 Cordelle", lat: 45.915616, lng: 4.060274, verifiedAt: "2026-07-18", source: "Brochure officielle Camping de Mars" },
  "papa-rtenaires-camping-gouffre-de-la-croix": { address: "1050 Route du Pont de Vezor, 38680 Châtelus", lat: 45.0646168, lng: 5.3930855, googleMapsUrl: "https://maps.app.goo.gl/oLRMQCTom1WTbVyZ9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-veronne": { address: "1300 Chemin de la Plaine, 26270 Saulce-sur-Rhône", lat: 44.679857, lng: 4.804217, googleMapsUrl: "https://maps.app.goo.gl/zi5CXqFKUA5Um2bG6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-parc-du-chateau": { address: "Rue du Château, 56350 Rieux", lat: 47.5979201, lng: -2.1010122, googleMapsUrl: "https://maps.app.goo.gl/YJgEbGVizZvscCrz9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-de-gouarec": { address: "Le Bout du Pont, 22570 Gouarec", lat: 48.225184, lng: -3.180776, googleMapsUrl: "https://maps.app.goo.gl/qcKaTVaZCC2WfnqF9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-freche-a-lane": { address: "6 Rue du Champ Saint-Paul, 22550 Pléboulle", lat: 48.608648, lng: -2.336317, googleMapsUrl: "https://maps.app.goo.gl/74xTqWofL9btkyhe7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-les-2-rivieres": { address: "Pré Bouché, 71400 La Celle-en-Morvan", lat: 47.0127041, lng: 4.1912877, googleMapsUrl: "https://maps.app.goo.gl/ffaYpr6W5m5Qh6SH9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-de-gracay": { address: "4 Chemin de Trompé Souris, 18310 Graçay", lat: 47.133261, lng: 1.851544, googleMapsUrl: "https://maps.app.goo.gl/p1bk7GxyWsB84D8Z7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-la-fritillaire": { address: "6 Rue du Camping, 37420 Savigny-en-Véron", lat: 47.2002781, lng: 0.1400725, googleMapsUrl: "https://maps.app.goo.gl/agoMY5P8RoR8Ag9d7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-lile-aux-mille-charmes": { address: "20 Rue de l'Écluse, 88130 Charmes", lat: 48.377224, lng: 6.2899989, googleMapsUrl: "https://maps.app.goo.gl/GzSVA4wdejrYcEzt7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-la-fontaine-des-clercs": { address: "1 Rue de l'Église, 62170 Montreuil-sur-Mer", lat: 50.4682602, lng: 1.7628211, googleMapsUrl: "https://maps.app.goo.gl/2Rjor3Q56i31URrG6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-dauberoche": { address: "100 Route du Roc, 24640 Bassillac et Auberoche", lat: 45.2095595, lng: 0.8988025, googleMapsUrl: "https://maps.app.goo.gl/zg8gWisYoXynxUyPA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-nature-et-vezere": { address: "18 route de Treignac, 19260 Peyrissac", lat: 45.5014661, lng: 1.7037271, googleMapsUrl: "https://maps.app.goo.gl/cu9m7sspAmwYpnBQA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-chez-gendron": { address: "Chez Jandron, 33820 Saint-Palais-de-Blaye", lat: 45.314192, lng: -0.603218, googleMapsUrl: "https://maps.app.goo.gl/ehPpezs7dfP35Ae39", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-chateau-le-verdoyer": { address: "Château le Verdoyer, 24470 Champs-Romain", lat: 45.55145, lng: 0.7955698, googleMapsUrl: "https://maps.app.goo.gl/GqmU49XgNvywFpfg8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-plein-air-neuvicois": { address: "D39, 24190 Neuvic", lat: 45.1075007, lng: 0.4699344, googleMapsUrl: "https://maps.app.goo.gl/JGvVp8e1ero3LedMA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-prelong": { address: "49 Rue de l'Estran, 17310 Saint-Pierre-d'Oléron", lat: 45.948979, lng: -1.366279, googleMapsUrl: "https://maps.app.goo.gl/ovkF9wHWLZ13qtmj6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-la-venise-verte": { address: "178 Route des Bords de Sèvre, 79510 Coulon", lat: 46.314687, lng: -0.608797, googleMapsUrl: "https://maps.app.goo.gl/dfQGE5YAQqkWL3xZ9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-maine-blanc": { address: "Lieu-dit Le Maine Blanc, 33920 Saint-Christoly-de-Blaye", lat: 45.1395805, lng: -0.4867591, googleMapsUrl: "https://maps.app.goo.gl/LHQuZAgLrxCuwLWcA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-associatif-anac": { address: "Lieu-dit La Monnerie, 1481 Route de l'Estang, 24450 La Coquille", lat: 45.5518649, lng: 0.945924, googleMapsUrl: "https://maps.app.goo.gl/j3fKmjd6Cb3JPKUeA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-du-parc": { address: "9 Allée William Jonka, 17750 Étaules", lat: 45.7327614, lng: -1.1022661, googleMapsUrl: "https://maps.app.goo.gl/K5m8QSJmDk4t4pBP8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-de-la-bucherie": { address: "203 Route de la Peyrière, 24470 Saint-Saud-Lacoussière", lat: 45.5669128, lng: 0.8385066, googleMapsUrl: "https://maps.app.goo.gl/RZTCiC2R32zYPuB46", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-sorbier": { address: "828 Chemin de la Fontaine, 24290 Montignac-Lascaux", lat: 45.0418432, lng: 1.1501698, googleMapsUrl: "https://maps.app.goo.gl/9jK8DrZU3hYJeiar9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-les-catalpas": { address: "1335 chemin de Gaillardel, 47500 Fumel", lat: 44.48926, lng: 0.9968768, googleMapsUrl: "https://maps.app.goo.gl/2esm6SvzpcHjVB296", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-le-valenty": { address: "Plaine de Valenty, 46700 Soturac", lat: 44.488985126901675, lng: 1.0184187283754782, verifiedAt: "2026-07-18", source: "Site officiel Camping Le Valenty" },
  "papa-rtenaires-camping-pre-fixe": { address: "175 Rue de l'Abbé Duthil, 31420 Cassagnabère-Tournas", lat: 43.226662, lng: 0.78885, verifiedAt: "2026-07-18", source: "PiNCAMP / ADAC" },
  "papa-rtenaires-camping-nature-le-pichadou-z-13-rue-du-cers-11330-salza-07-84-84-83-41-https-www-facebook-com-camping-nature-le-pichadou-102427315823843": { address: "13 Rue du Cers, 11330 Salza", lat: 42.9841924, lng: 2.4970408, verifiedAt: "2026-07-18", source: "Adresse du guide Papa'rtenaires" },
  "papa-rtenaires-camping-loliveraie": { address: "1600 chemin de Bédarieux, 34480 Laurens", lat: 43.5346666667, lng: 3.18725, verifiedAt: "2026-07-18", source: "Site officiel Camping L'Oliveraie" },
  "papa-rtenaires-camping-les-terrasses-du-jaur": { address: "Chemin de Notre-Dame, 34390 Prémian", lat: 43.5220098, lng: 2.83127545, verifiedAt: "2026-07-18", source: "Office de tourisme Minervois au Caroux" },
  "papa-rtenaires-camping-le-moulin-du-bel-air": { address: "685 Route du Céou, Claux de Bouyssole, 46310 Saint-Germain-du-Bel-Air", lat: 44.6493368, lng: 1.4350603, googleMapsUrl: "https://maps.app.goo.gl/d3Kreu1beLgFBTZUA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-les-auzerals": { address: "Route de Grazac, 81800 Rabastens", lat: 43.831668959621, lng: 1.6970097789764, verifiedAt: "2026-07-18", source: "Camping-Car Magazine / adresse officielle" },
  "papa-rtenaires-camping-du-loup": { address: "Chemin de la Forêt, 65100 Lourdes", lat: 43.097647, lng: -0.069963, verifiedAt: "2026-07-18", source: "Adresse officielle Camping du Loup" },
  "papa-rtenaires-le-domaine-du-castex": { address: "Le Domaine du Castex, 32290 Aignan", lat: 43.692703, lng: 0.075425, verifiedAt: "2026-07-18", source: "PiNCAMP / ADAC" },
  "papa-rtenaires-camping-la-plage": { address: "85 Le Courau, 30630 Saint-André-de-Roquepertuis", lat: 44.2458888, lng: 4.4508187, googleMapsUrl: "https://maps.app.goo.gl/6bcChEWTvjL1jJ3z5", verifiedAt: "2026-07-18", source: "Google Maps" },
  "papa-rtenaires-camping-lou-treillat": { address: "1 route des Cambous, 48110 Sainte-Croix-Vallée-Française", lat: 44.178491, lng: 3.751533, verifiedAt: "2026-07-18", source: "Site officiel Camping Lou Treillat" },
  "papa-rtenaires-camping-arc-en-ciel": { address: "50 Avenue Henri Malacrida, 13100 Aix-en-Provence", lat: 43.512224, lng: 5.4715826, verifiedAt: "2026-07-18", source: "Site officiel Camping Arc-en-Ciel" },
  "papa-rtenaires-camping-le-marais-sauvage": { address: "12 Route de la Sèvre, 85420 Le Mazeau", lat: 46.3297805, lng: -0.6743517, verifiedAt: "2026-07-18", source: "Site officiel Camping Le Marais Sauvage" },
};

export function getVerifiedSpottedGps(placeId: string): VerifiedSpottedGps | undefined {
  return VERIFIED_SPOTTED_GPS[placeId];
}

export const VERIFIED_SPOTTED_GPS_COUNT = Object.keys(VERIFIED_SPOTTED_GPS).length;
export const VERIFIED_SPOTTED_GPS_IDS = Object.keys(VERIFIED_SPOTTED_GPS);
