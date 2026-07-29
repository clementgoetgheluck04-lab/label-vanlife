# Recette E2E avant commercialisation

Ce protocole doit être exécuté sur une preview isolée, avec Stripe en mode test. Il ne faut jamais utiliser une clé `sk_live_` ni une carte bancaire réelle.

## Préparation obligatoire

1. Sauvegarder la base Supabase réelle et conserver l'identifiant de la sauvegarde.
2. Appliquer la migration `20260720000100_member_household`.
3. Déployer la branche de recette sur Vercel.
4. Vérifier, sans afficher les secrets, la présence de `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY` et `RESEND_FROM_EMAIL`.
5. Vérifier que `STRIPE_SECRET_KEY` commence par `sk_test_` et que le webhook Stripe pointe vers `/api/stripe/webhook` sur la preview.

## Scénario A — Adhésion membre

- Créer un compte avec une adresse de test contrôlée, un titulaire et au moins deux accompagnants dont un mineur.
- Vérifier l'email de confirmation Supabase et cliquer sur son lien.
- Vérifier l'ouverture automatique de Stripe Checkout.
- Payer avec une carte de test Stripe et revenir sur `/paiement/succes`.
- Contrôler l'événement `checkout.session.completed` et sa réponse HTTP 200.
- Contrôler en base : commande `PAID`, adhésion `ACTIVE`, carte active, code d'accès haché, âge du titulaire et accompagnants.
- Vérifier l'email membre, l'email administrateur et la connexion avec le code reçu.
- Ouvrir `/member/carte` et vérifier toutes les personnes, leurs âges, le téléphone et l'email.

Preuves à conserver : URL de preview, ID de session Stripe, ID d'événement webhook, ID de commande, ID d'adhésion, identifiants des deux emails et capture de la carte sans données sensibles.

## Scénario B — Candidature de labellisation

- Remplir les quatre étapes avec un site internet, une photo, un plan, une réduction et un code promotionnel de test.
- À chaque changement d'étape, vérifier que la page revient réellement en haut.
- Vérifier l'enregistrement du dossier et des pièces dans le stockage privé.
- Vérifier la réception du récapitulatif candidat et du dossier administrateur.
- Payer la labellisation avec Stripe test et revenir sur la confirmation.
- Contrôler l'événement webhook et le passage du paiement à `PAID`.
- Vérifier les emails de paiement au candidat et à l'administrateur.

Preuves à conserver : ID de candidature, chemins privés des pièces, ID de session Stripe, ID d'événement webhook et identifiants des quatre emails.

## Nettoyage

Supprimer les données personnelles de test, les fichiers envoyés et l'utilisateur Supabase de recette. Conserver uniquement les identifiants techniques, les résultats et les captures anonymisées dans le rapport de sprint.
