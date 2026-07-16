import Link from "next/link";

const EVENTS = [
  {
    title: "🚐 Rasso COMBICOX – 1ère Édition",
    date: "23-24-25 Mai 2025",
    location: "Camping de l'Aix, Pommiers-en-Forez (42), Loire",
    type: "VW Combi",
    price: "23€/van · 2€ visiteur",
    desc: "La 1ère édition du Rasso COMBICOX au Camping de l'Aix à Pommiers-en-Forez ! Village exposants, soirée concert, jeux, balade et foodtrucks. En collaboration avec Combi Clipper France. Lieu partenaire Label Vanlife — réductions membres sur place !",
  },
  {
    title: "🟡 Valence Aircooled Show",
    date: "14-15 Février 2026",
    location: "Valence (26), Palais des Congrès — Only Flat 4",
    type: "VW Combi",
    price: "Entrée libre",
    desc: "Organisé par Drôme Historic Events. Rassemblement indoor de véhicules VW refroidis par air (Flat 4 uniquement). Pièces détachées, bourse d'échange, expositions.",
  },
  {
    title: "Viva Camping-Car – Biarritz",
    date: "5-8 Mars 2026",
    location: "Halle d'Iraty, Biarritz (64), Pays Basque",
    type: "Salon",
    price: "Entrée payante",
    desc: "Le salon camping-car et van aménagé du Pays Basque. Exposants nationaux, nouveautés véhicules et équipements, animations famille. Un incontournable pour commencer la saison.",
  },
  {
    title: "🟡 VW Dream & Troc – 8ème Bourse d'échange",
    date: "8 Mars 2026",
    location: "Fréjeville (81), Tarn",
    type: "VW Combi",
    price: "Entrée libre",
    desc: "8ème édition de la bourse d'échange VW Dream. Cox, Combis, pièces détachées, véhicules à vendre. Restauration sur place. Le rendez-vous des passionnés du Tarn.",
  },
  {
    title: "Salon Van & Camping-Car – Béziers",
    date: "2-5 Avril 2026",
    location: "Parc des Expositions de Béziers (34), Hérault",
    type: "Salon",
    price: "Entrée payante",
    desc: "Le grand salon du camping-car, van et fourgon aménagé de la région Occitanie. Des centaines d'exposants, des nouveautés véhicules, équipements et accessoires.",
  },
  {
    title: "Vanlife Expo – Rennes",
    date: "11-12 Avril 2026",
    location: "Parc Expo Rennes (Bruz), Halls 4, 5 et 8",
    type: "Salon",
    price: "8€ prévente / 10€ sur place",
    desc: "2 jours d'exposition à Rennes : vans aménagés, fourgons, équipements solaire & autonomie, espace conférences et Pôle Aventure 4x4.",
  },
  {
    title: "🎂 Meeting Cox & Dérivés – Club ATR 30 ans",
    date: "Dimanche 12 Avril 2026",
    location: "Cormeilles-en-Parisis (95), Salle des fêtes Emy-les-Prés",
    type: "VW Combi",
    price: "Entrée libre",
    desc: "Le Club ATR fête ses 30 ans ! Grand meeting dédié aux Cox, Combi et dérivés VW. Exposition, échanges entre passionnés, bonne humeur & esprit club.",
  },
  {
    title: "Camper Van Week-End Brissac",
    date: "24-26 Avril 2026",
    location: "Brissac-Quincé (49), Anjou",
    type: "Vanlife",
    price: "Gratuit - 50€ bivouac",
    desc: "8ᵉ édition ! Le plus grand événement vanlife de France. Vans & fourgons aménagés, accessoires, kits de voyage, mini-caravanes, tentes de toit. Bivouac, exposants, festival We Love Van avec concerts live.",
  },
  {
    title: "🟡 Meeting O.V.K (Old Volks Klub)",
    date: "8-10 Mai 2026",
    location: "Étang de la Baronnie, La Ferté-Fresnel (61)",
    type: "VW Combi",
    price: "Entrée libre",
    desc: "Rassemblement annuel organisé par l'Old Volks Klub. Ambiance camping et passion VW au bord de l'eau.",
  },
  {
    title: "🟡 Meeting de Cox'Attitude – 5ème édition",
    date: "8-9-10 Mai 2026",
    location: "Excenevex (74), Lac Léman",
    type: "VW Combi",
    price: "Entrée libre",
    desc: "5ème édition du rassemblement VW Aircooled sur les rives du Lac Léman. Thème 2026 : '100% Beach Attitude'. Cox, Combis et dérivés VW. Cadre exceptionnel face aux Alpes.",
  },
  {
    title: "Vanlife Expo – Grenoble",
    date: "9-10 Mai 2026",
    location: "Alpexpo Grenoble (38), Isère",
    type: "Salon",
    price: "8€ prévente / 10€ sur place",
    desc: "2ᵉ édition grenobloise du salon Vanlife Expo ! Vans aménagés, équipements solaire & autonomie, Pôle Aventure 4x4, conférences vanlife. Aux portes des Alpes.",
  },
  {
    title: "Rassemblement de vans dans le Lot – Van Lot",
    date: "14-17 Mai 2026",
    location: "Camping Le Moulin du Bel Air, entre Sarlat et Cahors (Lot)",
    type: "Vanlife",
    price: "152€ / 2 pers. · 126€ / 1 pers.",
    desc: "Rassemblement de vans dans le Lot. 4 jours de vanlife au cœur du Périgord Noir. Balades, repas partagés, soirées au coin du feu. Ambiance 100% vanlife.",
  },
  {
    title: "Vanlife Expo – Bordeaux",
    date: "23-24 Mai 2026",
    location: "Parc des Expositions de Bordeaux (33), Gironde",
    type: "Salon",
    price: "8€ prévente / 10€ sur place",
    desc: "Le salon Vanlife Expo fait étape à Bordeaux. Vans aménagés, équipements, conférences et animations pour toute la famille.",
  },
  {
    title: "Rassemblement VW – 40 ans du Combi Club de France",
    date: "30-31 Mai 2026",
    location: "À déterminer",
    type: "VW Combi",
    price: "À confirmer",
    desc: "Rassemblement exceptionnel pour les 40 ans du Combi Club de France. Des centaines de combis attendus pour célébrer cet anniversaire historique.",
  },
  {
    title: "Vanlife Expo – Lyon",
    date: "6-7 Juin 2026",
    location: "Eurexpo Lyon (69), Rhône",
    type: "Salon",
    price: "8€ prévente / 10€ sur place",
    desc: "L'étape lyonnaise du Vanlife Expo. Deux jours de découverte et d'inspiration pour tous les amoureux de la vie en van.",
  },
  {
    title: "Week-end Label Vanlife - Ardèche",
    date: "Automne 2026",
    location: "Ardèche",
    type: "Vanlife",
    price: "Réservé aux membres",
    desc: "Un week-end découverte dans les gorges de l'Ardèche avec les membres du label. Randonnées, baignades et soirées partagées.",
  },
  {
    title: "Assemblée Générale Label Vanlife",
    date: "Hiver 2026",
    location: "En ligne",
    type: "Vanlife",
    price: "Gratuit pour les membres",
    desc: "Bilan de l'année et perspectives pour la communauté Label Vanlife. Participation ouverte à tous les membres.",
  },
];

