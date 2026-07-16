# Déploiement

## Cible

GitHub -> Vercel -> Supabase PostgreSQL/Auth -> Stripe -> Resend.

## Pipeline

1. Pull request : lint, TypeScript, tests, build et migration dry-run.
2. Preview Vercel avec services de test et base isolée.
3. E2E, accessibilité et Lighthouse sur la preview.
4. Approbation humaine pour migration et production.
5. Migration compatible arrière, puis déploiement applicatif.
6. Smoke tests, suivi erreurs et possibilité de rollback.

## Checklist production

- Domaine, HTTPS et headers vérifiés.
- Variables validées et secrets de production présents.
- Migrations appliquées et sauvegarde restaurable disponible.
- RLS testées ; service role absente du bundle client.
- Webhook Stripe pointé vers la bonne URL et événements requis sélectionnés.
- Produits, prix, taxes, factures et portail client vérifiés.
- Domaine Resend authentifié (SPF, DKIM, DMARC) et emails texte/HTML testés.
- Robots, sitemap, canonicals et OpenGraph vérifiés.
- Alertes sur erreurs, échecs webhook et taux de paiement.

## Rollback

Le code peut revenir à la version Vercel précédente. Les migrations doivent être expand/contract pour rester compatibles ; une migration destructive ne se « rollback » pas sans plan de restauration validé. Les webhooks échoués sont rejoués depuis la table d'événements ou Stripe après correction.
