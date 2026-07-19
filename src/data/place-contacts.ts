export type PlaceContact = {
  website?: string;
  email?: string;
  phone?: string;
};

// Coordonnées publiques vérifiées dans les pages enregistrées fournies avec la V1.
// Les adresses Label Vanlife et les valeurs de démonstration ont été exclues.
const CONTACTS: Record<string, PlaceContact> = {
  "camping-au-tylo-soleil": { website: "https://autylosoleil.fr/" },
  "camping-bon-sejour": { website: "https://camping-bonsejour.fr/", email: "contact@camping-bonsejour.fr", phone: "+33466514711" },
  "camping-de-fontenoy": { website: "https://www.campingfontenoy.com/", email: "camping.fontenoylechateau@outlook.fr", phone: "+33329363474" },
  "camping-de-gracay": { website: "https://www.camping-berry.com/", email: "contact@campingdegracay.com", phone: "+33681993766" },
  "camping-de-laix": { website: "https://camping-pommiers.fr/", email: "camping.depommiers@orange.fr", phone: "+33649009700" },
  "camping-de-la-torche": { website: "https://www.campingdelatorche.fr/", email: "info@campingdelatorche.fr", phone: "+33614799614" },
  "camping-de-lann-hoedic": { website: "https://www.camping-lannhoedic.fr/", email: "contact@camping-lannhoedic.fr", phone: "+33297480173" },
  "camping-de-pont-augan": { website: "https://camping-pontaugan.fr/", email: "camping.pontaugan@gmail.com", phone: "+33743462435" },
  "camping-des-bains": { website: "https://www.campinglesbains.com/", email: "info@campingdesbains.com", phone: "+33636364273" },
  "camping-des-lacs": { website: "https://www.campingdeslacs.fr/", email: "info@campingdeslacs.fr", phone: "+33677417344" },
  "camping-la-communnion": { email: "lacommunion@orange.fr", phone: "+33652884252" },
  "camping-la-pindiere": { website: "https://www.camping-la-pindiere.com/", email: "contact@camping-la-pindiere.com", phone: "+33240576541" },
  "camping-la-plage": { website: "https://www.campinglaplage-gard.fr/", email: "info@campinglaplage-gard.com", phone: "+33685642517" },
  "camping-le-clos-de-la-lere": { website: "https://www.camping-leclosdelalere.com/", email: "le-clos-de-la-lere@wanadoo.fr", phone: "+33563312041" },
  "camping-le-coin-charmant": { website: "https://www.camping-lecoincharmant-ardeche.com/", email: "campinglecoincharmant@gmail.com", phone: "+33646414803" },
  "camping-le-moulin-du-bel-air": { website: "https://www.lot-camping.com/", email: "contact@lot-camping.com", phone: "+33565310071" },
  "camping-le-patis": { website: "https://sites.google.com/view/camping-lesaynans/accueil", email: "campinglesaynans@gmail.com", phone: "+33673919778" },
  "camping-le-verger": { website: "https://www.campingleverger17.com/", email: "contact@campingleverger17.com" },
  "camping-les-amarines": { website: "https://www.campinglesamarines.com/", email: "les.amarines@orange.fr", phone: "+33466822492" },
  "camping-les-drouihedes": { website: "https://www.campingcevennes.com/", email: "info@campingcevennes.com", phone: "+33466250480" },
  "camping-les-terrasses": { website: "https://www.camping-les-terrasses.com/", email: "campinglesterrasses34@gmail.com", phone: "+33467253506" },
  "camping-saint-lambert": { website: "https://www.camping-millau-riviere.fr/fr-fr/accueil", email: "contact@campingsaintlambert.fr", phone: "+33565600712" },
  "domaine-de-mepillat": { website: "https://www.camping-mepillat.fr/", email: "contact@camping-mepillat.fr", phone: "+33970770121" },
  "eco-camping-la-porte-dautan": { website: "https://www.laportedautan.fr/", email: "contact@laportedautan.fr", phone: "+33630766221" },
  "ferme-pedagogique-solidor": { website: "https://fermedesolidor.fr/", email: "contact@fermedesolidor.fr" },
  "mas-de-bouzou": { website: "https://www.masdebouzou.net/", email: "kompostelle@yahoo.com", phone: "+33666500628" },
};

export function getPlaceContact(placeId: string): PlaceContact {
  return CONTACTS[placeId] ?? {};
}
