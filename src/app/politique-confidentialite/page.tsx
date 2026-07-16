import Link from "next/link";

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
          <h2 className="text-xl font-bold text-neutral-800">Paiements</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Les paiements sont traités via Stripe. Nous ne stockons aucune information bancaire. Consultez la politique de confidentialité de Stripe pour plus d'informations.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Durée de conservation</h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Vos données sont conservées pendant la durée de votre adhésion et jusqu'à 3 ans après la résiliation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-800">Contact</h2>
          <p className="text-sm text-neutral-600">
            Pour toute question : <Link href="mailto:contact@labelvanlife.com" className="text-emerald-600 hover:underline">contact@labelvanlife.com</Link>
          </p>
        </section>
      </div>
    </div>
  );
}