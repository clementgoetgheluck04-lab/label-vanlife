import Link from "next/link";

export default function ConseilCampingPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-charcoal via-charcoal to-sage/20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-sage rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-amber-500 rounded-full blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sand">
            Directeur de camping — Consultant
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Augmentez les réservations{" "}
            <span className="text-sage">de votre camping.</span>
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto leading-relaxed">
            Le camping, ce n&apos;est pas mon métier. <strong className="text-white">C&apos;est ma vie.</strong>
            <br />
            Ancien directeur de camping, j&apos;ai augmenté le chiffre d&apos;affaires d&apos;un établissement de{" "}
            <strong className="text-sage">48% en 3 ans</strong>.
            Aujourd&apos;hui j&apos;aide les campings indépendants à atteindre leur plein potentiel.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              href="#audit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors shadow-lg"
            >
              Demander mon audit — 500 €
            </Link>
            <Link
              href="#offres"
              className="inline-flex items-center gap-2 px-6 py-3 border border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
            >
              Voir toutes les offres
            </Link>
          </div>
        </div>
      </section>

      {/* What I bring */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
                Ce que j&apos;apporte
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight">
                Directeur de camping devenu consultant.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Je connais le prix d&apos;une nuit non vendue, l&apos;angoisse d&apos;un week-end pluvieux en juillet
                et la satisfaction d&apos;un camping plein en basse saison.
              </p>
              <div className="space-y-4">
                {[
                  { icon: "📈", text: "✔ Augmenter votre visibilité" },
                  { icon: "🎯", text: "✔ Améliorer vos réservations" },
                  { icon: "💻", text: "✔ Optimiser votre stratégie digitale" },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-charcoal font-medium">
                    <span className="text-2xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Problem */}
            <div className="bg-cream rounded-3xl p-8 sm:p-10 border border-border/30 space-y-6">
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-red-500/70">
                Le problème
              </span>
              <h3 className="text-2xl font-bold text-charcoal">Aujourd&apos;hui, beaucoup de campings :</h3>
              <ul className="space-y-3">
                {[
                  "ont un site internet peu performant",
                  "sont mal référencés sur Google",
                  "dépendent trop de Booking",
                  "perdent des réservations sans le savoir",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-muted-foreground">
                    <span className="text-red-400 font-bold">✕</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-semibold text-sage pt-2">
                La solution : un audit performance camping.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real example */}
      <section className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
              Exemple réel
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Sur le camping que je dirigeais :
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { value: "+48%", label: "de chiffre d'affaires en 3 ans" },
              { value: "+20%", label: "de réservations directes" },
              { value: "−35%", label: "de dépendance aux OTA" },
            ].map((stat) => (
              <div key={stat.value} className="text-center bg-white rounded-2xl p-8 border border-border/30">
                <p className="text-5xl font-black text-sage">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground text-sm mt-8 max-w-2xl mx-auto">
            70 mobil-homes, 70 emplacements, piscine, animations, restaurant. Ancien directeur de camping,
            je connais les leviers qui fonctionnent vraiment.
          </p>
        </div>
      </section>

      {/* Three step solution */}
      <section id="offres" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
              La solution
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">
              Trois étapes pour transformer votre camping.
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Un tunnel de valeur progressif : diagnostic → optimisation → transformation complète.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div id="audit" className="bg-cream rounded-3xl p-8 border border-border/30 hover:shadow-lg transition-all relative">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-sage">Commencer ici</span>
                <p className="text-xs font-semibold text-muted-foreground">ÉTAPE 1</p>
                <h3 className="text-2xl font-bold text-charcoal">Audit Performance Camping</h3>
                <p className="text-sm text-muted-foreground">
                  Identifier les optimisations simples qui augmentent vos réservations rapidement.
                </p>
                <p className="text-3xl font-black text-sage">500 €</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Audit complet site internet
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Analyse référencement Google
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Benchmark concurrents locaux
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Rapport personnalisé 30 pages
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Visio restitution 1h
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    5 axes d&apos;amélioration priorisés
                  </li>
                </ul>
                <p className="text-xs text-amber-600 font-medium">
                  ⚠ Je réalise seulement 5 audits par mois afin de garder un accompagnement personnalisé.
                </p>
                <Link
                  href="#"
                  className="block w-full text-center px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
                >
                  Demander mon audit
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-cream rounded-3xl p-8 border border-border/30 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-sage">ÉTAPE 2</span>
                <h3 className="text-2xl font-bold text-charcoal">Optimisation Performance Camping</h3>
                <p className="text-sm text-muted-foreground">
                  Passer de la théorie à l&apos;augmentation réelle de vos réservations.
                </p>
                <p className="text-3xl font-black text-sage">1 500 € – 3 000 €</p>
                <p className="text-xs text-muted-foreground">selon la taille du camping</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Étude concurrence locale</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Analyse prix & saisonnalité</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Optimisation fiche Google Business</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Optimisation fiches OTA</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Amélioration tunnel de réservation</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Templates emails & automatisation</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Visio stratégique 1h</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Résultat attendu : +10 à +30% de réservations directes</li>
                </ul>
                <Link
                  href="#"
                  className="block w-full text-center px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
                >
                  Demander une optimisation
                </Link>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-cream rounded-3xl p-8 border border-border/30 hover:shadow-lg transition-all">
              <div className="space-y-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-sage">ÉTAPE 3</span>
                <h3 className="text-2xl font-bold text-charcoal">Création ou Refonte de Site Internet</h3>
                <p className="text-sm text-muted-foreground">
                  Un site internet qui génère des réservations — votre meilleur commercial.
                </p>
                <p className="text-3xl font-black text-sage">2 500 € – 4 000 €</p>
                <p className="text-xs text-muted-foreground">selon projet — délai 2 à 4 semaines</p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>UX / UI Design sur mesure</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Design moderne, mobile first</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Tunnel de réservation optimisé</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>SEO touristique & référencement local</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Connectable à votre PMS</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Automatisation emails</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Formation gestion du site</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Optimisation OTA incluse</li>
                  <li className="flex items-start gap-2"><span className="text-sage shrink-0">✓</span>Bonus : stratégie digitale offerte</li>
                </ul>
                <p className="text-xs font-semibold text-sage uppercase tracking-wider pt-2">Maintenance & Suivi</p>
                <p className="text-sm"><strong className="text-charcoal">Actualisation mensuelle</strong> — 49 € / mois</p>
                <p className="text-sm"><strong className="text-charcoal">Actualisation hebdomadaire</strong> — 149 € / mois</p>
                <Link
                  href="#"
                  className="block w-full text-center px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
                >
                  Discuter de mon projet
                </Link>
              </div>
            </div>
          </div>

          {/* Premium offer */}
          <div className="mt-12 bg-charcoal text-white rounded-3xl p-8 sm:p-12">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sage">Offre sur mesure</span>
                <p className="text-xs font-semibold text-sand/70">TRANSFORMATION COMPLÈTE</p>
                <h3 className="text-2xl sm:text-3xl font-bold">Site internet + Automatisation + PMS personnalisé</h3>
                <p className="text-white/70">
                  Propulsé par des agents IA. Pour les campings qui veulent aller plus loin : automatisation des équipes,
                  relation client autonome et système de gestion sur mesure connecté à votre écosystème.
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
                >
                  Demander un devis
                </Link>
              </div>
              <div className="space-y-4">
                {[
                  { icon: "🎨", title: "Site UX / UI sur mesure", desc: "Design premium & tunnel optimisé" },
                  { icon: "🤖", title: "Agents IA", desc: "Automatisation clients & équipes" },
                  { icon: "⚙️", title: "PMS personnalisé", desc: "Gestion intégrée & connectée" },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-white/60">{item.desc}</p>
                    </div>
                  </div>
                ))}
                <p className="text-2xl font-black text-sage">Sur devis</p>
                <p className="text-xs text-white/40">Sur demande uniquement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Before/After */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal">Avant / Après</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-border/30 space-y-4">
              <h3 className="text-lg font-bold text-red-400">Situation actuelle ✕</h3>
              <ul className="space-y-3">
                {["Dépendance Booking", "Site vieillissant", "Faible visibilité Google", "Réservations limitées", "Stratégie imprécise"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-red-300">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-sage/30 space-y-4">
              <h3 className="text-lg font-bold text-sage">Avec optimisation ✓</h3>
              <ul className="space-y-3">
                {["Réservations directes", "Site moderne & rapide", "Meilleur référencement", "Augmentation réservations", "Plan d'action structuré"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-charcoal font-medium">
                    <span className="text-sage">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">Mon histoire</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-charcoal leading-tight mt-4">
              Né dans un auvent de caravane. Élevé entre les allées d&apos;un camping.
            </h2>
          </div>
          <div className="bg-cream rounded-3xl p-8 sm:p-12 space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Mon père était gardien de camping. J&apos;ai grandi au milieu des allées, des arrivées du dimanche soir
              et des départs du samedi matin. À 8 ans, je savais déjà vider une poubelle de sanitaires et accueillir
              un client fatigué avec le sourire.
            </p>
            <p>
              À 25 ans, direction d&apos;un camping de 140 emplacements. 3 ans plus tard, le chiffre d&apos;affaires avait
              augmenté de 48%, les réservations directes de 20%, et la dépendance aux OTA avait chuté de 35%.
            </p>
            <p>
              Aujourd&apos;hui, je transmets ce que j&apos;ai appris sur le terrain. Pas de théorie. Pas de bullshit. Juste
              des stratégies qui marchent — parce que je les ai testées moi-même.
            </p>
            <p className="font-semibold text-charcoal">
              — Clément Goetgheluck, Fondateur de Label Vanlife & Consultant Camping
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}