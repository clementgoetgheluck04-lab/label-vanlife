import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/config/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité et cookies",
  description: "Données collectées, finalités, conservation, sous-traitants, cookies et droits des utilisateurs de Label Vanlife.",
  alternates: { canonical: "/politique-confidentialite" },
};

const sectionClass = "space-y-3";
const titleClass = "text-xl font-bold text-neutral-900";
const textClass = "text-sm leading-7 text-neutral-700";

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-28">
      <article className="mx-auto max-w-3xl space-y-9">
        <header>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-800">Vie privée</p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Politique de confidentialité et cookies</h1>
          <p className="mt-3 text-sm text-neutral-600">Dernière mise à jour : 15 septembre 2026.</p>
        </header>

        <section className={sectionClass}>
          <h2 className={titleClass}>Responsable du traitement</h2>
          <p className={textClass}>Label Vanlife est responsable des traitements décrits sur cette page. Pour toute question ou pour exercer vos droits, écrivez à <Link href={CONTACT_MAILTO} className="font-semibold text-emerald-800 underline underline-offset-2">{CONTACT_EMAIL}</Link>.</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>Données, finalités et bases légales</h2>
          <div className="overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="min-w-[640px] w-full text-left text-sm">
              <thead className="bg-neutral-950 text-white"><tr><th className="p-4">Données</th><th className="p-4">Pourquoi</th><th className="p-4">Base légale</th></tr></thead>
              <tbody className="divide-y divide-neutral-200 text-neutral-700">
                <tr><td className="p-4">Compte, identité et coordonnées</td><td className="p-4">Créer le compte et fournir les services membre ou professionnel</td><td className="p-4">Exécution du contrat</td></tr>
                <tr><td className="p-4">Commande et statut Stripe</td><td className="p-4">Traiter le paiement, activer l’accès et tenir les justificatifs</td><td className="p-4">Contrat et obligations légales</td></tr>
                <tr><td className="p-4">Candidature, pièces et fiche d’établissement</td><td className="p-4">Évaluer puis publier un lieu avec son accord</td><td className="p-4">Mesures précontractuelles et contrat</td></tr>
                <tr><td className="p-4">Email de newsletter</td><td className="p-4">Envoyer les actualités demandées</td><td className="p-4">Consentement</td></tr>
                <tr><td className="p-4">Coordonnées professionnelles publiques</td><td className="p-4">Présenter le label à des lieux dont l’activité est pertinente</td><td className="p-4">Intérêt légitime, avec opposition simple et gratuite</td></tr>
                <tr><td className="p-4">Parcours et actions sur le site</td><td className="p-4">Mesurer l’usage et améliorer le service</td><td className="p-4">Consentement</td></tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>Destinataires et sous-traitants</h2>
          <p className={textClass}>Seules les personnes habilitées de Label Vanlife et les prestataires nécessaires au service reçoivent les données utiles : Vercel pour l’hébergement, Supabase pour l’authentification et le stockage, Stripe pour les paiements et Resend pour les emails. Les données bancaires complètes ne sont jamais stockées par Label Vanlife.</p>
          <p className={textClass}>Certains prestataires peuvent traiter des données hors de l’Espace économique européen. Dans ce cas, les transferts doivent reposer sur un mécanisme reconnu par le RGPD, notamment une décision d’adéquation ou des clauses contractuelles types.</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>Durées de conservation</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-neutral-700">
            <li>Compte et accès : pendant la relation, puis le temps nécessaire aux obligations ou litiges applicables.</li>
            <li>Données de commande et justificatifs : pendant les durées légales comptables et fiscales.</li>
            <li>Candidatures non finalisées et pièces : durée strictement nécessaire à l’étude et au suivi du dossier.</li>
            <li>Prospects professionnels non clients : trois ans au plus après la collecte ou le dernier contact du prospect.</li>
            <li>Oppositions à la prospection : conservation minimale des informations nécessaires pour respecter le refus.</li>
            <li>Statistiques consenties : identifiant navigateur six mois au plus ; événements détaillés vingt-cinq mois au plus.</li>
          </ul>
        </section>

        <section id="cookies" className={`${sectionClass} scroll-mt-28`}>
          <h2 className={titleClass}>Cookies et stockage local</h2>
          <p className={textClass}>Les traceurs indispensables servent à sécuriser la connexion, maintenir une session et mémoriser votre choix de confidentialité. Ils ne peuvent pas être désactivés depuis le bandeau lorsque le service demandé en dépend.</p>
          <p className={textClass}>Sans l’option « Rester connecté », la connexion membre prend fin à la fermeture du navigateur. Avec cette option, elle peut persister sur l’appareil personnel, mais elle est automatiquement fermée après 10 jours sans consultation de l’espace membre. Une déconnexion manuelle reste disponible à tout moment.</p>
          <p className={textClass}>Les statistiques internes sont facultatives. Elles utilisent un identifiant aléatoire dans le stockage local et un identifiant de session, sans publicité ni suivi entre différents sites. Elles ne démarrent qu’après votre accord et respectent le signal « Do Not Track » de votre navigateur.</p>
          <p className={textClass}>Vous pouvez refuser dès le premier affichage et rouvrir à tout moment le panneau « Gérer mes cookies » présent en bas de chaque page. Le refus n’empêche ni la consultation du site, ni l’achat, ni l’accès membre.</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>Vos droits</h2>
          <p className={textClass}>Selon le traitement concerné, vous pouvez demander l’accès, la rectification, l’effacement, la limitation ou la portabilité de vos données, et vous opposer à un traitement fondé sur l’intérêt légitime. Vous pouvez retirer un consentement à tout moment, sans effet rétroactif.</p>
          <p className={textClass}>Écrivez à <Link href={CONTACT_MAILTO} className="font-semibold text-emerald-800 underline underline-offset-2">{CONTACT_EMAIL}</Link>. Une preuve d’identité pourra être demandée uniquement en cas de doute raisonnable. Vous pouvez également adresser une réclamation à la <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noreferrer" className="font-semibold text-emerald-800 underline underline-offset-2">CNIL</a>.</p>
        </section>

        <section className={sectionClass}>
          <h2 className={titleClass}>Sécurité et évolution</h2>
          <p className={textClass}>Label Vanlife applique des contrôles d’accès, des liens temporaires, le chiffrement des communications, une validation serveur et des limitations anti-abus. Aucun service en ligne ne pouvant être totalement exempt de risque, les mesures sont réévaluées régulièrement. Toute évolution importante de cette politique sera datée sur cette page.</p>
        </section>
      </article>
    </main>
  );
}
