"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {
  ArrowRight,
  MapPin,
  CreditCard,
  Award,
  Sparkles,
  Check,
  Shield,
  Smartphone,
  Loader2,
  Ban,
  CircleDollarSign,
  Meh,
  Map,
  Route,
  Handshake,
  BadgePercent,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { MemberDigitalAccess } from "@/components/MemberDigitalAccess";
import { MembershipCardPreview, MembershipJourneyNav } from "@/components/MembershipWelcome";

const AVANTAGES = [
  {
    icone: MapPin,
    titre: "Carte interactive complète",
    desc: "Accès à tous les 26 lieux labellisés sur notre carte privée, avec filtres, photos et avis membres.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icone: CreditCard,
    titre: "Jusqu'à -20% chez les partenaires",
    desc: "Réductions exclusives membres dans tous les campings, étapes nature et hébergements labellisés.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icone: Award,
    titre: "Défis, badges et récompenses",
    desc: "Gagne des points à chaque visite, débloque des niveaux et obtiens des avantages exclusifs.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icone: Smartphone,
    titre: "Application PWA en développement",
    desc: "Une fois disponible, elle pourra être installée depuis l’espace membre après connexion. La carte et la map restent accessibles sur internet dès maintenant.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

const CHIFFRES = [
  { valeur: "26", label: "lieux labellisés" },
  { valeur: "-20%", label: "jusqu'à chez les partenaires" },
  { valeur: "39€", label: "tarif annuel normal" },
  { valeur: "29€", label: "offre de cette année" },
];

const PROBLEMES = [
  { icon: Ban, title: "Spots bondés ou panneaux d'interdiction", text: "Vous cherchez un endroit tranquille, vous tombez sur un parking saturé ou un panneau « Stationnement interdit aux camping-cars ». Encore." },
  { icon: CircleDollarSign, title: "Plein tarif dans des campings qui ne comprennent pas la vanlife", text: "Tarif normal, emplacement standard, aucun regard particulier. Vous payez comme tout le monde — sans jamais être vraiment accueillis." },
  { icon: Meh, title: "Vous ne savez jamais si vous êtes bienvenus ou juste tolérés", text: "Certains gérants acceptent, d'autres font la grimace. L'incertitude à chaque arrivée, c'est épuisant." },
];

const ETAPES_ROAD_TRIP = [
  { icon: Map, eyebrow: "Votre espace membre", title: "Vous ouvrez votre espace membre et la MAP Label Vanlife", text: "Tous les lieux labellisés sur une carte interactive. Filtrez par région, type d'accueil et équipements. Des spots vérifiés, pas un annuaire." },
  { icon: Route, eyebrow: "Road trip & GPS · App native à venir", title: "Vous sélectionnez un ou plusieurs lieux pour créer votre road trip", text: "Composez votre itinéraire étape par étape, exportable vers votre GPS — et bientôt disponible dans notre application native." },
  { icon: Handshake, eyebrow: "Accueil garanti", title: "Vous arrivez ou réservez avec votre code ou votre carte membre", text: "Montrez votre carte à l'accueil ou communiquez le numéro membre lors de la réservation. Vous êtes attendu — pas simplement toléré." },
  { icon: BadgePercent, eyebrow: "Réduction immédiate", title: "Vous payez 10 à 20 % de moins", text: "La réduction prévue par chaque lieu s'applique après vérification de votre carte membre active." },
];

export default function DevenirMembrePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/member-login?mode=register&redirect=/devenir-membre"); return; }

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setLoading(false);
  };
  return (
    <div className="min-h-dvh bg-white">
      {/* ─── HERO ─── */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-white" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <MembershipJourneyNav active="join" />
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-xs font-semibold tracking-wide text-emerald-700">
              Membre Label Vanlife
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 leading-tight mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Deviens membre
            <br />
            <span className="text-emerald-500">29 € cette année</span>
          </h1>

          <p className="text-lg sm:text-xl text-neutral-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            Accès illimité à tous les lieux labellisés, réductions exclusives
            jusqu&apos;à -20% et défis pour pimenter tes voyages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/member-login?mode=register&redirect=/devenir-membre">
                          <Button variant="cta" size="lg" className="text-base px-10 py-4 h-auto shadow-lg shadow-amber-500/20">
                            Devenir membre — 29€
                            <ArrowRight className="h-5 w-5 ml-1" />
                          </Button>
                        </Link>
            <Link href="/explorer">
              <Button variant="secondary-dark" size="lg" className="text-base px-8 py-4 h-auto">
                Explorer les lieux
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-neutral-400">
            <Shield className="h-4 w-4" />
            <span>Renouvellement non automatique</span>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 py-20 text-white sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#c39960]">Vous reconnaissez-vous ?</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Ce que vivent la plupart des vanlifers</h2></div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">{PROBLEMES.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-white/5 p-6"><Icon className="h-7 w-7 text-[#c39960]" /><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p></article>)}</div>
        </div>
      </section>

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7445]">Imaginez votre prochain road trip</p><h2 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">En 4 étapes, du canapé à la nuit parfaite.</h2></div>
          <div className="relative mt-14 grid gap-6 lg:grid-cols-4">{ETAPES_ROAD_TRIP.map(({ icon: Icon, eyebrow, title, text }, index) => <article key={title} className="relative rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"><span className="absolute -top-3 right-5 grid h-7 w-7 place-items-center rounded-full bg-[#c39960] text-xs font-bold text-white">{index + 1}</span><Icon className="h-7 w-7 text-emerald-600" /><p className="mt-5 text-xs font-bold uppercase tracking-wider text-[#9a7445]">{eyebrow}</p><h3 className="mt-2 font-bold text-neutral-900">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-500">{text}</p></article>)}</div>
          <div className="mt-12 rounded-3xl bg-[#f7f1e8] p-8 text-center sm:p-10"><h3 className="text-2xl font-bold text-neutral-900">Et si votre prochain arrêt vous coûtait 10 à 20 % de moins ?</h3><p className="mt-3 text-neutral-600">C'est exactement ce que fait la carte membre. Dès la première nuit.</p><Link href="/member-login?mode=register&redirect=/devenir-membre"><Button variant="cta" size="lg" className="mt-6">Je renseigne mes informations <ArrowRight className="h-5 w-5" /></Button></Link></div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <MembershipCardPreview />
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7445]">Plus qu'une carte de spots</p>
            <h2 className="text-3xl font-bold text-neutral-900">Des lieux choisis pour la qualité de leur accueil</h2>
            <p className="leading-relaxed text-neutral-600">Chaque lieu est sélectionné, évalué et labellisé. Les membres retrouvent les informations pratiques, les photos et les avantages dans un espace sécurisé.</p>
            <MemberDigitalAccess compact />
          </div>
        </div>
      </div>

      {/* ─── CHIFFRES ─── */}
      <section className="border-y border-neutral-100 bg-neutral-50/50">
        <div className="max-w-6xl mx-auto px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {CHIFFRES.map((chiffre) => (
              <div key={chiffre.label} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {chiffre.valeur}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500 uppercase tracking-wider">
                  {chiffre.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AVANTAGES ─── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 space-y-3">
            <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">
              Tout inclus
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>
              Ce que ta carte annuelle débloque pour 29 € cette année
            </h2>
            <p className="text-neutral-500 max-w-xl mx-auto">
              Pas de surprise, pas de frais cachés. Un seul prix pour tout débloquer.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {AVANTAGES.map((avantage) => {
              const Icon = avantage.icone;
              return (
                <Card key={avantage.titre} variant="hover" className="p-6">
                  <CardContent className="space-y-4">
                    <div className={cn("inline-flex h-12 w-12 rounded-2xl items-center justify-center", avantage.bg)}>
                      <Icon className={cn("h-6 w-6", avantage.color)} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-800">{avantage.titre}</h3>
                      <p className="text-sm text-neutral-500 mt-2 leading-relaxed">{avantage.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRIX UNIQUE ─── */}
            <section className="py-20 bg-gradient-to-b from-emerald-50/30 to-white">
              <div className="max-w-2xl mx-auto px-6">
                <div className="text-center mb-10 space-y-3">
                  <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-emerald-500">
                    Un seul abonnement
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                    Choisis la simplicité
                  </h2>
                </div>

                <Card className="relative overflow-hidden border-emerald-200/50 shadow-xl shadow-emerald-500/5">
                  <CardContent className="p-8 sm:p-10">
                    <div className="text-center space-y-6">
                      <div>
                        <p className="text-sm text-neutral-500 uppercase tracking-wider mb-1">
                          Membre Label Vanlife
                        </p>
                        <div className="flex items-baseline justify-center gap-2">
                          <span className="text-2xl text-neutral-400 line-through">39€</span>
                          <span className="text-5xl sm:text-6xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>29€</span>
                          <span className="text-lg text-neutral-400 font-medium">cette année</span>
                        </div>
                        <p className="text-sm text-emerald-500 font-semibold mt-1">
                          Moins de 2,50€ par mois
                        </p>
                      </div>

                      <div className="border-t border-neutral-100 pt-6 space-y-3">
                        {[
                          "Carte interactive 26 lieux",
                          "Réductions -10% à -20%",
                          "Défis, badges, niveaux",
                          "Carte membre numérique accessible en ligne",
                          "Application PWA en développement",
                          "Accès aux road trips membres",
                          "Renouvellement non automatique",
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-3 text-sm text-neutral-600">
                            <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4">
                        <Button
                          variant="cta"
                          size="lg"
                          className="w-full text-base py-4 h-auto shadow-lg shadow-amber-500/20 gap-2"
                          onClick={handleCheckout}
                          disabled={loading}
                        >
                          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
                          Je deviens membre — 29€
                        </Button>
                        <p className="text-xs text-neutral-400 mt-3">
                                            Paiement sécurisé Stripe · Renouvellement non automatique
                                          </p>
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                  <p className="text-center text-xs text-neutral-400 pt-2">Une question ? <a href="mailto:contact@labelvanlife.com" className="text-emerald-600 underline">contact@labelvanlife.com</a></p>
              </div>
            </section>

      {/* ─── CTA FINAL ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-700 to-emerald-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            La communauté t&apos;attend
          </h2>
          <p className="text-lg text-white/70 mb-8 max-w-md mx-auto">
            Offre de cette année : 29 € au lieu de 39 € pour voyager plus simplement et profiter des avantages du réseau.
          </p>
          <Link href="/member-login?mode=register&redirect=/devenir-membre">
                      <Button variant="cta" size="lg" className="text-base px-10 shadow-xl shadow-amber-500/25">
                        Je deviens membre — 29€ →
                        <ArrowRight className="h-5 w-5 ml-1" />
                      </Button>
                    </Link>
        </div>
      </section>
    </div>
  );
}
