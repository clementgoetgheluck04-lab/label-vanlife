"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, Leaf, Heart, X, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LeLabelPage() {
  return (
    <div className="min-h-screen bg-white pt-20 sm:pt-24">
      {/* ===== HERO ===== */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Pourquoi Label Vanlife ?</span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-neutral-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
            Le Label<br />
            <span className="text-emerald-500">Vanlife</span>
          </h1>
          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Face à l&apos;explosion du voyage en van, quelque chose s&apos;est perdu en chemin. Voici pourquoi nous avons tout repensé.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#manifeste">
              <Button variant="primary" size="lg" className="gap-2 text-base px-8">
                Lire notre manifeste <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
            <Link href="/devenir-membre">
              <Button variant="cta" size="lg" className="text-base px-8">Rejoindre le mouvement</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== MANIFESTE ===== */}
      <section id="manifeste" className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-6">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Notre Manifeste</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              La vanlife ne devrait pas être<br />
              une chasse aux spots.
            </h2>
            <p className="text-lg text-neutral-500 italic">
              Ce n&apos;est pas une course.<br />
              Ce n&apos;est pas un GPS.<br />
              Ce n&apos;est pas une liste de lieux à consommer.
            </p>
            <p className="text-sm font-semibold text-neutral-400">Et pourtant…</p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-8 sm:p-12 text-center space-y-4 border border-neutral-100">
            <p className="text-neutral-600 leading-relaxed">Aujourd&apos;hui, la vanlife est devenue ça.</p>
            <p className="text-neutral-500">Des milliers de points sur une carte.<br />Des lieux saturés.<br />Des riverains à bout.<br />Des interdictions qui se multiplient.</p>
            <div className="pt-4">
              <p className="text-xl font-bold text-neutral-800 italic">&ldquo;On est passés de la liberté…</p>
              <p className="text-xl font-bold text-emerald-600 italic">à un problème.&rdquo;</p>
            </div>
          </div>

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold text-neutral-900">Nous refusons cette dérive.</h3>
            <p className="text-lg font-semibold text-neutral-600">Nous refusons la vanlife…</p>
            <div className="grid sm:grid-cols-2 gap-3 max-w-md mx-auto">
              {["bruyante", "illégale", "jetable", "sans respect"].map((item) => (
                <div key={item} className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 rounded-xl text-red-600 text-sm font-medium">
                  <X className="h-4 w-4" /> {item}
                </div>
              ))}
            </div>
            <p className="text-neutral-500 mt-4">Parce que la vraie vanlife, ce n&apos;est pas ça.</p>
          </div>

          <div className="text-center space-y-6 py-8">
            <h3 className="text-3xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>
              La vanlife, c&apos;est une rencontre.
            </h3>
            <p className="text-xl text-emerald-600 font-semibold">Un lieu. Un hôte. Un moment.</p>
            <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 space-y-3">
              <p className="text-lg font-semibold text-neutral-800">LABEL VANLIFE est né pour créer un réseau de lieux<br />où tu es attendu.</p>
              <p className="text-neutral-500">Pas toléré.<br />Pas caché.<br />Pas en train de déranger.</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: "🚐", title: "Voyager moins, mais mieux." },
              { icon: "⏳", title: "Rester plus longtemps." },
              { icon: "🌿", title: "Laisser les lieux plus beaux." },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center space-y-2">
                <span className="text-4xl">{item.icon}</span>
                <p className="font-semibold text-neutral-800 text-sm">{item.title}</p>
              </Card>
            ))}
          </div>

          <div className="bg-neutral-50 rounded-2xl p-8 text-center space-y-3 border border-neutral-100">
            <p className="text-neutral-600">Zéro spot sauvage imposé.<br />Zéro voisin énervé.<br />Zéro stress.</p>
            <p className="text-lg font-bold text-neutral-800 italic pt-4">&ldquo;La liberté n&apos;est durable<br />que si elle respecte les autres.&rdquo;</p>
            <p className="text-neutral-500 pt-4">Juste… des réveils qui ont du sens.</p>
          </div>
        </div>
      </section>

      {/* ===== LE PROBLÈME ===== */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 text-center" style={{ fontFamily: "Outfit, sans-serif" }}>
            Le problème aujourd&apos;hui
          </h2>
          <p className="text-lg text-neutral-600 text-center">Les applications de spots ont transformé le voyage en van en une consommation de points GPS.</p>
          <div className="space-y-4">
            {[
              "Des lieux surfréquentés et saturés",
              "Des parkings bondés, du bruit, des déchets",
              "Des riverains excédés, des interdictions qui s'accumulent",
              "Une image dégradée de toute une communauté",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-neutral-100">
                <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">{item}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-neutral-400 italic pt-4">Ce système ne protège ni les lieux, ni les habitants, ni les voyageurs eux-mêmes.</p>
          <p className="text-center text-lg font-bold text-neutral-800 italic">&ldquo;Quand tout est accessible à tous,<br />plus rien n&apos;est vraiment respecté.&rdquo;</p>
        </div>
      </section>

      {/* ===== LA RÉPONSE ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>
            La réponse Label Vanlife
          </h2>
          <p className="text-lg text-neutral-600">
            Nous ne cherchons pas à répertorier tous les spots.<br />
            <strong className="text-emerald-600">Nous choisissons de certifier les bons.</strong>
          </p>
          <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100 space-y-2">
            <p className="font-semibold text-neutral-800">Des lieux :</p>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li className="flex items-center justify-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> qui ont envie d&apos;accueillir des vanlifers,</li>
              <li className="flex items-center justify-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> qui partagent des valeurs de respect et de calme,</li>
              <li className="flex items-center justify-center gap-2"><Check className="h-4 w-4 text-emerald-500" /> qui souhaitent recevoir moins de monde, mais mieux.</li>
            </ul>
          </div>
          <p className="text-xl font-bold text-emerald-600 pt-4">Label Vanlife n&apos;est pas une carte à spots.</p>
          <p className="text-2xl font-bold text-neutral-800">C&apos;est un réseau de confiance.</p>
        </div>
      </section>

      {/* ===== POURQUOI NOUS SOMMES DIFFÉRENTS ===== */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Pourquoi nous sommes différents</span>
            <p className="text-neutral-600 max-w-2xl mx-auto">Nous ne sommes pas un annuaire de plus. Nous sommes un réseau engagé qui exclut volontairement la &ldquo;consommation&rdquo; de lieux au profit de la qualité du séjour.</p>
            <p className="text-sm text-neutral-500">Nous privilégions le lien humain, le respect des règles locales et la préservation de l&apos;environnement.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="w-8 h-8" />, title: "Confiance Réciproque", desc: "L'hôte vous attend avec plaisir, vous voyagez avec sérénité." },
              { icon: <Leaf className="w-8 h-8" />, title: "Respect des Lieux", desc: "Zéro trace, zéro déchet, 100% de courtoisie." },
              { icon: <Shield className="w-8 h-8" />, title: "Tourisme Durable", desc: "Soutenir l'économie locale et préserver les territoires." },
            ].map((item) => (
              <Card key={item.title} className="p-6 text-center space-y-3">
                <div className="inline-flex h-14 w-14 rounded-2xl items-center justify-center bg-emerald-50 text-emerald-500 mx-auto">{item.icon}</div>
                <h3 className="font-bold text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CHARTE ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">La Charte Label Vanlife</span>
            <p className="text-sm text-neutral-500">Chaque engagement protège autant le voyageur que le lieu.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: "🌙", title: "Calme & Sérénité", voyageur: "Dormir au calme, sans nuisances ni stress.", lieu: "Préserver la tranquillité du site et du voisinage." },
              { icon: "🤝", title: "Respect Local", voyageur: "Comprendre où l'on est accueilli.", lieu: "Respect des règles, du rythme et de l'environnement." },
              { icon: "🛡️", title: "Sécurité", voyageur: "Dormir sereinement, seul ou en famille.", lieu: "Accueillir en confiance, sans comportements à risque." },
              { icon: "💚", title: "Dimension Humaine", voyageur: "Éviter les zones de masse et l'anonymat.", lieu: "Privilégier la qualité plutôt que la quantité." },
            ].map((item) => (
              <Card key={item.title} className="p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{item.icon}</span>
                  <h3 className="font-bold text-neutral-900">{item.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-emerald-50 rounded-lg p-3 space-y-1">
                    <span className="font-semibold text-emerald-700 block">Voyageur</span>
                    <p className="text-neutral-600">{item.voyageur}</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-3 space-y-1">
                    <span className="font-semibold text-amber-700 block">Lieu</span>
                    <p className="text-neutral-600">{item.lieu}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUVERT À TOUS ===== */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Ouvert à tous les professionnels</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Le Label s&apos;adresse à…</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Bien plus qu&apos;un réseau de campings ! Tous les professionnels partageant nos valeurs peuvent candidater.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🏕️", label: "Lieux d'accueil", sub: "Campings, aires, fermes..." },
              { icon: "🍽️", label: "Restauration", sub: "Restaurants, snacks, foodtrucks" },
              { icon: "🔧", label: "Garagistes", sub: "Mécanique, réparation" },
              { icon: "🚐", label: "Concessionnaires", sub: "Vente & aménagement vans" },
              { icon: "🎒", label: "Accessoiristes", sub: "Équipements vanlife" },
              { icon: "🎁", label: "Goodies", sub: "Boutiques, artisans locaux" },
              { icon: "🗺️", label: "Excursions", sub: "Guides, tours organisés" },
              { icon: "🏄", label: "Activités", sub: "Loisirs, bien-être, sport" },
            ].map((item) => (
              <Card key={item.label} className="p-4 text-center hover:shadow-md transition-shadow">
                <span className="text-2xl block mb-1">{item.icon}</span>
                <h3 className="text-sm font-semibold text-neutral-800">{item.label}</h3>
                <p className="text-[10px] text-neutral-500 mt-0.5">{item.sub}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-emerald-600">En bref : presque tous ceux qui souhaitent accueillir ou servir des vanlifers respectueux peuvent candidater !</p>
          <div className="text-center">
            <Link href="/labellisation">
              <Button variant="primary" size="lg" className="gap-2">Candidater maintenant <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROCESSUS ===== */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-6 space-y-8">
          <div className="text-center space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Comment un lieu obtient le Label Vanlife</span>
            <p className="text-sm text-neutral-500">Un processus rigoureux pour garantir la qualité et l&apos;authenticité du réseau.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { num: "1", title: "Candidature", desc: "L'hôte présente son lieu, son mode d'accueil et son engagement envers la charte." },
              { num: "2", title: "Vérification", desc: "Le lieu est évalué par notre équipe ou par un membre ambassadeur de confiance." },
              { num: "3", title: "Labellisation", desc: "Une fois validé, le lieu rejoint le réseau Label Vanlife et devient visible sur la carte réservée aux membres." },
            ].map((item) => (
              <Card key={item.num} className="p-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white text-lg font-bold mx-auto">{item.num}</div>
                <h3 className="font-bold text-neutral-900">{item.title}</h3>
                <p className="text-sm text-neutral-500">{item.desc}</p>
              </Card>
            ))}
          </div>
          <p className="text-center text-sm font-semibold text-emerald-600 italic">Tous les lieux ne sont pas acceptés.<br />Et c&apos;est exactement ce qui fait la valeur du label.</p>
        </div>
      </section>

      {/* ===== HISTOIRE ===== */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Une histoire de terrain, pas de bureau</span>
          <p className="text-lg text-neutral-600">Label Vanlife n&apos;est pas né derrière un écran.</p>
          <p className="text-neutral-500">Il est né sur les routes, dans des vans, dans des lieux magnifiques… parfois trop fréquentés.</p>
          <div className="bg-white rounded-2xl p-8 border border-neutral-100 shadow-sm">
            <p className="text-neutral-600 leading-relaxed">Si nous voulons continuer à voyager librement,<br />nous devons voyager autrement.</p>
          </div>
          <p className="text-lg font-semibold text-emerald-600">Label Vanlife est une tentative sincère de remettre du sens, du respect et de l&apos;humain au cœur de la vanlife.</p>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>
            Prêt à voyager<br />autrement ?
          </h2>
          <p className="text-emerald-100">Rejoignez une communauté qui partage vos valeurs et accédez à des lieux de confiance partout en France.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/devenir-membre">
              <Button className="bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8 py-3 rounded-xl font-semibold shadow-lg">
                Devenir Membre
              </Button>
            </Link>
            <Link href="/map">
              <Button className="border-2 border-white text-white hover:bg-emerald-700 text-base px-8 py-3 rounded-xl font-semibold">
                Voir les lieux
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}