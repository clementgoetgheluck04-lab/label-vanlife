# Évolution utile — 22 septembre 2026

## Décision produit

Renforcer les parcours existants avant d'ajouter un réseau social ou un assistant IA. Passeport, visites avec photos, modération, road-trips partageables et événements analytics existent déjà dans le code. Leur présence ne prouve ni leur utilisation réelle ni un parcours de paiement intégralement testé.

Les prix actuels restent inchangés. Aucun achat, nouvelle campagne ou migration n'est déclenché par ce lot.

## Correction locale

La candidature ne doit pas dépendre de localStorage/sessionStorage : navigation privée restrictive, stockage désactivé ou quota plein peuvent lever une exception. Les accès sont désormais protégés. Un avertissement explique lorsque la progression ne peut pas être conservée. Si le dossier est enregistré mais le Checkout indisponible, et que sa reprise ne peut pas être mémorisée, la référence du dossier et le contact sont affichés.

## Priorités suivantes, avec critères de réussite

1. **Conversion fiable** : tester en environnement isolé un dossier complet, ses pièces, un échec puis une reprise de paiement, et le rejeu d'un webhook. Aucun paiement réel utilisé pour ce test.
2. **Oppositions commerciales** : contrôler aussi les réponses entrantes et changements d'adresse ; aucune réponse entrante ne doit réactiver automatiquement un contact opposé. L'amélioration de la reprise manuelle ne suffit pas à prouver ce point.
3. **Source de vérité** : réconcilier les lieux statiques et PostgreSQL avant toute migration. Préserver identifiants, propriétaires et historique.
4. **Preuves utiles** : distinguer visite déclarée, documentée et validée ; ne pas transformer vues ou clics en réservations. Un seul timbre par lieu existe actuellement : ce n'est pas un registre de séjours répétés.
5. **Mesure** : comparer candidatures, paiements, premières visites et renouvellements sur des cohortes réelles, en tenant compte du consentement analytics. Aucun objectif commercial n'est présenté comme une statistique réalisée.

## Limites de l'audit

PostGIS et une organisation features/ sont des cibles, pas l'architecture implémentée. Le modèle PlaceScore ne constitue pas un score public validé. Les tests de contrats/source ne remplacent pas un test navigateur avec base et fournisseurs de test. Les documents antérieurs doivent être lus avec ces réserves.

Le prochain investissement utile est la vérification reproductible du tunnel complet, pas une nouvelle couche d'IA. Les changements de ce lot restent locaux tant qu'un déploiement n'est pas réalisé et contrôlé.
