# Stratégie de tests

## Pyramide

- Unitaires : règles de prix, éligibilité, statuts, génération de droits.
- Intégration : cas d'usage avec PostgreSQL de test, RLS et adaptateurs Stripe simulés.
- E2E : navigateur sur preview avec Stripe test et événements contrôlés.

## Parcours critiques

1. Inscription, confirmation, connexion et récupération.
2. Achat membre réussi, annulé, échoué et rejoué.
3. Candidature label sauvegardée, paiement, décision.
4. Refus d'accès membre -> pro -> admin.
5. Carte : recherche, filtre, fiche et favori.
6. Déconnexion et expiration de session.

## Contrats automatisés actuels

- Le tunnel membre vérifie la continuité `confirmation email -> reprise Checkout -> succès -> webhook -> carte -> email membre + email administrateur`.
- Le tunnel labellisation vérifie la continuité `dossier et pièces jointes -> Checkout -> succès -> webhook -> emails candidat + administrateur`.
- Les règles titulaire/accompagnants et la confidentialité des codes promotionnels sont couvertes par tests.

Ces contrats ne remplacent pas les deux scénarios externes. Avant campagne commerciale, exécuter sur une preview isolée :

1. une adhésion avec une clé Stripe `sk_test_`, confirmation de l'email Supabase, carte bancaire de test Stripe, contrôle de la commande `PAID`, de la carte, du code d'accès et des deux emails ;
2. une candidature complète avec un plan et une photo de test, paiement Stripe test, contrôle du webhook, du stockage privé et des quatre emails (dossier et paiement, candidat et administrateur).

Ne jamais exécuter ces scénarios avec une clé Stripe live. Conserver les identifiants Stripe des deux sessions et les identifiants Resend comme preuves, puis supprimer les données personnelles de test.

Le protocole d'exécution et la liste exacte des preuves sont décrits dans [E2E_RELEASE_RUNBOOK.md](./E2E_RELEASE_RUNBOOK.md).

## Tests de sécurité

- Modification d'un `userId`/`applicationId` étranger.
- Appel direct aux routes admin avec chaque rôle.
- Webhook sans signature, dupliqué, désordonné et ancien.
- Validation des charges trop grandes, HTML/script et cadence abusive.
- Matrice RLS lecture/écriture par rôle et propriété.

## CI

Ordre recommandé : format/lint -> TypeScript -> unitaires -> intégration -> build -> E2E preview -> Lighthouse/accessibilité. Les données de test sont isolées et nettoyées sans toucher aux environnements partagés.
