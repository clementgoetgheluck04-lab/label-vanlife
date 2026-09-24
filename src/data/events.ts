export type VanlifeEvent = {
  id: string; name: string; start: string; end: string; location: string;
  description: string; url: string; provisional?: boolean;
};
export const EVENT_POSTERS: Record<string, { src: string; source: string; credit: string; width: number; height: number }> = Object.fromEntries(
  ["grenoble", "rennes", "vannes", "bordeaux"].map(city => [`${city}-2027`, {
    src: `/images/evenements/${city}-2027.webp`,
    source: `https://vanlife-expo.com/wp-content/uploads/2026/09/AFFICHE-HORIZONTALE-VANLIFE-EXPO-${city.toUpperCase()}-2027.webp`,
    credit: "Vanlife Expo", width: 900, height: 506,
  }]),
);
const SOURCE = "https://vanlife-expo.com/vanlife-expo-2027-une-nouvelle-saison-quatre-rendez-vous-et-une-dynamique-qui-se-confirme/";
export const EVENTS_CHECKED_AT = "2026-09-23";
export const VANLIFE_EVENTS: readonly VanlifeEvent[] = [
  { id: "camper-van-week-end-chantilly-2026", name: "Camper Van Week-End Paris–Chantilly", start: "2026-10-09", end: "2026-10-11", location: "Polo Club du Domaine de Chantilly, Apremont (60)", description: "Vans, fourgons et équipements, rencontres avec les exposants et conférences autour du voyage itinérant. Consultez les conditions d’inscription et les pass parking ou bivouac auprès de l’organisateur.", url: "https://www.camper-van-week-end.fr/chantilly/" },
  { id: "vdl-2026", name: "Salon des Véhicules de Loisirs", start: "2026-09-26", end: "2026-10-04", location: "Parc des Expositions Paris – Le Bourget", description: "Un rendez-vous pour découvrir les véhicules de loisirs et préparer votre projet de voyage.", url: "https://salonvdl.com/infos-pratiques/" },
  { id: "grenoble-2027", name: "Vanlife Expo Grenoble", start: "2027-03-20", end: "2027-03-21", location: "Alpexpo, Grenoble", description: "La saison commence à Grenoble, autour des véhicules aménagés et de l’équipement pour voyager.", url: SOURCE },
  { id: "rennes-2027", name: "Vanlife Expo Rennes", start: "2027-04-10", end: "2027-04-11", location: "Rennes Parc Expo", description: "Une cinquième édition pour rencontrer les professionnels du véhicule aménagé et des solutions de voyage.", url: SOURCE },
  { id: "vannes-2027", name: "Vanlife Expo Vannes", start: "2027-10-09", end: "2027-10-10", location: "Le Chorus, Parc des Expositions de Vannes", description: "Une première édition Grand Ouest, avec un format régional pour rencontrer les professionnels du territoire.", url: SOURCE },
  { id: "bordeaux-2027", name: "Vanlife Expo Bordeaux", start: "2027-11-13", end: "2027-11-14", location: "Parc des Expositions de Bordeaux", description: "Une troisième édition annoncée à Bordeaux ; les dates restent sous réserve de validation par l’organisateur.", url: SOURCE, provisional: true },
];
export function eventStatus(event: Pick<VanlifeEvent, "start" | "end">, today: string): "past" | "ongoing" | "upcoming" {
  if (event.end < today) return "past";
  return event.start <= today ? "ongoing" : "upcoming";
}
