# Analytics Label Vanlife

## Objectif

Mesurer la valeur produite sans construire un système de surveillance. La North Star est le nombre de connexions vanlife qualifiées par mois : itinéraire lancé, avantage consulté ou utilisé, QR scanné, visite confirmée ou interaction équivalente.

Dans la première version mesurable, elle additionne `route_start`, `qr_scan` et `benefit_view`. Les impressions et simples vues de fiche restent séparées et ne sont jamais comptées comme une visite ou du chiffre d'affaires.

## Collecte

- Les événements sont acceptés uniquement par `POST /api/analytics` avec contrôle d'origine, limite de taille et rate limiting.
- Une liste fermée de noms est définie dans `src/lib/analytics/events.ts`.
- Les propriétés sont limitées à douze valeurs primitives et les chaînes sont tronquées.
- Aucune adresse IP brute, position GPS, email ou contenu libre n'est enregistré dans les événements.
- `Do Not Track` désactive la collecte côté navigateur.
- Les identifiants navigateur et session sont pseudonymes et générés localement.
- Les tables analytics ne sont jamais accessibles directement avec les rôles Supabase `anon` et `authenticated`.

## Événements initiaux

- `landing_view`, `page_view`, `map_open`, `place_view`
- `membership_checkout_start`, `membership_purchase`
- `place_application_start`, `place_application_submit`, `label_purchase`
- `place_recommend`, `place_claim`
- `favorite_add`, `route_start`, `qr_scan`, `benefit_view`, `review_submit`
- `referral_share`, `referral_conversion`
- `activity_created`, `recap_generated`, `recap_shared`
- `public_trip_view`, `public_trip_place_click`, `public_trip_signup`, `public_trip_membership_conversion`

## Règles

Un événement de conversion serveur prime toujours sur un événement navigateur. Les achats sont donc enregistrés après validation Stripe. Aucun chiffre de réservation ou de revenu attribué à un lieu ne doit être extrapolé depuis une simple vue.

## Rétention

La durée de conservation doit être fixée avant montée en volume. Proposition initiale : événements détaillés 13 mois, puis uniquement agrégats anonymes. L'export et la suppression des événements liés à un utilisateur doivent suivre les demandes RGPD associées au compte.
