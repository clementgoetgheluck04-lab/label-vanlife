# Base de données

## État actuel

Le schéma Prisma couvre utilisateurs, profils, adhésions, cartes, établissements, lieux, candidatures, avis, favoris, road trips, badges, passeport, paiements, blog, support et notifications. Il est syntaxiquement valide mais ne possède aucun `@@index` non unique. Les SQL présents ne constituent pas un historique Prisma standard et ne définissent pas de RLS.

## Risques de scalabilité

- Requêtes par `userId`, `placeId`, `status`, `createdAt` et `publishedAt` sans index dédié.
- Carte fondée sur deux `Float`, sans index spatial.
- Tags/services/features en JSON, difficiles à contraindre et indexer proprement.
- Compteurs dénormalisés sans règle transactionnelle.
- Numéro de carte basé sur le nombre de lignes.
- `Payment.applicationId` sans relation.
- Absence de modèle d'événement Stripe et d'idempotence.
- Suppression cascade des paiements avec l'utilisateur, problématique pour l'audit comptable.

## Cible

- Extension PostGIS et colonne `geography(Point, 4326)` indexée GiST.
- Index composites fondés sur les requêtes réelles, par exemple `(status, createdAt)`, `(userId, createdAt)` et `(placeId, createdAt)`.
- Tables normalisées pour services/tags qui sont filtrés à grande échelle.
- `orders`, `order_items`, `payments`, `stripe_events` et `entitlements` séparés.
- Identifiants publics non séquentiels ; numéro de carte généré de façon atomique.
- Conservation des enregistrements financiers et audit logs.
- Pagination par curseur, jamais offset profond sur des millions de lignes.

## Migration

1. Sauvegarde et inventaire du schéma distant.
2. Réconciliation avec Prisma sans suppression.
3. Baseline versionnée sous `prisma/migrations/`.
4. Ajout d'index via migration contrôlée, `CONCURRENTLY` si le volume l'exige.
5. Tests de rollback et vérification RLS.

Aucune migration destructive ne doit être appliquée sans validation explicite et sauvegarde restaurable.
