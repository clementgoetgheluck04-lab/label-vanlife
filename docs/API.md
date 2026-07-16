# API

## Routes actuelles

| Route | Rôle | Contrôles principaux |
|---|---|---|
| `POST /api/auth/signup` | Création de compte | Validation serveur et limitation de débit |
| `POST /api/auth/verify-member-code` | Échange le code d'accès membre reçu après paiement contre une session Supabase | Code haché, usage unique, expiration 24 h, comparaison temporelle constante et limitation de débit |
| `POST /api/labellisation/submit-draft` | Enregistre le dossier complet, le plan et 1 à 3 photos dans un bucket Supabase privé, puis confirme l'envoi au candidat et à `contact@labelvanlife.com` | 3 dossiers/heure/IP, origine contrôlée, types et tailles vérifiés, liens temporaires signés |
| `POST /api/stripe/checkout` | Checkout membre | Session serveur, commande interne et prix catalogue serveur |
| `POST /api/stripe/checkout-labellisation` | Crée la commande et le Checkout Stripe de labellisation | Utilisateur authentifié, dossier revalidé, prix calculé côté serveur : 110 € jusqu'au 31 décembre 2026 puis 220 € |
| `POST /api/stripe/webhook` | Confirme le paiement, active l'adhésion ou la candidature et envoie les confirmations au client et à `contact@labelvanlife.com` | Signature Stripe, contrôle montant/produit/utilisateur, transaction Prisma et idempotence des événements |
| `GET /api/admin/labellisations` | Liste les candidatures payées | Administrateur authentifié côté serveur |
| `POST /api/admin/labellisations` | Valide ou refuse une candidature | Origine, autorisation administrateur, décision définitive ; le refus crée un remboursement Stripe total idempotent |
| `POST /api/contact` | Contact | Validation minimale, pas d'anti-abus |
| `POST /api/newsletter` | Newsletter | Erreurs DB silencieuses, consentement non tracé |
| `GET /auth/callback` | Callback Supabase | Redirections à valider |
| `GET /auth/logout` | Déconnexion | Devrait être une mutation protégée contre CSRF/login CSRF selon flux |

## Contrat cible

- Entrée validée avec un schéma partagé, taille maximale et types stricts.
- Authentification depuis la session serveur ; autorisation par capacité.
- Réponses d'erreur stables (`code`, `message`, `requestId`) sans détails internes.
- Rate limits par IP et identité sur auth, contact, newsletter et checkout.
- Origin/CSRF vérifié pour les mutations basées sur cookie.
- Journalisation structurée sans secret ni donnée sensible.
- Idempotency key obligatoire pour commandes et événements externes.

## Paiement cible

`POST /api/orders/membership` crée une commande interne à partir du catalogue serveur et retourne une URL Checkout. Le webhook vérifié met à jour la commande dans une transaction. La page succès lit le statut interne et n'accorde jamais un droit sur le seul paramètre `session_id`.
