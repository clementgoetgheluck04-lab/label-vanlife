# Sécurité

## État du durcissement (3 septembre 2026)

- L'endpoint public de création de membres par code admin a été supprimé.
- La prévisualisation membre est limitée à localhost et désactivée en production.
- Les routes admin exigent un utilisateur Supabase possédant réellement le rôle `ADMIN`.
- Les mutations navigateur exigent une origine identique, un type de contenu explicite et une taille bornée.
- Les pages privées et toutes les API sont marquées `private, no-store`.
- Le service worker ne peut mettre en cache ni API, ni authentification, ni espaces membre/admin/pro.
- Le dossier de labellisation est lié au paiement par une preuve HMAC à durée limitée et un identifiant unique en base.
- Les fichiers sont contrôlés par taille, MIME et signature binaire avant stockage privé.
- Le webhook Stripe vérifie sa signature, borne son corps et déduplique les événements.
- Les décisions de labellisation sont journalisées avec l'identifiant admin, la cible et l'adresse IP.
- Les redirections d'authentification refusent les destinations externes et les variantes avec antislash.
- Les données JSON-LD sont échappées contre la fermeture de balise `script`.
- L'ancienne colonne applicative `users.password`, inutilisée avec Supabase Auth, est supprimée par migration.
- Next.js est maintenu sur une version corrigée et un audit de dépendances est exécuté en CI.

## Modèle d'autorisation

- `VISITOR` : lecture publique publiée.
- `MEMBER` : ses propres données et avantages actifs.
- `ESTABLISHMENT` : ses profils, lieux et candidatures.
- `ADMIN` : opérations explicitement autorisées et journalisées.

Le rôle n'est jamais pris dans une requête client. Les routes et politiques RLS refusent par défaut.

## Contrôles

- Validation serveur, normalisation et limites de taille.
- Rate limiting, protection bot et journalisation des abus.
- CSRF/origin pour mutations cookie ; CSP avec nonce lorsque compatible.
- Secrets uniquement dans le coffre de l'hébergeur, rotation documentée.
- Aucune donnée personnelle dans logs, metadata Stripe ou analytics sans nécessité.
- Dépendances scannées en CI, mises à jour groupées et revues.
- Sauvegardes chiffrées, restauration testée, rétention documentée.

## Stripe

- Signature sur le corps brut.
- `event.id` unique stocké avant traitement.
- Metadata limitée à des identifiants internes opaques.
- Commandes et droits mis à jour dans une transaction.
- Rejeu sans double activation.
- Remboursements, contestations, échecs et paiements asynchrones couverts.

## Limites de l'audit

Le dépôt ne permet pas à lui seul de certifier les réglages distants. Avant mise en production du durcissement :

1. Définir `LABELLISATION_DRAFT_SECRET` dans Vercel pour Production et Preview.
2. Vérifier que les migrations et RLS sont appliquées sur Supabase, puis tester avec les rôles anon/authenticated.
3. Activer CAPTCHA et régler les limites Supabase Auth.
4. Activer les règles WAF/rate limiting Vercel sur inscription, codes, newsletter, candidature et checkout.
5. Vérifier les événements Stripe, la signature webhook et les alertes d'échec.
6. Vérifier les sauvegardes Supabase, leur rétention et un test de restauration.
7. Activer MFA pour tous les comptes Hostinger, Vercel, Supabase, Stripe, Resend et GitHub.
