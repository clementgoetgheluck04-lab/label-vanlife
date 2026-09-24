export type MagRoute = {
  slug: string; title: string; area: string; duration: string; season: string;
  image: string; excerpt: string; caution: string;
  steps: readonly [string, string][];
  stay: { id?: string; name: string; town: string; source?: string; reason: string };
};

// Sélections éditoriales, pas des voyages vendus ni des tracés GPS validés.
// Les sources externes ont été consultées le 23 septembre 2026.
export const MAG_ROUTES: MagRoute[] = [
  {
    slug: "morbihan-rhuys-blavet", title: "Morbihan : du golfe au Blavet", area: "Ouest", duration: "5 jours", season: "Mai à septembre",
    image: "morbihan-rhuys-blavet", excerpt: "Sarzeau, Vannes et le Blavet : deux ambiances bretonnes, sans courir tout le littoral.",
    steps: [["J1–J2 · Sarzeau", "Installez-vous sur la presqu’île de Rhuys. Alternez une découverte du bourg et une promenade côtière choisie selon la météo. Gardez une demi-journée libre pour un marché ou une rencontre plutôt que de remplir chaque heure."], ["J3 · Vannes", "Consacrez une journée à Vannes et à ses ruelles. Repérez un stationnement adapté avant d’arriver et poursuivez à pied ; l’itinéraire propose une visite, pas une nuit sur un parking urbain."], ["J4–J5 · Baud et le Blavet", "Rejoignez la vallée du Blavet pour changer de rythme : chemin de halage, villages et pause au bord de l’eau. Ce changement de secteur peut justifier une seconde base ; vérifiez son ouverture avant de quitter Rhuys."]],
    caution: "Consultez les marées et les conditions d’accès aux sentiers. Le parcours n’inclut aucune traversée maritime.",
    stay: { id: "camping-de-lann-hoedic", name: "Camping de Lann Hoëdic", town: "Sarzeau", reason: "Une base du réseau pour la première partie, sur la presqu’île de Rhuys." },
  },
  {
    slug: "finistere-pays-bigouden", title: "Finistère : le pays bigouden au rythme de l’océan", area: "Ouest", duration: "4 jours", season: "Mai à septembre",
    image: "finistere-pays-bigouden", excerpt: "Plomeur, Penmarc’h et Pont-l’Abbé : ports, lumière et pauses à terre.",
    steps: [["J1 · Plomeur", "Prenez le temps d’arriver et de demander les accès adaptés à votre véhicule. Une promenade près du littoral permet de découvrir l’ambiance du pays bigouden sans multiplier les kilomètres le premier jour."], ["J2–J3 · Penmarc’h", "Partez découvrir les ports et les paysages de Penmarc’h. Choisissez une sortie courte si le vent se lève, gardez vos distances avec les vagues et revenez dormir dans votre lieu d’accueil réservé."], ["J4 · Pont-l’Abbé", "Terminez par une journée à Pont-l’Abbé : balade dans le centre, commerces et artisanat selon les ouvertures. C’est une dernière étape à savourer, pas un détour ajouté à une longue journée de route."]],
    caution: "La mer et le vent commandent le programme. Une plage de surf n’est pas une baignade surveillée ni un emplacement de nuit.",
    stay: { id: "camping-de-la-torche", name: "Camping de la Torche", town: "Plomeur", reason: "Une base du réseau pour découvrir le pays bigouden." },
  },
  {
    slug: "cotentin-val-de-saire", title: "Cotentin : ports et jardins du Val de Saire", area: "Nord", duration: "4 jours", season: "Mai à septembre",
    image: "cotentin-val-de-saire", excerpt: "Cherbourg, Barfleur et Saint-Vaast-la-Hougue : une boucle maritime à petit rythme.",
    steps: [["J1 · Cherbourg", "Commencez par Cherbourg, son front de mer et une visite culturelle selon vos envies. Prévoyez le stationnement en amont et gardez l’installation au camping pour une heure compatible avec l’accueil."], ["J2 · Barfleur", "Rejoignez Barfleur pour une découverte du port à pied. Prenez le temps d’observer l’activité du village, de faire une pause et de choisir une courte promenade plutôt qu’une tournée de toutes les pointes."], ["J3–J4 · Saint-Vaast-la-Hougue", "Poursuivez vers Saint-Vaast-la-Hougue et ses paysages côtiers. Une activité maritime éventuelle se réserve séparément et dépend des conditions ; une journée à terre reste une belle option."]],
    caution: "Ne vous engagez pas sur l’estran sans informations locales sur les marées et les accès.",
    stay: { name: "L’Anse du Brick", town: "Maupertus-sur-Mer", source: "https://www.sandaya.fr/nos-campings/l-anse-du-brick", reason: "Suggestion pour sa situation dans le secteur de Cherbourg et du Val de Saire ; emplacements annoncés par l’exploitant." },
  },
  {
    slug: "baie-de-somme", title: "Baie de Somme : regarder plutôt que collectionner", area: "Nord", duration: "3 jours", season: "Avril à octobre",
    image: "baie-de-somme", excerpt: "Saint-Valery, Le Crotoy et Cayeux : un carnet pour apprécier la baie sans déranger ses habitants.",
    steps: [["J1 · Saint-Valery-sur-Somme", "Découvrez les quais puis le centre à pied, après installation. Pour une première soirée, gardez du temps pour observer la lumière et choisir votre programme du lendemain en fonction de la météo."], ["J2 · Le Crotoy", "Rejoignez Le Crotoy pour voir la baie depuis une autre rive. Une promenade accessible et un repas local suffisent à construire une vraie journée ; les sorties dans la baie demandent un encadrement adapté."], ["J3 · Cayeux-sur-Mer", "Terminez sur le front de mer de Cayeux. Observez les oiseaux à distance et restez sur les accès aménagés, sans chercher à approcher les animaux pour obtenir une photographie."]],
    caution: "Marées et chenaux rendent les traversées dangereuses : choisissez un guide pour sortir des promenades balisées.",
    stay: { name: "Camping Le Walric", town: "Saint-Valery-sur-Somme", source: "https://www.campinglewalric.com/", reason: "Suggestion à Saint-Valery, avec emplacements pour tentes, caravanes et camping-cars annoncés sur son site." },
  },
  {
    slug: "loire-saumur", title: "Loire : Saumur et les villages de tuffeau", area: "Ouest", duration: "4 jours", season: "Mai à octobre",
    image: "loire-saumur", excerpt: "Saumur, Montsoreau et Candes-Saint-Martin, avec du temps pour descendre du véhicule.",
    steps: [["J1 · Saumur", "Installez-vous autour de Saumur puis découvrez la ville à pied. Choisissez une seule visite patrimoniale pour garder une arrivée souple, particulièrement si vous avez déjà roulé dans la journée."], ["J2–J3 · Montsoreau", "Partez vers Montsoreau et ses rues de pierre claire. Pour une sortie à vélo, vérifiez le tracé, la longueur et les équipements avec un interlocuteur local : le carnet ne décrit pas une piste continue garantie."], ["J4 · Candes-Saint-Martin", "Accordez la dernière journée à Candes-Saint-Martin et au paysage du confluent. Stationnez hors des ruelles étroites ; un détour chez un artisan ou un producteur peut compléter la balade."]],
    caution: "Les berges ne sont pas des aires de nuit. Les conditions de circulation à vélo se vérifient localement.",
    stay: { name: "Camping de l’Île d’Offard", town: "Saumur", source: "https://www.saumur-camping.com/location-emplacement-saumur/", reason: "Suggestion de base à Saumur ; l’exploitant propose des emplacements de camping." },
  },
  {
    slug: "charente-la-rochelle", title: "Charente-Maritime : La Rochelle et son arrière-pays", area: "Ouest", duration: "3 jours", season: "Avril à octobre",
    image: "charente-la-rochelle", excerpt: "Une étape autour de Dompierre-sur-Mer pour alterner ville portuaire et chemins plus tranquilles.",
    steps: [["J1 · Dompierre-sur-Mer", "Posez les bagages dans l’arrière-pays rochelais. Demandez à votre hôte une promenade et les commerces du secteur ; cette première journée peut rester très simple après la route."], ["J2 · La Rochelle", "Prévoyez une journée à La Rochelle, en anticipant l’accès et le stationnement ou une alternative de transport. Le vieux port et une visite au choix valent mieux qu’un programme rempli jusqu’au soir."], ["J3 · Marans", "Remontez vers Marans pour une ambiance de canaux et de petite ville. Vérifiez les activités ouvertes et gardez une pause au bord de l’eau avant le retour, sans confondre halte de jour et nuit autorisée."]],
    caution: "Une excursion sur l’île de Ré est un supplément de parcours, avec accès et stationnement à préparer séparément.",
    stay: { id: "camping-le-verger", name: "Camping Le Verger", town: "Dompierre-sur-Mer", reason: "Une adresse du réseau pour rayonner dans le secteur rochelais." },
  },
  {
    slug: "perigord-vezere", title: "Périgord : suivre la Vézère", area: "Sud-Ouest", duration: "5 jours", season: "Mai à septembre",
    image: "perigord-vezere", excerpt: "Montignac, Saint-Léon-sur-Vézère et Les Eyzies : trois étapes plutôt qu’une liste interminable.",
    steps: [["J1–J2 · Montignac", "Consacrez le début du séjour à Montignac et à une visite culturelle réservée selon vos envies. Gardez un créneau libre entre deux découvertes : les lieux préhistoriques ne se visitent pas tous sans réservation."], ["J3 · Saint-Léon-sur-Vézère", "Faites une pause dans le village puis découvrez les alentours à pied. Une activité sur l’eau doit être choisie avec un professionnel selon le niveau, la météo et les conditions de la rivière."], ["J4–J5 · Les Eyzies", "Poursuivez vers Les Eyzies pour approfondir un thème plutôt que d’enchaîner les sites. Alternez une visite et une promenade courte ; choisissez les accès adaptés au véhicule et aux marcheurs du groupe."]],
    caution: "Réservez les visites sensibles à l’affluence et vérifiez les conditions des activités nautiques.",
    stay: { name: "Camping Le Paradis", town: "Saint-Léon-sur-Vézère", source: "https://le-paradis.fr/", reason: "Suggestion de base dans la vallée de la Vézère, dont la localisation est confirmée par l’exploitant." },
  },
  {
    slug: "lot-gourdon-cahors", title: "Lot : de Gourdon à Cahors, par les petites pauses", area: "Sud-Ouest", duration: "4 jours", season: "Mai à octobre",
    image: "lot-gourdon-cahors", excerpt: "Gourdon, Saint-Germain-du-Bel-Air et Cahors : villages, marché et vallée du Lot.",
    steps: [["J1 · Gourdon", "Commencez par le centre de Gourdon et ses points de vue accessibles selon votre mobilité. Prévoyez un stationnement adapté au gabarit, puis faites les derniers mètres à pied plutôt que de chercher une place dans les ruelles."], ["J2 · Saint-Germain-du-Bel-Air", "Gardez une journée de campagne autour de votre hébergement. Demandez les chemins praticables et les producteurs ouverts : une bonne rencontre ne nécessite pas forcément une grande excursion."], ["J3–J4 · Cahors", "Rejoignez Cahors pour une découverte du patrimoine et des bords du Lot. Prévoyez votre nuit si vous changez de base, et laissez une marge de temps pour le marché ou une visite choisie."]],
    caution: "Les petites routes peuvent ralentir les trajets. Pas de kilométrage ni de temps de conduite garanti.",
    stay: { id: "camping-le-moulin-du-bel-air", name: "Camping Le Moulin du Bel-Air", town: "Saint-Germain-du-Bel-Air", reason: "Une étape du réseau entre campagne lotoise et visites de villages." },
  },
  {
    slug: "pays-basque-interieur", title: "Pays basque : Espelette, Itxassou et Cambo", area: "Sud-Ouest", duration: "4 jours", season: "Mai à octobre",
    image: "pays-basque-interieur", excerpt: "Une boucle de villages pour rencontrer le Pays basque intérieur, sans chercher à franchir tous les cols.",
    steps: [["J1 · Itxassou", "Installez-vous près d’Itxassou et découvrez le village. Demandez un parcours pédestre adapté à votre groupe : un environnement de montagne ne signifie pas que tous les chemins conviennent à tous."], ["J2 · Espelette", "Consacrez du temps à Espelette, à ses commerces et aux producteurs qui accueillent les visiteurs. Vérifiez les horaires avant de vous déplacer et prévoyez de stationner à l’extérieur du centre."], ["J3–J4 · Cambo-les-Bains", "Terminez par Cambo-les-Bains et une visite choisie selon les ouvertures. Une demi-journée sans programme laisse la place à la météo et aux conseils recueillis sur place."]],
    caution: "Évitez les petites routes de montagne non adaptées au véhicule ; demandez conseil avant tout détour vers les reliefs.",
    stay: { name: "Camping Hiriberria", town: "Itxassou", source: "https://www.hiriberria.com/", reason: "Suggestion située à Itxassou, pour rayonner vers Espelette et Cambo sans changer de base chaque nuit." },
  },
  {
    slug: "montagne-noire-saissac", title: "Montagne Noire : Saissac et ses horizons", area: "Sud-Ouest", duration: "3 jours", season: "Mai à septembre",
    image: "montagne-noire-saissac", excerpt: "Saissac, Montolieu et le bassin de Saint-Ferréol : patrimoine et respiration.",
    steps: [["J1 · Saissac", "Découvrez Saissac et son patrimoine, puis prenez le temps d’arriver au camping. Demandez les possibilités de promenade et adaptez le programme à la chaleur, au vent et aux capacités de chacun."], ["J2 · Montolieu", "Partez vers Montolieu pour une journée autour des livres et des ruelles. Les boutiques et ateliers ont leurs propres horaires : mieux vaut choisir quelques adresses ouvertes qu’un parcours trop serré."], ["J3 · Saint-Ferréol", "Rejoignez le secteur de Saint-Ferréol pour une découverte du paysage et une promenade selon les accès autorisés. Ne présumez ni de la baignade ni de l’ouverture des équipements hors saison."]],
    caution: "Vérifiez la météo et l’accès aux massifs le jour du départ ; modifiez le programme en cas de restrictions.",
    stay: { id: "eco-camping-la-porte-dautan", name: "Éco-Camping La Porte d’Autan", town: "Saissac", reason: "Une base du réseau à Saissac pour ce carnet de Montagne Noire." },
  },
  {
    slug: "aveyron-millau-tarn", title: "Aveyron : Millau et l’entrée des gorges du Tarn", area: "Sud-Ouest", duration: "4 jours", season: "Mai à septembre",
    image: "aveyron-millau-tarn", excerpt: "Millau, Peyre et Le Rozier : une escapade entre villages et reliefs.",
    steps: [["J1 · Millau", "Commencez par Millau pour vous installer et préparer les excursions. Une découverte à pied du centre laisse du temps pour demander les conditions routières et choisir les visites du séjour."], ["J2 · Peyre", "Découvrez Peyre en laissant le véhicule sur un stationnement autorisé et adapté. Le village se savoure à pied : n’engagez pas votre fourgon dans une ruelle sans connaître l’accès et les possibilités de demi-tour."], ["J3–J4 · Le Rozier", "Rejoignez Le Rozier, à l’entrée des gorges, puis choisissez une promenade ou une activité encadrée. Il n’est pas nécessaire de parcourir toutes les gorges pour apprécier le paysage ; gardez une journée souple."]],
    caution: "Vérifiez les limitations de gabarit et les conditions de rivière ; cet itinéraire n’est pas un guidage poids lourd.",
    stay: { id: "camping-saint-lambert", name: "Camping Saint Lambert", town: "Millau", reason: "Une base du réseau à Millau, avant les excursions vers les villages et les gorges." },
  },
  {
    slug: "ardeche-chauzon-vogue", title: "Ardèche : Chauzon, Balazuc et Vogüé", area: "Sud-Est", duration: "4 jours", season: "Mai, juin et septembre",
    image: "ardeche-chauzon-vogue", excerpt: "Trois villages, une base et du temps pour apprécier la vallée de l’Ardèche.",
    steps: [["J1 · Chauzon", "Arrivez à Chauzon et posez le véhicule dans votre lieu d’accueil. Demandez les promenades conseillées et les conditions du moment ; une première soirée tranquille vaut mieux qu’une arrivée tardive après trop de détours."], ["J2 · Balazuc", "Prévoyez une découverte de Balazuc à pied, en anticipant le stationnement et la chaleur. Les rues peuvent être pentues : choisissez votre visite selon la mobilité des voyageurs et gardez de l’eau avec vous."], ["J3–J4 · Vogüé", "Rejoignez Vogüé puis consacrez une journée à une activité choisie avec un professionnel ou à une promenade courte. Gardez les baignades éventuelles dépendantes des conditions locales, jamais comme une promesse du programme."]],
    caution: "Crues, chaleur et accès aux rivières peuvent modifier le séjour ; demandez toujours les consignes locales.",
    stay: { id: "camping-le-coin-charmant", name: "Camping Le Coin Charmant", town: "Chauzon", reason: "Une base du réseau au cœur du secteur proposé." },
  },
  {
    slug: "haute-provence-dauphin", title: "Haute-Provence : Dauphin, Forcalquier et Mane", area: "Sud-Est", duration: "3 jours", season: "Mai, juin et septembre",
    image: "haute-provence-dauphin", excerpt: "Marchés et villages de Haute-Provence, à découvrir sans agenda surchargé.",
    steps: [["J1 · Dauphin", "Installez-vous près de Dauphin et découvrez le village au moment le plus agréable de la journée. Demandez conseil pour une courte promenade et prévoyez du temps au camping, pas seulement entre deux visites."], ["J2 · Forcalquier", "Choisissez Forcalquier pour une journée de patrimoine et de commerces. Si le marché fait partie de vos envies, confirmez son jour et les possibilités de stationnement avant d’organiser le reste du séjour."], ["J3 · Mane", "Terminez par Mane et une visite culturelle ou artisanale selon les ouvertures. Une pause à l’ombre et un déjeuner local complètent le carnet sans ajouter de longs trajets dans la chaleur."]],
    caution: "Consultez les restrictions d’accès aux massifs et évitez les promenades aux heures chaudes.",
    stay: { id: "camping-au-tylo-soleil", name: "Au Tylo Soleil Camping", town: "Dauphin", reason: "Une adresse du réseau à Dauphin, proche du cœur de cet itinéraire." },
  },
  {
    slug: "auvergne-aydat-volcans", title: "Auvergne : Aydat, Orcival et les paysages volcaniques", area: "Centre", duration: "4 jours", season: "Juin à septembre",
    image: "auvergne-aydat-volcans", excerpt: "Un lac, des villages et des reliefs : l’Auvergne en prenant le temps de choisir ses sorties.",
    steps: [["J1 · Aydat", "Posez le véhicule autour d’Aydat et découvrez les accès aménagés du lac. Une promenade courte permet de commencer doucement ; renseignez-vous sur les activités et les zones autorisées à vos dates."], ["J2 · Orcival", "Rejoignez Orcival pour une journée de village et de patrimoine. Gardez une marge pour les petites routes et choisissez une randonnée seulement après vérification de la météo et du niveau nécessaire."], ["J3–J4 · Paysages des puys", "Réservez une journée aux paysages volcaniques, avec un départ de promenade officiel et un retour à la même base si possible. En cas de mauvais temps, privilégiez une découverte culturelle plutôt qu’un sommet dans le brouillard."]],
    caution: "Accès aux reliefs, vent et météo se vérifient au quotidien. Aucun accès motorisé aux sommets n’est suggéré.",
    stay: { name: "Camping du Lac d’Aydat", town: "Aydat", source: "https://www.camping-lac-aydat.com/", reason: "Suggestion de base près du lac, dans le secteur des volcans d’Auvergne." },
  },
  {
    slug: "alsace-villages-vignoble", title: "Alsace : Riquewihr, Ribeauvillé et Colmar", area: "Est", duration: "4 jours", season: "Mai à octobre",
    image: "alsace-villages-vignoble", excerpt: "Une base dans le vignoble pour explorer trois étapes alsaciennes à pied.",
    steps: [["J1 · Riquewihr", "Découvrez Riquewihr après vous être installés dans le secteur. Les villages anciens se visitent mieux à pied : préparez le stationnement et ne cherchez pas à traverser les centres avec un véhicule encombrant."], ["J2 · Ribeauvillé", "Consacrez une journée à Ribeauvillé et aux paysages qui l’entourent. Les chemins du vignoble sont aussi des espaces de travail : respectez les consignes et demandez avant d’entrer sur une propriété."], ["J3–J4 · Colmar", "Gardez une journée entière pour Colmar, avec une visite au choix plutôt qu’une course aux photographies. Une journée supplémentaire permet de revenir dans un village apprécié ou de rencontrer un artisan."]],
    caution: "Anticipez l’affluence et les accès urbains. Toute dégustation impose de prévoir un conducteur sobre ou un autre transport.",
    stay: { name: "Camping de Riquewihr", town: "Riquewihr", source: "https://campingriquewihr.com/", reason: "Suggestion dans le vignoble, entre les étapes de Riquewihr, Ribeauvillé et Colmar." },
  },
  {
    slug: "jura-clairvaux-lacs", title: "Jura : Clairvaux et les paysages de lacs", area: "Est", duration: "4 jours", season: "Juin à septembre",
    image: "jura-clairvaux-lacs", excerpt: "Clairvaux-les-Lacs, les cascades du Hérisson et les belvédères : un séjour à adapter à la météo.",
    steps: [["J1 · Clairvaux-les-Lacs", "Installez-vous dans le secteur de Clairvaux et repérez les promenades accessibles depuis le village. Demandez les consignes locales autour du lac plutôt que de supposer que toutes les rives sont ouvertes."], ["J2 · Secteur du Hérisson", "Prévoyez une excursion vers les cascades seulement si les sentiers et les conditions le permettent. Chaussures adaptées, marge de temps et choix d’un parcours à votre niveau comptent davantage que le nombre de cascades vues."], ["J3–J4 · Villages et belvédères", "Gardez deux journées souples pour les villages et un point de vue choisi avec l’office de tourisme. Évitez d’enchaîner les routes étroites ; une promenade proche de la base peut remplacer une excursion lointaine."]],
    caution: "Sentiers glissants et restrictions autour des lacs : consultez les informations locales avant chaque sortie.",
    stay: { name: "Camping Les Tilleuls", town: "Clairvaux-les-Lacs", source: "https://www.camping-jura-lacs.com/", reason: "Suggestion de base à Clairvaux pour découvrir la région des lacs." },
  },
  {
    slug: "annecy-rive-ouest", title: "Lac d’Annecy : une base, trois journées dehors", area: "Sud-Est", duration: "3 jours", season: "Mai à septembre",
    image: "annecy-rive-ouest", excerpt: "Saint-Jorioz, Duingt et Annecy : profiter du lac sans déplacer la maison chaque matin.",
    steps: [["J1 · Saint-Jorioz", "Posez le véhicule à Saint-Jorioz et prenez vos repères. Demandez les itinéraires accessibles à pied ou à vélo, ainsi que les conditions de circulation, pour choisir une première sortie à votre mesure."], ["J2 · Duingt", "Prévoyez une découverte de Duingt en adaptant le mode de déplacement aux voyageurs. Une balade courte, un village et une pause composent une journée complète sans avoir besoin de faire le tour du lac."], ["J3 · Annecy", "Terminez par Annecy en anticipant le transport et l’affluence. Gardez le temps de flâner et une solution de retour simple ; le programme ne suppose pas un stationnement disponible dans le centre."]],
    caution: "Réservez l’hébergement en période fréquentée et vérifiez les transports plutôt que de compter sur une place au bord du lac.",
    stay: { name: "Camping Le Solitaire du Lac", town: "Saint-Jorioz", source: "https://www.lac-annecy.com/camping/camping-le-solitaire-du-lac-saint-jorioz/", reason: "Suggestion référencée par l’office de tourisme du lac d’Annecy, à Saint-Jorioz." },
  },
  {
    slug: "corse-balagne", title: "Corse : Calvi et la Balagne, sans précipitation", area: "Corse", duration: "5 jours", season: "Mai, juin et septembre",
    image: "corse-balagne", excerpt: "Calvi, Lumio et L’Île-Rousse : un premier carnet corse concentré sur la Balagne.",
    steps: [["J1–J2 · Calvi", "Après la traversée et l’arrivée, gardez du temps pour Calvi et son front de mer. Installez-vous avant d’explorer ; ne programmez pas une longue route de montagne le jour du débarquement."], ["J3 · Lumio", "Choisissez Lumio pour une découverte à pied du village, après avoir confirmé l’accès et le stationnement adaptés à votre véhicule. Les petites distances sur la carte ne signifient pas des déplacements rapides."], ["J4–J5 · L’Île-Rousse", "Poursuivez vers L’Île-Rousse et ses alentours, avec une journée souple pour le marché ou une promenade. Si vous changez de base, confirmez la nuit avant le départ ; ce carnet ne réserve aucun emplacement."]],
    caution: "Ferry, gabarit et hébergements se préparent séparément. Ne suivez pas un raccourci sans vérifier la largeur de la route.",
    stay: { name: "Camping La Clé des Champs", town: "Calvi", source: "https://www.campingcalvi.com/tarif/camping-corse", reason: "Suggestion à Calvi pour le début du séjour ; le site de l’exploitant mentionne l’accueil des camping-cars." },
  },
  {
    slug: "corse-porto-piana", title: "Corse : Porto, Ota et Piana", area: "Corse", duration: "4 jours", season: "Mai, juin et septembre",
    image: "corse-porto-piana", excerpt: "Un séjour autour du golfe de Porto, avec peu de changements de base et beaucoup de marge.",
    steps: [["J1 · Porto", "Rejoignez Porto sans surcharger la journée d’arrivée. Posez le véhicule, découvrez le port et prenez conseil sur les sorties possibles ; les trajets côtiers réclament plus de temps que leur distance ne le laisse penser."], ["J2 · Ota", "Consacrez une journée au secteur d’Ota, avec une promenade adaptée à la météo et au niveau du groupe. Demandez les accès officiels et renoncez aux chemins exposés si les conditions ne sont pas favorables."], ["J3–J4 · Piana", "Prévoyez une excursion vers Piana seulement après avoir vérifié les accès pour votre gabarit. Gardez une journée libre : elle pourra accueillir une sortie encadrée, une visite ou simplement une pause près de la base."]],
    caution: "Routes côtières sinueuses : confirmer l’itinéraire avec le camping, particulièrement en camping-car ou avec une caravane.",
    stay: { name: "Camping Funtana a l’Ora", town: "Porto-Ota", source: "https://www.funtanaalora.fr/", reason: "Suggestion autour de Porto ; l’exploitant annonce des emplacements pour vans et camping-cars." },
  },
  {
    slug: "corse-bonifacio-sud", title: "Corse du Sud : prendre le temps autour de Bonifacio", area: "Corse", duration: "4 jours", season: "Mai, juin et septembre",
    image: "corse-bonifacio-sud", excerpt: "Bonifacio, ses promenades côtières et une escapade vers Porto-Vecchio, sans promettre de plage secrète.",
    steps: [["J1–J2 · Bonifacio", "Gardez deux jours pour Bonifacio, son port et la ville haute, en adaptant la marche à votre mobilité. Une base proche permet de limiter les déplacements ; confirmez les accès plutôt que de chercher à monter dans les ruelles."], ["J3 · Promenade côtière", "Choisissez un sentier officiel après consultation de la météo et des consignes locales. Restez loin des bords exposés et prévoyez de l’eau ; une promenade plus courte est préférable à une sortie forcée par le programme."], ["J4 · Porto-Vecchio", "Si le temps disponible le permet, terminez par une découverte de Porto-Vecchio. Cette excursion reste facultative : une journée supplémentaire à Bonifacio évite aussi de reprendre la route avant le ferry."]],
    caution: "Réservez votre base et le ferry ; vérifiez vent, chaleur et accès. Aucune nuit sauvage ni stationnement sur une plage n’est recommandé.",
    stay: { name: "Camping L’Araguina", town: "Bonifacio", source: "https://www.visit-corsica.com/fr/Mon-sejour/Hebergement/Hebergement-de-Plein-Air/L-ARAGUINA", reason: "Suggestion près du port de Bonifacio, référencée par l’agence du tourisme de la Corse." },
  },
];

export const MAG_ITINERARIES = MAG_ROUTES.map(route => ({
  slug: route.slug, title: route.title, category: "Itinéraire", excerpt: route.excerpt,
  image: `/images/mag/itineraires/${route.image}.webp`, alt: `Illustration rétro — ${route.title}. Séjour dans un camping aménagé ; scène imaginée, pas une photographie du lieu conseillé.`,
  sections: route.steps.map(([title, text]) => ({ title, text })),
  destination: "/explorer", action: "Explorer les lieux du réseau", route,
}));
