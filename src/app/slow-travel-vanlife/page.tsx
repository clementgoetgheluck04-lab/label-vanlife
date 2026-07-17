import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bike, ChevronRight, Clock3, Compass, HeartHandshake, Leaf, MapPin, ShoppingBasket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "Slow travel vanlife : voyager en van sans se presser";
const description = "Découvrez les six principes du slow travel en van : rester plus longtemps, rouler moins, consommer local et laisser une place réelle à l'imprévu.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/slow-travel-vanlife" },
  keywords: ["slow travel vanlife", "voyage lent en van", "slow tourisme", "road trip van responsable"],
  openGraph: {
    title,
    description,
    type: "article",
    url: "/slow-travel-vanlife",
    images: [{ url: "/images/hero-label-vanlife.png", width: 1536, height: 1024, alt: "Van au bord d'un lac au coucher du soleil" }],
  },
};

const principles = [
  { icon: Clock3, title: "Rester plutôt que passer", text: "Accordez plusieurs nuits à une étape lorsque le lieu s'y prête. La boulangerie de l'arrière-rue, un sentier discret ou une rencontre ne se révèlent pas toujours le premier soir." },
  { icon: Bike, title: "Conduire peu, explorer autrement", text: "Laissez le van posé et partez à pied, à vélo ou en kayak. Moins de kilomètres signifie généralement moins de carburant, moins de fatigue et davantage de détails observés." },
  { icon: Sparkles, title: "Choisir la qualité", text: "Quelques lieux vécus pleinement laissent souvent plus de souvenirs qu'une longue liste de spots survolés. Le voyage ne devrait pas devenir une série de cases à cocher." },
  { icon: ShoppingBasket, title: "Manger et acheter local", text: "Marchés, fermes, artisans et petites adresses font circuler les dépenses dans le territoire visité et créent des occasions de rencontre qui n'existent pas sur une aire anonyme." },
  { icon: Compass, title: "Accueillir l'imprévu", text: "Une météo changeante, une route fermée ou une recommandation locale peuvent modifier l'itinéraire. Un planning souple transforme ces écarts en possibilités plutôt qu'en problèmes." },
  { icon: HeartHandshake, title: "Choisir des lieux qui partagent cette vision", text: "Privilégiez les accueils où l'étape est une expérience : informations locales, cadre agréable, échange humain et conditions suffisamment claires pour profiter sans se presser." },
] as const;

const comparison = [
  ["Durée par lieu", "Une nuit ou moins", "Plusieurs nuits"],
  ["Distance quotidienne", "Longues liaisons répétées", "Courtes liaisons ou journée sans rouler"],
  ["Carburant", "Dépense généralement élevée", "Dépense généralement réduite"],
  ["Rencontres locales", "Ponctuelles", "Plus nombreuses et durables"],
  ["Organisation", "Planning serré", "Cadre souple et improvisation"],
  ["Fatigue", "Déplacements fréquents", "Temps de repos plus régulier"],
  ["Rapport au lieu", "Consommer une destination", "Comprendre un territoire"],
] as const;

const faqs = [
  { question: "Combien de nuits faut-il rester pour voyager lentement ?", answer: "Il n'existe pas de minimum universel. Deux, trois ou davantage de nuits permettent souvent de réduire la fatigue et de découvrir les environs sans reprendre immédiatement la route. Adaptez la durée à la saison, au lieu et aux besoins de chacun." },
  { question: "Le slow travel coûte-t-il moins cher ?", answer: "Rouler moins réduit généralement la consommation de carburant et certains frais liés aux déplacements. Le budget final dépend néanmoins du véhicule, du type d'hébergement, des activités et de la manière de consommer sur place." },
  { question: "Comment trouver des lieux adaptés au slow travel ?", answer: "Cherchez des étapes avec des activités accessibles à pied ou à vélo, un cadre agréable, des services utiles et un accueil favorable aux séjours de plusieurs nuits. Les fiches Label Vanlife permettent de préparer cette sélection avant le départ." },
] as const;

