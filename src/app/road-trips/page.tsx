import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Compass, Map, MapPin, Mountain, Route, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "Road trip en van en France : 6 itinéraires incontournables";
const description = "Préparez votre road trip en van en France : Bretagne, Alpes, Provence, Atlantique, Pyrénées et Corse, avec durées, saisons et conseils pratiques.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/road-trips" },
  keywords: ["road trip van France", "itinéraire van France", "voyage en van", "road trip Bretagne van", "road trip Alpes van"],
  openGraph: { title, description, type: "article", url: "/road-trips", images: [{ url: "/images/hero-label-vanlife.png", width: 1536, height: 1024, alt: "Road trip en van en France" }] },
};

const trips = [
  { id: "bretagne", icon: Waves, region: "Bretagne", duration: "7 à 10 jours", season: "Mai–juin ou septembre", description: "Côtes sauvages, criques, phares et villages de caractère : un itinéraire iodé à parcourir par petites étapes.", stages: "Golfe du Morbihan · Presqu’île de Crozon · Côte de Granit Rose" },
  { id: "alpes", icon: Mountain, region: "Alpes", duration: "10 à 14 jours", season: "Juin à septembre", description: "Cols mythiques, lacs turquoise et villages d’altitude composent l’un des voyages en van les plus spectaculaires d’Europe.", stages: "Annecy · Vercors · Écrins · Queyras" },
  { id: "provence", icon: Sparkles, region: "Provence", duration: "7 à 10 jours", season: "Mai, juin ou septembre", description: "Lavande, villages perchés et gorges du Verdon : la Provence intérieure, loin du rythme des stations côtières.", stages: "Luberon · Plateau de Valensole · Verdon" },
  { id: "atlantique", icon: Waves, region: "Côte Atlantique", duration: "10 à 14 jours", season: "Printemps à automne", description: "De la Normandie au Pays basque, l’Atlantique déroule des paysages changeants, des vagues et une gastronomie généreuse.", stages: "Normandie · Vendée · Landes · Pays basque" },
  { id: "pyrenees", icon: Mountain, region: "Pyrénées", duration: "7 à 10 jours", season: "Juin à septembre", description: "Une chaîne encore préservée, des vallées profondes et des panoramas grandioses, avec moins de foule que dans les grands massifs alpins.", stages: "Pays basque · Gavarnie · Ariège" },
  { id: "corse", icon: Compass, region: "Corse", duration: "10 à 14 jours", season: "Mai–juin ou septembre", description: "L’île de Beauté en van : routes exigeantes, mer cristalline et reliefs puissants. Un parcours à préparer et à vivre lentement.", stages: "Cap Corse · Balagne · Corte · Extrême Sud" },
] as const;

const advice: ReadonlyArray<{ icon: typeof ShieldCheck; title: string; text: string; link?: string }> = [
  { icon: ShieldCheck, title: "Vérifiez Crit’Air avant le départ", text: "La vignette est obligatoire dans les ZFE-m et lors de certaines mesures de circulation différenciée. Les règles et dérogations varient selon les collectivités : consultez la carte officielle avec la catégorie inscrite sur votre carte grise.", link: "https://www.certificat-air.gouv.fr/" },
  { icon: Route, title: "Préférez les routes secondaires", text: "Les axes côtiers et autoroutiers se chargent fortement en haute saison. Les nationales et départementales demandent plus de temps, mais donnent accès aux villages, paysages et producteurs locaux." },
  { icon: CalendarDays, title: "Anticipez juillet et août", text: "Sur les littoraux et autour des grands sites, campings et aires peuvent afficher complet. Réservez les étapes importantes ou privilégiez l’intérieur des terres et les ailes de saison." },
] as const;

