export type RichPlaceDetails = {
  labelYear: number;
  displayType?: string;
  displayAddress?: string;
  contactName?: string;
  facebookUrl?: string;
  promoCode?: string;
  discountInstructions?: string[];
  venueQuote?: string;
  vanliferExperience?: string[];
  vanSpecifics?: string;
  opening?: string;
  openingMonths?: string[];
  swimming?: string;
  dining?: string;
  activities?: string[];
  otherInfo?: string[];
  bookingMethods?: string[];
  reservationLabel?: string;
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
  "camping-le-clos-de-la-lere": {
    labelYear: 2026,
    displayAddress: "230 route de Septfonds, 82240 Cayriech",
    facebookUrl: "https://www.facebook.com/campingleclosdelalere/",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Le Clos de la Lère, c’est un camping familial au cœur du Quercy Blanc. On vous accueille dans un cadre verdoyant, avec piscine, snack, bar et boulangerie du 1er mars au 30 novembre — et une réduction de 20% pour tous les membres Label Vanlife. Bienvenue chez Cindy et l’équipe !",
    vanliferExperience: [
      "Le Quercy Blanc est une région de calcaire blond, de causses et de vallées encaissées qui n’a rien à envier au Lot voisin, avec l’avantage d’être encore peu fréquentée. Depuis Le Clos de la Lère, le terrain de jeu est immense et varié.",
      "Les gorges de l’Aveyron s’ouvrent à quelques kilomètres : Bruniquel et son château au-dessus du confluent, Saint-Antonin-Noble-Val et son marché du dimanche matin dans les ruelles médiévales, puis Penne et ses ruines sur leur piton rocheux. Une descente en canoë permet de découvrir ces paysages depuis l’eau.",
      "La grotte du Bosc, à environ 10 minutes, propose des visites à taille humaine au milieu de concrétions préservées. Montauban, à environ 30 minutes, mérite également une soirée pour son centre historique en brique toulousaine et sa cuisine du terroir.",
      "L’ouverture de mars à novembre permet de découvrir la région hors saison : cerisiers en fleurs au printemps, rivières encore fraîches et villages paisibles.",
    ],
    vanSpecifics: "Emplacements spacieux · électricité 10A · WiFi gratuit sur tout le camping · animaux acceptés · piscine de juin à septembre · réservation en ligne, par email, téléphone ou sur place.",
    opening: "Ouvert du 1er mars au 30 novembre. Accueil de 8h30 à 10h30 et de 15h30 à 19h.",
    openingMonths: ["Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov"],
    swimming: "Piscine ouverte de juin à septembre, de 10h à 21h, sous réserve des conditions climatiques.",
    dining: "Snack au camping de mai à octobre. Bar et boulangerie de mars à novembre. Restaurant Le Causse à Puylaroque, à environ 3 km.",
    activities: ["Canoë sur l’Aveyron", "Escalade", "Vélo", "Randonnée", "Château de Penne", "Château de Bruniquel", "Grotte du Bosc", "Gorges de l’Aveyron", "Villages médiévaux du Quercy"],
    otherInfo: ["Animaux acceptés · WiFi gratuit sur tout le camping · électricité 10 ampères · piscine de juin à septembre, de 10h à 21h."],
    bookingMethods: ["En ligne", "Par email", "Par téléphone", "Sur place"],
    reservationUrl: "https://www.camping-leclosdelalere.com/",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "camping-de-laix": {
    labelYear: 2026,
    displayAddress: "364 route du Camping, 42260 Pommiers-en-Forez",
    contactName: "Olivier Bakanyi — propriétaire / gérant",
    facebookUrl: "https://www.facebook.com/CampingDeLAix",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Chez nous, les vanlifers ne sont pas des clients comme les autres — ils font partie de l’ambiance. Amenez votre combi, installez-vous sous les arbres, profitez de la piscine et du Tiky Snack. Bienvenue à Pommiers !",
    vanliferExperience: [
      "Le Forez est l’un de ces territoires que les vanlifers traversent parfois sans s’y arrêter en filant vers Lyon ou les Alpes. Depuis le Camping de l’Aix, vous êtes pourtant entre plaine et montagne, dans un calme qui contraste avec l’agitation des régions voisines.",
      "Les Monts du Lyonnais sont à portée de route : forêts, villages de caractère et panoramas sur la plaine du Forez. Ambert et son musée de la fourme d’Ambert se trouvent à environ 45 minutes au sud, au cœur d’un territoire fromager emblématique de l’Auvergne.",
      "Thiers, capitale française de la coutellerie, mérite une demi-journée pour ses maisons à colombages au-dessus des gorges de la Durolle et ses ateliers encore actifs. Clermont-Ferrand et le Puy-de-Dôme sont également accessibles pour une journée dans le parc des volcans d’Auvergne.",
      "Au camping, la piscine de 240 m², le Tiky Snack — ou le food truck lorsqu’il prend le relais — et l’ambiance conviviale invitent à s’installer plutôt qu’à simplement passer.",
    ],
    vanSpecifics: "Grands emplacements de 120 m² · piscine de 240 m² avec plages · Tiky Snack et food truck · réservation par email, téléphone ou sur place.",
    opening: "Ouvert d’avril à septembre.",
    openingMonths: ["Avr", "Mai", "Juin", "Juil", "Août", "Sep"],
    swimming: "Espace de détente et de baignade de 240 m² avec plages. Accès sous la responsabilité des utilisateurs et présence d’un parent obligatoire pour les enfants. Caleçon ou slip de bain obligatoire, shorts non autorisés. Ouverture selon la saison et non garantie en septembre.",
    dining: "Tiky Snack sur place, avec priorité aux clients du camping. Un food truck prend le relais lorsque le snack est fermé.",
    activities: ["Randonnée dans les Monts du Lyonnais", "Monts du Lyonnais", "Thiers et les gorges de la Durolle", "Ambert et la fourme d’Ambert", "Clermont-Ferrand et le Puy-de-Dôme"],
    otherInfo: ["Emplacements de 120 m² · animaux non acceptés · piscine ouverte selon la saison · réservation par email, téléphone ou sur place."],
    bookingMethods: ["Par email", "Par téléphone", "Sur place"],
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "camping-les-drouihedes": {
    labelYear: 2026,
    displayAddress: "100 allée du Camping, 30160 Peyremale",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Aux Drouilhèdes, on accueille les vanlifers comme des amis de passage. Ici, le rythme est celui de la rivière — lent, naturel, sincère. La Cèze est devant vous, les Cévennes derrière, et on fait tout pour que votre séjour ressemble à exactement ce que vous en espériez. Bienvenue chez nous !",
    vanliferExperience: [
      "Peyremale est l’un de ces villages des Cévennes encore préservés. La Cèze y coule dans un fond de vallée encaissé, entre chênes verts et falaises calcaires, avec une eau claire et fraîche et des plages naturelles propices aux journées sans programme.",
      "Les Drouilhèdes sont à l’opposé du camping de masse. La démarche Refuge LPO se traduit concrètement par une gestion attentive de la végétation, des déchets et des produits utilisés. L’ambiance suit le même rythme : les échanges sont paisibles, les enfants jouent dans la rivière et les vans s’installent à l’ombre des arbres.",
      "Les gorges de l’Ardèche sont accessibles en environ 30 minutes pour découvrir le Pont d’Arc, le canoë et les paysages calcaires. Beaucoup de voyageurs choisissent toutefois de rester au camping : l’accès direct à la Cèze et sa plage privée suffisent à ralentir vraiment.",
    ],
    vanSpecifics: "Emplacements spacieux sur terrain plat et arboré · accès direct à la Cèze · plage privée · philosophie slow tourisme · labels environnementaux.",
    opening: "Ouvert d’avril à septembre.",
    openingMonths: ["Avr", "Mai", "Juin", "Juil", "Août", "Sep"],
    swimming: "Accès direct à la rivière La Cèze et à la plage privée du camping. Baignade en milieu naturel sous la responsabilité des utilisateurs.",
    activities: ["Baignade sur la plage privée de la Cèze", "Canoë-kayak sur la Cèze", "Randonnée dans les Cévennes", "Gorges de l’Ardèche et Pont d’Arc", "Vallon-Pont-d’Arc", "Alès", "Villages cévenols"],
    otherInfo: ["Camping éco-responsable labellisé Refuge LPO, Via Natura et Destination Excellence · philosophie slow tourisme · animaux acceptés."],
    bookingMethods: ["En ligne", "Par email", "Par téléphone"],
    reservationUrl: "https://www.campingcevennes.com/",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "ferme-pedagogique-solidor": {
    labelYear: 2026,
    displayType: "Site de visite",
    displayAddress: "La Ville Biard, 35400 Saint-Malo",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Bienvenue à la Ferme de Solidor ! Notre ferme pédagogique vous invite à vivre une expérience unique au cœur de Saint-Malo : rencontrer nos animaux, participer à leurs soins et redécouvrir les gestes simples de la vie à la ferme. Nous accueillons familles, enfants et groupes avec passion. Réservation obligatoire par email à contact@fermedesolidor.fr.",
    vanliferExperience: [
      "Saint-Malo est l’une des villes les plus chargées d’histoire de France : les corsaires, Jacques Cartier, Chateaubriand et les remparts racontent plusieurs siècles d’aventures. En haute saison, les ruelles intra-muros et les remparts peuvent cependant être très fréquentés.",
      "La Ferme Solidor offre une vraie respiration. Pendant environ deux heures, les enfants rencontrent les animaux et renouent avec des gestes essentiels, dans un cadre simple et sans artifice. L’équipe, notamment Mélanie, est reconnue pour sa patience et sa bienveillance avec les plus jeunes.",
      "Depuis Saint-Malo, le Cap Fréhel et ses falaises sont accessibles en environ 35 minutes. Le Mont-Saint-Michel se trouve à environ 45 minutes vers l’est et Cancale, capitale de l’huître plate, à environ 15 minutes.",
    ],
    vanSpecifics: "Lieu de visite à la journée : aucun hébergement van n’est proposé sur place. Parking voitures disponible à proximité. Réservation obligatoire au moins 24 heures à l’avance.",
    opening: "Activités proposées toute l’année, uniquement sur réservation et selon le calendrier du lieu.",
    openingMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    activities: [
      "Visite pédagogique d’1 h : rencontre avec les poules, lapins, chèvres, cochons et chevaux — 7,50 € par personne",
      "Stage Petit Fermier de 2 h : soins aux animaux et entretien de la ferme — 12,50 € par enfant et 7,50 € par adulte accompagnant",
      "Après-midi à la ferme de 2 h pendant les vacances scolaires, de 14 h 30 à 16 h 30 — 20 € par enfant",
      "Anniversaires à la ferme le samedi, de 14 h 30 à 17 h — parcours, activité, décor et collation à partir de 150 €",
      "Visites de groupes scolaires et d’EHPAD — sur devis",
      "Chasse aux œufs de Pâques et animations saisonnières",
    ],
    otherInfo: ["Réservation obligatoire par email au moins 24 heures avant la visite. Le lieu accueille les familles, les enfants et les groupes, mais ne propose pas de nuitée van."],
    bookingMethods: ["Par email, au moins 24 h à l’avance"],
    reservationLabel: "Réserver une visite",
    reservationUrl: "mailto:contact@fermedesolidor.fr?subject=Réservation%20Ferme%20pédagogique%20Solidor",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "camping-des-lacs": {
    labelYear: 2026,
    displayType: "Camping 4 étoiles",
    displayAddress: "1 plage de la Guerlie, 16150 Pressignac",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Bienvenue au Flower Camping des Lacs ! Nathalie et son équipe vous accueillent au bord du lac de Lavaud, dans un cadre naturel exceptionnel. Notre camping 4 étoiles vous propose une expérience alliant nature, détente et convivialité. Profitez de notre plage privée, de nos trois piscines et de la richesse du territoire charentais. Réservation en ligne sur campingdeslacs.fr — 10 % de réduction pour les membres Label Vanlife.",
    vanliferExperience: [
      "La Charente est une région que l’on traverse parfois sans s’y arrêter. Le lac de Lavaud invite pourtant à ralentir : calme, préservé et entouré de forêts. Le Camping des Lacs en tire le meilleur parti avec sa plage privée, ses activités nautiques et sa piscine couverte chauffée pour les soirées plus fraîches.",
      "Depuis Pressignac, Angoulême et son patrimoine consacré à la bande dessinée se trouvent à environ 50 minutes. Limoges est accessible dans un temps comparable vers le nord-est, tandis que les gorges de la Vienne et du Taurion offrent de belles possibilités de randonnée.",
      "Le camping constitue aussi une étape pratique sur la route du Pays basque ou de l’Atlantique, loin de la forte fréquentation du littoral en été.",
    ],
    vanSpecifics: "56 emplacements dédiés aux camping-cars et vans, grands et spacieux · accès direct à la plage privée du lac de Lavaud · nouveauté 2026 : certains emplacements disposent d’un sanitaire privatif.",
    opening: "Ouvert d’avril à octobre.",
    openingMonths: ["Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct"],
    swimming: "Trois bassins complémentaires : piscine couverte chauffée à 28 °C, piscine extérieure et pataugeoire pour les enfants. L’espace aquatique est accessible aux personnes à mobilité réduite. Plage privée au bord du lac avec baignade surveillée en juillet et août.",
    dining: "Bar près de la piscine avec animations en soirée. Épicerie, pain et viennoiseries disponibles chaque matin. Des restaurants servant notamment du bœuf limousin se trouvent à proximité.",
    activities: [
      "Baignade surveillée dans le lac en juillet et août",
      "Canoë, paddle et pédalos",
      "Pêche, avec permis en vente à la réception",
      "Pétanque",
      "Salle de jeux avec billard et jeux d’arcade",
      "Animations saisonnières pour les enfants",
      "Randonnées et pistes cyclables au départ du camping",
      "Barbecue collectif",
      "Salle de réception pour événements, mariages et séminaires",
    ],
    otherInfo: ["166 emplacements au total, dont 56 dédiés aux camping-cars et vans · camping certifié Qualidog · chiens et chats bienvenus · ambiance calme et familiale."],
    bookingMethods: ["En ligne sur campingdeslacs.fr"],
    reservationUrl: "https://www.campingdeslacs.fr/",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
  "camping-le-moulin-du-bel-air": {
    labelYear: 2026,
    displayType: "Camping 3 étoiles",
    displayAddress: "685 Route du Céou, Claux de Bouyssole, 46310 Saint-Germain-du-Bel-Air",
    discountInstructions: [
      "Par téléphone ou par email : mentionnez votre adhésion Label Vanlife.",
      "Sur place : présentez votre carte membre à l’accueil dès votre arrivée.",
    ],
    venueQuote: "Bienvenue au Moulin du Bel-Air ! Ouvert du 3 avril au 26 septembre 2026. Piscine du 15 mai au 15 septembre. Arrivée à partir de 14 h et départ avant 12 h, avec une grande souplesse. Bar-brasserie guinguette, piscine chauffée, électricité 10A ou 16A, eau, vidange des eaux noires et grises, Wi-Fi gratuit, pain frais dès 8 h 30 et produits locaux. Emplacements plats et herbeux d’au moins 120 m², avec options Grand Espace, sanitaire privatif ou Belle Vue. Les membres Label Vanlife bénéficient de 10 % de réduction.",
    vanliferExperience: [
      "Le Lot est l’une des destinations vanlife les plus cohérentes de France : les routes sont belles, les villages sont préservés et les sites remarquables se succèdent sur des distances raisonnables.",
      "Saint-Cirq-Lapopie, classé parmi les Plus Beaux Villages de France, se trouve à environ 30 minutes. Cahors et son pont Valentré sont accessibles en environ 35 minutes, Rocamadour en 45 minutes et Sarlat en moins d’une heure.",
      "Le Moulin du Bel-Air permet ainsi de rayonner dans toute la région sans chercher un nouveau point de chute chaque soir. Le camping est lui-même à l’origine du rassemblement VANLOT : ici, la vanlife fait pleinement partie de l’identité du lieu.",
    ],
    vanSpecifics: "Emplacements plats et herbeux d’au moins 120 m², conçus pour les vans et camping-cars · options Grand Espace de plus de 150 m², sanitaire privatif ou Belle Vue sur la vallée · vidange des eaux noires et grises · électricité 10A ou 16A incluse.",
    opening: "Ouvert du 3 avril au 26 septembre 2026. Arrivée à partir de 14 h et départ avant 12 h, avec une grande souplesse annoncée par le camping.",
    openingMonths: ["Avr", "Mai", "Juin", "Juil", "Août", "Sep"],
    swimming: "Grande piscine extérieure chauffée, avec transats et parasols, ouverte du 15 mai au 15 septembre.",
    dining: "Bar-brasserie guinguette proposant des spécialités régionales du Lot. Pain frais disponible chaque matin dès 8 h 30 et vente de produits locaux à la réception.",
    activities: [
      "Rassemblement vanlife VANLOT, événement annuel créé par le camping",
      "Randonnée et vélo au départ du camping dans les vallées du Céou et du Lot",
      "Petits animaux de la ferme sur place : poules et chèvres",
      "Animations en soirée à la guinguette",
      "Saint-Cirq-Lapopie",
      "Cahors et le pont Valentré",
      "Rocamadour",
      "Sarlat et la vallée de la Dordogne",
    ],
    otherInfo: ["Camping labellisé Tourisme Zéro Déchet depuis 2019 · Wi-Fi gratuit · animaux acceptés · eau et vidange sur place · produits locaux disponibles à la réception."],
    bookingMethods: ["En ligne sur lot-camping.com", "Par email", "Par téléphone"],
    reservationUrl: "https://www.lot-camping.com/",
    regionLink: { label: "Découvrir les autres lieux vanlife de la région", href: "/explorer" },
  },
};

export function getRichPlaceDetails(placeId: string): RichPlaceDetails | undefined {
  return RICH_PLACE_DETAILS[placeId];
}
