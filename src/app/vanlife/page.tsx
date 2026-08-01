import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Compass, Euro, HelpCircle, Leaf, MapPin, ShieldCheck, Wrench } from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "Vanlife France : le guide complet 2026 pour voyager en van";
const description = "Vanlife France : où dormir en van, budget, loi, itinéraires, campings van friendly, carte des lieux et conseils pour préparer un road trip en van.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vanlife" },
  keywords: [
    "vanlife france",
    "vanlife en france",
    "voyage en van france",
    "où dormir en van france",
    "camping van friendly france",
    "road trip van france",
    "budget vanlife france",
    "carte vanlife france",
  ],
  openGraph: {
    title,
    description,
    type: "article",
    url: "/vanlife",
    images: [{ url: "/images/hero-label-vanlife.png", width: 1536, height: 1024, alt: "Voyage en van au bord d'un lac" }],
  },
};

const summary = [
  ["definition", "Qu'est-ce que la vanlife ?"],
  ["pourquoi", "Pourquoi choisir la vanlife"],
  ["budget", "Le budget réel"],
  ["equipement", "L'équipement indispensable"],
  ["dormir", "Où dormir en France"],
  ["destinations", "Les meilleures destinations"],
  ["road-trip", "Organiser son road trip"],
  ["responsable", "Voyager sans dégrader"],
  ["derives", "Les réalités à connaître"],
  ["faq", "FAQ vanlife France"],
  ["commencer", "Par où commencer"],
] as const;

const budget = [
  ["Carburant", "200 à 400 €"],
  ["Nourriture", "300 à 500 €"],
  ["Nuits et accueils", "0 à 200 €"],
  ["Entretien du van", "100 à 200 €"],
  ["Assurance", "80 à 150 €"],
  ["Activités et imprévus", "100 à 300 €"],
] as const;

const essentials = [
  "Un couchage réellement confortable",
  "Une source d'énergie autonome et dimensionnée à vos usages",
  "Une ventilation permanente et un chauffage adapté à la saison",
  "Un réfrigérateur à compression et une cuisine simple",
  "Une réserve d'eau propre avec pompe 12 V",
  "Une trousse de secours, un extincteur et un détecteur de monoxyde de carbone",
];

const responsibleRules = [
  "Laisser chaque lieu dans le même état qu'à l'arrivée — ou mieux",
  "Utiliser les points prévus pour les eaux grises et les toilettes",
  "Respecter les interdictions, les riverains et les horaires de calme",
  "Éviter les lieux saturés et ne jamais publier un spot fragile sans précaution",
  "Privilégier les accueils qui ont explicitement choisi de recevoir des vans",
];

const destinations = [
  {
    name: "Bretagne",
    href: "/vanlife-regions/bretagne",
    text: "Côtes sauvages, GR34, ports, phares et lieux labellisés dans le Morbihan et autour de Saint-Malo.",
  },
  {
    name: "Provence",
    href: "/vanlife-regions/provence",
    text: "Lavande, Verdon, Camargue et campings nature pour voyager hors des foules du littoral.",
  },
  {
    name: "Ardèche",
    href: "/vanlife-regions/ardeche",
    text: "Gorges, rivières, villages en pierre et étapes idéales pour une vanlife lente et nature.",
  },
  {
    name: "Alpes",
    href: "/vanlife-regions/alpes",
    text: "Cols, lacs et Alpes du Sud pour les voyageurs qui cherchent de grands paysages.",
  },
] as const;

const relatedGuides = [
  { href: "/dormir-en-van", title: "Où dormir en van en France ?", text: "Règles, options légales, campings, terrains privés et bonnes pratiques." },
  { href: "/campings-van-friendly", title: "Campings van friendly en France", text: "Comprendre ce qu’un camping vraiment van friendly doit offrir." },
  { href: "/road-trips", title: "Road trips en van en France", text: "Itinéraires par région pour construire un voyage réaliste." },
  { href: "/vanlife-famille", title: "Vanlife en famille", text: "Conseils concrets pour voyager en van avec des enfants." },
] as const;

