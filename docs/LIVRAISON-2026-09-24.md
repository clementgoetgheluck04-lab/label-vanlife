# Lot du 24 septembre 2026

## Changements vérifiés localement

- Mag : quatre articles hors itinéraires réécrits, Provence avec deux propositions distinctes, ressources officielles visibles et citations structurées. Les vingt itinéraires conservent étapes, visite, anecdote et camping ; ils n'ont pas tous été réécrits aujourd'hui.
- Carte : offre actuelle à 19 €, affichage public harmonisé, catalogue serveur utilisé par Checkout à 1 900 centimes. Ancien prix de renouvellement plafonné au prix actuel, sans modification des paiements historiques. Futurs tarifs annuels 39/29/19 €, fondateur 19 € à vie y compris après interruption. Grille mensuelle/trimestrielle retirée. Pas de prélèvement automatique activé.
- Simulateur du guide d'achat : six réponses locales non sauvegardées, deux formats indicatifs expliqués, test du parcours dans le navigateur.
- Agenda : Camper Van Week-End Paris–Chantilly, 9–11 octobre 2026, source organisateur https://www.camper-van-week-end.fr/chantilly/ . Pas encore d'affiche officielle ajoutée pour cet événement.
- Pilotage : automatisation existante mise en pause conformément à la demande d'abandonner les horaires fixes. Reprise au signal explicite de présence, aucune détection automatique de connexion.
- Vérification : lint, typage, 170 tests et build réussis ; paiement simulé avec Stripe/DB/mails substitués, pas de paiement réel.

## À ne pas présenter comme terminé

- La fonction de devis fidélité reste une préparation non raccordée à un moteur complet de renouvellement post-2027. Le Checkout actuel reste en paiement unique pour l'édition finissant le 31/12/2027. Le basculement réel, les anniversaires, l'historique fondateur durable et la nouvelle échéance de renouvellement doivent être vérifiés avant activation future.
- Les sessions Stripe créées avant ce changement gardent leur montant initial : aucune expiration en masse effectuée.
- La production de 1–3 nouveaux itinéraires par journée de travail et la campagne spécifique J0/J7/J15 restent à implémenter. Pas d'envoi effectué, pas de contournement de la suspension Resend.
- Les suggestions éditoriales doivent rester indépendantes de l'achat du label et ne pas laisser croire qu'un refus rend un camping de mauvaise qualité.

## Publication demandée

Déploiement lancé : https://vercel.com/clement-projects/label-vanlife/2jyQjraDCHw9mPYgRGTW8939MVSC . Vérifier le statut et l'alias avant d'affirmer la mise en ligne.
