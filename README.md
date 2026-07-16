# Label Vanlife

Plateforme de confiance reliant les voyageurs en van à des lieux réellement accueillants. Le produit réunit une carte membre, une sélection de lieux labellisés, des road trips et un espace membre.

> État au 13 juillet 2026 : Sprint 0 implémenté. Build, TypeScript, tests et ESLint bloquant sont verts. La mise en production reste conditionnée à l'application des migrations sur Supabase et aux tests Stripe de bout en bout avec les variables réelles. Voir le [rapport Sprint 0](docs/SPRINT_0_REPORT.md).

## Stack

- Next.js 16, React 19, TypeScript strict et App Router
- Tailwind CSS 4
- Supabase Auth et PostgreSQL
- Prisma 7
- Stripe Checkout et webhooks
- Resend
- Leaflet et marker clustering

## Démarrage local

Prérequis : Node.js LTS, npm et une instance Supabase.

```bash
npm ci
cp .env.example .env.local
npm run db:generate
npm run dev
```

Ouvrir `http://localhost:3000`. Si ce port est déjà utilisé, lancer `npm run dev -- -p 3001` puis ouvrir `http://localhost:3001`.

La liste contractuelle des variables est disponible dans `.env.example` et documentée dans [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md).

## Contrôles qualité

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Les tests de contrat Sprint 0 sont automatisés. Les parcours E2E Stripe/Supabase avec services réels restent à ajouter selon [docs/TESTING.md](docs/TESTING.md).

## Documentation

- [Mission](MISSION.md)
- [Vision](docs/VISION.md)
- [Audit technique et produit](docs/AUDIT.md)
- [Roadmap](docs/ROADMAP.md)
- [Rapport Sprint 0](docs/SPRINT_0_REPORT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Produit](docs/PRODUCT.md)
- [Base de données](docs/DATABASE.md)
- [Sources de données](docs/DATA_SOURCES.md)
- [Bibliothèque de marque](docs/BRAND_ASSETS.md)
- [API](docs/API.md)
- [Sécurité](docs/SECURITY.md)
- [SEO](docs/SEO.md)
- [Déploiement](docs/DEPLOYMENT.md)
- [Contribution](CONTRIBUTING.md)

## Règle de livraison

Aucun déploiement en production tant que lint, TypeScript, build et parcours E2E critiques ne sont pas verts. Les paiements Stripe doivent être testés de bout en bout en mode test avec rejeu de webhooks.
