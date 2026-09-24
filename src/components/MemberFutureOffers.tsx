import { MEMBER_LOYALTY_TIERS, MEMBER_OFFERS_START, MEMBER_PAYMENT_GRACE_DAYS } from "@/config/member-offers";

const euros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function MemberFutureOffers() {
  return (
    <section aria-labelledby="future-member-offers" className="mx-auto max-w-4xl px-6 pb-12">
      <details className="rounded-2xl border border-emerald-200 bg-white text-left">
        <summary id="future-member-offers" className="cursor-pointer rounded-2xl bg-emerald-50 p-5 font-semibold text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700">Voir les offres carte membre disponibles à partir du {MEMBER_OFFERS_START}</summary>
        <div className="space-y-6 p-5 sm:p-7">
          <div>
            <h2 className="text-2xl font-bold text-neutral-900">Ta fidélité mérite d’être récompensée.</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-700">À partir du {MEMBER_OFFERS_START}, un seul paiement annuel. Ton tarif diminue avec ton ancienneté continue d’adhésion, et non selon l’année civile. Aucun paiement mensuel ni trimestriel.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {MEMBER_LOYALTY_TIERS.map((tier) => (
              <article key={tier.label} className="rounded-xl border border-neutral-200 p-4">
                <h3 className="font-bold text-emerald-900">{tier.label}</h3>
                <div className="mt-4 border-t border-neutral-200 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Paiement annuel unique</p>
                  <p className="mt-1 text-2xl font-bold text-neutral-900">{euros(tier.annual)} €<span className="text-sm font-normal"> / an</span></p>
                </div>
              </article>
            ))}
          </div>
          <div className="text-sm leading-6 text-neutral-700">
            <h3 className="font-bold text-neutral-900">Comment conserver ton tarif fidélité ?</h3>
            <p className="mt-2">Le tarif de troisième année est conservé tant que ton abonnement reste actif. Après une résiliation puis une réinscription, tu repars au tarif de première année.</p>
            <p className="mt-2">En cas d’incident de paiement, tu disposes de {MEMBER_PAYMENT_GRACE_DAYS} jours pour régulariser et conserver ton ancienneté. Ce délai ne prolonge pas une résiliation volontaire.</p>
          </div>
          <div className="rounded-xl bg-[#f7f1e8] p-4 text-sm leading-6 text-neutral-800">
            <p><strong>Tu possèdes déjà une carte ?</strong> Elle conserve ses conditions et sa date d’expiration. Aucun passage automatique à un abonnement et aucun supplément.</p>
            <p className="mt-2"><strong>Offre fondateur : 19 €/an à vie.</strong> Le premier achat à 19 € couvre la période jusqu’au 31 décembre 2027. Ensuite, chaque année d’adhésion est réglée en une fois à 19 €. Ton tarif fondateur reste acquis même après une interruption : ce n’est pas un accès à vie pour un paiement unique. Les achats fondateurs antérieurs à 29 € conservent leur validité et bénéficient de 19 € pour leurs futurs renouvellements, sans remboursement automatique du paiement initial.</p>
          </div>
        </div>
      </details>
    </section>
  );
}
