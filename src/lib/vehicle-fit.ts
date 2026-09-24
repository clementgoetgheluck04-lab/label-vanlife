export type VehicleNeeds = {
  crew: 'solo-couple' | 'family';
  rhythm: 'moving' | 'base';
  comfort: 'simple' | 'inside';
  daily: 'yes' | 'no';
  retro: 'yes' | 'no';
  ladder: 'yes' | 'no';
};
const formats = [
  { id: 'compact', name: 'Van compact', why: 'Un compromis à explorer entre déplacements fréquents et usage quotidien.', check: 'Essayez le lit déplié, les rangements et les places route. Compact ne garantit ni une hauteur de parking ni suffisamment de couchages.' },
  { id: 'fourgon', name: 'Fourgon aménagé', why: 'Une piste pour passer davantage de temps à l’intérieur tout en changeant d’étape.', check: 'Comparez les implantations, la charge disponible et le gabarit. Vérifiez la présence réelle des équipements souhaités.' },
  { id: 'campingcar', name: 'Camping-car', why: 'Un espace de vie à étudier pour un équipage ou des séjours avec du confort intérieur.', check: 'Contrôlez séparément places homologuées, couchages, charge disponible, dimensions et accès aux lieux d’accueil.' },
  { id: 'caravane', name: 'Caravane', why: 'Une base au camping qui permet de partir découvrir les alentours sans déplacer le couchage.', check: 'Avant tout achat, faites valider véhicule tracteur, masses, permis, stockage et aisance de manœuvre pour cet ensemble précis.' },
  { id: 'toit', name: 'Voiture et tente de toit', why: 'Une formule à essayer pour un séjour simple tourné vers la vie dehors.', check: 'Faites confirmer la compatibilité du toit et des barres. Essayez l’échelle, le repli sous la pluie et l’accès nocturne au couchage.' },
  { id: 'retro', name: 'Combi ou van rétro', why: 'Le voyage avec un véhicule de caractère, si l’entretien fait aussi partie du projet.', check: 'Faites réaliser une expertise indépendante de la corrosion et de la mécanique. Le charme ne garantit ni fiabilité ni coût d’entretien réduit.' },
] as const;

export function suggestVehicleFormats(needs: VehicleNeeds) {
  const scores: Record<string, number> = { compact: 0, fourgon: 0, campingcar: 0, caravane: 0, toit: 0, retro: 0 };
  if (needs.daily === 'yes') { scores.compact += 4; scores.toit += 2; }
  if (needs.rhythm === 'base') scores.caravane += 5;
  else { scores.compact += 2; scores.fourgon += 3; }
  if (needs.comfort === 'inside') { scores.fourgon += 4; scores.campingcar += 5; scores.caravane += 2; }
  else { scores.compact += 2; scores.toit += 4; }
  if (needs.crew === 'family') { scores.campingcar += 3; scores.caravane += 3; }
  else { scores.compact += 1; scores.fourgon += 1; }
  if (needs.retro === 'yes') scores.retro += 12;
  return formats.filter(format => (format.id !== 'toit' || needs.ladder === 'yes') && (format.id !== 'retro' || needs.retro === 'yes'))
    .map(format => ({ ...format, score: scores[format.id] }))
    .sort((a, b) => b.score - a.score).slice(0, 2);
}
