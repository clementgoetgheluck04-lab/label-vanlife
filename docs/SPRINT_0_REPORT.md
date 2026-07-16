# Rapport Sprint 0

Date : 13 juillet 2026  
Objectif : sécuriser le socle, rendre le projet reproductible et préparer un tunnel de paiement fiable.

## Résultat

Le socle Sprint 0 est implémenté et compilable. L'architecture de marque est désormais visible dans le produit à travers une page Écosystème, la page d'accueil et la navigation.

## Ce qui a été fait

- Offre unifiée : carte membre au tarif public de 39 € TTC, promotion actuelle à 29 € TTC pour 12 mois, sans renouvellement automatique ; Vanlife Friendly à 220 € TTC en paiement unique.
- Architecture de marque structurée autour de Label Vanlife, Pass, Places, Trips, Passport, Friendly, App et AI.
- Checkout Stripe relié à une commande interne, prix contrôlé côté serveur et clés d'idempotence.
- Webhook Stripe vérifié, rejouable et protégé contre les doubles activations.
- Autorisation serveur par rôle, garde des espaces privés et politiques RLS Supabase.
- Baseline Prisma, migrations, index et tables de commande, événements Stripe et newsletter.
- Validation des entrées, contrôle d'origine, limitation locale des abus et redirections sûres.
- CI, scripts de contrôle et tests de contrat.
- Documentation produit, architecture, sécurité, données, environnement, tests et déploiement.

## Vérifications réalisées

- TypeScript : réussi sans erreur.
- Tests automatisés : 5/5 réussis.
- ESLint bloquant : aucune erreur ; 111 avertissements non bloquants restent recensés.
- Build Next.js : réussi, 48 pages générées dont `/ecosysteme`.
- Vérification navigateur : `/ecosysteme` charge les huit produits sans erreur console.

## Ce qui reste avant production

- Renseigner les variables réelles Supabase, Stripe et Resend.
- Sauvegarder la base, appliquer les migrations puis tester les politiques RLS sur l'environnement Supabase cible.
- Créer ou vérifier les prix Stripe correspondant exactement à la promotion active de 29 € et à la labellisation de 220 €.
- Exécuter les deux paiements en mode test, vérifier les webhooks, remboursements et rejeux.
- Ajouter les E2E navigateur des parcours critiques et une limitation distribuée adaptée à Vercel.
- Réaliser Lighthouse mobile/desktop sur une URL de préproduction et traiter les budgets mesurés.

## Bugs et dette connus

- Plusieurs écrans membre, carte et road trips utilisent encore des données simulées.
- Les avertissements ESLint concernent surtout les imports inutilisés, les images non optimisées et certaines dépendances de hooks.
- La limitation de débit actuelle est en mémoire et ne se partage pas entre plusieurs instances serveur.
- La PWA, l'internationalisation et Vanlife AI restent des produits futurs, pas des promesses fonctionnelles actuelles.

## Temps passé

Une session d'implémentation et de vérification. Le temps mural ou facturable n'a pas été mesuré afin de ne pas produire une estimation fictive.

## Prochaine étape recommandée

Sprint 1 : consolider le tunnel de la carte membre, ajouter la preuve sociale et la conformité d'achat, puis valider l'ensemble en E2E sur une préproduction connectée à Stripe et Supabase en mode test.
