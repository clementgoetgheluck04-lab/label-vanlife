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

## Tests de sécurité

- Modification d'un `userId`/`applicationId` étranger.
- Appel direct aux routes admin avec chaque rôle.
- Webhook sans signature, dupliqué, désordonné et ancien.
- Validation des charges trop grandes, HTML/script et cadence abusive.
- Matrice RLS lecture/écriture par rôle et propriété.

## CI

Ordre recommandé : format/lint -> TypeScript -> unitaires -> intégration -> build -> E2E preview -> Lighthouse/accessibilité. Les données de test sont isolées et nettoyées sans toucher aux environnements partagés.
