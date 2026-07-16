# Changelog

Toutes les évolutions notables du projet sont consignées ici selon l'esprit de Keep a Changelog.

## Non publié

### Documentation

- Ajout de l'audit CTO initial et de la roadmap priorisée.
- Ajout des référentiels architecture, produit, design, données, API, SEO, sécurité, environnement, tests et déploiement.
- Remplacement du README générique.

### Produit

- Introduction de l’architecture de marque Label Vanlife : Pass, Places, Trips, Passport, Friendly, App et AI.
- Ajout d’une page Écosystème, d’une section d’accueil et d’une navigation harmonisée.
- Centralisation des prix Vanlife Pass à 39 € / 12 mois et Vanlife Friendly à 220 €.
- Intégration de la bibliothèque officielle de marque : logos, favicon, cartes 2026, visuels sociaux, plaque et stickers.
- Désignation des 26 établissements de `ENRICHED_LIEUX` comme source canonique temporaire et correction des compteurs visibles.

### Sécurité et fiabilité

- Ajout des commandes internes, événements Stripe idempotents et vérification serveur des montants.
- Ajout du RBAC serveur, des politiques RLS, de la synchronisation Supabase Auth et des migrations Prisma.
- Ajout des validations, protections d’origine, limites de débit locales, tests et CI.

### Constat connu

- Build, TypeScript, tests de contrat et ESLint bloquant validés localement ; 111 avertissements ESLint non bloquants restent à traiter.
- Tunnel Stripe et contrôles d'autorisation refondus, mais pas encore validés de bout en bout avec les services réels.
- Données membre, road trips et carte encore largement simulées.
