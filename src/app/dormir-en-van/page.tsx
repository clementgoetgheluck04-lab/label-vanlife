import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronRight, CircleAlert, ExternalLink, Home, Info, MapPin, MoonStar, ShieldCheck, Smartphone, TentTree } from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "Où dormir en van en France ? Règles et solutions";
const description = "Voie publique, aires, campings, terrains privés et lieux labellisés : comparez les solutions pour dormir en van en France et préparez une étape sereine.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/dormir-en-van" },
  keywords: ["où dormir en van", "dormir en van France", "camping sauvage van", "aire van France", "terrain privé van"],
  openGraph: { title, description, type: "article", url: "/dormir-en-van", images: [{ url: "/images/hero-label-vanlife.png", width: 1536, height: 1024, alt: "Dormir en van en France" }] },
};

const rules = [
  "Un véhicule peut stationner là où le code de la route et la signalisation locale l’autorisent.",
  "Sortir table, chaises, cales ou auvent matérialise une installation de camping et change la situation.",
  "Le camping isolé est interdit dans plusieurs zones protégées et peut être restreint localement.",
  "Sur un terrain privé, demandez toujours l’accord du propriétaire et vérifiez les règles d’urbanisme applicables.",
  "En période de risque d’incendie ou dans un espace naturel, consultez impérativement les arrêtés locaux.",
] as const;

const options = [
  { icon: MapPin, title: "Voie publique", status: "Selon signalisation", price: "Souvent gratuit", text: "Le véhicule doit être régulièrement stationné, sans emprise extérieure ni comportement assimilable à du camping.", note: "Vérifiez les panneaux, arrêtés municipaux et règles de stationnement." },
  { icon: Home, title: "Aires aménagées", status: "Cadre officiel", price: "Gratuit ou payant", text: "Une solution pratique pour une étape courte, avec parfois eau, vidange, électricité ou sanitaires.", note: "Services et durées maximales varient selon chaque aire." },
  { icon: TentTree, title: "Campings", status: "Réservation possible", price: "Tarif variable", text: "Douches, toilettes, électricité et cadre sécurisé : utile pour souffler, refaire les niveaux ou rester plusieurs jours.", note: "Réservation recommandée en haute saison." },
  { icon: ShieldCheck, title: "Lieux labellisés", status: "Accueil vérifié", price: "Tarif du lieu", text: "Campings, fermes et autres établissements engagés à accueillir les vanlifers selon des informations claires.", note: "Les membres retrouvent les avantages et conditions dans leur espace." },
  { icon: MoonStar, title: "Terrain privé", status: "Accord nécessaire", price: "À convenir", text: "Une étape chez un particulier ou un producteur peut être possible avec son autorisation et dans le respect des règles locales.", note: "Un accord du propriétaire ne neutralise pas les interdictions réglementaires." },
  { icon: CircleAlert, title: "Camping isolé", status: "Règles variables", price: "Sans service", text: "Il est soumis au Code de l’urbanisme, aux protections des sites et aux restrictions décidées par les autorités locales.", note: "Ne vous fiez jamais à la seule présence d’autres véhicules." },
] as const;

const apps = [
  { name: "Park4Night", text: "Base communautaire de spots et d’étapes avec avis d’utilisateurs." },
  { name: "iOverlander", text: "Repérage communautaire utile pour les voyages au long cours et les zones rurales." },
  { name: "Campstop", text: "Recherche d’aires et d’étapes orientée camping-car et van." },
  { name: "Label Vanlife", text: "Des lieux labellisés, des informations détaillées et des avantages réservés aux membres." },
] as const;

const faqs = [
  { question: "Peut-on dormir dans son van sur la voie publique ?", answer: "Dormir à l’intérieur d’un véhicule régulièrement stationné n’est pas, à lui seul, une autorisation générale de camper. Respectez le code de la route, les panneaux, les arrêtés locaux et n’installez aucun équipement à l’extérieur." },
  { question: "L’accord d’un propriétaire suffit-il sur un terrain privé ?", answer: "Son accord est indispensable, mais les règles nationales et locales d’urbanisme, de protection des espaces ou de prévention des incendies continuent de s’appliquer. En cas de doute, renseignez-vous auprès de la mairie." },
  { question: "Comment choisir une étape fiable ?", answer: "Vérifiez la date des informations, les conditions d’accès, le gabarit accepté, les horaires, les services et la nécessité de réserver. Un lieu labellisé fournit une fiche structurée pour limiter les mauvaises surprises." },
] as const;

