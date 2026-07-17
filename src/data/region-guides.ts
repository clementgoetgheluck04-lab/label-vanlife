export type RegionGuide = {
  slug: string;
  name: string;
  eyebrow: string;
  title: string;
  intro: string;
  tags: readonly string[];
  whyTitle: string;
  paragraphs: readonly string[];
  bestPeriod: string;
  highlights: readonly { label: string; value: string }[];
  itinerary?: readonly { days: string; place: string; text: string }[];
  partnerIds: readonly string[];
};

export const REGION_GUIDES = [
  {
    slug: "bretagne",
    name: "Bretagne",
    eyebrow: "Destination vanlife",
    title: "Vanlife en Bretagne — l’odyssée du bout du monde",
    intro: "Des côtes sauvages, des crêperies dans chaque village et des phares au bout des terres : la Bretagne en van offre l’une des aventures les plus dépaysantes de France.",
    tags: ["GR34 depuis de nombreuses étapes", "3 lieux labellisés", "Belle en toute saison"],
    whyTitle: "Pourquoi la Bretagne est une destination vanlife idéale",
    paragraphs: [
      "La Bretagne rassemble des routes côtières spectaculaires, une culture forte, une gastronomie accessible et une grande variété de paysages naturels. En quelques jours, le granit rose, les landes, les abers et les îles donnent l’impression de changer plusieurs fois de pays.",
      "La météo fait partie de l’expérience : une matinée brumeuse sur la côte de Granit Rose possède une atmosphère que le soleil du Midi ne reproduit pas. Un bon équipement de pluie permet de continuer à marcher et à explorer.",
      "Hors saison, la région retrouve un rythme plus calme. Les routes et les grands sites sont moins fréquentés, mais il faut vérifier les périodes d’ouverture des services et des hébergements.",
    ],
    bestPeriod: "Mai–juin et septembre pour davantage de calme",
    highlights: [{ label: "Ambiance", value: "Côtes, îles et villages" }, { label: "À pied", value: "Sentier côtier GR34" }, { label: "Rythme conseillé", value: "10 à 12 jours" }],
    itinerary: [
      { days: "J1–J3", place: "Saint-Malo et côte d’Émeraude", text: "Intra-muros, estuaire de la Rance, Dinard et Cap Fréhel. La Ferme Pédagogique Solidor offre une première étape identifiée à Saint-Malo." },
      { days: "J4–J5", place: "Cap Fréhel", text: "Falaises, phare et landes sauvages : plusieurs boucles permettent de découvrir cette portion remarquable du GR34." },
      { days: "J6–J7", place: "Perros-Guirec", text: "Côte de Granit Rose, sentier des douaniers et sorties vers l’archipel des Sept-Îles selon la saison." },
      { days: "J8–J9", place: "Crozon et Finistère", text: "Presqu’île de Crozon, pointes et plages exposées : prévoyez peu de kilomètres pour profiter des petites routes." },
      { days: "J10–J12", place: "Golfe du Morbihan", text: "Vannes, presqu’île de Rhuys et mégalithes de Carnac, avec une étape possible au Camping Lann Hoëdic." },
    ],
    partnerIds: ["ferme-pedagogique-solidor", "camping-de-pont-augan", "camping-de-lann-hoedic"],
  },
  {
    slug: "provence",
    name: "Provence",
    eyebrow: "Destination vanlife",
    title: "Vanlife en Provence — lavande, Verdon et Camargue",
    intro: "La lumière du matin, les reliefs du Verdon, les villages perchés et les étangs de Camargue composent un road trip français aux ambiances très différentes.",
    tags: ["Verdon et Luberon", "3 étapes du réseau à proximité", "Ailes de saison recommandées"],
    whyTitle: "Pourquoi la Provence est faite pour la vanlife",
    paragraphs: [
      "Du Verdon à la Camargue, des Alpilles au Luberon, chaque territoire possède son propre rythme. Le van permet d’alterner montagnes sèches, villages, rivières et littoral sans refaire ses valises.",
      "Mai, juin, septembre et octobre offrent généralement des températures plus agréables et une fréquentation plus modérée. En été, chaleur, risque d’incendie et restrictions d’accès demandent une préparation quotidienne.",
      "Les marchés, moulins à huile et producteurs locaux donnent tout son sens à un voyage lent. Vérifiez toujours les jours d’ouverture et réservez les étapes importantes en haute saison.",
    ],
    bestPeriod: "Mai–juin ou septembre–octobre",
    highlights: [{ label: "Paysages", value: "Gorges, lavande, étangs" }, { label: "Vigilance", value: "Chaleur et incendies en été" }, { label: "Rythme conseillé", value: "10 à 14 jours" }],
    itinerary: [
      { days: "J1–J3", place: "Camargue et Grau-du-Roi", text: "Plage de l’Espiguette, étangs et observation de la faune. Le Camping Bon Séjour constitue une étape du réseau à proximité." },
      { days: "J4–J5", place: "Nîmes et Pont du Gard", text: "Patrimoine romain, villages du Gard et découverte de la vallée de la Cèze." },
      { days: "J6–J8", place: "Gorges du Verdon", text: "Route panoramique, lac de Sainte-Croix et activités nautiques, avec réservation recommandée pendant les périodes fréquentées." },
      { days: "J9–J10", place: "Luberon et Dauphin", text: "Villages perchés, marchés et paysages de Haute-Provence. Le Camping Au Tylo Soleil permet de rayonner depuis Dauphin." },
      { days: "J11–J14", place: "Alpilles", text: "Saint-Rémy, Les Baux-de-Provence et petites routes entre oliveraies et reliefs calcaires." },
    ],
    partnerIds: ["camping-au-tylo-soleil", "camping-bon-sejour", "camping-la-plage"],
  },
  {
    slug: "ardeche",
    name: "Ardèche",
    eyebrow: "Destination vanlife",
    title: "Vanlife en Ardèche — gorges, rivières et garrigue",
    intro: "Canyons calcaires, rivières propices à la baignade et villages de caractère se concentrent sur un territoire idéal à parcourir lentement.",
    tags: ["Gorges et baignades", "1 lieu labellisé", "Printemps à automne"],
    whyTitle: "L’Ardèche en van : pourquoi c’est exceptionnel",
    paragraphs: [
      "Les gorges de l’Ardèche comptent parmi les grands paysages du sud de la France. Les belvédères, la rivière et les villages invitent à poser le van plusieurs jours plutôt qu’à multiplier les kilomètres.",
      "Partir tôt permet de profiter des sites avant l’arrivée des visiteurs à la journée. En fin de journée, la lumière sur les falaises révèle une tout autre ambiance.",
      "Les routes sinueuses, les marchés et les petits villages en font une destination slow travel. En été, anticipez la fréquentation, la chaleur et les règles d’accès aux espaces naturels.",
    ],
    bestPeriod: "Avril–juin et septembre–octobre",
    highlights: [{ label: "Activités", value: "Kayak, baignade, randonnée" }, { label: "Conduite", value: "Routes étroites et sinueuses" }, { label: "Rythme conseillé", value: "7 à 10 jours" }],
    itinerary: [
      { days: "J1–J2", place: "Entrée nord et vallée du Rhône", text: "Premiers marchés, villages et paysages de garrigue avant de rejoindre la vallée de l’Ardèche." },
      { days: "J3–J5", place: "Aubenas et Vogüé", text: "Village médiéval, baignades selon les conditions et découverte des producteurs locaux." },
      { days: "J6–J8", place: "Gorges de l’Ardèche", text: "Belvédères, kayak encadré et découverte de la grotte Chauvet 2. Réservez les activités et les nuits en saison." },
      { days: "J9–J10", place: "Vals-les-Bains et Antraigues", text: "Villages cévenols, terrasses et étape plus fraîche avant de reprendre la route." },
    ],
    partnerIds: ["camping-le-coin-charmant"],
  },
  {
    slug: "pyrenees",
    name: "Pyrénées",
    eyebrow: "Destination vanlife",
    title: "Vanlife dans les Pyrénées — cols mythiques et vallées sauvages",
    intro: "Des cols spectaculaires, des lacs d’altitude et des villages préservés : les Pyrénées offrent une aventure montagnarde à vivre sans précipitation.",
    tags: ["Cols et vallées", "2 étapes du réseau à proximité", "Été recommandé"],
    whyTitle: "Les Pyrénées en van : ce qu’il faut savoir",
    paragraphs: [
      "Moins urbanisées que d’autres massifs, les Pyrénées alternent routes de cols, vallées habitées et espaces de haute montagne. Les distances paraissent courtes sur la carte mais les temps de trajet sont souvent longs.",
      "Le Tourmalet, l’Aubisque ou l’Aspin demandent un véhicule entretenu et une conduite adaptée. Les dates d’ouverture changent avec l’enneigement et les travaux : vérifiez les informations routières officielles avant chaque passage.",
      "Pour les randonnées, préparez météo, eau, équipement et niveau de difficulté. La faune doit être observée à distance et les espaces protégés respectés.",
    ],
    bestPeriod: "Juin à septembre, selon l’ouverture des cols",
    highlights: [{ label: "Terrain", value: "Cols, vallées et haute montagne" }, { label: "Difficulté", value: "Pentes et virages serrés" }, { label: "Rythme conseillé", value: "10 à 14 jours" }],
    partnerIds: ["camping-la-communnion", "camping-le-clos-de-la-lere"],
  },
  {
    slug: "landes",
    name: "Landes",
    eyebrow: "Destination vanlife",
    title: "Vanlife dans les Landes — océan, pinèdes et surf",
    intro: "De longues plages atlantiques, une forêt parcourue de pistes cyclables et une culture du surf profondément installée : les Landes se prêtent naturellement au voyage en van.",
    tags: ["Océan Atlantique", "Vélo et surf", "Hors saison conseillé"],
    whyTitle: "Les Landes en van : l’essentiel",
    paragraphs: [
      "La côte landaise alterne plages océanes, grands lacs, pinèdes et bourgs animés. Hors saison, le rythme ralentit et les pistes cyclables deviennent un excellent moyen de laisser le van stationné.",
      "Hossegor, Capbreton et Seignosse vivent au rythme du surf. Les courants océaniques peuvent être puissants : baignez-vous dans les zones surveillées et consultez les conditions avant toute session.",
      "En haute saison, la réglementation du stationnement est renforcée sur de nombreux secteurs littoraux. Repérez une aire ou un camping autorisé avant d’arriver et ne comptez pas sur un stationnement improvisé près de la plage.",
    ],
    bestPeriod: "Mai–juin ou septembre–octobre",
    highlights: [{ label: "Activités", value: "Surf, vélo et grands lacs" }, { label: "Routes", value: "Relief généralement facile" }, { label: "Rythme conseillé", value: "7 à 8 jours" }],
    itinerary: [
      { days: "J1–J2", place: "Bassin d’Arcachon", text: "Ports ostréicoles, Dune du Pilat et premières pistes cyclables, avec réservation indispensable en période chargée." },
      { days: "J3–J4", place: "Biscarrosse et Mimizan", text: "Lacs, plages océanes et activités nautiques pour alterner eau douce et Atlantique." },
      { days: "J5–J6", place: "Hossegor et Capbreton", text: "Culture surf, marché et balades autour du lac marin." },
      { days: "J7–J8", place: "Bayonne et côte basque", text: "Transition vers un littoral plus escarpé, avec davantage de circulation et des règles de stationnement à anticiper." },
    ],
    partnerIds: [],
  },
  {
    slug: "alpes",
    name: "Alpes",
    eyebrow: "Destination vanlife",
    title: "Vanlife dans les Alpes — cols, lacs et panoramas vertigineux",
    intro: "Cols d’altitude, lacs aux eaux glaciaires et villages de montagne donnent au voyage en van une dimension spectaculaire — à condition de respecter la saison et le véhicule.",
    tags: ["Alpes du Nord et du Sud", "1 lieu labellisé", "Cols à vérifier"],
    whyTitle: "Les Alpes en van : deux territoires, deux ambiances",
    paragraphs: [
      "Dans les Alpes du Nord, Chamonix, Annecy et la Vanoise offrent des paysages puissants, mais aussi des routes fréquentées et parfois exigeantes pour les grands vans.",
      "Les Alpes du Sud alternent influences montagnardes et provençales. Les vallées basses peuvent se découvrir sur une saison plus longue, tandis que les cols restent soumis à la neige et aux fermetures hivernales.",
      "Avant chaque étape, contrôlez météo, état des routes, hauteur du véhicule et capacité de freinage. En montagne, quelques dizaines de kilomètres peuvent représenter plusieurs heures de conduite.",
    ],
    bestPeriod: "Juin à septembre pour les grands cols",
    highlights: [{ label: "Paysages", value: "Cols, lacs et vallées" }, { label: "Vigilance", value: "Météo et fermetures routières" }, { label: "Rythme conseillé", value: "10 jours ou davantage" }],
    itinerary: [
      { days: "J1–J2", place: "Verdon", text: "Belvédères, lac de Sainte-Croix et activités nautiques dans un secteur très fréquenté en été." },
      { days: "J3–J4", place: "Dauphin et montagne de Lure", text: "Villages de Haute-Provence et première base au Camping Au Tylo Soleil." },
      { days: "J5–J6", place: "Digne-les-Bains", text: "Patrimoine géologique, thermalisme et lignes ferroviaires historiques." },
      { days: "J7–J8", place: "Ubaye et Barcelonnette", text: "Vallée alpine, architecture singulière et départs de randonnées de niveaux variés." },
      { days: "J9–J10", place: "Embrun et Serre-Ponçon", text: "Lac, activités nautiques et panoramas montagneux pour terminer le parcours." },
    ],
    partnerIds: ["camping-au-tylo-soleil"],
  },
] as const satisfies readonly RegionGuide[];

export const REGION_GUIDE_SLUGS = REGION_GUIDES.map((guide) => guide.slug);

export function getRegionGuide(slug: string): RegionGuide | undefined {
  return REGION_GUIDES.find((guide) => guide.slug === slug);
}
