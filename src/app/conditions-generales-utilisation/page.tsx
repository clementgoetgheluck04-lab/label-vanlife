import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/config/contact";

export const metadata: Metadata = {
  title: "Conditions générales d’utilisation et de vente",
  description: "Règles d’utilisation de Label Vanlife et conditions applicables aux cartes membres et labellisations.",
  alternates: { canonical: "/conditions-generales-utilisation" },
};

const sectionClass = "space-y-3";
const titleClass = "text-xl font-bold text-neutral-900";
const textClass = "text-sm leading-7 text-neutral-700";

export default function ConditionsGeneralesPage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-28">
      <article className="mx-auto max-w-3xl space-y-9">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Cadre contractuel</p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Conditions générales d’utilisation et de vente</h1>
          <p className="mt-3 text-sm text-neutral-600">Version applicable au 15 septembre 2026.</p>
        </header>

        <section className={sectionClass}><h2 className={titleClass}>1. Objet et acceptation</h2><p className={textClass}>Ces conditions encadrent l’utilisation du site Label Vanlife, de l’espace membre, de la carte des lieux, des outils de road trip et du parcours de labellisation. Utiliser un espace connecté ou finaliser une commande implique l’acceptation de la version présentée au moment de l’action.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>2. Comptes et sécurité</h2><p className={textClass}>L’utilisateur fournit des informations exactes, conserve ses moyens d’accès confidentiels et signale rapidement toute utilisation suspecte. Un compte et une carte membre sont personnels, sauf personnes du foyer explicitement couvertes par l’offre achetée. Toute tentative d’accès non autorisé, de fraude ou de contournement des contrôles est interdite.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>3. Carte membre</h2><p className={textClass}>La carte donne accès aux fonctionnalités et avantages indiqués sur la page de l’offre pendant sa période de validité. Sauf mention expresse, elle n’est pas renouvelée automatiquement. Les remises sont accordées par les établissements participants selon leurs conditions publiées ; elles ne constituent pas une réservation ni une garantie de disponibilité.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>4. Labellisation des établissements</h2><p className={textClass}>Le paiement ouvre l’étude d’un dossier et ne remplace pas la validation. Les informations, autorisations, tarifs, photographies et engagements fournis doivent être sincères et à jour. En cas de non-conformité déclarée après étude, le remboursement annoncé sur l’offre est effectué selon le moyen de paiement initial. Le label peut être suspendu ou retiré en cas d’information trompeuse, de manquement à la charte ou de risque pour les voyageurs.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>5. Prix et paiement</h2><p className={textClass}>Les prix affichés au moment de la commande sont ceux applicables. Le paiement est unique et traité par Stripe. Aucun numéro complet de carte bancaire n’est reçu ou conservé par Label Vanlife. Les éventuelles offres limitées restent disponibles dans la limite annoncée.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>6. Contenus et propriété intellectuelle</h2><p className={textClass}>Les textes, signes distinctifs, créations et logiciels du service sont protégés. L’utilisateur conserve ses droits sur les contenus qu’il transmet et autorise Label Vanlife à les utiliser uniquement pour étudier, exploiter et promouvoir sa fiche ou son parcours, selon le contexte. Il garantit disposer des droits nécessaires sur ces contenus.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>7. Carte, informations et services tiers</h2><p className={textClass}>Les horaires, prix, capacités et équipements peuvent évoluer. L’utilisateur doit vérifier les informations importantes auprès du lieu avant son déplacement. Les liens vers des sites, cartes, moyens de paiement ou services tiers restent soumis aux conditions de leurs éditeurs respectifs.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>8. Disponibilité et responsabilité</h2><p className={textClass}>Label Vanlife met en œuvre des moyens raisonnables pour maintenir le service et corriger les incidents. Une interruption temporaire peut toutefois survenir pour maintenance, sécurité ou cause extérieure. Rien dans ces conditions ne limite une responsabilité qui ne pourrait légalement être exclue.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>9. Suspension et suppression</h2><p className={textClass}>Un accès peut être suspendu en cas de fraude, d’atteinte à la sécurité, de violation grave de ces conditions ou d’obligation légale. L’utilisateur peut demander la fermeture de son compte, sous réserve des données que la loi impose de conserver.</p></section>
        <section className={sectionClass}><h2 className={titleClass}>10. Droit applicable et contact</h2><p className={textClass}>Ces conditions sont régies par le droit français. Avant tout litige, les parties sont invitées à rechercher une solution amiable. Pour toute question : <Link href={CONTACT_MAILTO} className="font-semibold text-emerald-800 underline underline-offset-2">{CONTACT_EMAIL}</Link>. Les règles relatives aux données personnelles figurent dans la <Link href="/politique-confidentialite" className="font-semibold text-emerald-800 underline underline-offset-2">politique de confidentialité</Link>.</p></section>
      </article>
    </main>
  );
}