export default function DormirEnVanPage() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description, image: "https://labelvanlife.com/images/hero-label-vanlife.png", author: { "@type": "Organization", name: "Label Vanlife" }, publisher: { "@type": "Organization", name: "Label Vanlife" }, mainEntityOfPage: "https://labelvanlife.com/dormir-en-van" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}
      <div className="mx-auto max-w-6xl px-6 pt-8"><nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-xs text-neutral-400"><Link href="/" className="hover:text-emerald-700">Accueil</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-neutral-700">Hébergement en van</span></nav></div>

      <header className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-16"><div className="animate-fade-in-up"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7445]">Hébergement en van</p><h1 className="mt-4 text-4xl font-bold leading-[1.08] text-neutral-950 sm:text-6xl">Où dormir en van en France ?</h1><p className="mt-5 text-lg leading-8 text-neutral-600">C’est la question du premier soir. Les solutions sont nombreuses, mais leur cadre, leurs services et leurs règles ne sont pas identiques.</p><div className="mt-7 flex flex-wrap gap-2">{["Règles essentielles", "6 solutions comparées", "Lieux vérifiés"].map((tag) => <span key={tag} className="rounded-full border border-[#c39960]/30 bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-[#7d5d38]">{tag}</span>)}</div></div><div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-900/15"><Image src="/images/hero-label-vanlife.png" alt="Van installé pour une nuit dans un cadre naturel" fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" /></div></header>

      <article className="mx-auto max-w-5xl space-y-20 px-6">
        <section><div className="mx-auto max-w-3xl text-center"><Info className="mx-auto h-9 w-9 text-emerald-700" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Cadre général</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Ce qu’il faut comprendre avant de s’installer</h2><p className="mt-4 leading-7 text-neutral-600">Stationner un véhicule et camper ne sont pas la même chose. La signalisation, les arrêtés locaux, le type de terrain et l’emprise créée autour du van déterminent ce qui est permis.</p></div><div className="mx-auto mt-8 max-w-3xl overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">{rules.map((rule) => <div key={rule} className="flex gap-3 border-b border-neutral-200 p-4 last:border-0"><Check className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><p className="text-sm leading-6 text-neutral-700">{rule}</p></div>)}</div><div className="mx-auto mt-5 flex max-w-3xl flex-wrap gap-4 text-xs"><a href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000034355031" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline">Code de l’urbanisme — article R111-33 <ExternalLink className="h-3 w-3" /></a><span className="text-neutral-400">Informations générales, à vérifier localement avant chaque étape.</span></div></section>

        <section><div className="text-center"><MoonStar className="mx-auto h-9 w-9 text-emerald-700" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Choisir son étape</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Toutes les options pour dormir en van</h2></div><div className="mt-10 grid gap-5 md:grid-cols-2">{options.map(({ icon: Icon, title: optionTitle, status, price, text, note }) => <div key={optionTitle} className="micro-card rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><span className="micro-icon flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><div className="text-right"><span className="block text-xs font-bold text-emerald-700">{status}</span><span className="mt-1 block text-xs text-neutral-400">{price}</span></div></div><h3 className="mt-5 text-xl font-bold text-neutral-950">{optionTitle}</h3><p className="mt-2 leading-7 text-neutral-600">{text}</p><p className="mt-4 rounded-xl bg-[#f7f1e8] px-4 py-3 text-xs font-semibold leading-5 text-[#755837]">{note}</p></div>)}</div></section>

        <section className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-10"><div className="grid gap-8 lg:grid-cols-[.8fr_1.2fr] lg:items-start"><div><Smartphone className="h-8 w-8 text-[#c39960]" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#d6b98f]">Préparer l’étape</p><h2 className="mt-3 text-3xl font-bold">Applications utiles</h2><p className="mt-3 leading-7 text-white/60">Croisez toujours plusieurs sources : les conditions d’accès et les réglementations peuvent changer.</p></div><div className="grid gap-3 sm:grid-cols-2">{apps.map((app) => <div key={app.name} className="rounded-2xl border border-white/10 bg-white/5 p-5"><h3 className="font-bold">{app.name}</h3><p className="mt-2 text-sm leading-6 text-white/60">{app.text}</p></div>)}</div></div></section>

        <section><div className="text-center"><h2 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Questions fréquentes</h2></div><div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">{faqs.map((faq) => <details key={faq.question} className="group p-5 open:bg-[#f7f1e8]/50 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-neutral-900"><span>{faq.question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg transition group-open:rotate-45 group-open:bg-[#c39960] group-open:text-white">+</span></summary><p className="mt-4 pr-10 text-sm leading-7 text-neutral-600">{faq.answer}</p></details>)}</div></section>

        <section className="grid gap-5 sm:grid-cols-2"><Link href="/road-trips" className="micro-card rounded-2xl border border-neutral-200 p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#9a7445]">Itinéraires</p><h2 className="mt-2 text-xl font-bold text-neutral-950">Les meilleurs road trips en France</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Découvrir <ArrowRight className="h-4 w-4" /></span></Link><Link href="/vanlife" className="micro-card rounded-2xl border border-neutral-200 p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#9a7445]">Guide complet</p><h2 className="mt-2 text-xl font-bold text-neutral-950">La vanlife en France</h2><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Lire le guide <ArrowRight className="h-4 w-4" /></span></Link></section>

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Une étape plus sereine</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Des lieux d’accueil vérifiés sur toute la France</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Campings et établissements engagés : retrouvez les informations utiles avant d’arriver.</p><Link href="/explorer" className="mt-7 inline-flex"><Button variant="cta" size="lg">Voir la carte <ArrowRight className="h-4 w-4" /></Button></Link></section>
      </article>
    </main>
  );
}
