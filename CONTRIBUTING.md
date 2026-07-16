# Contribuer à Label Vanlife

## Flux de travail

1. Partir de `develop` avec une branche `feature/*` ou `fix/*`.
2. Traiter une seule capacité métier par changement.
3. Ajouter ou adapter les tests avant la demande de revue.
4. Mettre à jour la documentation et le changelog si le comportement change.
5. Ne jamais inclure de secret, de donnée personnelle ou de fichier `.env`.

## Définition de terminé

- TypeScript sans erreur et aucun `any` non justifié.
- ESLint sans erreur.
- Build de production réussi.
- Tests unitaires et d'intégration pertinents réussis.
- E2E réussi pour tout changement auth, paiement, candidature ou espace membre.
- États chargement, erreur, vide et succès couverts.
- Vérification clavier, lecteur d'écran de base et responsive 320/768/1024/1440 px.
- Migration, rollback et impact données documentés si nécessaire.

## Conventions

- Server Component par défaut.
- Validation des entrées à la frontière serveur.
- Aucun accès administratif depuis le navigateur sans contrôle de rôle serveur.
- Les montants sont stockés en unités mineures et ne viennent jamais du client.
- Les changements de schéma passent par une migration Prisma versionnée ; jamais par `db push` en production.
- Commits explicites, par exemple `fix(payments): verify checkout ownership`.

## Revue

Une revue bloque la fusion si elle détecte une régression de sécurité, un paiement non idempotent, un changement destructif sans plan de retour ou une métrique Core Web Vitals dégradée.
