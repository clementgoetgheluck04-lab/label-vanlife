export type RichPlaceDetails = {
  labelYear: number;
  displayAddress?: string;
  facebookUrl?: string;
  promoCode?: string;
  discountInstructions?: string[];
  venueQuote?: string;
  vanliferExperience?: string[];
  vanSpecifics?: string;
  opening?: string;
  openingMonths?: string[];
  dining?: string;
  activities?: string[];
  otherInfo?: string[];
  bookingMethods?: string[];
  reservationUrl?: string;
  tourismUrl?: string;
  regionLink?: { label: string; href: string };
};

// Contenu éditorial validé lieu par lieu par Label Vanlife.
// Cette source complète les informations techniques, contacts, médias et GPS
// sans les dupliquer dans le composant d'affichage.
const RICH_PLACE_DETAILS: Record<string, RichPlaceDetails> = {
  "camping-le-verger": {
    labelYear: 2026,
    displayAddress: "27 Rue Jean-Pierre Pigot - Bellecroix, 17139 Dompierre-sur-Mer",
    facebookUrl: "https://www.facebook.com/CampingLeVerger17",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Notre philosophie du camping : simplicité et authenticité. Vous n’êtes pas des clients dans un camping lambda. Vous êtes nos invités dans notre jardin.",
    vanliferExperience: [
      "Dompierre-sur-Mer offre le meilleur des deux mondes : à 10 minutes à vélo du cœur de La Rochelle — son Vieux-Port, ses tours médiévales, ses ruelles couvertes, son aquarium et ses bateaux-bus — tout en retrouvant un calme total une fois le portail du camping fermé.",
      "L’île de Ré est à environ 20 minutes, avec ses pistes cyclables entre marais salants et vignes, ses villages blancs aux volets pastel et ses plages préservées. L’île d’Oléron, ses forêts et ses plages, est également accessible. L’île d’Aix, interdite aux voitures, offre une parenthèse de calme absolu : trois îles à découvrir depuis un seul camping.",
      "Le Marais poitevin se trouve à environ 45 minutes : la « Venise verte » et ses barques glissant sous les frênes. Rochefort constitue aussi une belle escapade le long de l’estuaire.",
      "Le soir, le foodtruck change chaque jour et son menu est annoncé sur les réseaux sociaux du camping : une restauration souple, dans l’esprit de la vanlife.",
    ],
    vanSpecifics: "Proche de La Rochelle et de l’île de Ré · aire camping-car ouverte 24h/24 hors saison · ambiance de jardin familial.",
    opening: "Saison : du 1er juin au 29 août. Hors saison : aire de camping-cars ouverte 24h/24.",
    dining: "Un foodtruck différent est présent chaque soir. Le menu du jour est publié sur les réseaux sociaux du camping.",
    reservationUrl: "https://www.campingleverger17.com/tarifs-camping-la-rochelle.html,1,24,0,0,0?cle=tarifs&ids=1,24,0,0,0",
    tourismUrl: "https://www.campingleverger17.com/a-voira-visiter-la-rochelle.html,9,25,0,0,0?cle=a-voir-a-visiter&ids=9,25,0,0,0",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "eco-camping-la-porte-dautan": {
    labelYear: 2026,
    displayAddress: "1 rue Boris Vian, 11310 Saissac",
    promoCode: "labelvanlife",
    discountInstructions: [
      "Réservation en ligne : utilisez le code « labelvanlife » lors de votre réservation.",
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Ici, on accueille les vanlifers comme des amis : un emplacement au calme, un cadre nature préservé, des équipements soignés et une équipe à l’écoute. La Porte d’Autan, c’est votre base dans la Montagne Noire — à portée de Carcassonne, des gorges et du Canal du Midi. Bienvenue chez nous !",
    vanliferExperience: [
      "Imaginez : vous ouvrez les portes de votre van au réveil et, face à vous, la chaîne des Pyrénées s’étire jusqu’à l’horizon. À 30 minutes de Carcassonne et de ses ruelles médiévales, vous profitez de la carte postale historique le temps d’une après-midi, puis vous revenez dormir dans votre chez-vous, sur un terrain qui vous ressemble.",
      "La Montagne Noire est un terrain de jeu immense et encore préservé : le Canal du Midi débute ici, les gorges de l’Orbiel et le lac de la Galaube sont à portée de roue, et les crêtes offrent des balades sans foule. En juillet et août, lorsque le littoral catalan est très fréquenté, le calme reste ici particulièrement appréciable.",
      "L’accueil est à l’image du lieu : simple, chaleureux et sincère. Le soir, les conversations s’installent naturellement sous un ciel propice à l’observation des étoiles, avant de reprendre la route vers les vignes du Minervois.",
    ],
    vanSpecifics: "Emplacements spacieux adaptés aux vans et camping-cars · électricité disponible · réservation en ligne avec le code promotionnel labelvanlife.",
    opening: "Ouvert d’avril à octobre.",
    openingMonths: ["Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"],
    activities: ["Randonnée", "VTT", "Baignade au lac de la Galaube", "Canal du Midi", "Carcassonne (30 min)", "Gorges de l’Orbiel", "Lac de la Galaube", "Minervois"],
    otherInfo: ["Éco-camping engagé : gestion responsable des déchets, énergie solaire et produits locaux."],
    bookingMethods: ["En ligne", "Par email", "Par téléphone"],
    reservationUrl: "https://www.laportedautan.fr/",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
};

export function getRichPlaceDetails(placeId: string): RichPlaceDetails | undefined {
  return RICH_PLACE_DETAILS[placeId];
}
