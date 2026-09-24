import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/config/contact";
import { BRAND_ASSETS } from "@/config/brand-assets";

const title = "Presse et partenaires : faire connaître une vanlife respectueuse";
const description = "Médias, clubs Combi, loueurs et acteurs du tourisme : découvrez Label Vanlife, ses critères d’accueil et les possibilités de collaboration.";

export const metadata: Metadata = {
  title: "Presse, partenaires et méthode éditoriale", description,
  alternates: { canonical: "/presse-et-partenaires" },
  openGraph: { title, description, url: "/presse-et-partenaires", type: "website", images: [{ url: BRAND_ASSETS.socialCover, alt: "Label Vanlife — presse et partenaires" }] },
  twitter: { card: "summary_large_image", title, description, images: [BRAND_ASSETS.socialCover] },
};

export default function PressPartnersPage() {
  return (
    <main className="bg-[#f7f7f2] px-6 pb-20 pt-32 text-neutral-900">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-emerald-800">Presse · clubs · partenaires</p>
        <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">Des humains qui voyagent.<br />Des lieux qui les accueillent.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8">Combi rétro, van moderne, fourgon, tente de toit, caravane ou camping-car : Label Vanlife rassemble autour d’une manière de voyager, fondée sur le respect des hôtes, de la nature et de la vie locale.</p>
        <a href={`${CONTACT_MAILTO}?subject=${encodeURIComponent("Presse ou partenariat — Label Vanlife")}`} className="mt-8 inline-flex min-h-12 items-center rounded-xl bg-emerald-900 px-6 py-3 font-semibold text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4">Parlons de votre projet</a>

        <section className="mt-14 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-9" aria-labelledby="presentation">
          <h2 id="presentation" className="text-2xl font-bold">Label Vanlife, en quelques mots</h2>
          <p className="mt-4 leading-7">Label Vanlife met en relation des voyageurs itinérants et des lieux d’accueil. Les établissements candidats sont étudiés selon un référentiel publié. La carte membre donne accès aux services de l’espace membre et aux avantages proposés par les lieux partenaires, selon leurs conditions.</p>
          <p className="mt-4 leading-7">Le projet est porté par Clément, ancien directeur de camping et vanlifer depuis plus de 20 ans. Son ambition : rapprocher les besoins des voyageurs et les réalités des établissements.</p>
          <p className="mt-4 leading-7">Un lieu « repéré » n’est pas un lieu labellisé. Consultez le statut et l’année indiqués sur chaque fiche. Label Vanlife est une démarche indépendante, pas une certification publique ni une garantie de fréquentation.</p>
          <div className="mt-6 flex flex-wrap gap-5 font-semibold text-emerald-900">
            <Link className="underline underline-offset-4" href="/referentiel-label-vanlife">Lire le référentiel</Link>
            <Link className="underline underline-offset-4" href="/philosophie-vanlife">Notre philosophie</Link>
            <Link className="underline underline-offset-4" href="/explorer">Consulter les lieux</Link>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="collaborations">
          <h2 id="collaborations" className="text-2xl font-bold">Trois façons de faire avancer le voyage responsable</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              ["Médias et créateurs", "Un entretien sur l’accueil des voyageurs, une présentation du projet ou un retour de terrain. Chaque rédaction conserve sa liberté éditoriale."],
              ["Clubs et communautés", "Combi anciens ou véhicules modernes : partager des conseils utiles et ouvrir le dialogue sur les attentes des voyageurs et des hôtes."],
              ["Loueurs et tourisme local", "Étudier ensemble un relais d’information pour aider les voyageurs à préparer leurs étapes et découvrir les acteurs locaux."],
            ].map(([heading, text]) => <article key={heading} className="rounded-2xl border border-neutral-200 bg-white p-6"><h3 className="text-lg font-bold">{heading}</h3><p className="mt-3 leading-7 text-neutral-700">{text}</p></article>)}
          </div>
          <p className="mt-5 text-sm leading-6 text-neutral-600">Ces pistes sont des propositions de collaboration, pas l’annonce de partenariats déjà conclus.</p>
        </section>

        <section className="mt-12 rounded-3xl border border-neutral-200 bg-white p-6 sm:p-9" aria-labelledby="methode-editoriale">
          <h2 id="methode-editoriale" className="scroll-mt-28 text-2xl font-bold">Comment lire et vérifier nos guides ?</h2>
          <p className="mt-4 leading-7">Le Mag Label Vanlife est un ensemble de guides de préparation, pas un compte rendu de voyages réalisés par la rédaction. Il propose des étapes et des idées de visite ; il ne garantit ni les disponibilités, ni les tarifs, ni la praticabilité des routes pour tous les véhicules.</p>
          <dl className="mt-6 space-y-6">
            <div><dt className="font-bold">D’où viennent les informations locales ?</dt><dd className="mt-2 leading-7">Les carnets renvoient aux sources consultées : offices de tourisme, monuments, collectivités et sites des exploitants. La date de consultation est indiquée à proximité. Une légende est présentée comme une légende, pas comme un fait historique établi.</dd></div>
            <div><dt className="font-bold">Une adresse conseillée est-elle labellisée ?</dt><dd className="mt-2 leading-7">Non, pas nécessairement. Une suggestion éditoriale non labellisée n’a pas reçu le label et ne garantit aucun avantage membre. Pour un lieu du réseau, vérifiez sa fiche et son année de labellisation. Le <Link href="/referentiel-label-vanlife" className="font-semibold underline underline-offset-4">référentiel public</Link> décrit la démarche de labellisation, distincte de la sélection documentaire du Mag.</dd></div>
            <div><dt className="font-bold">Les images montrent-elles les lieux visités ?</dt><dd className="mt-2 leading-7">Les illustrations éditoriales sont des scènes imaginées, réalisées avec assistance d’IA. Elles ne constituent ni des photographies des établissements, ni une preuve de visite ou de contrôle. Les conseils du guide d’achat ne prétendent pas remplacer un essai ou une expertise du véhicule.</dd></div>
            <div><dt className="font-bold">Comment signaler une information à corriger ?</dt><dd className="mt-2 leading-7">Écrivez à <a href={CONTACT_MAILTO} className="font-semibold underline underline-offset-4">{CONTACT_EMAIL}</a> en indiquant le lien du guide, le passage concerné et, si possible, une source officielle récente. Avant de partir, confirmez les conditions directement auprès des lieux et organisateurs.</dd></div>
          </dl>
          <p className="mt-6"><Link href="/blog#itineraires" className="font-semibold text-emerald-900 underline underline-offset-4">Consulter les itinéraires et leurs sources →</Link></p>
        </section>

        <section className="mt-12 border-t border-neutral-300 pt-8" aria-labelledby="editorial">
          <h2 id="editorial" className="text-2xl font-bold">Pour préparer votre publication</h2>
          <p className="mt-4 leading-7">Vous pouvez citer cette présentation avec un lien vers notre site. Pour un entretien, des visuels dont les droits sont vérifiés ou des informations complémentaires, écrivez à <a className="font-semibold text-emerald-900 underline underline-offset-4" href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>.</p>
          <p className="mt-4 text-sm leading-6 text-neutral-600">Le kit et les badges de labellisation restent réservés aux établissements autorisés. Une mention éditoriale ne vaut pas attribution du label.</p>
        </section>
      </div>
    </main>
  );
}
