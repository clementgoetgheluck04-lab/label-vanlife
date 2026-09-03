# Variables d'environnement

## Variables observées

| Variable | Exposition | Usage |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Navigateur autorisé | URL Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Navigateur autorisé | Clé publique soumise aux RLS |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur secret | Administration Supabase, jamais côté client |
| `DATABASE_URL` | Serveur secret | PostgreSQL/Prisma |
| `STRIPE_SECRET_KEY` | Serveur secret | API Stripe |
| `STRIPE_WEBHOOK_SECRET` | Serveur secret | Signature webhook |
| `MEMBER_ACCESS_CODE_SECRET` | Serveur secret | Sel secret utilisé pour hacher les codes d'accès membre à usage unique |
| `LABELLISATION_DRAFT_SECRET` | Serveur secret | Signature HMAC distincte reliant les pièces jointes au paiement ; 32 caractères minimum |
| `ADMIN_PREVIEW_CODE_HASH` | Local uniquement | Empreinte SHA-256 du code de prévisualisation locale ; ignorée en production |
| `ADMIN_PREVIEW_COOKIE_SECRET` | Local uniquement | Signature du cookie de prévisualisation locale ; ignorée en production |
| `STRIPE_MEMBERSHIP_PRICE_ID` | Serveur | Prix catalogue membre |
| `CRON_SECRET` | Serveur secret | Authentification des tâches Vercel ; 32 caractères minimum |
| `RESEND_API_KEY` | Serveur secret | Envoi email |

## Règles

- Créer `.env.example` avec valeurs factices après validation de cette liste.
- Séparer development, preview et production.
- Utiliser des comptes et clés Stripe test en local/preview.
- Valider les variables au démarrage avec un schéma typé et échouer explicitement.
- Rotation immédiate après suspicion d'exposition.
- Ne jamais journaliser une variable secrète.
- Utiliser des secrets aléatoires distincts d'au moins 32 caractères ; ne jamais réutiliser la clé Supabase service role.
