"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Sparkles, MapPin, BadgeCheck, Percent, Shield, Check, Star, Heart, Users, TreePine, Warehouse, Home
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LabellisationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 sm:pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* ===== HERO ===== */}
        <section className="py-12 sm:py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 rounded-full text-amber-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              DEVENIEZ LIEU LABELLISÉ
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 max-w-3xl mx-auto leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Attirez des vanlifers qualitatifs
            </h1>
            <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto leading-relaxed">
              Un réseau qui transforme vos visiteurs en clients fidèles. Rejoignez le premier label qui connecte les hôtes de qualité avec des voyageurs responsables et engagés.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg" className="gap-2 text-base px-8" onClick={() => router.push("/labellisation/candidature")}>
                Candidater au Label <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>

        {/* ===== EXPÉRIENCE DU FONDATEUR ===== */}
        <section className="pb-10 sm:pb-14">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="absolute -right-16 -top-20 h-52 w-52 rounded-full bg-emerald-50" aria-hidden="true" />
            <div className="relative grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-8">
              <div className="mx-auto md:mx-0">
                <Image
                  src="/images/people/clement-goetgheluck.jpg"
                  alt="Clément Goetgheluck, fondateur de Label Vanlife et ancien directeur de camping"
                  width={112}
                  height={112}
                  className="h-28 w-28 rounded-2xl border-4 border-white object-cover shadow-lg"
                />
              </div>
              <div className="text-center md:text-left">
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">Une expertise de terrain</span>
                <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Pensé par un vanlifer, avec l’expérience d’un directeur de camping
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600 sm:text-base">
                  J’ai dirigé un camping et je voyage en van depuis plus de 15 ans. Je connais vos réalités : la saisonnalité, les réservations, l’accueil, les imprévus et la nécessité de préserver la tranquillité de votre établissement. Label Vanlife est né pour créer une relation simple et équilibrée entre des lieux de qualité et des voyageurs respectueux.
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-2 md:justify-start">
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">Ancien directeur de camping</span>
                  <span className="rounded-full bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-[#8b673d]">Vanlifer depuis plus de 15 ans</span>
                  <span className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-700">Vision terrain & établissement</span>
                </div>
                <p className="mt-5 text-sm font-bold text-neutral-900">Clément Goetgheluck <span className="font-normal text-neutral-500">· Fondateur de Label Vanlife</span></p>
              </div>
            </div>
          </div>
        </section>

        {/* ===== CHIFFRES ===== */}
        <section className="py-8 border-y border-neutral-100">
          <div className="grid grid-cols-3 gap-8 text-center max-w-lg mx-auto">
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-900">27</p>
              <p className="text-xs text-neutral-500 mt-1">Lieux labellisés</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-900">150</p>
              <p className="text-xs text-neutral-500 mt-1">Lieux en cours</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-bold text-emerald-600">+30%</p>
              <p className="text-xs text-neutral-500 mt-1">Résa. directes</p>
            </div>
          </div>
        </section>

        {/* ===== RÉSEAU EN CROISSANCE ===== */}
        <section className="py-12 text-center">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Réseau en croissance</span>
        </section>

        {/* ===== BÉNÉFICES ===== */}
        <section id="benefices" className="py-12 sm:py-16">
          <div className="text-center mb-12 space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Les bénéfices concrets</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Ce que le label vous apporte</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Des résultats mesurables pour votre activité. Pas de promesses vagues, des avantages concrets.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-emerald-500 mb-2">30%</div>
              <h3 className="font-bold text-neutral-900 text-sm">Jusqu'à 30% de réservations directes</h3>
              <p className="text-xs text-neutral-500 mt-2">Nos membres réservent en direct, sans commission de plateforme. Vous gardez la marge.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-emerald-500 mb-2">×10</div>
              <h3 className="font-bold text-neutral-900 text-sm">Visibilité décuplée</h3>
              <p className="text-xs text-neutral-500 mt-2">Votre lieu est mis en avant sur notre carte interactive, notre site et nos réseaux auprès de milliers de vanlifers.</p>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-4xl font-black text-emerald-500 mb-2">95%</div>
              <h3 className="font-bold text-neutral-900 text-sm">Clientèle qualitative et fidèle</h3>
              <p className="text-xs text-neutral-500 mt-2">Nos membres sont engagés et respectueux. Ils reviennent et vous recommandent.</p>
            </Card>
          </div>
        </section>

        {/* ===== TROIS PILIERS ===== */}
        <section className="py-12 sm:py-16">
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="p-6 text-center space-y-3">
              <div className="inline-flex h-14 w-14 rounded-2xl items-center justify-center bg-emerald-50 text-emerald-500 mx-auto">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-neutral-900">MAP</h3>
              <p className="text-sm text-neutral-500">Présence sur notre carte exclusive. Accessible uniquement aux membres. Votre lieu bénéficie d'une fiche dédiée avec photos, avis et itinéraire.</p>
            </Card>
            <Card className="p-6 text-center space-y-3">
              <div className="inline-flex h-14 w-14 rounded-2xl items-center justify-center bg-emerald-50 text-emerald-500 mx-auto">
                <BadgeCheck className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-neutral-900">LABEL</h3>
              <p className="text-sm text-neutral-500">Recevez votre badge numérique LABEL VANLIFE à afficher sur vos supports en ligne. Un gage de confiance pour tous les voyageurs.</p>
            </Card>
            <Card className="p-6 text-center space-y-3">
              <div className="inline-flex h-14 w-14 rounded-2xl items-center justify-center bg-emerald-50 text-emerald-500 mx-auto">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-neutral-900">RÉSEAU</h3>
              <p className="text-sm text-neutral-500">Rejoignez un réseau de lieux qui s'entraident, partagent leurs bonnes pratiques et grandissent ensemble.</p>
            </Card>
          </div>
        </section>

        {/* ===== AVANTAGES LISTE ===== */}
        <section className="py-12 sm:py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Heart className="w-5 h-5" />, title: "Clientèle respectueuse et engagée", desc: "Chaque membre signe une charte de bonne conduite. En cas de non-respect, vous pouvez signaler le voyageur et nous lui retirerons sa carte membre." },
              { icon: <Percent className="w-5 h-5" />, title: "Zéro commission sur vos réservations", desc: "Contrairement aux plateformes, nous ne prenons aucune commission. Vos revenus restent les vôtres." },
              { icon: <Star className="w-5 h-5" />, title: "Mise en avant auprès de la communauté", desc: "Votre lieu est recommandé directement à notre communauté de vanlifers engagés, sur notre carte et nos réseaux." },
              { icon: <Shield className="w-5 h-5" />, title: "Qualité plutôt que quantité", desc: "Vous gardez le contrôle sur le nombre de visiteurs. Nous privilégions les séjours de qualité aux flux de masse." },
              { icon: <TreePine className="w-5 h-5" />, title: "Impact local positif", desc: "Favorisez l'économie locale et les circuits courts. Nos membres consomment local et recommandent les commerces alentour." },
              { icon: <BadgeCheck className="w-5 h-5" />, title: "Badge de labellisation officiel", desc: "Recevez votre badge numérique LABEL VANLIFE à afficher sur vos supports en ligne." },
            ].map((item) => (
              <Card key={item.title} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 text-emerald-500">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ===== POURQUOI NOUS REJOINDRE ===== */}
        <section className="py-12 sm:py-16">
          <div className="text-center mb-10 space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Pourquoi nous rejoindre</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>Le label qui fait la différence</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="p-6">
              <p className="text-sm text-neutral-600 leading-relaxed">
                LABEL VANLIFE n'est pas une plateforme de réservation de plus. C'est un réseau de confiance mutuelle où chaque membre — lieu comme voyageur — s'engage à respecter une charte de qualité. En devenant partenaire, vous rejoignez un mouvement pour une vanlife plus durable et mieux acceptée par les territoires.
              </p>
            </Card>
            <Card className="p-6 bg-emerald-50/50 border-emerald-100">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Charte de confiance mutuelle</h3>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                    Chaque voyageur porteur de la carte membre LABEL VANLIFE signe une charte de bonne conduite. En cas de manquement, vous pouvez signaler le voyageur directement. Après vérification, nous pouvons retirer sa carte membre.
                  </p>
                  <p className="text-xs text-emerald-600 font-semibold mt-2">Excellence garantie : des voyageurs et des lieux de qualité, toujours.</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ===== CE QUI NOUS DISTINGUE ===== */}
        <section className="py-12 sm:py-16 bg-white rounded-3xl px-6 sm:px-8 border border-neutral-100">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Ce qui nous distingue</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              "Audit personnalisé de votre lieu par nos experts",
              "Accompagnement et conseils pour optimiser l'accueil vanlife",
              "Badge numérique officiel LABEL VANLIFE pour votre établissement",
              "Fiche dédiée sur notre carte interactive exclusive",
              "Indiquez des emplacements spécifiques : vanlife couple, vanlife famille, solo...",
              "Système de signalement mutuel pour garantir l'excellence du réseau",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-neutral-600">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ===== OUVERT À TOUS ===== */}
        <section className="py-12 sm:py-16">
          <div className="text-center mb-10 space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Ouvert à tous</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>À qui s'adresse le label ?</h2>
            <p className="text-neutral-500 max-w-xl mx-auto">Que vous soyez professionnel ou particulier, si vous avez un lieu de qualité, le label est fait pour vous.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <TreePine className="w-6 h-6" />, title: "Campings Nature", desc: "Établissements à taille humaine privilégiant le calme et l'authenticité." },
              { icon: <Warehouse className="w-6 h-6" />, title: "Fermes & Domaines", desc: "Producteurs et propriétaires ouvrant leurs terres aux voyageurs." },
              { icon: <Home className="w-6 h-6" />, title: "Gîtes & Chambres", desc: "Hébergements souhaitant accueillir une clientèle vanlife de qualité." },
              { icon: <Users className="w-6 h-6" />, title: "Particuliers", desc: "Propriétaires d'un terrain souhaitant partager leur coin de paradis." },
            ].map((item) => (
              <Card key={item.title} className="p-5 text-center">
                <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-50 items-center justify-center text-emerald-500 mb-3">{item.icon}</div>
                <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
                <p className="text-xs text-neutral-500 mt-1">{item.desc}</p>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-neutral-500 mb-4">Et aussi tous les professionnels qui souhaitent rejoindre l'aventure :</p>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-neutral-600">
              {["Restaurants", "Snacks", "Garagistes", "Concessionnaires", "Accessoiristes", "Boutiques goodies", "Excursions", "Activités sportives", "Visites guidées", "Producteurs locaux", "Caves & vignobles", "Artisans"].map((item) => (
                <span key={item} className="px-3 py-1.5 bg-white rounded-full border border-neutral-200">{item}</span>
              ))}
            </div>
            <p className="text-sm font-semibold text-emerald-600 mt-4">En bref, presque tous ceux qui le souhaitent peuvent candidater !</p>
          </div>
        </section>

        {/* ===== EN RÉSUMÉ ===== */}
        <section className="py-12">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">En résumé</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 mt-2" style={{ fontFamily: "Outfit, sans-serif" }}>Pourquoi les lieux nous choisissent</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-emerald-500">0€</p>
              <p className="text-sm text-neutral-500 mt-2">de commission sur vos réservations</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-emerald-500">+30%</p>
              <p className="text-sm text-neutral-500 mt-2">de réservations directes en moyenne</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-4xl font-black text-emerald-500">100%</p>
              <p className="text-sm text-neutral-500 mt-2">de vos revenus gardés</p>
            </Card>
          </div>
        </section>

        {/* ===== CTA FINAL ===== */}
        <section className="relative py-20 sm:py-24 mb-8 overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
          <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
            <span className="inline-block px-4 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-semibold tracking-wide mb-4">Offre exceptionnelle 2026</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Prêt à développer votre activité ?</h2>
            <p className="text-white/70 mb-8">Candidatez dès maintenant. Notre équipe vous recontactera sous 10 jours pour échanger sur votre lieu.</p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs"><Check className="w-3 h-3" /> Sans engagement</span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs"><Check className="w-3 h-3" /> 0% de commission</span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs"><Check className="w-3 h-3" /> Année civile 2026</span>
            </div>
            <Button variant="cta" size="lg" className="text-base px-10 shadow-xl shadow-amber-500/25" onClick={() => router.push("/labellisation/candidature")}>
              Remplir le formulaire de candidature <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <p className="text-white/60 text-xs mt-4">Dépôt gratuit · Étude complète à 110 € au lieu de 220 € jusqu'au 31 décembre 2026 · Remboursement intégral en cas de non-conformité.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
