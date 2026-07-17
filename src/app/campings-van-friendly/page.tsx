import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, Ruler, ShowerHead, Trees, Users, Volume2, Wifi } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";

const title = "Campings van friendly en France : la sélection Label Vanlife";
const description = "Découvrez ce qui distingue un véritable camping van friendly et consultez la sélection 2026 des campings labellisés Label Vanlife en France.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/campings-van-friendly" },
  keywords: ["camping van friendly", "camping van France", "camping van aménagé", "camping Label Vanlife"],
  openGraph: {
    title,
    description,
    type: "article",
    url: "/campings-van-friendly",
    images: [{ url: "/images/lieux/camping-le-coin-charmant/photo-1.jpg", alt: "Camping van friendly Label Vanlife" }],
  },
};

const selectedIds = [
  "camping-de-pont-augan",
  "camping-de-lann-hoedic",
  "camping-de-fontenoy",
  "camping-le-coin-charmant",
  "camping-bon-sejour",
  "camping-au-tylo-soleil",
  "camping-saint-lambert",
  "camping-les-terrasses",
] as const;

const selectedCampings = selectedIds
  .map((id) => ENRICHED_LIEUX.find((place) => place.id === id))
  .filter((place): place is NonNullable<typeof place> => Boolean(place));

const networkCount = ENRICHED_LIEUX.filter((place) => place.status === "actif").length;

const criteria = [
  { icon: Ruler, title: "Emplacements adaptés", text: "Dimensions annoncées, accès praticable et sol approprié au type de véhicule accueilli. Les contraintes de hauteur, de longueur ou de manœuvre doivent être clairement indiquées." },
  { icon: Users, title: "Accueil humain", text: "L'équipe comprend les besoins des voyageurs itinérants. Les vans sont accueillis comme des visiteurs à part entière, avec des informations utiles dès l'arrivée." },
  { icon: Trees, title: "Cadre agréable", text: "Nature, tranquillité ou identité locale : le lieu offre davantage qu'une simple place de stationnement et permet de profiter réellement de l'étape." },
  { icon: ShowerHead, title: "Sanitaires entretenus", text: "Lorsque des sanitaires sont proposés, leur disponibilité, leurs horaires et leurs conditions d'accès sont expliqués sans ambiguïté." },
  { icon: Volume2, title: "Atmosphère respectueuse", text: "Les règles de calme sont communiquées et appliquées afin de protéger le repos des voyageurs, des autres campeurs et du voisinage." },
  { icon: Wifi, title: "Informations de connexion", text: "Wifi ou couverture mobile : la réalité du réseau est renseignée lorsque l'information est connue, notamment pour les voyageurs qui travaillent sur la route." },
] as const;

const faqs = [
  { question: "Qu'est-ce qu'un camping van friendly ?", answer: "C'est un établissement qui accueille réellement les voyageurs en van : accès et emplacements adaptés aux véhicules acceptés, informations claires, services annoncés avec précision et équipe bienveillante. L'expérience compte autant que la taille de l'emplacement." },
  { question: "Quelle différence avec un camping labellisé Label Vanlife ?", answer: "Un lieu labellisé rejoint une démarche structurée : sa candidature, ses informations d'accueil et ses engagements sont étudiés par Label Vanlife. Il annonce également l'avantage réservé aux membres et s'engage à maintenir sa fiche à jour." },
  { question: "Comment trouver un camping van friendly près de chez moi ?", answer: `L'explorateur Label Vanlife présente actuellement ${networkCount} lieux actifs en France. Vous pouvez rechercher un nom ou une ville et consulter librement les équipements et le pourcentage d'avantage. La carte membre coûte 39 € par an et est actuellement proposée à 29 € pour cette année.` },
] as const;

