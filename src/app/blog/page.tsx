import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MAG_ARTICLES } from "@/data/mag";

export const metadata: Metadata = {
  title: "Le Mag — 20 itinéraires en France et en Corse",
  description: "20 itinéraires illustrés en France, dont 3 en Corse : étapes, durées conseillées et lieux d’accueil. Labellisés et suggestions non labellisées clairement distingués.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Le Mag Label Vanlife", description: "Des routes. Des rencontres. Des lieux qui valent le détour.", url: "/blog", images: ["/images/mag/itineraires/communaute-camping.webp"] },
};

export default function BlogPage() {
  return <div className="bg-cream pt-28 text-charcoal">
    <header className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-20">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.25em]">Le journal de Label Vanlife</p>
        <h1 className="my-6 font-serif text-7xl leading-none sm:text-8xl">Le Mag<span className="text-[#35604b]">.</span></h1>
        <p className="max-w-lg text-2xl leading-snug">Des routes. Des rencontres.<br />Des lieux qui valent le détour.</p>
        <p className="mt-6 max-w-lg leading-relaxed">Combi rétro, fourgon, tente de toit, caravane ou camping-car : ce qui nous rassemble, ce sont les humains qui voyagent. Et leur attention aux lieux traversés.</p>
        <Link href="#itineraires" className="mt-8 inline-flex rounded-full bg-[#294c3b] px-6 py-3 font-semibold text-white hover:bg-[#1d382b]">Choisir parmi 20 itinéraires →</Link>
        <p className="mt-4 text-sm">France continentale & Corse · De 3 à 5 jours · À adapter à votre rythme</p>
      </div>
      <figure>
        <Image src="/images/mag/itineraires/communaute-camping.webp" alt="Illustration de voyageurs accueillis dans un camping avec des vans et fourgons de couleurs variées." width={1536} height={1024} sizes="(max-width: 1024px) 100vw, 50vw" priority className="h-auto w-full rounded-3xl border border-charcoal/10" />
        <figcaption className="mt-3 text-center text-xs">Illustration d’ambiance · Les lieux se découvrent dans leurs fiches.</figcaption>
      </figure>
    </header>
    <nav aria-label="Rubriques du Mag" className="border-y border-charcoal/15">
      <div className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-3 px-6 py-5 text-sm font-semibold">
        <a href="#lectures" className="underline underline-offset-4">Nos lectures</a>
        <a href="#itineraires" className="underline underline-offset-4">20 itinéraires</a>
        <Link href="/vanlife-regions">Prendre la route</Link>
        <Link href="/explorer">Des lieux et des rencontres</Link>
        <Link href="/philosophie-vanlife">Voyager avec attention</Link>
      </div>
    </nav>
    <section id="itineraires" className="mx-auto max-w-6xl scroll-mt-28 px-6 py-16">
      <p className="text-xs uppercase tracking-widest">20 façons de prendre la route</p>
      <h2 className="mt-3 font-serif text-4xl">La France, une étape à la fois.</h2>
      <p className="mt-5 max-w-3xl leading-relaxed">Des propositions de parcours, pas des circuits chronométrés. Chaque carnet présente une base d’accueil à consulter : lieu du réseau lorsque disponible, ou suggestion éditoriale non labellisée. Les visites ne sont pas des emplacements pour la nuit.</p>
      <nav aria-label="Choisir une zone" className="my-8 flex flex-wrap gap-3">
        {["Ouest", "Nord", "Sud-Ouest", "Centre", "Est", "Sud-Est", "Corse"].map(area => <a key={area} href={`#zone-${area}`} className="rounded-full border border-[#294c3b] px-4 py-2 font-semibold text-[#294c3b] hover:bg-white">{area}</a>)}
      </nav>
      {["Ouest", "Nord", "Sud-Ouest", "Centre", "Est", "Sud-Est", "Corse"].map(area => <section key={area} id={`zone-${area}`} className="mb-12 scroll-mt-28">
        <h3 className="mb-5 font-serif text-3xl">{area}</h3>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {MAG_ARTICLES.filter(post => post.route?.area === area).map(post => <article key={post.slug} className="overflow-hidden rounded-2xl border border-charcoal/15 bg-white">
            <Link href={`/blog/${post.slug}`} aria-label={`Lire : ${post.title}`}><Image src={post.image} alt={post.alt} width={1536} height={1024} sizes="(max-width:768px) 100vw, (max-width:1024px) 50vw, 33vw" className="aspect-[3/2] h-auto w-full object-cover" /></Link>
            <div className="p-6">
              <p className="text-sm font-semibold text-[#35604b]">{post.route?.duration} · {post.route?.season}</p>
              <h4 className="my-3 font-serif text-2xl"><Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h4>
              <p className="text-sm leading-relaxed">{post.excerpt}</p>
              <p className="mt-4 text-xs font-semibold">{post.route?.stay.id ? "Avec une étape du réseau · millésime sur la fiche" : "Avec une suggestion non labellisée"}</p>
              <Link href={`/blog/${post.slug}`} className="mt-5 inline-block font-semibold underline underline-offset-4">Voir les étapes et le lieu conseillé →</Link>
            </div>
          </article>)}
        </div>
      </section>)}
    </section>
    <section id="lectures" className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-16">
      <p className="text-xs uppercase tracking-widest">Le carnet ouvert</p>
      <h2 className="mt-3 font-serif text-4xl">Une idée pour la prochaine étape</h2>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {MAG_ARTICLES.filter(post => !post.route).map(post => <article key={post.slug} className="overflow-hidden rounded-2xl border border-charcoal/15 bg-white">
          <Image src={post.image} alt={post.alt} width={post.image.endsWith(".webp") ? 1536 : 1254} height={post.image.endsWith(".webp") ? 1024 : 1254} sizes="(max-width: 768px) 100vw, 50vw" className="h-auto w-full object-contain" />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#35604b]">{post.category}</p>
            <h3 className="my-4 font-serif text-3xl"><Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h3>
            <p className="leading-relaxed">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="mt-6 inline-block font-semibold underline underline-offset-4">Lire le carnet →<span className="sr-only"> {post.title}</span></Link>
          </div>
        </article>)}
      </div>
    </section>
    <section className="bg-[#294c3b] px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl space-y-5">
        <p className="text-xs uppercase tracking-widest">La route appartient aussi à ceux qui la racontent</p>
        <h2 className="font-serif text-4xl">Votre histoire a sa place ici.</h2>
        <p className="leading-relaxed">Une rencontre, une étape, une leçon de voyage ? Proposez-nous votre récit. Nous échangeons avec vous avant toute publication. Pas besoin d’un voyage spectaculaire : une histoire sincère suffit.</p>
        <a href="mailto:contact@labelvanlife.com?subject=Mon%20r%C3%A9cit%20pour%20Le%20Mag" className="inline-block rounded-full bg-cream px-6 py-3 font-semibold text-charcoal">Proposer mon récit</a>
        <p className="text-sm">N’envoyez que des photos que vous avez le droit de partager, avec l’accord des personnes reconnaissables.</p>
      </div>
    </section>
  </div>;
}
