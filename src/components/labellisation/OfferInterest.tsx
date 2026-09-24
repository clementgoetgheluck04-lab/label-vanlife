"use client";

import { LABEL_PRICE } from "@/config/commercial";
import { LABEL_LOYALTY_TIERS, EXCELLENCE_PROMO_LOYALTY_CENTS, EXCELLENCE_MONTHLY_CENTS, EXCELLENCE_PROMO_MONTHLY_CENTS, EXCELLENCE_CONTACT_LABEL, EXCELLENCE_PROMO_END, LABEL_OFFERS_START, LABEL_OFFER_COMPARISON, formatOfferEuros } from "@/config/label-offers";

export function OfferInterest({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <section aria-labelledby="label-offer-heading" className="rounded-2xl border border-[#c39960]/40 bg-white p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#315d4c]">L’offre disponible aujourd’hui</p>
      <h2 id="label-offer-heading" className="mt-2 text-xl font-bold text-neutral-900">Votre label Essentiel, sans abonnement</h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">Cette candidature concerne uniquement l’offre actuelle : <strong>{LABEL_PRICE} € en paiement unique</strong>, pour un label actif dès validation jusqu’au 31 décembre 2027.</p>
      <p className="mt-2 text-sm leading-6 text-neutral-700">Les futures formules ci-dessous sont présentées pour information. Elles ne remplacent pas votre offre actuelle et ne changent pas son prix.</p>
      <h3 className="mt-6 border-t border-neutral-200 pt-5 text-lg font-bold text-neutral-900">Les offres disponibles début 2027</h3>
      <p className="mt-1 text-sm text-neutral-600">Essentiel et Excellence : découvrez les services et les tarifs applicables à partir du {LABEL_OFFERS_START}.</p>
      <details className="mt-4 rounded-xl border border-neutral-200">
        <summary className="cursor-pointer rounded-xl p-4 font-semibold text-[#315d4c] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315d4c]">Comparer Essentiel et Excellence</summary>
        <div className="space-y-5 border-t border-neutral-200 p-4 sm:p-5">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">Un même label, deux niveaux de services</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-700">Les critères et l’exigence de labellisation sont identiques. Excellence ajoute des services de visibilité et d’accompagnement : le prix ne change ni les critères ni la décision de validation.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-[#f7f1e8] p-4 text-neutral-900"><h4 className="font-bold">Essentiel</h4><p className="mt-2 text-sm leading-6">Faire reconnaître votre accueil et rendre votre lieu visible dans le réseau.</p></div>
            <div className="rounded-xl bg-[#edf3ef] p-4 text-neutral-900"><h4 className="font-bold">Excellence</h4><p className="mt-2 text-sm leading-6">Tous les services Essentiel, avec un accompagnement renforcé pour faire découvrir votre destination.</p></div>
          </div>
          <div className="overflow-x-auto rounded-xl border border-neutral-200" role="region" aria-label="Tableau comparatif des services" tabIndex={0}>
            <table className="w-full min-w-[440px] text-left text-sm">
              <caption className="sr-only">Services des offres Essentiel et Excellence</caption>
              <thead className="bg-[#f7f1e8] text-neutral-900"><tr><th scope="col" className="p-3">Service</th><th scope="col" className="p-3">Essentiel</th><th scope="col" className="p-3">Excellence</th></tr></thead>
              <tbody>{LABEL_OFFER_COMPARISON.map(([label, essential, excellence]) => <tr key={label} className="border-t border-neutral-200 text-neutral-700"><th scope="row" className="p-3 font-medium text-neutral-900">{label}</th><td className="p-3">{essential}</td><td className="p-3">{excellence}</td></tr>)}</tbody>
            </table>
          </div>
          <p className="text-xs leading-5 text-neutral-600">L’exclusivité concerne uniquement un autre établissement Excellence de même catégorie dans un rayon de 15 km, pendant la durée de l’offre active. Des lieux Essentiel et des activités complémentaires peuvent rester présents. Les actions de communication ne constituent pas une garantie de visites ou de réservations.</p>
        </div>
      </details>
      <details className="mt-3 rounded-xl border border-[#315d4c]/30" data-offer-pricing>
        <summary className="cursor-pointer rounded-xl bg-[#edf3ef] p-4 font-semibold leading-6 text-[#234737] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315d4c]">Voir les tarifs des offres disponibles à partir du {LABEL_OFFERS_START}</summary>
        <div className="space-y-5 border-t border-neutral-200 p-4 sm:p-5">
          <div>
            <h3 className="text-xl font-bold text-neutral-900">Votre fidélité récompensée</h3>
            <p className="mt-2 text-sm leading-6 text-neutral-700">Tarifs pour adhésion à partir du {LABEL_OFFERS_START}. Plus vous restez avec nous, plus votre mensualité diminue. Les années correspondent à votre ancienneté d’abonnement, pas aux années calendaires.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["essential", "excellence"] as const).map((key) => (
              <div key={key} className="rounded-xl border border-neutral-200 p-4">
                <h4 className="text-lg font-bold text-[#315d4c]">{key === "essential" ? "Essentiel" : "Excellence"}</h4>
                <ol className="mt-4 space-y-4">
                  {LABEL_LOYALTY_TIERS.map((tier) => (
                    <li key={tier.label} className="border-t border-neutral-100 pt-3">
                      <p className="text-sm font-medium text-neutral-600">{tier.label}</p>
                      <p className="mt-1 text-2xl font-bold text-neutral-900">{formatOfferEuros(tier[key])} €<span className="text-sm font-normal"> / mois</span></p>
                      <p className="text-xs leading-5 text-neutral-600">Soit {formatOfferEuros(tier[key] * 12)} € sur 12 mois.</p>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="text-sm leading-6 text-neutral-700">Abonnements mensuels avec engagement initial de 12 mois. Les paliers fidélité s’appliquent dans la continuité de l’abonnement ; le tarif de la troisième année est ensuite conservé tant que l’abonnement reste actif.</p>
          <p className="rounded-xl bg-[#f7f1e8] p-4 text-sm leading-6 text-neutral-800">Déjà adhérent ? Vos droits achetés ou offerts restent valables jusqu’à leur échéance, sans supplément ni conversion automatique en abonnement.</p>
          <details className="rounded-xl border border-neutral-200">
            <summary className="cursor-pointer p-4 text-sm font-semibold text-[#315d4c]">Intéressé par Excellence avant le {LABEL_OFFERS_START} ?</summary>
            <div className="space-y-2 px-4 pb-4 text-sm leading-6 text-neutral-700">
              <p>Offre anticipée : −20 % pour une souscription jusqu’au {EXCELLENCE_PROMO_END} inclus. Tarif d’entrée : {formatOfferEuros(EXCELLENCE_PROMO_MONTHLY_CENTS)} €/mois au lieu de {formatOfferEuros(EXCELLENCE_MONTHLY_CENTS)} €, soit {formatOfferEuros(EXCELLENCE_PROMO_MONTHLY_CENTS * 12)} € sur les 12 premiers mois. La remise de 20 % est conservée aux renouvellements.</p>
              <p>La remise se cumule avec votre fidélité : {EXCELLENCE_PROMO_LOYALTY_CENTS.map(formatOfferEuros).join(" € → ")} €/mois, respectivement en première année, deuxième année, puis à partir de la troisième année.</p>
              <p>La mise en place des services et la disponibilité de votre zone sont confirmées avant toute souscription.</p>
              <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-xl bg-[#f7f1e8] p-4 text-sm leading-6 text-neutral-900">
                <input type="checkbox" name="excellenceContactRequested" checked={checked} onChange={(event) => onChange(event.target.checked)} aria-describedby="excellence-interest-note" className="mt-1 h-5 w-5 shrink-0 accent-[#315d4c]" />
                <span>{EXCELLENCE_CONTACT_LABEL}</span>
              </label>
              <p id="excellence-interest-note" className="mt-2 text-xs leading-5 text-neutral-600">Facultatif. Votre choix est transmis avec votre candidature. Il ne modifie pas le prix à payer, ne réserve pas de zone et ne souscrit aucun abonnement.</p>
            </div>
          </details>
        </div>
      </details>
    </section>
  );
}