const typeColors: Record<string, string> = {
  "Vanlife": "bg-emerald-100 text-emerald-800",
  "VW Combi": "bg-blue-100 text-blue-800",
  "Salon": "bg-amber-100 text-amber-800",
};

export default function EvenementsPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-sage rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Agenda 2026
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-charcoal leading-tight">
            Événements <span className="text-sage">Vanlife & VW</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Rassemblements, festivals et salons pour les passionnés de liberté sur roues. Du printemps à l&apos;automne,
            ne manquez aucun rendez-vous de la communauté !
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">Calendrier</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Tous", "Vanlife", "VW Combi", "Salon"].map((filter) => (
              <button
                key={filter}
                className="px-4 py-1.5 text-xs font-medium text-charcoal/70 bg-cream rounded-full hover:bg-sage/10 hover:text-sage transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {EVENTS.map((event) => (
              <div
                key={event.title}
                className="bg-cream rounded-2xl p-6 sm:p-8 border border-border/30 hover:shadow-md transition-all flex flex-col sm:flex-row gap-6"
              >
                {/* Date badge */}
                <div className="shrink-0 text-center sm:text-left sm:w-48">
                  <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2 ${typeColors[event.type] || "bg-gray-100 text-gray-700"}`}>
                    {event.type}
                  </span>
                  <p className="text-sm font-bold text-sage mt-1">{event.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">{event.price}</p>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-charcoal mb-2">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                    <span>📍</span> {event.location}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{event.desc}</p>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex sm:flex-col gap-2 items-start">
                  <button className="px-4 py-2 text-xs font-semibold text-sage border border-sage rounded-full hover:bg-sage hover:text-white transition-colors">
                    Plus d'infos
                  </button>
                  <button className="px-4 py-2 text-xs font-semibold text-charcoal/70 border border-border/50 rounded-full hover:bg-charcoal/5 transition-colors">
                    Site →
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 space-y-4">
            <p className="text-muted-foreground text-sm">
              Vous organisez un événement vanlife ? Proposez-le sur Label Vanlife.
            </p>
            <Link
              href="/devenir-membre"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
            >
              Devenir membre pour participer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}