export default function VanFriendlyCampingsPage() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description, image: "https://labelvanlife.com/images/lieux/camping-le-coin-charmant/photo-1.jpg", author: { "@type": "Organization", name: "Label Vanlife" }, publisher: { "@type": "Organization", name: "Label Vanlife" }, mainEntityOfPage: "https://labelvanlife.com/campings-van-friendly" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav aria-label="Fil d'Ariane" className="flex items-center gap-2 text-xs text-neutral-400"><Link href="/" className="hover:text-emerald-700">Accueil</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-neutral-700">Campings van friendly</span></nav>
      </div>

      <header className="mx-auto max-w-6xl px-6 py-12 text-center sm:py-16">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7445]">Sélection 2026</p>
        <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-bold leading-[1.08] text-neutral-950 sm:text-6xl">Campings van friendly en France</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-neutral-600">Un camping van friendly n'est pas seulement un camping avec un grand emplacement. C'est un lieu qui comprend l'esprit vanlife, l'accueille et partage ses valeurs.</p>
        <div className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">{[[String(networkCount), "lieux labellisés"], ["✓", "vérifiés et sélectionnés"], ["France", "un réseau qui grandit"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-neutral-200 bg-[#f7f1e8]/60 p-4"><strong className="block text-2xl text-[#8b673d]">{value}</strong><span className="text-xs text-neutral-500">{label}</span></div>)}</div>
      </header>

      <section className="bg-neutral-950 py-16 text-white sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-9 px-6 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfc59f]">Au-delà des mots</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Ce que « van friendly » veut vraiment dire</h2><p className="mt-5 leading-7 text-white/70">Le terme est utilisé partout, mais l'expérience varie fortement. Un bon accueil repose sur des informations fiables, un accès cohérent avec les véhicules acceptés et une équipe qui considère les vanlifers comme des voyageurs attendus — jamais simplement tolérés.</p><p className="mt-4 leading-7 text-white/70">Label Vanlife a été créé pour rendre ces différences visibles et aider les voyageurs à choisir leur étape avec davantage de confiance.</p></div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-3xl"><Image src="/images/lieux/camping-le-coin-charmant/photo-1.jpg" alt="Emplacement de camping adapté aux voyageurs en van" fill sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover transition duration-700 hover:scale-105" /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">La grille de lecture</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">6 critères d'un camping réellement van friendly</h2><p className="mx-auto mt-3 max-w-2xl text-neutral-500">Ces éléments font partie des points examinés lors de l'étude d'un lieu, au sein d'une évaluation plus complète.</p></div>
        <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{criteria.map(({ icon: Icon, title: criterionTitle, text }) => <div key={criterionTitle} className="micro-card rounded-2xl border border-neutral-200 p-6"><span className="micro-icon flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-neutral-950">{criterionTitle}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p></div>)}</div>
        <div className="mt-8 text-center"><Link href="/le-label" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Découvrir la charte Label Vanlife <ArrowRight className="h-4 w-4" /></Link></div>
      </section>

      <section className="bg-[#f7f1e8]/55 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Du nord au sud</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Une sélection de campings labellisés</h2></div><Link href="/explorer" className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Voir les {networkCount} lieux <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{selectedCampings.map((camping) => <Link key={camping.id} href={`/lieux/${camping.id}`} className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"><div className="relative h-40 overflow-hidden bg-emerald-50"><Image src={camping.photoUrl || "/images/hero-label-vanlife.png"} alt={`Vue de ${camping.nom}`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />{camping.discountPercent > 0 && <span className="absolute right-3 top-3 rounded-full bg-[#c39960] px-2.5 py-1 text-xs font-bold text-white">-{camping.discountPercent}%</span>}</div><div className="p-4"><h3 className="font-bold text-neutral-950 group-hover:text-emerald-700">{camping.nom}</h3><p className="mt-1 flex items-center gap-1 text-xs text-neutral-500"><MapPin className="h-3.5 w-3.5" />{camping.ville} · {camping.region}</p><span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">Voir le lieu <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" /></span></div></Link>)}</div>
          <div className="mt-10 text-center"><Link href="/explorer"><Button variant="cta" size="lg">Voir tous les lieux sur la carte <ArrowRight className="h-4 w-4" /></Button></Link></div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
        <div className="text-center"><CheckCircle2 className="mx-auto h-9 w-9 text-[#c39960]" /><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Questions fréquentes</h2></div>
        <div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">{faqs.map((faq) => <details key={faq.question} className="group p-5 open:bg-[#f7f1e8]/50 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-neutral-900"><span>{faq.question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg transition group-open:rotate-45 group-open:bg-[#c39960] group-open:text-white">+</span></summary><p className="mt-4 pr-10 text-sm leading-7 text-neutral-600">{faq.answer}</p></details>)}</div>
      </section>

      <section className="mx-auto max-w-5xl px-6"><div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Votre prochaine étape</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Trouvez un accueil qui comprend votre façon de voyager</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Parcourez les fiches publiques puis rejoignez les membres pour accéder aux modalités et codes privés des établissements.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/explorer"><Button variant="cta" size="lg" className="w-full sm:w-auto">Explorer les lieux</Button></Link><Link href="/devenir-membre"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Découvrir la carte membre</Button></Link></div></div></section>
    </main>
  );
}