export default function SlowTravelVanlifePage() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description, image: "https://labelvanlife.com/images/hero-label-vanlife.png", author: { "@type": "Organization", name: "Label Vanlife" }, publisher: { "@type": "Organization", name: "Label Vanlife" }, mainEntityOfPage: "https://labelvanlife.com/slow-travel-vanlife" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-neutral-400"><Link href="/" className="hover:text-emerald-700">Accueil</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-neutral-700">Slow travel vanlife</span></nav>
      </div>

      <header className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-16">
        <div className="animate-fade-in-up"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7445]">Philosophie du voyage</p><h1 className="mt-4 text-4xl font-bold leading-[1.08] text-neutral-950 sm:text-6xl">Slow travel vanlife : voyager sans se presser</h1><p className="mt-5 text-lg leading-8 text-neutral-600">Dans un monde qui va trop vite, le van peut devenir un outil de ralentissement. Pas une façon de voir plus — mais de voir mieux.</p><div className="mt-7 flex flex-wrap gap-2">{["Moins de route", "Plus de rencontres", "Économie locale", "Voyage responsable"].map((tag) => <span key={tag} className="rounded-full border border-[#c39960]/30 bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-[#7d5d38]">{tag}</span>)}</div></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-900/15"><Image src="/images/hero-label-vanlife.png" alt="Van posé au bord d'un lac au coucher du soleil" fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /></div>
      </header>

      <article className="mx-auto max-w-5xl space-y-20 px-6">
        <section className="mx-auto max-w-3xl text-lg leading-8 text-neutral-600"><p>La vanlife peut facilement reproduire la vitesse du quotidien : autoroutes, kilomètres, photos qui défilent et spots consommés les uns après les autres. Une autre manière de voyager existe, plus lente et plus attentive.</p><p className="mt-4">Elle accepte de ne pas savoir exactement où l'on sera dans trois jours. Elle donne au territoire le temps de devenir autre chose qu'un décor.</p><blockquote className="mt-8 rounded-r-2xl border-l-4 border-[#c39960] bg-[#f7f1e8] px-7 py-6 text-xl font-semibold leading-8 text-neutral-900">« Le slow travel en van, ce n'est pas aller moins loin. C'est aller plus profond. »</blockquote><p className="mt-6">Label Vanlife s'inscrit dans cette philosophie : mettre en avant des lieux où l'étape a du sens, où l'on peut découvrir les environs et où l'accueil ne se résume pas à une place de stationnement.</p></section>

        <section>
          <div className="text-center"><Leaf className="mx-auto h-9 w-9 text-emerald-600" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Changer de rythme</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Les 6 principes du slow travel en vanlife</h2></div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">{principles.map(({ icon: Icon, title: principleTitle, text }, index) => <div key={principleTitle} className="micro-card relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6"><span className="absolute right-5 top-3 text-5xl font-black text-neutral-100">{String(index + 1).padStart(2, "0")}</span><span className="micro-icon relative flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><h3 className="relative mt-5 text-lg font-bold text-neutral-950">{principleTitle}</h3><p className="relative mt-2 text-sm leading-6 text-neutral-600">{text}</p></div>)}</div>
        </section>

        <section>
          <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Deux manières de partir</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Slow travel ou voyage accéléré ?</h2><p className="mx-auto mt-3 max-w-2xl text-neutral-500">Cette comparaison illustre deux rythmes. Un même voyage peut naturellement alterner les deux.</p></div>
          <div className="mt-8 overflow-x-auto rounded-2xl border border-neutral-200"><table className="w-full min-w-[650px] border-collapse text-left text-sm"><thead className="bg-neutral-950 text-white"><tr><th className="px-5 py-4">Critère</th><th className="px-5 py-4 text-white/60">Voyage accéléré</th><th className="px-5 py-4 text-[#dfc59f]">Slow travel</th></tr></thead><tbody>{comparison.map(([criterion, fast, slow]) => <tr key={criterion} className="border-b border-neutral-100 last:border-0"><th className="px-5 py-4 font-semibold text-neutral-900">{criterion}</th><td className="px-5 py-4 text-neutral-500">{fast}</td><td className="bg-emerald-50/45 px-5 py-4 font-semibold text-emerald-800">{slow}</td></tr>)}</tbody></table></div>
        </section>

        <section className="grid gap-6 rounded-3xl bg-[#f7f1e8] p-7 sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Une première expérience simple</p><h2 className="mt-3 text-3xl font-bold text-neutral-950">Choisissez une région, puis enlevez la moitié du programme.</h2><p className="mt-4 max-w-2xl leading-7 text-neutral-600">Repérez une ou deux étapes accueillantes, garez le van et explorez les alentours sans chercher à optimiser chaque heure. Le slow travel commence souvent par un agenda volontairement incomplet.</p></div><MapPin className="hidden h-14 w-14 text-[#c39960] lg:block" /></section>

        <section>
          <div className="text-center"><h2 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Questions fréquentes</h2></div>
          <div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">{faqs.map((faq) => <details key={faq.question} className="group p-5 open:bg-[#f7f1e8]/50 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-neutral-900"><span>{faq.question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg transition group-open:rotate-45 group-open:bg-[#c39960] group-open:text-white">+</span></summary><p className="mt-4 pr-10 text-sm leading-7 text-neutral-600">{faq.answer}</p></details>)}</div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Prenez le temps</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trouvez un lieu où vous aurez envie de rester</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Explorez les lieux labellisés, leurs équipements et les expériences accessibles autour de chaque étape.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/explorer"><Button variant="cta" size="lg" className="w-full sm:w-auto">Explorer les lieux <ArrowRight className="h-4 w-4" /></Button></Link><Link href="/vanlife"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Lire le guide Vanlife France</Button></Link></div></section>
      </article>
    </main>
  );
}
