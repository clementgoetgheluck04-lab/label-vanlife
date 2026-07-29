# Base de données

## État actuel

Le schéma Prisma couvre utilisateurs, profils, accompagnants, adhésions, cartes, établissements, lieux, candidatures, avis, favoris, road trips, badges, passeport, paiements, blog, support et notifications. Les migrations sont versionnées et la RLS Supabase protège les données privées par propriétaire ou rôle administrateur.

Le titulaire possède un âge optionnel dans `profiles`. Les personnes couvertes supplémentaires sont stockées dans `member_companions` (`firstName`, `lastName`, `age`, `userId`) afin que la carte membre affiche une identité et un numéro dérivé distincts pour chaque personne, sans placer ces données dans les métadonnées Stripe ou Supabase Auth.

## Risques de scalabilité

- Certains accès à grand volume nécessiteront encore des index composites guidés par les requêtes réelles.
- Carte fondée sur deux `Float`, sans index spatial.
- Tags/services/features en JSON, difficiles à contraindre et indexer proprement.
- Compteurs dénormalisés sans règle transactionnelle.
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
