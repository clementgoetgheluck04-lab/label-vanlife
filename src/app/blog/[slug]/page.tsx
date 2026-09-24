import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MAG_ARTICLES, getMagArticle, getRelatedMagArticles } from "@/data/mag";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getRichPlaceDetails, getVisibleLabelYears } from "@/data/rich-place-details";
import { labelEditionSummary } from "@/lib/label-edition";
import { magArticleSchema } from "@/lib/seo/mag-schema";
import { serializeJsonLd } from "@/lib/seo/json-ld";
import { getRouteDetails } from "@/data/mag-route-details";
import { ROUTE_VISITS } from "@/data/mag-route-visits";
import { MAG_EXTENSIONS } from "@/data/mag-extensions";
import { MAG_LOCAL_STORIES } from "@/data/mag-local-stories";
import { googleMapsRoute, wazeDestination } from "@/lib/mag-navigation";

export function generateStaticParams() {
  return MAG_ARTICLES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getMagArticle(slug);
  if (!post) return { title: "Article introuvable", robots: { index: false } };
  return {
    title: post.title, description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, url: `/blog/${post.slug}`, images: [{ url: post.image, alt: post.alt }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getMagArticle(slug);
  if (!post) notFound();
  const related = getRelatedMagArticles(slug);
  const routeDetails = post.route ? getRouteDetails(slug) : [];
  const visit = post.route ? ROUTE_VISITS[slug] : undefined;
  const localStory = post.route ? MAG_LOCAL_STORIES[slug] : undefined;
  const stay = post.route?.stay;
  const partner = stay?.id ? ENRICHED_LIEUX.find(place => place.id === stay.id && place.status === "actif") : undefined;
  const details = partner ? getRichPlaceDetails(partner.id) : undefined;
  const edition = labelEditionSummary(details ? getVisibleLabelYears(details) : []);
  return <article className="bg-cream px-6 pb-20 pt-32 text-charcoal">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(magArticleSchema(post)) }} />
    <div className="mx-auto max-w-4xl">
      <nav aria-label="Fil d’Ariane" className="text-sm">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <li><Link href="/" className="underline underline-offset-4">Accueil</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link href="/blog" className="underline underline-offset-4">Le Mag</Link></li>
          {post.route && <><li aria-hidden="true">/</li><li><Link href={`/blog#zone-${post.route.area}`} className="underline underline-offset-4">{post.route.area}</Link></li></>}
          <li aria-hidden="true">/</li>
          <li aria-current="page">{post.title}</li>
        </ol>
      </nav>
      <p className="mt-10 text-xs font-bold uppercase tracking-widest text-[#35604b]">{post.category} · Le Mag Label Vanlife</p>
      <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-6xl">{post.title}</h1>
      <p className="my-8 text-xl leading-relaxed">{post.excerpt}</p>
      {post.route && <div className="mb-8 rounded-2xl border border-charcoal/15 bg-white p-6">
        <p className="font-semibold">{post.route.duration} conseillés · {post.route.area} · {post.route.season}</p>
        <p className="mt-3 text-sm leading-relaxed">Durée indicative, selon vos envies et la météo. Carnet éditorial avec destinations ouvrables dans votre GPS, sans tracé routier contrôlé ni réservation incluse. Confirmez l’ouverture, les emplacements et les accès adaptés à votre véhicule avant le départ.</p>
        <a href="#dormir" className="mt-4 inline-block font-semibold underline underline-offset-4">Voir la base d’accueil conseillée ↓</a>
        {routeDetails.length > 0 && <div className="mt-6 border-t border-charcoal/15 pt-5">
          <h2 className="font-serif text-2xl">Emporter ce carnet dans votre GPS</h2>
          <p className="my-3 text-sm leading-relaxed">Google Maps ouvre les trois étapes dans l’ordre ci-dessous, de la première à la dernière. Waze s’ouvre destination par destination : choisissez le résultat correspondant, puis lancez le guidage dans l’application. Ces liens ne sauvegardent pas automatiquement un voyage dans votre compte.</p>
          <a href={googleMapsRoute(routeDetails.map(day => day.destination))} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full bg-[#294c3b] px-5 py-3 font-semibold text-white">Ouvrir les 3 étapes dans Google Maps ↗</a>
          <ol aria-label="Les étapes du carnet" className="my-4 list-inside list-decimal space-y-2 text-sm">{routeDetails.map((day, index) => <li key={day.destination}><a href={`#etape-${index + 1}`} className="underline underline-offset-4">{day.destination}</a></li>)}</ol>
          {localStory && <a href="#histoire-locale" className="mb-4 inline-block text-sm font-semibold underline underline-offset-4">La petite histoire du coin ↓</a>}
          <p className="text-sm leading-relaxed">Les repères de visite ne sont pas des parkings ni des lieux de nuitée. Le GPS recalcule les routes, distances et durées ; il ne garantit pas leur compatibilité avec un fourgon, un camping-car ou une caravane. Vérifiez hauteur, largeur, poids et restrictions sur place. Si votre version de Maps ignore les étapes, utilisez les boutons individuels ci-dessous.</p>
        </div>}
      </div>}
      <figure className="mx-auto max-w-xl">
        <Image src={post.image} alt={post.alt} width={post.image.endsWith(".webp") ? 1536 : 1254} height={post.image.endsWith(".webp") ? 1024 : 1254} sizes="(max-width: 640px) 100vw, 576px" priority className="h-auto w-full rounded-2xl" />
        <figcaption className="mt-3 text-xs">Illustration d’ambiance, pas une photographie d’un lieu du réseau.</figcaption>
      </figure>
      <div className="mx-auto mt-12 max-w-2xl space-y-10">
        {post.sections.map((section, index) => <section key={section.title} id={`etape-${index + 1}`} className="scroll-mt-28">
          <h2 className="mb-4 font-serif text-3xl">{section.title}</h2>
          <p className="text-lg leading-relaxed">{section.text}</p>
          {section.bullets && <ul className="mt-4 list-disc space-y-3 pl-6 leading-relaxed">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
          {routeDetails[index] && <div className="mt-6 space-y-5 rounded-2xl border border-charcoal/15 bg-white p-6">
            <div><h3 className="font-semibold">Pour commencer</h3><p className="mt-2 leading-relaxed">{routeDetails[index].morning}</p></div>
            <div><h3 className="font-semibold">Prendre le temps</h3><p className="mt-2 leading-relaxed">{routeDetails[index].afternoon}</p></div>
            <div><h3 className="font-semibold">La pause locale</h3><p className="mt-2 leading-relaxed">{routeDetails[index].pause}</p></div>
            {visit?.step === index && <aside className="rounded-xl border border-[#294c3b]/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider">Une visite concrète à préparer</p>
              <h3 className="mt-2 font-serif text-2xl">{visit.name}</h3>
              <p className="mt-2 text-sm font-semibold">{visit.time} · suggestion de rythme</p>
              <p className="mt-3 leading-relaxed">{visit.note}</p>
              <a href={visit.source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block font-semibold underline underline-offset-4">Informations officielles et conditions de visite ↗</a>
              <p className="mt-2 text-xs">Source consultée le 23 septembre 2026. Visite facultative, billet non inclus, aucun avantage membre garanti.</p>
            </aside>}
            <div className="rounded-xl bg-cream p-4"><h3 className="font-semibold">Si le programme change</h3><p className="mt-2 leading-relaxed">{routeDetails[index].alternative}</p></div>
            <p className="text-sm font-semibold">Repère à confirmer dans le GPS : {routeDetails[index].destination}</p>
            <div className="flex flex-wrap gap-3">
              <a href={googleMapsRoute([routeDetails[index].destination])} target="_blank" rel="noopener noreferrer" aria-label={`Ouvrir dans Google Maps : ${routeDetails[index].destination}`} className="inline-flex min-h-11 items-center rounded-full bg-[#294c3b] px-5 py-3 font-semibold text-white">Google Maps ↗</a>
              <a href={wazeDestination(routeDetails[index].destination)} target="_blank" rel="noopener noreferrer" aria-label={`Rechercher dans Waze : ${routeDetails[index].destination}`} className="inline-flex min-h-11 items-center rounded-full border border-[#294c3b] px-5 py-3 font-semibold text-[#294c3b]">Ouvrir dans Waze ↗</a>
            </div>
          </div>}
        </section>)}
        {localStory && <aside id="histoire-locale" aria-labelledby="histoire-locale-title" className="scroll-mt-28 rounded-2xl border border-[#b88e59]/40 bg-[#f5ead8] p-6 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-widest">La petite histoire du coin · {localStory.kind}</p>
          <h2 id="histoire-locale-title" className="mt-3 font-serif text-3xl">{localStory.title}</h2>
          <p className="mt-4 leading-relaxed">{localStory.text}</p>
          <a href={localStory.source} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold underline underline-offset-4">Pour en savoir plus : {localStory.sourceLabel} ↗</a>
          <p className="mt-2 text-xs">Source consultée le 23 septembre 2026.</p>
        </aside>}
        {MAG_EXTENSIONS[slug] && <section className="rounded-2xl border border-charcoal/15 bg-white p-6">
          <h2 className="font-serif text-2xl">{MAG_EXTENSIONS[slug].title}</h2>
          <p className="mt-3 leading-relaxed">{MAG_EXTENSIONS[slug].text}</p>
          <p className="mt-3 text-sm">Prolongement facultatif à préparer séparément, non inclus dans les liens GPS de ce carnet.</p>
        </section>}
        {post.route && <section className="rounded-2xl border border-charcoal/15 bg-white p-6">
          <h2 className="font-serif text-2xl">Avant de prendre la route</h2>
          <p className="mt-3 leading-relaxed">{post.route.caution}</p>
          <p className="mt-3 leading-relaxed">Découvrez villages, paysages et producteurs locaux par des routes adaptées à votre véhicule. En juillet et août, anticipez les réservations sur le littoral et près des grands sites. Avant de traverser une agglomération, consultez les restrictions locales et les informations du <a href="https://www.certificat-air.gouv.fr/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">site officiel Crit’Air</a>.</p>
          <p className="mt-3 text-sm">Les étapes décrivent des secteurs de visite, pas des autorisations de camper. Réservez les nuits manquantes auprès d’un accueil autorisé ; une seule adresse ne couvre pas nécessairement tout le trajet.</p>
          <h3 className="mt-5 font-semibold">Organiser les nuits et le budget</h3>
          <p className="mt-2 leading-relaxed">Utilisez la base proposée ci-dessous pour les excursions proches. Avant chaque changement de secteur, comparez le retour au camping avec une nouvelle nuitée réservée. Demandez le tarif pour votre véhicule, le nombre de voyageurs, l’électricité, les animaux et les taxes éventuelles : aucun prix de séjour n’est garanti dans ce carnet.</p>
          <h3 className="mt-5 font-semibold">La veille de chaque départ</h3>
          <ul className="mt-2 list-disc space-y-2 pl-5 leading-relaxed"><li>Confirmez l’accueil et l’heure limite d’arrivée, les visites choisies et leur ouverture.</li><li>Consultez météo et restrictions locales ; choisissez un stationnement autorisé compatible avec votre gabarit avant de lancer le guidage.</li><li>Faites eau, vidanges et déchets dans les installations prévues. Emportez eau potable, chaussures adaptées et de quoi déjeuner.</li><li>Gardez une copie du carnet et préparez vos cartes hors connexion avant une zone peu couverte. Configurez le GPS à l’arrêt.</li></ul>
        </section>}
        {stay && <section id="dormir" className="scroll-mt-28 rounded-2xl border-2 border-[#294c3b] bg-white p-7">
          <p className="text-xs font-bold uppercase tracking-widest text-[#35604b]">{partner ? edition.title : stay.source ? "Suggestion éditoriale · Non labellisée Label Vanlife" : "Adresse du réseau à reconfirmer"}</p>
          <h2 className="mt-3 font-serif text-3xl">{stay.name}</h2>
          <p className="mt-2 font-semibold">{stay.town}</p>
          <p className="mt-4 leading-relaxed">{stay.reason}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href={googleMapsRoute([`${stay.name}, ${stay.town}, France`])} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-[#294c3b] px-4 py-2 font-semibold">Le camping dans Google Maps ↗</a>
            <a href={wazeDestination(`${stay.name}, ${stay.town}, France`)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-[#294c3b] px-4 py-2 font-semibold">Le camping dans Waze ↗</a>
          </div>
          <p className="mt-3 text-xs">Confirmez le résultat et l’entrée conseillée avec le camping avant de suivre le guidage. Un lien GPS ne confirme ni disponibilité ni labellisation.</p>
          {partner ? <>
            {edition.renewalPending && <p className="mt-4 text-sm leading-relaxed">{edition.message}</p>}
            <Link href={`/lieux/${partner.id}`} className="mt-5 inline-block rounded-full bg-[#294c3b] px-5 py-3 font-semibold text-white">Consulter la fiche du lieu →</Link>
          </> : stay.source ? <>
            <p className="mt-4 text-sm leading-relaxed">Sélection documentaire, sans visite de contrôle Label Vanlife ni avantage carte membre garanti. Vérifiez tarifs, dates et accueil de votre véhicule directement auprès du lieu.</p>
            <a href={stay.source} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block font-semibold underline underline-offset-4">Consulter la source officielle et préparer le séjour ↗</a>
            <p className="mt-3 text-xs">Source consultée le 23 septembre 2026. Ce lien ouvre un autre site.</p>
          </> : <Link href="/explorer" className="mt-5 inline-block underline">Rechercher une autre étape dans le réseau</Link>}
        </section>}
        {post.resources && <section aria-labelledby="article-resources" className="rounded-2xl border border-charcoal/15 bg-white p-6">
          <h2 id="article-resources" className="font-serif text-2xl">Pour préparer votre séjour et aller plus loin</h2>
          <ul className="mt-4 space-y-4">{post.resources.map(resource => <li key={resource.href}><a href={resource.href} {...(resource.href.startsWith("https://") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="font-semibold underline underline-offset-4">{resource.label}{resource.href.startsWith("https://") ? " ↗" : " →"}</a></li>)}</ul>
          <p className="mt-4 text-sm">Sources externes consultées le 24 septembre 2026. Les horaires, accès et tarifs se vérifient auprès des organismes avant le départ. Les exemples de programme et de budget sont des propositions de la rédaction, pas des prestations réservées.</p>
        </section>}
        <aside className="rounded-2xl bg-[#294c3b] p-7 text-white">
          <h2 className="font-serif text-2xl">Du carnet à votre prochaine étape</h2>
          <p className="my-4 leading-relaxed">Poursuivez avec les informations du site. Les disponibilités et conditions du séjour se confirment auprès de chaque lieu.</p>
          <Link href={post.destination} className="inline-block rounded-full bg-cream px-5 py-3 font-semibold text-charcoal">{post.action} →</Link>
        </aside>
        <p className="text-sm">La rédaction Label Vanlife · Guide de préparation, sans témoignage de séjour revendiqué. <Link href="/presse-et-partenaires#methode-editoriale" className="font-semibold underline underline-offset-4">Notre méthode et les corrections</Link></p>
        {related.length > 0 && <section aria-labelledby="related-guides" className="border-t border-charcoal/20 pt-8">
          <h2 id="related-guides" className="font-serif text-3xl">{post.route ? `D’autres idées en ${post.route.area}` : "Poursuivre la lecture"}</h2>
          {post.route && <p className="mt-3 text-sm leading-relaxed">Des carnets de la même grande zone à comparer, pas des étapes à enchaîner : vérifiez les distances avant de construire votre voyage.</p>}
          <ul className="mt-5 space-y-4">
            {related.map(article => <li key={article.slug}>
              <Link href={`/blog/${article.slug}`} className="block rounded-xl border border-charcoal/15 bg-white p-5 transition hover:border-[#294c3b] focus-visible:outline-2 focus-visible:outline-offset-4">
                <span className="font-semibold underline underline-offset-4">{article.title} →</span>
                <span className="mt-2 block text-sm leading-relaxed">{article.excerpt}</span>
              </Link>
            </li>)}
          </ul>
        </section>}
      </div>
    </div>
  </article>;
}
