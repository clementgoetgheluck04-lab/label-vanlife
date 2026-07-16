import Link from "next/link";

export default function MarketplacePage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            Marketplace
          </span>
          <h1 className="text-5xl sm:text-6xl font-bold text-charcoal leading-tight">
            L&apos;univers des <span className="text-sage">Vanlifers</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Produits dérivés, équipements, vans à vendre et bonnes affaires de la communauté Label Vanlife.
          </p>
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-8 bg-white border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: "🛍️", title: "Produits & Goodies", desc: "Produits dérivés et équipements" },
              { icon: "🚐", title: "Vans à vendre", desc: "Vans aménagés par des vanlifers" },
              { icon: "🏪", title: "Établissements", desc: "Partenaires à reprendre" },
            ].map((cat) => (
              <button
                key={cat.title}
                className="bg-cream rounded-xl p-4 border border-border/30 hover:border-sage/50 hover:bg-sage/5 transition-all text-left"
              >
                <span className="text-2xl block mb-1">{cat.icon}</span>
                <p className="font-semibold text-charcoal text-sm">{cat.title}</p>
                <p className="text-xs text-muted-foreground">{cat.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Tous", "Goodies Label", "Livres & Guides", "Équipement", "Art & Photos"].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1.5 text-xs font-medium text-charcoal/70 bg-cream rounded-full hover:bg-sage/10 hover:text-sage transition-colors"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Featured product */}
          <div className="bg-cream rounded-3xl overflow-hidden border border-border/30 mb-12">
            <div className="grid md:grid-cols-2">
              <div className="bg-gradient-to-br from-sage/20 to-cream flex items-center justify-center p-12">
                <div className="text-center">
                  <span className="text-8xl block mb-4">☕</span>
                  <span className="inline-block text-xs font-semibold bg-sage text-white px-3 py-1 rounded-full">
                    NOUVEAU
                  </span>
                </div>
              </div>
              <div className="p-8 sm:p-12 space-y-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-sage">Goodie officiel</span>
                <h2 className="text-3xl font-bold text-charcoal">Duo de Mugs Label Vanlife</h2>
                <p className="text-sm text-muted-foreground">par Label Vanlife</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-sage">30 €</span>
                  <span className="text-sm text-muted-foreground line-through">40 €</span>
                  <span className="text-xs text-muted-foreground">les 2 mugs</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Le duo de mugs officiels Label Vanlife pour vos pauses café en van ou à la maison.
                  Un design unique avec le van Label Vanlife et le logo.
                </p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    325 ml, taille idéale pour un café latte
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Céramique blanche et brillante
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Impression certifiée FDA, couleurs vives
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Compatible lave-vaisselle et micro-ondes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sage shrink-0">✓</span>
                    Livraison gratuite
                  </li>
                </ul>
                <p className="text-xs text-muted-foreground">
                  Livraison offerte en 6-9 jours ouvrés en France métropolitaine
                </p>
                <button className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors">
                  Commander — 30 €
                </button>
              </div>
            </div>
          </div>

          {/* Partner shops */}
          <div className="space-y-8">
            <h3 className="text-2xl font-bold text-charcoal">Boutiques partenaires</h3>

            {/* Marco l'Iveco */}
            <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-border/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="inline-block text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full">
                  Partenaire voyageur
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gradient-to-br from-sage/10 to-cream rounded-xl h-40 flex items-center justify-center">
                  <span className="text-6xl">🚐</span>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Routes de la Soie
                  </span>
                  <h3 className="text-xl font-bold text-charcoal">La boutique de Marco l&apos;Iveco</h3>
                  <p className="text-sm text-muted-foreground">par Bastien — Marco l&apos;Iveco</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ressources exclusives sur l&apos;aménagement de véhicule d&apos;expédition, guides pratiques
                    et contenus premium pour préparer votre aventure — par le vanlifer qui traverse les continents
                    en camion de pompier.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
                  >
                    Accéder à la boutique →
                  </Link>
                </div>
              </div>
            </div>

            {/* Crazy Charly */}
            <div className="bg-cream rounded-2xl p-6 sm:p-8 border border-border/30 hover:shadow-md transition-all">
              <div className="flex items-start gap-3 mb-3">
                <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full">
                  Partenaire référencé
                </span>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 bg-gradient-to-br from-blue-100 to-cream rounded-xl h-40 flex items-center justify-center">
                  <span className="text-6xl">🔧</span>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <span className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                    Près d&apos;Arras · Europe · Bientôt USA
                  </span>
                  <h3 className="text-xl font-bold text-charcoal">Crazy Charly — Chasseur de Combi VW</h3>
                  <p className="text-sm text-muted-foreground">par CRAZY CHARLY — Spécialiste Combi Volkswagen</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Vous rêvez d&apos;un Combi Volkswagen mais vous ne savez pas où chercher ? CRAZY CHARLY part à la
                    chasse pour vous — en France et partout en Europe — selon vos critères exacts. Note clients : 5/5 ★
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
                  >
                    Contacter CRAZY CHARLY →
                  </Link>
                </div>
              </div>
            </div>

            {/* UX Design service */}
            <div className="bg-charcoal text-white rounded-2xl p-6 sm:p-8">
              <div className="grid md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-1 text-center">
                  <span className="text-5xl block mb-2">🎨</span>
                  <span className="text-xs font-semibold tracking-wider uppercase text-sage">Service partenaire</span>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xl font-bold">Création de sites web & UX Design</h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    L&apos;UX Design consiste à concevoir des interfaces digitales centrées sur l&apos;utilisateur :
                    navigation intuitive, parcours fluide, design soigné et adapté à tous les écrans.
                    L&apos;objectif ? Que chaque visiteur trouve ce qu&apos;il cherche facilement.
                  </p>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage/80 transition-colors"
                  >
                    Découvrir le portfolio →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Publish your ad */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-charcoal text-center mb-8">Publiez votre annonce</h3>
            <p className="text-center text-muted-foreground text-sm mb-8">
              Partagez vos produits, vendez votre van ou proposez votre établissement.
              Toutes les annonces sont validées par notre équipe.
            </p>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: "🛍️", title: "Vendre un produit", desc: "Goodies, équipements, livres...", cta: "Déposer une annonce" },
                { icon: "🚐", title: "Vendre mon van", desc: "Van aménagé, fourgon...", cta: "Déposer une annonce" },
                { icon: "🏪", title: "Céder mon établissement", desc: "Camping, aire d'accueil...", cta: "Déposer une annonce" },
              ].map((item) => (
                <div key={item.title} className="bg-cream rounded-2xl p-6 border border-border/30 hover:shadow-md transition-all text-center space-y-3">
                  <span className="text-4xl block">{item.icon}</span>
                  <h4 className="font-bold text-charcoal">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <button className="px-4 py-2 text-sm font-semibold text-sage border border-sage rounded-full hover:bg-sage hover:text-white transition-colors">
                    {item.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <Link href="/map" className="bg-cream rounded-xl p-4 text-center font-semibold text-charcoal hover:bg-sage/10 transition-colors">
              🏕️ Lieux partenaires Campings van-friendly →
            </Link>
            <Link href="/devenir-membre" className="bg-cream rounded-xl p-4 text-center font-semibold text-charcoal hover:bg-sage/10 transition-colors">
              💳 Carte membre Rejoindre le réseau →
            </Link>
            <Link href="/labellisation" className="bg-cream rounded-xl p-4 text-center font-semibold text-charcoal hover:bg-sage/10 transition-colors">
              🏡 Vous êtes gérant ? Rejoindre le label →
            </Link>
            <Link href="/evenements" className="bg-cream rounded-xl p-4 text-center font-semibold text-charcoal hover:bg-sage/10 transition-colors">
              📅 Agenda Événements vanlife →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}