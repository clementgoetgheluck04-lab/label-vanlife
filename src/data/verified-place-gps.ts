export type VerifiedPlaceGps = {
  address: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
  verifiedAt: string;
  source: "Google Maps";
};

// Chaque point correspond à la fiche établissement Google Maps, contrôlée
// manuellement avec le nom, l'adresse et le site officiel le 18 juillet 2026.
// Les coordonnées ne sont volontairement pas arrondies : elles servent aux
// marqueurs de la MAP et aux boutons Google Maps / Waze.
const VERIFIED_PLACE_GPS: Record<string, VerifiedPlaceGps> = {
  "camping-de-pont-augan": { address: "Camping De Pont Augan N°6, 56150 Baud", lat: 47.8827125, lng: -3.1070201, googleMapsUrl: "https://maps.app.goo.gl/1Dpk6wUuh2URpBno7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-de-lann-hoedic": { address: "Rue Jean de la Fontaine Lann Hoedic, 56370 Sarzeau", lat: 47.5074329, lng: -2.7609594, googleMapsUrl: "https://maps.app.goo.gl/LXfUAz3fQyEUHqwk7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-de-la-torche": { address: "4 Roz an Tremen, 29120 Plomeur", lat: 47.8327074, lng: -4.3268287, googleMapsUrl: "https://maps.app.goo.gl/QP2nckXxDaQFHq1u6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-le-verger": { address: "27 Rue Jean-Pierre Pigot - Bellecroix, 17139 Dompierre-sur-Mer", lat: 46.1777366, lng: -1.0544302, googleMapsUrl: "https://maps.app.goo.gl/N63o1o3WjACZqUjb8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-la-pindiere": { address: "102 La Denais, 44810 Héric", lat: 47.413509, lng: -1.6705092, googleMapsUrl: "https://maps.app.goo.gl/zm6R6MmYAHyGHWV9A", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-bon-sejour": { address: "1730 Route de l'Espiguette, 30240 Le Grau-du-Roi", lat: 43.5116647, lng: 4.1458131, googleMapsUrl: "https://maps.app.goo.gl/DEy5N3L49kJY7auC8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-de-gracay": { address: "4 Chemin de Trompé Souris, 18310 Graçay", lat: 47.133261, lng: 1.851544, googleMapsUrl: "https://maps.app.goo.gl/BYWkkvfyehyAt4kG7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-des-lacs": { address: "1 Plage de la Guerlie, 16150 Pressignac", lat: 45.8049164, lng: 0.7079421, googleMapsUrl: "https://maps.app.goo.gl/Hmaw1rccNdGdAtTU8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-saint-lambert": { address: "2050 Avenue de l'Aigoual, 12100 Millau", lat: 44.0998039, lng: 3.1115367, googleMapsUrl: "https://maps.app.goo.gl/XjWVs3YpM7gEyu2D9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-la-communnion": { address: "La Communion, 31310 Latour", lat: 43.204326, lng: 1.269546, googleMapsUrl: "https://maps.app.goo.gl/iJ9sMwGTbsHVGXup8", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-les-terrasses": { address: "65 Chemin des Cigales, 34360 Saint-Chinian", lat: 43.421221, lng: 2.933939, googleMapsUrl: "https://maps.app.goo.gl/ezD4JiTvWD6wdrAS7", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-la-plage": { address: "85 Le Courau, 30630 Saint-André-de-Roquepertuis", lat: 44.2458888, lng: 4.4508187, googleMapsUrl: "https://maps.app.goo.gl/6bcChEWTvjL1jJ3z5", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-les-drouihedes": { address: "100 Allée du Camping, 30160 Peyremale", lat: 44.2911619, lng: 4.0670651, googleMapsUrl: "https://maps.app.goo.gl/uoVdrWZT2YjRWFqE6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-les-amarines": { address: "D23, 30630 Cornillon", lat: 44.2198737, lng: 4.4801014, googleMapsUrl: "https://maps.app.goo.gl/sDoJkt8n1zcwqmq96", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-le-coin-charmant": { address: "1050 Chemin des Digues, 07120 Chauzon", lat: 44.4858796, lng: 4.3732603, googleMapsUrl: "https://maps.app.goo.gl/jqaHmA2tUYwQ3ymv9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-au-tylo-soleil": { address: "627 Route des Encontres, 04300 Dauphin", lat: 43.9110218, lng: 5.7820187, googleMapsUrl: "https://maps.app.goo.gl/rZoXSq3o3Lef9TYGA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-de-laix": { address: "364 Route du Camping, 42260 Pommiers-en-Forez", lat: 45.8241306, lng: 4.0679327, googleMapsUrl: "https://maps.app.goo.gl/TeHxn5Tqy72Ly9436", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-de-fontenoy": { address: "11 Route de Saint-Loup, 88240 Fontenoy-le-Château", lat: 47.9564459, lng: 6.2114244, googleMapsUrl: "https://maps.app.goo.gl/1RsJDo9YFTgy257z9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-le-moulin-du-bel-air": { address: "685 Route du Céou, Claux de Bouyssole, 46310 Saint-Germain-du-Bel-Air", lat: 44.6493368, lng: 1.4350603, googleMapsUrl: "https://maps.app.goo.gl/d3Kreu1beLgFBTZUA", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-le-clos-de-la-lere": { address: "230 Route de Septfonds, 82240 Cayriech", lat: 44.2171795, lng: 1.6131894, googleMapsUrl: "https://maps.app.goo.gl/EtUap77YWdbqtoco6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-le-patis": { address: "3 Rue des Lavandières, 70200 Les Aynans", lat: 47.6216812, lng: 6.4526856, googleMapsUrl: "https://maps.app.goo.gl/MkVs2CXF5poX7ncX9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "camping-des-bains": { address: "15 Avenue Jean Mermoz, 58360 Saint-Honoré-les-Bains", lat: 46.90689, lng: 3.828042, googleMapsUrl: "https://maps.app.goo.gl/L6ahuHJ8L8ApiiSB6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "domaine-de-mepillat": { address: "70 Grange Maigre, 01560 Saint-Nizier-le-Bouchoux", lat: 46.4518996, lng: 5.1896865, googleMapsUrl: "https://maps.app.goo.gl/Kb17eXf9pBrtHyED9", verifiedAt: "2026-07-18", source: "Google Maps" },
  "eco-camping-la-porte-dautan": { address: "1 Rue Boris Vian, 11310 Saissac", lat: 43.3615845, lng: 2.1610025, googleMapsUrl: "https://maps.app.goo.gl/LGn3D4C8Vu1FpwJs5", verifiedAt: "2026-07-18", source: "Google Maps" },
  "ferme-pedagogique-solidor": { address: "La Ville Biard, 35400 Saint-Malo", lat: 48.6213626, lng: -1.9693493, googleMapsUrl: "https://maps.app.goo.gl/55QxNhSKAd2yj34v6", verifiedAt: "2026-07-18", source: "Google Maps" },
  "mas-de-bouzou": { address: "Mas de Bouzou, 46320 Grèzes", lat: 44.6206394, lng: 1.823537, googleMapsUrl: "https://maps.app.goo.gl/7PyJhEcrgcDp3UeR8", verifiedAt: "2026-07-18", source: "Google Maps" },
};

export function getVerifiedPlaceGps(placeId: string): VerifiedPlaceGps | undefined {
  return VERIFIED_PLACE_GPS[placeId];
}

export const VERIFIED_PLACE_GPS_COUNT = Object.keys(VERIFIED_PLACE_GPS).length;
export const VERIFIED_PLACE_GPS_IDS = Object.keys(VERIFIED_PLACE_GPS);
