export type PlaceContact = {
  website?: string;
  email?: string;
  phone?: string;
  contactName?: string;
  kitEmailSubject?: string;
  kitEmailPreheader?: string;
  kitEmailTitle?: string;
  kitEmailParagraphs?: string[];
};

// Coordonnées publiques vérifiées dans les pages enregistrées fournies avec la V1.
// Les adresses Label Vanlife et les valeurs de démonstration ont été exclues.
const CONTACTS: Record<string, PlaceContact> = {
  "camping-au-tylo-soleil": { website: "https://autylosoleil.fr/", email: "contact@autylosoleil.fr" },
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
  "camping-le-verger": {
    website: "https://www.campingleverger17.com/",
    email: "contact@campingleverger17.com",
    contactName: "Élise",
  },
  "camping-les-amarines": { website: "https://www.campinglesamarines.com/", email: "les.amarines@orange.fr", phone: "+33466822492" },
  "camping-les-drouihedes": { website: "https://www.campingcevennes.com/", email: "info@campingcevennes.com", phone: "+33466250480" },
  "camping-les-terrasses": { website: "https://www.camping-les-terrasses.com/", email: "campinglesterrasses34@gmail.com", phone: "+33467253506" },
  "camping-saint-lambert": { website: "https://www.camping-millau-riviere.fr/fr-fr", email: "contact@campingsaintlambert.fr", phone: "+33565600048" },
  "domaine-de-mepillat": { website: "https://www.camping-mepillat.fr/", email: "contact@camping-mepillat.fr", phone: "+33970770121" },
  "eco-camping-la-porte-dautan": {
    website: "https://www.laportedautan.fr/",
    email: "contact@laportedautan.fr",
    phone: "+33630766221",
    contactName: "Jean-Louis",
    kitEmailSubject: "Jean-Louis, votre renouvellement 2027 et votre kit Label Vanlife",
    kitEmailPreheader: "Merci de poursuivre l’aventure avec nous : votre renouvellement et votre kit 2027 sont prêts.",
    kitEmailTitle: "Merci Jean-Louis, cap sur 2027",
    kitEmailParagraphs: [
      "Merci pour votre réponse, votre franchise et votre confiance renouvelée. Nous avons bien entendu votre retour : en 2026, Label Vanlife ne vous a apporté aucune visite identifiée sur votre site et aucune demande de réduction. Il est important pour nous de le reconnaître clairement afin de faire mieux.",
      "Nous sommes sincèrement désolés que la saison ait été aussi éprouvante. Entre la canicule, les incendies qui ont affecté l’image du département, la tempête de Castelnaudary et la tornade qui a frappé un village, vous avez subi une succession d’événements particulièrement difficile, même lorsque votre camping n’était pas directement touché.",
      "2026 était l’année de lancement de Label Vanlife. Nous voulons faire de 2027 une année de croissance, avec davantage de visibilité pour les lieux, un suivi plus attentif des retombées et une communication plus régulière auprès des voyageurs. Votre renouvellement est bien entendu offert pour toute la saison 2027.",
      "L’Éco-Camping La Porte d’Autan porte exactement le type d’accueil humain, engagé et proche de la nature que nous souhaitons mieux faire connaître. Nous vous souhaitons beaucoup de courage pour préparer la prochaine saison et espérons qu’elle vous apportera le nouvel élan que votre établissement mérite.",
    ],
  },
  "ferme-pedagogique-solidor": { website: "https://fermedesolidor.fr/", email: "contact@fermedesolidor.fr" },
  "mas-de-bouzou": { website: "https://www.masdebouzou.net/", email: "kompostelle@yahoo.com", phone: "+33666500628" },
};

export function getPlaceContact(placeId: string): PlaceContact {
  return CONTACTS[placeId] ?? {};
}

export function getLabelledPlaceByEmail(email: string): { placeId: string; contact: PlaceContact } | undefined {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  const entry = Object.entries(CONTACTS).find(([, contact]) => contact.email?.trim().toLowerCase() === normalized);
  return entry ? { placeId: entry[0], contact: entry[1] } : undefined;
}
