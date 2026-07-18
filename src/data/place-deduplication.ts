// Correspondances contrôlées entre la source canonique des lieux labellisés
// et les anciennes fiches issues des réseaux externes. Ces fiches externes
// ne doivent plus apparaître comme des lieux « repérés, non labellisés » :
// leurs informations complètent désormais la fiche labellisée officielle.
export const LABELLED_DUPLICATE_SOURCE_IDS = {
  "camping-de-gracay": ["papa-rtenaires-camping-de-gracay"],
  "camping-la-communnion": ["bienvenue-ferme-ferme-la-communion"],
  "camping-la-plage": ["papa-rtenaires-camping-la-plage"],
  "camping-le-moulin-du-bel-air": ["papa-rtenaires-camping-le-moulin-du-bel-air"],
} as const;

const DUPLICATE_SOURCE_IDS = new Set<string>(Object.values(LABELLED_DUPLICATE_SOURCE_IDS).flat());

export function isSpottedDuplicateOfLabelled(sourceId: string) {
  return DUPLICATE_SOURCE_IDS.has(sourceId);
}

export function getLabelledSourceIds(labelledPlaceId: string): readonly string[] {
  return LABELLED_DUPLICATE_SOURCE_IDS[labelledPlaceId as keyof typeof LABELLED_DUPLICATE_SOURCE_IDS] ?? [];
}

export const LABELLED_DUPLICATE_COUNT = DUPLICATE_SOURCE_IDS.size;
