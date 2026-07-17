import places from "./member-camping-network.json";

export type SpottedPlace = {
  id: string;
  name: string;
  network: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  website: string;
  source: string;
};

export const SPOTTED_PLACES = places as SpottedPlace[];

export function getSpottedPlace(id: string) {
  return SPOTTED_PLACES.find((place) => place.id === id);
}

export function buildClaimHref(place: SpottedPlace) {
  const params = new URLSearchParams({
    claim: place.id,
    establishmentName: place.name,
    address: place.address,
    postalCode: place.postalCode,
    city: place.city,
    region: place.region,
  });
  if (place.website) params.set("website", place.website);
  return `/labellisation/candidature?${params.toString()}`;
}

export function buildRemovalMailto(place: SpottedPlace) {
  const subject = `Correction ou retrait de la fiche : ${place.name}`;
  const body = [
    "Bonjour Label Vanlife,",
    "",
    `Je vous contacte au sujet de la fiche « ${place.name} » (référence : ${place.id}).`,
    "",
    "Ma demande : [correction / retrait de la fiche]",
    "Je suis : [propriétaire / gestionnaire / autre]",
    "Précisions :",
    "",
    "Merci de me recontacter afin de vérifier ma demande.",
  ].join("\n");
  return `mailto:contact@labelvanlife.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
