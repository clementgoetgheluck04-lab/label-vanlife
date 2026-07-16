# Sécurité

## Priorités immédiates

1. Désactiver l'encaissement tant que les flux C1–C5 de l'audit ne sont pas corrigés.
2. Retirer la création admin publique de comptes.
3. Imposer rôle et propriété côté serveur pour admin, pro et membre.
4. Déployer et tester les RLS Supabase.
5. Rendre les webhooks idempotents et observables.

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

Le dépôt ne permet pas de certifier les RLS, secrets, sauvegardes, journaux ou configurations externes. Une revue en lecture des consoles Supabase, Stripe, Vercel et Resend est obligatoire.
