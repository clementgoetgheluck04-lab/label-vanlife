import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Baby, BedDouble, BookOpen, ChevronRight, Droplets, Heart, Map, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "Vanlife en famille : le guide complet pour voyager avec des enfants";
const description = "Aménagement, sécurité, rythme, hygiène, itinéraires et scolarité : préparez sereinement un voyage en van avec vos enfants.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/vanlife-famille" },
  keywords: ["vanlife famille", "voyager en van avec enfants", "van aménagé famille", "road trip famille France"],
  openGraph: {
    title,
    description,
    type: "article",
    url: "/vanlife-famille",
    images: [{ url: "/images/people/helene-family-vanlifers.png", width: 1536, height: 1024, alt: "Famille en voyage devant son van aménagé" }],
  },
};

const keys = [
  { icon: BedDouble, title: "Aménagement couchage", text: "Un couchage simple à installer évite de transformer tout le van chaque soir. Lit fixe, pavillon ou toit relevable : choisissez selon l'âge des enfants, les protections prévues par le fabricant et votre besoin d'espace quotidien." },
  { icon: ShieldCheck, title: "Sécurité à bord", text: "Chaque passager voyage assis et attaché. Les enfants de moins de 10 ans utilisent un dispositif homologué adapté à leur morphologie. Personne ne voyage dans un lit ou dans l'espace de vie lorsque le véhicule roule." },
  { icon: Droplets, title: "Sanitaires et hygiène", text: "Avec des enfants, l'eau, les toilettes et les douches deviennent prioritaires. Alternez les étapes autonomes avec des campings ou des lieux d'accueil correctement équipés." },
  { icon: SlidersHorizontal, title: "Rythme lent", text: "Rester deux à quatre nuits au même endroit apporte des repères, limite la fatigue et laisse aux enfants le temps de découvrir le lieu, de jouer et de rencontrer d'autres familles." },
  { icon: BookOpen, title: "Activités et apprentissage", text: "Lire la carte, aider à préparer le repas, tenir un carnet de voyage ou observer les étoiles transforme le trajet en expérience. Gardez aussi des temps calmes et sans programme." },
  { icon: Heart, title: "Santé et administration", text: "Vérifiez assurance, assistance et couverture de l'aménagement. Pour l'Europe, chaque membre de la famille, y compris chaque enfant, doit disposer de sa propre CEAM. Conservez ordonnances et documents utiles dans un dossier protégé." },
] as const;

const routes = [
  { emoji: "⚓", name: "Bretagne", duration: "7 à 10 jours", text: "Plages, châteaux, crêperies et sentiers côtiers. Prévoyez des étapes courtes et une solution de repli pour les jours de pluie." },
  { emoji: "🛶", name: "Ardèche", duration: "5 à 7 jours", text: "Grottes, baignades et activités de pleine nature. Adaptez les sorties à l'âge des enfants et anticipez la chaleur en été." },
  { emoji: "🌊", name: "Landes", duration: "7 jours", text: "Océan, forêt de pins et pistes cyclables. Une destination simple pour alterner activité, baignade surveillée et journées calmes." },
  { emoji: "🏔️", name: "Vercors et Drôme", duration: "5 à 7 jours", text: "Villages, plateaux et randonnées courtes. Vérifiez toujours la météo et le dénivelé avant une sortie familiale." },
] as const;

const faqs = [
  { question: "Peut-on faire de la vanlife avec des enfants en bas âge ?", answer: "Oui, à condition d'adapter le véhicule et le rythme : couchage sécurisé, siège auto homologué, eau disponible, pauses fréquentes et étapes avec sanitaires. Un premier week-end proche de chez vous permet de tester l'organisation sans pression." },
  { question: "Quelle taille de van faut-il pour une famille ?", answer: "Il n'existe pas de taille universelle. Pour deux adultes et un ou deux enfants, beaucoup de familles choisissent un fourgon offrant quatre places homologuées et quatre couchages. Vérifiez surtout la carte grise, la charge utile, les places ceinturées, l'accès aux lits et la facilité d'usage au quotidien avant d'acheter." },
  { question: "Comment gérer la scolarité pendant une longue vanlife ?", answer: "Pour les vacances et week-ends, l'enfant reste dans son organisation scolaire habituelle. Pour un projet de longue durée concernant un enfant soumis à l'obligation d'instruction, l'instruction en famille n'est pas une simple déclaration : elle est soumise à une autorisation annuelle du Dasen et à des conditions précises. Renseignez-vous suffisamment tôt auprès de votre académie." },
] as const;