const faqs = [
  {
    question: "Où faire de la vanlife en France ?",
    answer: "La France est particulièrement adaptée à la vanlife grâce à ses routes secondaires, ses massifs montagneux, ses littoraux et ses régions rurales. Les destinations les plus recherchées sont la Bretagne, l’Ardèche, la Provence, les Alpes, les Landes, les Pyrénées et l’Atlantique. Le plus important reste de choisir des lieux où les vans sont explicitement bienvenus.",
  },
  {
    question: "Est-ce légal de dormir dans son van en France ?",
    answer: "Dormir dans un véhicule stationné peut être autorisé si le stationnement est permis et si vous ne vous installez pas en mode camping. En revanche, le camping isolé est interdit dans certaines zones : sites classés, bords de mer réglementés, forêts domaniales, périmètres protégés ou zones signalées par arrêté local. Il faut toujours vérifier la signalisation et les règles locales.",
  },
  {
    question: "Quel budget prévoir pour la vanlife en France ?",
    answer: "Pour un voyage régulier en van en France, un budget mensuel réaliste se situe souvent entre 780 € et 1 750 € hors achat du véhicule. Les postes principaux sont le carburant, l’alimentation, l’assurance, l’entretien, les nuits payantes, les activités et les imprévus.",
  },
  {
    question: "Comment trouver des lieux van friendly en France ?",
    answer: "La meilleure méthode consiste à croiser les campings, aires, terrains privés et lieux labellisés qui annoncent clairement leur accueil des vans. Label Vanlife recense des lieux vérifiés ou repérés, avec une carte, des fiches pratiques et des avantages réservés aux membres.",
  },
  {
    question: "Quelle est la meilleure période pour voyager en van en France ?",
    answer: "Le printemps et le début de l’automne sont souvent les meilleures périodes : météo agréable, moins de monde, prix plus doux et lieux plus accessibles. Juillet-août reste possible, mais demande davantage d’anticipation, surtout sur le littoral et les destinations très touristiques.",
  },
] as const;

