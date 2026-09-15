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

## 2026-09-15 — Vanlife Activity privée par défaut

La première activité partageable réutilise les vrais `RoadTrip` et `RoadTripEtape`. La publication exige une action explicite du membre et n'expose que des fiches d'établissements déjà publiques. Les coordonnées exactes, le domicile, la position courante et les lieux repérés ne sont jamais rendus publics dans cette version. L'identifiant technique du voyage sert de lien opaque ; la page peut être dépubliée à tout moment.

## 2026-09-15 — Pool PostgreSQL adapté au serverless

Chaque instance Vercel utilise au maximum une connexion PostgreSQL et libère rapidement toute connexion inactive. Le projet Supabase actuel est limité à 15 sessions ; la configuration par défaut de dix connexions par instance épuisait ce quota lors d'une navigation entre plusieurs fonctions.

## 2026-09-15 — Visites confirmées sans géolocalisation

Le Passeport utilise un QR signé, propre au lieu et distribué uniquement dans son kit partenaire. Une confirmation exige un compte membre actif, est idempotente par couple membre-lieu et n'enregistre que le lieu et la date. Le dispositif ne collecte ni trace, ni position GPS du membre. Il fournit une preuve d'usage utile au membre et au professionnel sans transformer Label Vanlife en outil de surveillance.