export default function FamilyVanlifePage() {
  const schemas = [
    { "@context": "https://schema.org", "@type": "Article", headline: title, description, image: "https://labelvanlife.com/images/people/helene-family-vanlifers.png", author: { "@type": "Organization", name: "Label Vanlife" }, publisher: { "@type": "Organization", name: "Label Vanlife" }, mainEntityOfPage: "https://labelvanlife.com/vanlife-famille" },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return (
    <main className="bg-white pb-24 pt-16 text-neutral-800">
      {schemas.map((schema, index) => <script key={index} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />)}

      <div className="mx-auto max-w-6xl px-6 pt-8">
        <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-2 text-xs text-neutral-400"><Link href="/" className="hover:text-emerald-700">Accueil</Link><ChevronRight className="h-3.5 w-3.5" /><Link href="/vanlife" className="hover:text-emerald-700">Vanlife</Link><ChevronRight className="h-3.5 w-3.5" /><span className="text-neutral-700">Vanlife famille</span></nav>
      </div>

      <header className="mx-auto grid max-w-6xl gap-9 px-6 py-12 lg:grid-cols-[1.02fr_.98fr] lg:items-center lg:py-16">
        <div className="animate-fade-in-up">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a7445]">Guide pratique</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] text-neutral-950 sm:text-6xl">Vanlife en famille : voyager en van avec des enfants</h1>
          <p className="mt-5 text-lg leading-8 text-neutral-600">Un van, des parents, des enfants qui regardent les étoiles. La vanlife en famille est possible — et les souvenirs construits ensemble changent souvent la manière de voyager.</p>
          <div className="mt-6 flex flex-wrap gap-2">{["Famille avec enfants", "Aménagement van", "Sécurité à bord", "Lieux adaptés"].map((tag) => <span key={tag} className="rounded-full border border-[#c39960]/30 bg-[#f7f1e8] px-3 py-1.5 text-xs font-semibold text-[#7d5d38]">{tag}</span>)}</div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl shadow-neutral-900/15"><Image src="/images/people/helene-family-vanlifers.png" alt="Famille installée devant son van aménagé" fill priority sizes="(max-width: 1024px) 100vw, 48vw" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" /></div>
      </header>

      <article className="mx-auto max-w-4xl space-y-20 px-6">
        <section className="text-lg leading-8 text-neutral-600">
          <p>Le plus grand mythe autour de la vanlife en famille consiste à penser qu'il faudrait attendre que les enfants soient grands. En réalité, ils s'adaptent souvent plus vite que les adultes à un nouvel espace et à un nouveau rythme.</p>
          <p className="mt-4">L'objectif n'est pas de reproduire une maison dans quelques mètres carrés. Il est de créer un espace sûr, lisible et suffisamment simple pour que chacun trouve sa place.</p>
          <blockquote className="mt-8 rounded-3xl bg-neutral-950 p-7 text-white sm:p-9"><p className="text-xl font-medium leading-8 text-white/90">« Notre fils de 5 ans nous a dit : le van est plus grand que notre maison parce qu’on peut aller partout. »</p><footer className="mt-4 text-sm text-[#dfc59f]">— Témoignage d’une famille vanlife</footer></blockquote>
        </section>

        <section>
          <div className="text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Les fondamentaux</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">6 clés pour réussir sa vanlife en famille</h2><p className="mx-auto mt-3 max-w-2xl text-neutral-500">Les repères qui reviennent le plus souvent chez les familles expérimentées.</p></div>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">{keys.map(({ icon: Icon, title: keyTitle, text }) => <div key={keyTitle} className="micro-card rounded-2xl border border-neutral-200 bg-white p-6"><span className="micro-icon flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Icon className="h-5 w-5" /></span><h3 className="mt-5 text-lg font-bold text-neutral-950">{keyTitle}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{text}</p></div>)}</div>
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm leading-6 text-emerald-950"><p className="font-bold">Sécurité routière</p><p className="mt-1">Le siège doit être homologué, adapté à la morphologie de l'enfant et installé selon les notices du siège et du véhicule. Les enfants de moins de 10 ans voyagent normalement à l'arrière, sauf exceptions prévues par la réglementation.</p><a href="https://www.securite-routiere.gouv.fr/chacun-sa-conduite-1/siege-auto-les-dispositifs-de-retenue" target="_blank" rel="noreferrer" className="mt-2 inline-flex font-semibold underline underline-offset-2">Consulter les règles officielles</a></div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-6"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a7445]">Idées de parcours</p><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">4 itinéraires adaptés aux familles</h2></div><Map className="hidden h-10 w-10 text-[#c39960] sm:block" /></div>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">{routes.map((route) => <div key={route.name} className="group rounded-2xl border border-neutral-200 p-6 transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"><div className="flex items-center justify-between"><span className="text-3xl" aria-hidden="true">{route.emoji}</span><span className="rounded-full bg-[#f7f1e8] px-3 py-1 text-xs font-bold text-[#8b673d]">{route.duration}</span></div><h3 className="mt-5 text-xl font-bold text-neutral-950">{route.name}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{route.text}</p><Link href="/explorer" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">Voir les lieux labellisés <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link></div>)}</div>
        </section>

        <section>
          <div className="text-center"><Baby className="mx-auto h-9 w-9 text-[#c39960]" /><h2 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Questions fréquentes — vanlife en famille</h2></div>
          <div className="mt-8 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200">{faqs.map((faq) => <details key={faq.question} className="group bg-white p-5 open:bg-[#f7f1e8]/45 sm:p-6"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-bold text-neutral-900"><span>{faq.question}</span><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg transition group-open:rotate-45 group-open:bg-[#c39960] group-open:text-white">+</span></summary><p className="mt-4 pr-10 text-sm leading-7 text-neutral-600">{faq.answer}</p></details>)}</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2"><a href="https://www.service-public.fr/particuliers/vosdroits/F23429" target="_blank" rel="noreferrer" className="rounded-xl border border-neutral-200 p-4 text-sm transition hover:border-[#c39960]"><strong className="block text-neutral-900">Instruction en famille</strong><span className="text-neutral-500">Conditions et autorisation sur Service-Public.fr</span></a><a href="https://www.ameli.fr/assure/droits-demarches/europe-international/protection-sociale-etranger/vacances-etranger" target="_blank" rel="noreferrer" className="rounded-xl border border-neutral-200 p-4 text-sm transition hover:border-[#c39960]"><strong className="block text-neutral-900">Santé en Europe</strong><span className="text-neutral-500">Demander une CEAM pour chaque membre de la famille</span></a></div>
        </section>

        <section className="rounded-3xl bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 text-center text-white sm:p-12"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">Préparer la prochaine étape</p><h2 className="mt-3 text-3xl font-bold sm:text-4xl">Des lieux où les familles sont réellement les bienvenues</h2><p className="mx-auto mt-4 max-w-2xl text-emerald-50/80">Consultez les équipements, les conditions d'accueil et les informations pratiques avant de choisir votre prochaine halte.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/explorer"><Button variant="cta" size="lg" className="w-full sm:w-auto">Voir les lieux Label Vanlife <ArrowRight className="h-4 w-4" /></Button></Link><Link href="/vanlife"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Lire le guide Vanlife France</Button></Link></div></section>
      </article>
    </main>
  );
}