export default function RoadTripsPage() {
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: title, description, image: "https://labelvanlife.com/images/hero-label-vanlife.png", author: { "@type": "Organization", name: "Label Vanlife" }, publisher: { "@type": "Organization", name: "Label Vanlife" }, mainEntityOfPage: "https://labelvanlife.com/road-trips" };

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div className="mx-auto max-w-6xl px-6 pt-8"><nav aria-label="Fil d’Ariane" className="flex items-center gap-2 text-xs text-neutral-400"><Link href="/" className="hover:text-emerald-700">Accueil</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-neutral-700">Itinéraires</span></nav></div>

      <header className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[.95fr_1.05fr] lg:items-center lg:py-16">
        <div className="animate-fade-in-up"><p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7445]">Itinéraires</p><h1 className="mt-4 text-4xl font-bold leading-[1.08] text-neutral-950 sm:text-6xl">Road trip en van en France : les meilleurs itinéraires</h1><p className="mt-5 text-lg leading-8 text-neutral-600">Des Alpes à la Bretagne, de la Provence à la Corse, chaque région offre une expérience différente. Voici six voyages qui méritent vraiment le détour.</p><div className="mt-7 flex flex-wrap gap-2">{["6 itinéraires", "De 7 à 14 jours", "Conseils pratiques"].map((tag) => <span key={tag} className="rounded-full border border-[#c39960]/30 bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-[#7d5d38]">{tag}</span>)}</div></div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-900/15"><Image src="/images/hero-label-vanlife.png" alt="Van au bord d’un lac, point de départ d’un road trip en France" fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" /></div>
      </header>

      <article className="mx-auto max-w-5xl space-y-20 px-6">
        <section className="mx-auto max-w-3xl text-lg leading-8 text-neutral-600"><h2 className="text-3xl font-bold text-neutral-950">Pourquoi la France est idéale en van</h2><p className="mt-5">Des milliers de communes, des côtes très différentes, plusieurs massifs montagneux et une grande diversité de climats permettent de changer totalement de décor sans franchir de frontière.</p><p className="mt-4">Le réseau secondaire traverse des territoires que l’autoroute ne laisse qu’entrevoir. En van, le trajet devient une partie du voyage : une petite route, un marché ou une recommandation locale peuvent transformer l’itinéraire.</p><blockquote className="mt-8 rounded-r-2xl border-l-4 border-[#c39960] bg-[#f7f1e8] px-7 py-6 text-xl font-semibold leading-8 text-neutral-900">« En van, la destination, c’est aussi le chemin. Les meilleures surprises sont souvent sur les petites routes. »</blockquote></section>

        <section><div className="text-center"><Map className="mx-auto h-9 w-9 text-emerald-600" /><p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Choisir sa direction</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Les 6 road trips incontournables</h2></div><div className="mt-10 grid gap-5 md:grid-cols-2">{trips.map(({ id, icon: Icon, region, duration, season, description: tripDescription, stages }, index) => <article id={id} key={region} className="micro-card scroll-mt-28 rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-start justify-between gap-4"><span className="micro-icon flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><span className="text-4xl font-black text-neutral-100">{String(index + 1).padStart(2, "0")}</span></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#9a7445]">Road trip van</p><h3 className="mt-1 text-2xl font-bold text-neutral-950">{region}</h3><div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-neutral-600"><span className="rounded-full bg-neutral-100 px-3 py-1.5">{duration}</span><span className="rounded-full bg-neutral-100 px-3 py-1.5">{season}</span></div><p className="mt-4 leading-7 text-neutral-600">{tripDescription}</p><p className="mt-4 flex items-start gap-2 text-sm font-semibold text-emerald-800"><MapPin className="mt-0.5 h-4 w-4 shrink-0" />{stages}</p><Link href={`/explorer?region=${encodeURIComponent(region)}`} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-neutral-900 hover:text-emerald-700">Voir les lieux sur l’itinéraire <ArrowRight className="h-4 w-4" /></Link></article>)}</div></section>

        <section><div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Avant de prendre la route</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Conseils pour votre road trip</h2></div><div className="mt-8 grid gap-5 md:grid-cols-3">{advice.map(({ icon: Icon, title: adviceTitle, text, link }) => <div key={adviceTitle} className="rounded-2xl bg-neutral-50 p-6"><Icon className="h-6 w-6 text-emerald-700" /><h3 className="mt-4 font-bold text-neutral-950">{adviceTitle}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p>{link && <a href={link} target="_blank" rel="noreferrer" className="mt-4 inline-flex text-sm font-bold text-emerald-700 hover:underline">Consulter le site officiel ↗</a>}</div>)}</div></section>

        <section className="grid gap-5 sm:grid-cols-2"><Link href="/vanlife" className="micro-card rounded-2xl border border-neutral-200 p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#9a7445]">Guide complet</p><h2 className="mt-2 text-xl font-bold text-neutral-950">La vanlife en France</h2><p className="mt-2 text-sm text-neutral-600">Préparation, véhicule, budget et vie à bord.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Lire le guide <ArrowRight className="h-4 w-4" /></span></Link><Link href="/dormir-en-van" className="micro-card rounded-2xl border border-neutral-200 p-6"><p className="text-xs font-bold uppercase tracking-widest text-[#9a7445]">Hébergement</p><h2 className="mt-2 text-xl font-bold text-neutral-950">Où dormir en van</h2><p className="mt-2 text-sm text-neutral-600">Règles, options et bonnes pratiques.</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Lire le guide <ArrowRight className="h-4 w-4" /></span></Link></section>

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">À chaque étape</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Des lieux d’accueil vérifiés sur vos itinéraires</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Découvrez les établissements labellisés, leurs équipements et les avantages proposés aux membres.</p><Link href="/explorer" className="mt-7 inline-flex"><Button variant="cta" size="lg">Voir la carte des lieux <ArrowRight className="h-4 w-4" /></Button></Link></section>
      </article>
    </main>
  );
}
