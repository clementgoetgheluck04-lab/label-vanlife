# ADR-001 — Stabiliser le monolithe modulaire

Statut : accepté pour la roadmap  
Date : 13 juillet 2026

## Contexte

Le produit doit évoluer vite mais les risques actuels concernent l'identité, les paiements et la cohérence des données, pas la capacité d'un service unique. Introduire des microservices augmenterait les frontières, les déploiements et les scénarios de panne.

## Décision

Conserver Next.js comme monolithe modulaire. Isoler les capacités métier dans `features/` et les intégrations dans `server/`. PostgreSQL reste la source de vérité transactionnelle. Les traitements asynchrones ne seront extraits que lorsqu'une mesure de charge ou de fiabilité le justifiera.

## Conséquences

- Stabilisation plus rapide et transactions locales simples.
- Discipline nécessaire pour empêcher les imports transversaux et l'accès direct aux intégrations.
- Possibilité d'extraire plus tard les emails, imports ou génération IA derrière des interfaces déjà définies.
