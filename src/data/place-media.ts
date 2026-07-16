type PlaceMediaDefinition = {
  extensions: string[];
  documentCount?: number;
};

export type PlaceMedia = {
  photos: string[];
  documents: { label: string; url: string }[];
};

const MEDIA: Record<string, PlaceMediaDefinition> = {
  "camping-au-tylo-soleil": { extensions: ["jpg", "jpeg", "jpeg", "webp", "webp", "webp", "webp", "webp", "webp", "webp"] },
  "camping-bon-sejour": { extensions: ["jpg", "jpg"] },
  "camping-de-fontenoy": { extensions: ["jpg", "jpg", "jpg", "jpg"] },
  "camping-de-gracay": { extensions: ["webp", "webp", "jpeg", "webp"] },
  "camping-de-laix": { extensions: ["png", "jpg", "jpg", "jpg", "png", "jpg", "jpeg", "jpg", "jpg"] },
  "camping-de-la-torche": { extensions: ["jpg", "webp", "webp"] },
  "camping-de-lann-hoedic": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "svg"] },
  "camping-de-pont-augan": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg", "jpg"] },
  "camping-des-bains": { extensions: ["jpg", "jpg", "webp", "jpg", "jpg", "avif", "png"], documentCount: 1 },
  "camping-des-lacs": { extensions: ["jpg", "jpg", "webp", "webp", "webp", "webp", "webp", "png"] },
  "camping-la-communnion": { extensions: ["jpg", "jpg", "jpg"] },
  "camping-la-pindiere": { extensions: ["jpg", "png", "jpg", "jpg"], documentCount: 1 },
  "camping-la-plage": { extensions: ["jpg", "webp", "webp", "webp", "webp", "webp"], documentCount: 1 },
  "camping-le-clos-de-la-lere": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpg", "png", "jpg", "jpeg"] },
  "camping-le-coin-charmant": { extensions: ["jpg", "jpg", "jpg", "jpg", "png", "webp"] },
  "camping-le-moulin-du-bel-air": { extensions: ["jpg", "jpg", "jpg", "jpg", "png"], documentCount: 1 },
  "camping-le-patis": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpg"] },
  "camping-le-verger": { extensions: ["jpg", "jpg", "jpg", "png", "jpg", "jpg", "jpg"] },
  "camping-les-amarines": { extensions: ["jpg", "png", "png", "png", "png", "png", "jpg"] },
  "camping-les-drouihedes": { extensions: ["jpg", "jpg", "jpg"], documentCount: 1 },
  "camping-les-terrasses": { extensions: ["jpg", "jpg", "webp", "webp", "webp", "webp"], documentCount: 1 },
  "camping-saint-lambert": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpeg", "png"] },
  "domaine-de-mepillat": { extensions: ["jpg", "webp", "jpg"], documentCount: 1 },
  "eco-camping-la-porte-dautan": { extensions: ["jpg", "jpg", "jpg", "jpg", "jpg", "png", "jpg"] },
  "ferme-pedagogique-solidor": { extensions: ["jpg", "jpg", "jpg", "jpg"] },
  "mas-de-bouzou": { extensions: ["jpg", "jpg", "avif"] },
};

export function getPlaceMedia(placeId: string): PlaceMedia {
  const definition = MEDIA[placeId];
  if (!definition) return { photos: [], documents: [] };

  const base = `/images/lieux/${placeId}`;
  return {
    photos: definition.extensions.map(
      (extension, index) => `${base}/source-${String(index + 1).padStart(2, "0")}.${extension}`,
    ),
    documents: Array.from({ length: definition.documentCount ?? 0 }, (_, index) => ({
      label: index === 0 ? "Plan ou document pratique" : `Document pratique ${index + 1}`,
      url: `${base}/document-${String(index + 1).padStart(2, "0")}.pdf`,
    })),
  };
}
