import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/config/contact";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <h1 className="text-3xl font-bold text-neutral-900" style={{ fontFamily: "Outfit, sans-serif" }}>Politique de Confidentialité</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Collecte des données</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Nous collectons les données suivantes : nom, prénom, adresse email, et informations de paiement via Stripe. Ces données sont collectées lors de l'inscription ou de la candidature à la labellisation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Utilisation des données</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Vos données sont utilisées pour : gérer votre compte membre, traiter les candidatures de labellisation, vous envoyer des communications liées à votre adhésion, et améliorer nos services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Prospection auprès des établissements professionnels</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Pour présenter Label Vanlife à des établissements dont l’activité est directement liée à l’accueil touristique ou aux voyageurs en van, nous pouvons utiliser leurs coordonnées professionnelles rendues publiques sur leur site internet ou dans un annuaire professionnel. Ce traitement repose sur notre intérêt légitime à développer le réseau Label Vanlife.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Chaque message précise l’identité de Label Vanlife, la raison du contact et comporte un moyen de s’opposer simplement et gratuitement à toute nouvelle sollicitation. Une opposition, un refus, une plainte ou une adresse invalide arrête immédiatement les relances et place l’adresse sur une liste d’exclusion.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Paiements</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Les paiements sont traités via Stripe. Nous ne stockons aucune information bancaire. Consultez la politique de confidentialité de Stripe pour plus d'informations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Durée de conservation</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Les données des membres et partenaires sont conservées pendant la relation contractuelle puis pendant la durée nécessaire au respect de nos obligations. Les données d’un prospect non client sont conservées au maximum trois ans à compter de leur collecte ou du dernier contact émanant du prospect. Les informations nécessaires au respect d’une opposition peuvent être conservées afin d’éviter toute nouvelle sollicitation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Contact</h2>
          <p className="text-sm text-neutral-600">
            Pour toute question : <Link href={CONTACT_MAILTO} className="text-emerald-600 hover:underline">{CONTACT_EMAIL}</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
