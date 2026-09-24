export type LocalStory = {
  title: string;
  kind: "Histoire locale" | "Curiosité locale" | "Légende locale" | "Tradition locale";
  text: string;
  source: string;
  sourceLabel: string;
};

// Paraphrased editorial notes, checked against the linked sources on 2026-09-23.
// Legends and uncertain etymologies are deliberately not stated as historical facts.
export const MAG_LOCAL_STORIES: Record<string, LocalStory> = {
  "morbihan-rhuys-blavet": {
    title: "À Suscinio, deux histoires se croisent", kind: "Curiosité locale",
    text: "Le château ne parle pas seulement de la vie des ducs : son Logis Merveilleux met aussi en scène l’univers arthurien. Une façon de distinguer, pendant la visite, la vie médiévale documentée et les récits de légende. À raconter au retour au camping : une forteresse peut conserver de l’histoire et faire vivre l’imaginaire, sans confondre les deux.",
    source: "https://www.golfedumorbihan.bzh/fiche/domaine-de-suscinio/", sourceLabel: "Golfe du Morbihan Vannes Tourisme",
  },
  "finistere-pays-bigouden": {
    title: "Un nom venu d’un geste généreux", kind: "Histoire locale",
    text: "Pourquoi un phare breton porte-t-il le nom d’Eckmühl ? Sa construction a été rendue possible par la générosité de la marquise Adélaïde-Louise d’Eckmühl de Blocqueville, fille du maréchal Davout. Achevé en 1897, il a pris le relais d’un phare devenu insuffisant pour signaler cette pointe aux navires. Derrière la silhouette, il y a donc aussi une histoire de transmission.",
    source: "https://www.destination-paysbigouden.com/en/discover/the-sea/lighthouses/visit-the-eckmuhl-lighthouse/", sourceLabel: "Office de tourisme Destination Pays Bigouden",
  },
  "cotentin-val-de-saire": {
    title: "Le bateau qui sait aussi rouler", kind: "Curiosité locale",
    text: "Pour rejoindre Tatihou depuis Saint-Vaast-la-Hougue, le bateau amphibie peut naviguer ou avancer sur ses roues selon la marée. Ici, le paysage change jusqu’à la manière d’arriver sur l’île ! Ce petit détail donne envie d’observer la traversée autant que la destination. Consultez les modalités officielles : ce n’est pas une invitation à traverser seul à pied.",
    source: "https://tatihou.manche.fr/infos-pratiques/venir/", sourceLabel: "Département de la Manche — Tatihou",
  },
  "baie-de-somme": {
    title: "Une porte, plusieurs mémoires", kind: "Histoire locale",
    text: "À Saint-Valery, les tours Guillaume sont aussi connues sous les noms de Porte de Haut et de Porte Jeanne d’Arc. Ce dernier rappelle son passage en décembre 1430. Un même monument peut donc porter plusieurs noms et plusieurs époques : une bonne raison de lire les panneaux au lieu de ne retenir que la vue sur la baie.",
    source: "https://www.tourisme-baiedesomme.fr/patrimoine-culturel-baie-de-somme/tours-guillaume/", sourceLabel: "Office de tourisme de la baie de Somme",
  },
  "loire-saumur": {
    title: "Le château n’a pas toujours été un musée", kind: "Histoire locale",
    text: "Derrière sa silhouette de palais, Saumur garde un passé moins attendu : le château a servi de prison, notamment à des marins britanniques, puis de dépôt d’armes. La Ville l’a acheté en 1906 pour y installer son musée. Regarder le même bâtiment comme résidence, prison puis lieu de culture change la promenade autour de ses murs.",
    source: "https://www.chateau-saumur.fr/decouvrir/historique", sourceLabel: "Château de Saumur — historique officiel",
  },
  "charente-la-rochelle": {
    title: "Des bateaux gravés pour ne pas les oublier", kind: "Histoire locale",
    text: "La tour de la Lanterne conserve plus de 600 graffitis liés à son passé de prison. Des détenus y ont laissé des noms, des dates et des dessins de navires, parfois riches en détails sur les gréements. Ce sont des traces humaines à observer avec attention, jamais à imiter : le souvenir du voyage n’a pas besoin d’une nouvelle marque sur la pierre.",
    source: "https://www.tours-la-rochelle.fr/decouvrir/les-graffitis-de-la-tour-de-la-lanterne", sourceLabel: "Centre des monuments nationaux",
  },
  "perigord-vezere": {
    title: "Quatre jeunes et une découverte immense", kind: "Histoire locale",
    text: "Le 12 septembre 1940, Marcel Ravidat, Jacques Marsal, Georges Agniel et Simon Coencas découvrent les peintures de Lascaux. Ce ne sont pas les membres d’une grande expédition, mais quatre jeunes explorant les lieux. Aujourd’hui, la visite du fac-similé permet d’approcher cette découverte sans entrer dans la grotte originale : émerveillement et protection du patrimoine vont ensemble.",
    source: "https://lascaux.fr/fr/histoire-de-la-decouverte/", sourceLabel: "Lascaux — histoire de la découverte",
  },
  "lot-gourdon-cahors": {
    title: "Un petit diable sur le pont", kind: "Légende locale",
    text: "Le pont Valentré possède un détail que l’on peut facilement manquer : une figure de diable sur sa tour centrale. Elle rappelle la légende associée à sa construction. Le personnage appartient au récit local, pas à une explication historique du chantier. Un joli jeu d’observation depuis les accès ouverts, sans grimper ni quitter les cheminements autorisés.",
    source: "https://www.cahorsvalleedulot.com/patrimoine/le-pont-valentre-2/", sourceLabel: "Office de tourisme Cahors — Vallée du Lot",
  },
  "pays-basque-interieur": {
    title: "La maison de l’auteur de Cyrano", kind: "Histoire locale",
    text: "Arnaga est liée à Edmond Rostand, l’auteur de Cyrano de Bergerac. Après ce succès, il s’installe à Cambo-les-Bains pour des raisons de santé et y fait construire sa maison. La journée ne raconte donc pas seulement un beau jardin : elle ouvre une parenthèse littéraire. De quoi choisir une lecture pour la soirée au camping, plutôt qu’une visite de plus.",
    source: "https://www.arnaga.com/villa-musee-edmond-rostand", sourceLabel: "Villa Arnaga — Musée Edmond Rostand",
  },
  "montagne-noire-saissac": {
    title: "Le rêve d’un relieur devenu village du livre", kind: "Histoire locale",
    text: "L’identité de Montolieu comme village du livre doit beaucoup à Michel Braibant, relieur à Carcassonne, et à son projet de transmettre la mémoire des métiers du livre. Des libraires ont rejoint l’aventure. En poussant une porte, on rencontre ainsi autre chose qu’une boutique : un savoir-faire et un projet collectif qui ont transformé la vie du village.",
    source: "https://www.audetourisme.com/fr/experiences/montolieu-village-livre/", sourceLabel: "Aude Tourisme",
  },
  "aveyron-millau-tarn": {
    title: "Une église qui faisait aussi refuge", kind: "Histoire locale",
    text: "À Peyre, l’ancienne église Saint-Christophe s’appuie sur la roche : elle est semi-troglodytique. Pendant les guerres de Religion, elle a aussi reçu des aménagements défensifs et une salle destinée à abriter les habitants. Le village n’est donc pas seulement un point de vue sur le viaduc : sa falaise raconte sa propre manière d’habiter et de se protéger.",
    source: "https://www.explore-millau.com/les-incontournables/nos-jolis-villages-de-pierre/les-4-peyre-co/peyre-plus-beau-village-de-france/", sourceLabel: "Office de tourisme Explore Millau",
  },
  "ardeche-chauzon-vogue": {
    title: "À Balazuc, voyager bien avant le Moyen Âge", kind: "Curiosité locale",
    text: "On vient souvent pour les ruelles médiévales, mais Balazuc abrite aussi le Muséum de l’Ardèche. Ses collections remontent bien plus loin : elles retracent notamment des centaines de millions d’années de vie dans le territoire. Une autre échelle de temps pour regarder les roches autour du village, et une piste de visite à vérifier si vous aimez fossiles et paysages.",
    source: "https://www.ardeche-guide.com/decouvrir/top-10-des-experiences-incontournables/villages-caractere/balazuc/", sourceLabel: "Ardèche Guide — site officiel du tourisme",
  },
  "haute-provence-dauphin": {
    title: "Un jardin qui raconte les usages des plantes", kind: "Curiosité locale",
    text: "À Salagon, les jardins ne sont pas uniquement décoratifs : ils explorent les relations entre les habitants et les plantes, leurs usages et leurs savoir-faire. C’est le principe de l’ethnobotanique. La promenade invite à se demander d’où viennent les plantes de notre quotidien ; elle ne dispense ni de respecter les collections ni de s’abstenir de cueillir ou de goûter.",
    source: "https://www.haute-provence-tourisme.com/prestataire/jardins-du-prieure-de-salagon-5581678/", sourceLabel: "Haute Provence Tourisme",
  },
  "auvergne-aydat-volcans": {
    title: "Pourquoi Notre-Dame des Fers ?", kind: "Tradition locale",
    text: "Sur la façade sud de la basilique d’Orcival, chaînes et boulets rappellent la dévotion à Notre-Dame des Fers. La tradition religieuse associe ce nom à des récits de prisonniers délivrés par l’intercession de la Vierge. Ces récits sont présentés comme une croyance et une mémoire du lieu, pas comme des faits miraculeux établis. Un détail discret qui éclaire le monument.",
    source: "https://www.auvergnevolcansancy.com/site-culturel/basilique-notre-dame-dorcival/", sourceLabel: "Office de tourisme Auvergne VolcanSancy",
  },
  "alsace-villages-vignoble": {
    title: "Du couvent aux bains municipaux", kind: "Histoire locale",
    text: "À Colmar, le musée Unterlinden relie un ancien couvent du XIIIe siècle aux anciens bains municipaux, inaugurés en 1906. Le bâtiment fait donc lui-même partie de la découverte : avant d’abriter des œuvres, ses différents espaces ont accueilli des vies très différentes. Pendant la visite, prenez aussi le temps de regarder l’architecture entre deux salles.",
    source: "https://www.musee-unterlinden.com/musee/", sourceLabel: "Musée Unterlinden",
  },
  "jura-clairvaux-lacs": {
    title: "Le Hérisson ne serait pas un animal", kind: "Curiosité locale",
    text: "Selon Jura Tourisme, le nom des cascades du Hérisson viendrait de « Yrisson », associé à l’idée d’eau sacrée, plutôt que du petit animal à piquants. L’origine est formulée au conditionnel par la source : gardons cette nuance. Un nom familier peut ainsi cacher une autre histoire, à raconter pendant une pause sur le sentier.",
    source: "https://www.jura-tourism.com/vivre-le-jura/visiter/les-incontournables/cascades-du-herisson/", sourceLabel: "Jura Tourisme",
  },
  "annecy-rive-ouest": {
    title: "Un paysage déjà regardé par Cézanne", kind: "Histoire locale",
    text: "Le décor de Duingt a été peint par Cézanne. Au lieu de chercher seulement une nouvelle photographie, essayez de regarder les rapports entre lac, reliefs et château comme les éléments d’un tableau. Châteauvieux s’observe depuis les espaces publics : cette anecdote ne donne aucun droit d’entrer dans le domaine privé.",
    source: "https://www.lac-annecy.com/destination/villes-et-villages/duingt/", sourceLabel: "Office de tourisme du lac d’Annecy",
  },
  "corse-balagne": {
    title: "De l’art contemporain sous les remparts", kind: "Curiosité locale",
    text: "La citadelle de Calvi ne raconte pas uniquement le passé : sous son porche d’entrée, le MUDACC présente des œuvres du fonds d’art contemporain de la ville. Une surprise à chercher au milieu de la promenade patrimoniale. Vérifiez les conditions de visite avant de l’ajouter : l’idée est de découvrir un autre regard sur Calvi, sans transformer la journée en course.",
    source: "https://www.visit-corsica.com/en/Mon-sejour/Patrimoine-culturel/Tout-le-patrimoine-culturel/LA-CITADELLE-DE-CALVI", sourceLabel: "Agence du tourisme de la Corse",
  },
  "corse-porto-piana": {
    title: "Les rochers et la colère du diable", kind: "Légende locale",
    text: "Un récit relayé par l’office de tourisme attribue les formes tourmentées des calanques à un diable repoussé par une bergère. Furieux, il aurait malmené les rochers. C’est une légende, pas l’origine géologique du paysage. Elle donne simplement une autre manière de regarder les silhouettes depuis un arrêt autorisé, jamais en s’immobilisant dangereusement sur la route.",
    source: "https://www.ouestcorsica.com/a-voir-a-faire/culture-et-patrimoine/les-mythes-et-legendes/", sourceLabel: "Office de tourisme Ouest Corsica",
  },
  "corse-bonifacio-sud": {
    title: "Un escalier creusé en une nuit ?", kind: "Légende locale",
    text: "La légende de l’Escalier du Roy d’Aragon raconte que les soldats du roi auraient taillé les marches dans la falaise en une seule nuit, pendant le siège de 1420. L’office de tourisme présente bien cette histoire comme une légende. De quoi nourrir la découverte de Bonifacio, même si vous choisissez de ne pas descendre l’escalier.",
    source: "https://bonifacio.fr/decouvrir/bonifacio-ville-dart-et-dhistoire/lescalier-du-roy-daragon/", sourceLabel: "Office de tourisme de Bonifacio",
  },
};
