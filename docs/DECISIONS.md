# Décisions produit et architecture

## 2026-09-15 — Stabiliser le monolithe

Le projet conserve Next.js, Prisma, PostgreSQL/Supabase, Stripe, Resend et Vercel. Aucune architecture microservices n'est justifiée à ce stade.

## 2026-09-15 — CRM et analytics server-only

Les données de prospection, suppressions et analytics sont protégées par RLS sans politique client et leurs droits sont révoqués pour les rôles `anon` et `authenticated`. Toute consultation passe par une API authentifiée côté serveur.

## 2026-09-15 — Mesurer sans données sensibles

La collecte analytics utilise une liste fermée d'événements, des propriétés bornées et aucun stockage d'IP brute ou de géolocalisation. `Do Not Track` est respecté.

## 2026-09-15 — Retirer les produits fictifs

La marketplace et la page de conseil sauvegardée sont retirées du routage. Une fonctionnalité non transactionnelle ne doit pas être présentée comme disponible.

## 2026-09-15 — Première boucle de croissance

La recommandation de lieu précède Vanlife Activity : elle sert directement l'expansion du réseau de confiance avec moins de dépendance à une base importante de membres actifs. Vanlife Activity reste la prochaine boucle d'acquisition après la persistance réelle des voyages.
