"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Shield, Heart, Moon, Quote, Compass, ChevronDown, MapPin, Smartphone, Percent, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    camping: "Camping", parking: "Parking", etape_nature: "Étape Nature",
    hebergement_insolite: "Insolite", restaurant: "Restaurant", activite: "Activité",
  };
  return labels[type] || type;
}

export default function Home() {
  const labelledPlaces = ENRICHED_LIEUX.filter((l) => l.status === "actif");
  const featured = labelledPlaces.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Image
          src="/images/hero-label-vanlife.png"
          alt="Van aménagé au bord d'un lac au coucher du soleil"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/45" />
        <div className="relative z-10 w-full px-6 sm:px-8 lg:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-white/20">
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-white/80">1er label pour vanlifers</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-3xl mx-auto leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              La vanlife a enfin<br />son label.
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Des lieux calmes, respectueux et vraiment adaptés à la vanlife — sélectionnés et labellisés, avec <strong className="text-amber-300">10 à 20% de réduction</strong> pour nos membres.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/devenir-membre">
                <Button variant="cta" size="lg" className="text-base px-10 shadow-xl shadow-amber-500/25">
                  Rejoindre la communauté <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Link href="/explorer">
                <Button variant="primary" className="bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white/20 text-base px-8 rounded-xl">
                  Découvrir la map
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <span className="text-xs tracking-[0.2em] uppercase text-white/30">Découvrir</span>
          <ChevronDown className="h-5 w-5 text-white/40 animate-bounce" />
        </div>
      </section>

      <section className="relative overflow-hidden bg-neutral-950 py-20 text-white sm:py-28">
        <div className="absolute -right-20 -top-28 h-96 w-96 rounded-full bg-[#c39960]/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc59f]">Pourquoi devenir membre ?</span>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">Voyagez avec un réseau de confiance, pas avec une simple liste de spots.</h2>
            <p className="mt-5 max-w-xl leading-relaxed text-white/60">La carte membre réunit les lieux réellement engagés pour la vanlife et toutes les informations nécessaires pour choisir votre prochaine étape sereinement.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/devenir-membre"><Button variant="cta" size="lg">Découvrir la carte membre <ArrowRight className="h-4 w-4" /></Button></Link>
              <p className="text-sm text-white/60"><span className="mr-2 line-through">39 €</span><strong className="text-white">29 € cette année</strong><br /><span className="text-xs">Renouvellement non automatique</span></p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { icon: MapPin, value: "26", title: "lieux déjà labellisés", text: "Des fiches complètes avec photos, services et informations pratiques." },
              { icon: Percent, value: "10 à 20%", title: "d'avantage membre", text: "Le pourcentage est public ; le code éventuel reste dans votre espace privé." },
              { icon: Shield, value: "Vérifiés", title: "selon une vraie charte", text: "Accueil, environnement, confort et tranquillité sont évalués." },
              { icon: Smartphone, value: "Partout", title: "sur internet puis prochainement en application mobile", text: "Votre carte numérique et la map vous suivent partout sur votre téléphone." },
            ].map((item) => { const Icon = item.icon; return (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-sm">
                <Icon className="h-5 w-5 text-[#dfc59f]" />
                <p className="mt-5 text-2xl font-bold">{item.value}</p>
                <h3 className="mt-1 font-semibold text-white/90">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/50">{item.text}</p>
              </div>
            ); })}
          </div>
        </div>
      </section>

      {/* ===== COMMENT ÇA MARCHE ===== */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">De la carte au séjour</span>
            <h2 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">Préparez, réservez, profitez.</h2>
            <p className="mt-4 text-neutral-500">Tout est conçu pour vous faire gagner du temps avant et pendant le voyage.</p>
          </div>
          <div className="relative grid gap-5 md:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-8 hidden h-px bg-gradient-to-r from-[#c39960]/20 via-[#c39960] to-[#c39960]/20 md:block" />
            {[
              { num: "01", title: "J'active mon espace", desc: "Je crée mon compte et retrouve immédiatement ma carte membre numérique ainsi que mon accès à la map privée." },
              { num: "02", title: "Je prépare mon étape", desc: "Je compare les lieux, leurs équipements et leurs conditions, puis je réserve selon les modalités indiquées." },
              { num: "03", title: "Je profite de l'avantage", desc: "Sur place, je présente ma carte à jour. En ligne, j'utilise le code privé lorsque le lieu en propose un." },
            ].map((step) => (
              <div key={step.num} className="relative rounded-2xl border border-neutral-200 bg-white p-6 pt-5 text-center shadow-sm sm:p-8">
                <span className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#c39960] text-sm font-bold text-white shadow-md">{step.num}</span>
                <h3 className="mt-6 text-lg font-bold text-neutral-900">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-500">{step.desc}</p>
                <Check className="mx-auto mt-5 h-5 w-5 text-emerald-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== L'ESPRIT LABEL VANLIFE ===== */}
      <section className="py-20 sm:py-24 bg-emerald-50/30">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500 mb-4">L'esprit Label Vanlife</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-900 leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Partir sans savoir où tu vas.<br />
              <span className="text-emerald-500">MAIS</span> Savoir que tu seras bien accueilli.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <Compass className="w-6 h-6" />, title: "Liberté vraie", desc: "Pas de réservation obligatoire. Tu arrives, tu montres ta carte, tu es le bienvenu — et tu bénéficies de réductions." },
              { icon: <Heart className="w-6 h-6" />, title: "Confiance mutuelle", desc: "Les hôtes aiment la vanlife et t'accueillent en conséquence et en connaissance. Tu sais ce qui t'attend. Fini les mauvaises surprises." },
              { icon: <Star className="w-6 h-6" />, title: "Authenticité", desc: "Des lieux labellisés Label Vanlife, contrôlés par des vanlifers qui respectent la philosophie vanlife." },
              { icon: <Moon className="w-6 h-6" />, title: "Nuit tranquille", desc: "Zéro parking sauvage. Zéro voisin mécontent. Juste le silence et les étoiles." },
            ].map((item) => (
              <Card key={item.title} className="p-5 text-center space-y-2">
                <div className="inline-flex h-10 w-10 rounded-xl bg-emerald-50 items-center justify-center text-emerald-500">{item.icon}</div>
                <h3 className="font-bold text-neutral-900 text-sm">{item.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center space-y-2">
            <p className="text-sm text-neutral-500 italic">— Des lieux qui t'attendent · Des prix adaptés à la vanlife · Des hôtes qui comprennent ta façon de voyager</p>
            <p className="text-sm font-semibold text-emerald-600">👉 Tu arrives. Tu montres ta carte. Tu es chez toi.</p>
            <p className="text-sm font-bold text-neutral-800">La vanlife redevient simple.</p>
            <p className="text-xs text-neutral-400">— Clément, fondateur</p>
          </div>
        </div>
      </section>

      {/* ===== LIEUX À LA UNE ===== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500 mb-2">Nos lieux</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Les lieux labellisés Label Vanlife</h2>
            </div>
          </div>
          <p className="text-sm text-neutral-500 mb-8">Ces campings et lieux d'accueil ont été contrôlés et validés par la communauté vanlife. Réductions exclusives, accueil premium et expériences authentiques garanties.</p>
          <p className="text-xs text-neutral-400 mb-8">{labelledPlaces.length} lieux labellisés — présentez votre carte membre pour profiter des réductions 🎁</p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((lieu) => (
              <article
                key={lieu.id}
                className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 block"
              >
                <Link href={`/lieux/${lieu.id}`} className="relative block h-44 bg-gradient-to-br from-emerald-50 to-neutral-50 overflow-hidden" aria-label={`Découvrir ${lieu.nom}`}>
                  <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${lieu.photoUrl})` }} />
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[10px] font-semibold px-2.5 py-1 rounded-full shadow-sm text-emerald-700">{getTypeLabel(lieu.type)}</span>
                  {lieu.discountPercent > 0 && (
                    <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">-{lieu.discountPercent}%</span>
                  )}
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    {lieu.logoUrl ? (
                      <Image src={lieu.logoUrl} alt="" width={40} height={40} className="h-10 w-10 rounded-xl object-contain bg-white border border-neutral-200 p-1 shadow-sm shrink-0" />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold shrink-0 shadow-sm border border-emerald-100">{lieu.nom.charAt(0)}</div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-neutral-900 line-clamp-1"><Link href={`/lieux/${lieu.id}`} className="hover:text-emerald-700">{lieu.nom}</Link></h3>
                      <p className="text-xs text-neutral-400">{lieu.ville} · {lieu.region}</p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{lieu.description}</p>
                  <div className="pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-emerald-600 font-semibold">-{lieu.discountPercent}% pour les membres</span>
                      <Link href="/devenir-membre">
                        <Button variant="cta" size="sm" className="text-[10px] h-7 px-3 gap-1">Devenir membre <ArrowRight className="h-3 w-3" /></Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="flex items-center justify-center mt-10">
            <Link href="/explorer">
              <Button variant="secondary-dark" size="lg" className="gap-2">Découvrir tous les lieux <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
          <p className="text-center text-xs text-neutral-400 mt-3">697 lieux identifiés à travers la France</p>
        </div>
      </section>

      {/* ===== TÉMOIGNAGE ===== */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-4">
          <Image src="/images/people/helene-family-vanlifers.png" alt="Helene Family Vanlifers en voyage" width={72} height={72} className="mx-auto h-18 w-18 rounded-full border-2 border-white/70 object-cover shadow-lg" />
          <Quote className="h-8 w-8 text-emerald-200 mx-auto" />
          <p className="text-xl text-white italic leading-relaxed">&ldquo;LABEL VANLIFE a changé notre façon de voyager. Plus de stress, plus de mauvaises surprises.&rdquo;</p>
          <p className="text-sm text-emerald-200 font-semibold">— Helene Family Vanlifers</p>
        </div>
      </section>

      {/* ===== VALEURS ===== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">Nos valeurs</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Une vanlife plus respectueuse</h2>
          <p className="text-neutral-500 max-w-xl mx-auto">LABEL VANLIFE n'est pas une carte à spots. C'est une communauté de confiance, où voyageurs et lieux partagent les mêmes valeurs.</p>
          <div className="grid sm:grid-cols-4 gap-4 mt-8">
            {[
              { icon: <Moon className="w-6 h-6" />, title: "Calme", desc: "Des lieux paisibles, loin du tourisme de masse" },
              { icon: <Heart className="w-6 h-6" />, title: "Respect", desc: "Des voyageurs conscients et discrets" },
              { icon: <Star className="w-6 h-6" />, title: "Qualité", desc: "Des rencontres authentiques et humaines" },
              { icon: <Shield className="w-6 h-6" />, title: "Confiance", desc: "Un réseau vérifié et bienveillant" },
            ].map((v) => (
              <Card key={v.title} className="p-5 text-center space-y-2">
                <div className="inline-flex h-10 w-10 rounded-xl bg-emerald-50 items-center justify-center text-emerald-500 mx-auto">{v.icon}</div>
                <h3 className="font-bold text-neutral-900 text-sm">{v.title}</h3>
                <p className="text-xs text-neutral-500">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HISTOIRE DU FONDATEUR ===== */}
      <section className="py-20 sm:py-24 bg-neutral-50">
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">LABEL VANLIFE est né d'un constat simple</span>
          <div className="space-y-4 text-sm text-neutral-600">
            <p>🚐 Les vanlifers cherchent des lieux où ils sont les bienvenus.</p>
            <p>🏡 Les propriétaires de lieux cherchent une clientèle respectueuse.</p>
            <p className="text-neutral-400 italic">Mais il n'existait aucun pont entre les deux...</p>
            <p className="text-xs text-neutral-300">Pas de label de confiance · Pas de réseau structuré · Pas de garantie</p>
            <p className="text-lg font-bold text-emerald-600">✨ LABEL VANLIFE crée ce lien.</p>
            <p className="text-neutral-500">Un label qui sélectionne, vérifie et met en relation des lieux engagés avec des vanlifers responsables.</p>
          </div>
          <div className="mt-8 flex items-start gap-4 rounded-2xl border border-neutral-100 bg-white p-6 text-left">
            <Image src="/images/people/clement-goetgheluck.jpg" alt="Clément Goetgheluck, fondateur de Label Vanlife" width={64} height={64} className="h-16 w-16 shrink-0 rounded-full object-cover shadow-sm" />
            <p className="text-xs text-neutral-500 leading-relaxed">
              <strong>Clément Goetgheluck</strong> — Fondateur de LABEL VANLIFE — Vanlifer depuis +15 ans et ayant voyagé sur 5 continents, j'ai vu les spots sauvages passer de propres à dégueulasses, les voisinages d'accueillants à hostiles, les panneaux d'interdiction fleurir partout. Et côté campings ? Souvent déçu... On préférait dormir sur un parking. C'est de ce constat qu'est né LABEL VANLIFE. Grâce également à mon expérience d'ancien directeur de camping, j'essaie de recréer cette harmonie pour le plaisir du voyage en van : une map de "spots" sélectionnés, vérifiés et accueillants.
            </p>
          </div>
          <Link href="/manifeste">
            <Button variant="ghost" size="sm" className="gap-2 text-emerald-600">Lire le manifeste <ArrowRight className="h-3 w-3" /></Button>
          </Link>
        </div>
      </section>

      {/* ===== POUR PROS ===== */}
      <section className="py-20 bg-emerald-600">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs font-semibold">Pour les propriétaires & directeurs</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Accueillez les meilleurs voyageurs. Développez votre activité.</h2>
          <Link href="/labellisation">
            <Button variant="primary" className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl font-semibold">Voir plus de détails</Button>
          </Link>
        </div>
      </section>

      {/* ===== GUIDES ===== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500 mb-2">Guides & destinations</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Tout pour votre vanlife</h2>
            <p className="text-sm text-neutral-500 mt-2">Conseils pratiques, destinations, itinéraires — nos guides complets pour vivre la vanlife sereinement.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🚐", title: "Guide Vanlife France", desc: "Tout ce qu'il faut savoir pour se lancer dans la vanlife en France." },
              { icon: "👨‍👩‍👧‍👦", title: "Vanlife en famille", desc: "Voyager en van avec des enfants : conseils, itinéraires, lieux adaptés." },
              { icon: "🏕️", title: "Campings van-friendly", desc: "Les critères d'un bon camping pour vanlifers et notre sélection labellisée." },
              { icon: "🌿", title: "Slow travel & vanlife", desc: "Voyager moins vite pour profiter davantage — la philosophie du slow travel." },
              { icon: "🗺️", title: "Road trips en van", desc: "Les meilleurs itinéraires van à travers toute la France." },
              { icon: "🌙", title: "Dormir en van en France", desc: "Où dormir légalement, les aires, campings et spots les plus beaux." },
              { icon: "🧭", title: "Vanlife solo", desc: "Voyager seul(e) en van : sécurité, choix du van, communauté et itinéraires." },
              { icon: "🌊", title: "Vanlife par région", desc: "Bretagne, Provence, Ardèche, Pyrénées, Landes, Alpes — nos guides régionaux." },
            ].map((guide) => (
              <Card key={guide.title} variant="interactive" className="p-4 space-y-2">
                <span className="text-2xl block">{guide.icon}</span>
                <h3 className="text-sm font-bold text-neutral-900">{guide.title}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2">{guide.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="py-20 bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700">
        <div className="max-w-2xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "Outfit, sans-serif" }}>Prêt pour l'aventure ?</h2>
          <p className="text-emerald-100"><span className="line-through opacity-70">39€</span> <strong>29€ pour cette année</strong>, sans renouvellement automatique.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/devenir-membre">
              <Button variant="primary" className="bg-white text-emerald-700 hover:bg-emerald-50 text-base px-8 py-3 rounded-xl font-semibold shadow-lg">
                Je deviens membre <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/explorer">
              <Button variant="primary" className="border-2 border-white text-white hover:bg-emerald-700 text-base px-8 py-3 rounded-xl font-semibold">
                Découvrir les lieux
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
