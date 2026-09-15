# Growth Label Vanlife

## Boucle prioritaire : recommander un lieu

1. Un voyageur recommande un lieu en moins d'une minute.
2. Le système cherche un doublon dans les lieux labellisés et repérés.
3. La recommandation est enregistrée en attente de validation.
4. Si un email public du lieu est fourni, un prospect CRM est préparé mais aucune prospection n'est déclenchée automatiquement.
5. Un administrateur vérifie la proposition.
6. Le professionnel peut ensuite revendiquer sa fiche et déposer sa candidature.
7. Après validation et paiement, le lieu enrichit la MAP.

Métriques : recommandations valides, taux de doublon, délai de vérification, taux recommandation vers revendication, taux revendication vers candidature, taux candidature vers label payé.

## Boucle Vanlife Activity

Vanlife Activity sera livrée après la persistance réelle des road trips et visites. Elle produit un récapitulatif privé par défaut, partageable uniquement après choix explicite des étapes publiques ou approximatives.

Métriques : activités éligibles, taux de génération, taux de partage, visites des pages publiques, inscriptions attribuées, conversions membre attribuées.

## Prospection

L'automatisation reste désactivée tant que les contrôles RLS, la mesure, les suppressions et le suivi de délivrabilité ne sont pas validés en production. Une activation future suit une montée progressive avec arrêt immédiat en cas de plainte, rebond anormal ou défaut de webhook.