export default function VanlifeGuidePage() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: "https://www.labelvanlife.fr/images/hero-label-vanlife.png",
    author: { "@type": "Organization", name: "Label Vanlife" },
    publisher: { "@type": "Organization", name: "Label Vanlife" },
    mainEntityOfPage: "https://www.labelvanlife.fr/vanlife",
    datePublished: "2026-01-01",
    dateModified: "2026-08-01",
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.labelvanlife.fr" },
      { "@type": "ListItem", position: 2, name: "Vanlife France", item: "https://www.labelvanlife.fr/vanlife" },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <header className="relative isolate min-h-[72vh] overflow-hidden bg-neutral-950 text-white">
        <Image src="/images/hero-label-vanlife.png" alt="Van aménagé devant un lac au coucher du soleil" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-6xl items-end px-6 pb-14 pt-24 sm:items-center sm:pb-20">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#dfc59f]">Guide complet · Vanlife France</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.08] sm:text-6xl">Vanlife France : le guide complet pour voyager en van</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">Où dormir en van, combien ça coûte, quelles règles respecter, quelles destinations choisir et comment trouver des lieux vraiment accueillants : voici la page pilier pour préparer une vanlife en France simple, responsable et bien organisée.</p>
            <div className="mt-7 flex flex-wrap gap-3 text-xs text-white/75"><span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">Lecture : 15 min</span><span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">Mis à jour le 1 août 2026</span><span className="rounded-full border border-white/25 bg-white/10 px-4 py-2 backdrop-blur">France · vans · fourgons · road trips</span></div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[250px_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-2xl border border-neutral-200 bg-[#f7f1e8]/60 p-5 lg:sticky lg:top-24">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8b673d]">Dans ce guide</p>
          <nav className="mt-4 space-y-1" aria-label="Sommaire du guide">
            {summary.map(([id, label], index) => <a key={id} href={`#${id}`} className="flex gap-3 rounded-lg px-2 py-2 text-sm text-neutral-600 transition hover:bg-white hover:text-emerald-700"><span className="text-[#c39960]">{String(index + 1).padStart(2, "0")}</span>{label}</a>)}
          </nav>
        </aside>

        <article className="min-w-0 space-y-16 text-[1.02rem] leading-8 text-neutral-600">
          <section id="definition" className="scroll-mt-28">
            <SectionHeading eyebrow="Comprendre" title="Qu’est-ce que la vanlife en France ?" />
            <p>La <strong className="text-neutral-900">vanlife France</strong> désigne l’art de voyager — quelques jours, plusieurs mois ou à l’année — dans un véhicule aménagé sur les routes françaises. Combi, van compact, fourgon ou camping-car : le format change, mais l’idée reste la même. Pouvoir partir plus librement, ralentir et se réveiller dans un environnement différent.</p>
            <p className="mt-5">La France est l’un des meilleurs terrains de jeu européens pour voyager en van : côtes atlantiques, villages, montagnes, lacs, campagnes, routes départementales et diversité de climats. Mais cette liberté demande aussi de comprendre les règles locales, de respecter les lieux et d’éviter les spots saturés.</p>
            <blockquote className="mt-7 rounded-r-2xl border-l-4 border-[#c39960] bg-[#f7f1e8] px-6 py-5 text-xl font-semibold leading-relaxed text-neutral-800">« La vanlife n’est pas une fuite. C’est une autre façon de choisir son rythme. »</blockquote>
          </section>

          <section id="pourquoi" className="scroll-mt-28">
            <SectionHeading eyebrow="Les motivations" title="Pourquoi autant de voyageurs choisissent la vanlife" />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {[["Liberté", "Décider de l’itinéraire et du rythme sans organiser chaque journée à la minute."], ["Essentiel", "Voyager avec moins oblige à distinguer l’utile du superflu."], ["Nature", "La destination n’est plus seulement un point sur la carte : elle devient le cadre du quotidien."], ["Communauté", "Les rencontres, les conseils et l’entraide font partie intégrante du voyage."]].map(([name, text]) => <div key={name} className="micro-card rounded-2xl border border-neutral-200 bg-white p-5"><h3 className="font-bold text-neutral-900">{name}</h3><p className="mt-2 text-sm leading-6">{text}</p></div>)}
            </div>
          </section>

          <section id="budget" className="scroll-mt-28">
            <SectionHeading eyebrow="Les chiffres" title="Le budget vanlife : la réalité" icon={<Euro className="h-5 w-5" />} />
            <p>La vanlife peut coûter moins cher qu’un logement traditionnel, mais elle n’est pas gratuite. Le carburant, l’entretien et les imprévus pèsent vite dans le budget. Pour un voyage régulier, prévoyez une enveloppe réaliste plutôt qu’un scénario idéal.</p>
            <div className="mt-7 overflow-hidden rounded-2xl border border-neutral-200">
              {budget.map(([name, amount]) => <div key={name} className="flex items-center justify-between gap-4 border-b border-neutral-100 px-5 py-3.5 last:border-0"><span>{name}</span><strong className="whitespace-nowrap text-neutral-900">{amount}</strong></div>)}
              <div className="flex items-center justify-between bg-neutral-950 px-5 py-4 text-white"><strong>Total mensuel indicatif</strong><strong className="text-[#dfc59f]">780 à 1 750 €</strong></div>
            </div>
            <p className="mt-3 text-xs leading-5 text-neutral-400">Estimation indicative hors achat, financement et aménagement du véhicule. Votre consommation dépend du kilométrage, de la saison et du niveau de confort.</p>
          </section>

          <section id="equipement" className="scroll-mt-28">
            <SectionHeading eyebrow="Préparer le véhicule" title="L’équipement vraiment indispensable" icon={<Wrench className="h-5 w-5" />} />
            <p>Le meilleur équipement n’est pas le plus impressionnant : c’est celui qui répond à vos usages. Commencez par le sommeil, l’eau, l’énergie, l’aération et la sécurité avant les accessoires.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">{essentials.map((item) => <li key={item} className="flex gap-3 rounded-xl bg-emerald-50/60 p-4 text-sm leading-6 text-neutral-700"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />{item}</li>)}</ul>
          </section>

          <section id="dormir" className="scroll-mt-28">
            <SectionHeading eyebrow="Choisir son étape" title="Où dormir en van en France ?" icon={<MapPin className="h-5 w-5" />} />
            <p>Il faut distinguer le <strong className="text-neutral-900">stationnement du véhicule</strong> de l’installation en mode camping. Les règles peuvent varier selon la commune, le site protégé et la signalisation locale. Sur un terrain privé, l’accord de la personne qui dispose du terrain est indispensable.</p>
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><p className="font-bold">À vérifier avant chaque nuit</p><p className="mt-1">Consultez les panneaux, les arrêtés locaux et les règles des espaces protégés. Le Code de l’urbanisme encadre le camping isolé et prévoit plusieurs zones d’interdiction.</p><a href="https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006074075/LEGISCTA000031719402/" target="_blank" rel="noreferrer" className="mt-2 inline-flex font-semibold underline underline-offset-2">Lire les articles R111-32 à R111-35 sur Légifrance</a></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">{[["Lieux Label Vanlife", "Des établissements identifiés, avec des informations d’accueil et des avantages membres."], ["Campings et aires", "Une solution encadrée avec services, sanitaires ou bornes selon le lieu."], ["Terrain privé", "Possible avec l’accord explicite de la personne qui dispose du terrain."], ["Stationnement public", "Vérifiez la signalisation et restez en configuration de stationnement, sans installation extérieure."]].map(([name, text]) => <div key={name} className="rounded-2xl border border-neutral-200 p-5"><h3 className="font-bold text-neutral-900">{name}</h3><p className="mt-2 text-sm leading-6">{text}</p></div>)}</div>
            <Link href="/explorer" className="mt-7 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:gap-3">Découvrir les lieux Label Vanlife <ArrowRight className="h-4 w-4" /></Link>
          </section>

          <section id="destinations" className="scroll-mt-28">
            <SectionHeading eyebrow="Destinations" title="Les meilleures régions pour la vanlife en France" icon={<Compass className="h-5 w-5" />} />
            <p>Pour se positionner sur “Vanlife France”, il faut répondre à la question suivante : où partir concrètement ? Les régions ci-dessous sont les plus cohérentes pour construire un premier road trip en van, avec des paysages forts, des routes agréables et des étapes possibles.</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {destinations.map((destination) => (
                <Link key={destination.name} href={destination.href} className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/10">
                  <h3 className="text-lg font-bold text-neutral-950">{destination.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{destination.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:gap-3">Lire le guide région <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </section>

          <section id="road-trip" className="scroll-mt-28">
            <SectionHeading eyebrow="Prendre la route" title="Organiser son road trip sans tout figer" icon={<Compass className="h-5 w-5" />} />
            <p>Le bon itinéraire laisse de la place à l’imprévu. Une base simple consiste à prévoir quelques étapes importantes, puis à garder du temps entre elles. Visez des journées de route raisonnables : au-delà de 150 km quotidiens pendant plusieurs jours, le voyage peut vite devenir un transfert.</p>
            <div className="mt-6 rounded-2xl bg-neutral-950 p-6 text-white"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dfc59f]">La règle des 150 km</p><p className="mt-3 text-lg leading-7 text-white/80">Moins de route, plus de haltes, de marchés, de baignades et de rencontres. La vanlife commence souvent là où l’itinéraire prévu s’arrête.</p></div>
            <Link href="/road-trips" className="mt-7 inline-flex items-center gap-2 font-semibold text-emerald-700 hover:gap-3">Explorer les idées de road trips <ArrowRight className="h-4 w-4" /></Link>
          </section>

          <section id="responsable" className="scroll-mt-28">
            <SectionHeading eyebrow="Préserver" title="Une vanlife responsable" icon={<Leaf className="h-5 w-5" />} />
            <p>La popularité de la vanlife fragilise certains lieux. Chaque geste participe soit à préserver l’accueil, soit à provoquer de nouvelles interdictions. Voyager responsable, c’est accepter qu’un beau spot ne nous appartient jamais.</p>
            <ul className="mt-6 space-y-3">{responsibleRules.map((item) => <li key={item} className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-emerald-600" /><span>{item}</span></li>)}</ul>
          </section>

          <section id="derives" className="scroll-mt-28">
            <SectionHeading eyebrow="Sans filtre" title="Les réalités à connaître" />
            <div className="mt-6 space-y-4">{[["L’image parfaite", "Le coucher de soleil existe, mais aussi les pannes, la pluie, les nuits moyennes et le manque d’espace."], ["La saturation", "Les lieux les plus partagés peuvent devenir impraticables en haute saison et créer des tensions locales."], ["La course au matériel", "Un van n’a pas besoin d’être parfait pour partir. Tester avant d’acheter évite beaucoup de dépenses inutiles."]].map(([name, text]) => <div key={name} className="rounded-2xl border-l-4 border-[#c39960] bg-neutral-50 p-5"><h3 className="font-bold text-neutral-900">{name}</h3><p className="mt-1 text-sm leading-6">{text}</p></div>)}</div>
          </section>

          <section id="faq" className="scroll-mt-28">
            <SectionHeading eyebrow="Questions fréquentes" title="FAQ Vanlife France" icon={<HelpCircle className="h-5 w-5" />} />
            <div className="mt-7 divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
              {faqs.map((faq) => (
                <details key={faq.question} className="group p-5 open:bg-[#f7f1e8]/60">
                  <summary className="cursor-pointer list-none font-bold text-neutral-950 marker:hidden">
                    <span className="inline-flex w-full items-center justify-between gap-4">
                      {faq.question}
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-sm text-neutral-500 group-open:bg-[#c39960] group-open:text-white">+</span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="scroll-mt-28">
            <SectionHeading eyebrow="Maillage interne" title="Guides complémentaires pour préparer sa vanlife" />
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {relatedGuides.map((guide) => (
                <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-neutral-200 p-5 transition hover:border-[#c39960]/40 hover:bg-[#f7f1e8]/60">
                  <h3 className="font-bold text-neutral-950">{guide.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-600">{guide.text}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:gap-3">Lire le guide <ArrowRight className="h-4 w-4" /></span>
                </Link>
              ))}
            </div>
          </section>

          <section id="commencer" className="scroll-mt-28 rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Votre première étape</p>
            <h2 className="mt-3 text-3xl font-bold">Commencez petit, mais commencez vraiment.</h2>
            <p className="mt-4 text-emerald-50/80">Louez ou empruntez un véhicule pour un week-end proche de chez vous. Notez ce qui vous manque, ce que vous n’utilisez pas et le rythme qui vous convient. Votre deuxième départ sera déjà beaucoup plus simple.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Link href="/explorer"><Button variant="cta" size="lg" className="w-full sm:w-auto">Trouver une première étape <ArrowRight className="h-4 w-4" /></Button></Link><Link href="/devenir-membre"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Découvrir la carte membre</Button></Link></div>
          </section>
        </article>
      </div>
    </main>
  );
}

function SectionHeading({ eyebrow, title: sectionTitle, icon }: { eyebrow: string; title: string; icon?: React.ReactNode }) {
  return <div className="mb-5"><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">{icon}{eyebrow}</p><h2 className="mt-2 text-3xl font-bold leading-tight text-neutral-900 sm:text-4xl">{sectionTitle}</h2></div>;
}
