# Architecture

## État actuel

Application Next.js monolithique avec App Router. Les pages publiques, espaces membre/pro/admin et routes API vivent dans `src/app`. Supabase fournit Auth et l'accès PostgreSQL ; Prisma décrit parallèlement la base. Beaucoup de pages lisent des fichiers statiques et mocks. Cette coexistence crée deux sources de vérité.

## Architecture cible

```text
Navigateur
  -> Next.js (Server Components / Route Handlers / Server Actions)
      -> couche application (cas d'usage et autorisation)
          -> couche domaine (règles métier sans framework)
              -> repositories Prisma
                  -> PostgreSQL/Supabase + PostGIS
      -> Stripe / Resend via adaptateurs serveur
```

## Organisation cible progressive

```text
src/
  app/                 routes et composition UI
  features/
    auth/
    memberships/
    labellisation/
    places/
    road-trips/
  components/ui/       primitives accessibles
  server/
    auth/              session, rôles, permissions
    db/                client Prisma et transactions
    integrations/      Stripe, Resend
  lib/                  utilitaires réellement partagés
```

## Règles

- Les pages publiques sont Server Components par défaut.
- Le navigateur ne choisit jamais un utilisateur, un rôle, un prix ou un statut métier.
- Toute mutation traverse un cas d'usage serveur avec validation, autorisation et journalisation.
- Prisma est l'accès applicatif principal ; Supabase JS côté navigateur est limité à Auth et aux cas temps réel explicitement autorisés par RLS.
- Les événements externes sont idempotents et persistés avant application.
- Les données géographiques passent par PostGIS et des requêtes de bounding box.

## Décisions à prendre

- ADR-001 : stabiliser le monolithe modulaire avant toute séparation de services.
- Source de vérité Auth entre `auth.users` Supabase et `public.users`.
- Hébergement du contenu éditorial et stratégie de traduction.
- Fournisseur de rate limiting compatible Vercel.

Voir [ADR-001](adr/0001-stabiliser-le-monolithe.md).
