# Roadmap CTO

Les estimations sont des jours d'ingénierie nets et seront recalibrées après accès aux environnements. P0 bloque tout encaissement ou déploiement public.

## Sprint 0 — Sécuriser et rendre déployable

**État au 14 juillet 2026 : implémentation locale en cours, validation des services réels en attente.** La carte membre a un tarif public unique de 39 € TTC, actuellement proposé à 29 € TTC sans renouvellement automatique. La labellisation est proposée à 110 € TTC au lieu de 220 € TTC jusqu'au 31 décembre 2026, avec remboursement intégral si le lieu est déclaré non conforme après étude. Le détail des travaux et réserves figure dans [SPRINT_0_REPORT.md](SPRINT_0_REPORT.md).

| Titre | Description | Impact | Difficulté | Estimation | Dépendances | Priorité |
|---|---|---|---|---:|---|---|
| Décider l'offre commerciale | Fixer les prix, le mode de paiement, la TVA, le remboursement et la durée | Élimine les contradictions légales et techniques | Faible | 0,5 j | Décision fondateur | P0 — fait |
| Réparer le build | Déclarer la config Prisma correctement, supprimer les erreurs TS/ESLint et migrer `middleware` vers `proxy` | Rétablit CI/CD | Moyenne | 2 j | Aucune | P0 |
| Refaire Checkout membre | Auth serveur, commande interne, prix serveur, idempotency key, URLs fiables | Restaure les ventes | Élevée | 3 j | Offre décidée, Stripe test | P0 |
| Refaire Checkout label | Persister la candidature avant paiement et relier la session | Évite les paiements orphelins | Élevée | 3 j | Offre décidée | P0 |
| Durcir les webhooks | Service role/Prisma, table événements, transactions, retries, logs et tests | Garantit l'activation | Élevée | 3 j | Schéma et accès Stripe | P0 |
| Autorisation RBAC + RLS | Rôles serveur, politiques par table et tests négatifs | Protège données/admin | Élevée | 4 j | Audit Supabase | P0 |
| Sécuriser les API publiques | Schémas de validation, limites, rate limiting, erreurs neutres | Réduit abus et injection | Moyenne | 2 j | Choix infra rate limit | P0 |
| Baseline migrations | Réconcilier base distante et Prisma, créer un historique reproductible | Sécurise les déploiements | Élevée | 3 j | Accès DB + sauvegarde | P0 |

## Sprint 1 — Tunnel de conversion

| Titre | Description | Impact | Difficulté | Estimation | Dépendances | Priorité |
|---|---|---|---|---:|---|---|
| Unifier la vente membre | Une page, une offre, FAQ, preuves, récapitulatif et reprise d'abandon | Conversion | Moyenne | 3 j | Sprint 0 | P1 |
| Unifier la labellisation | Formulaire multi-étapes persisté, validation, sauvegarde et statut | Conversion pro | Élevée | 4 j | Sprint 0 | P1 |
| Auth fluide | Confirmation email, OTP, redirection sûre, récupération mot de passe | Activation | Moyenne | 3 j | RBAC | P1 |
| E2E critiques | Achat membre, achat label, webhook rejoué, login, accès refusé | Réduit les régressions | Élevée | 3 j | Parcours stabilisés | P1 |
| Conformité achat | CGV, confidentialité, consentement, facturation et support | Confiance/légal | Moyenne | 2 j | Validation juridique | P1 |

## Sprint 2 — Expérience membre et carte

| Titre | Description | Impact | Difficulté | Estimation | Dépendances | Priorité |
|---|---|---|---|---:|---|---|
| Remplacer les mocks | Brancher profil, carte, favoris, notifications et passeport sur la DB | Produit réel | Élevée | 6 j | RLS + modèle | P1 |
| Unifier les routes carte | Choisir une carte publique d'acquisition et une vue membre | Clarté/SEO | Moyenne | 2 j | Décision produit | P1 |
| API géospatiale | PostGIS, bbox, filtres, pagination curseur et clustering serveur | Scalabilité carte | Élevée | 5 j | Migration DB | P1 |
| Performance carte | Chargement différé, workers si utile, limites de marqueurs, cache | Core Web Vitals | Élevée | 4 j | API géospatiale | P1 |
| États UX complets | Skeletons, erreurs, vide, offline et reprise | Qualité perçue | Moyenne | 3 j | Données réelles | P1 |

## Sprint 3 — SEO, performance et contenu

| Titre | Description | Impact | Difficulté | Estimation | Dépendances | Priorité |
|---|---|---|---|---:|---|---|
| Architecture SEO | Slugs, canonicals, robots, sitemaps segmentés et noindex privé | Acquisition | Moyenne | 4 j | Routes unifiées | P1 |
| Pages programmatiques | Pays/région/département/lieu avec contenu utile et breadcrumbs | Croissance organique | Élevée | 7 j | Données propres | P2 |
| Réduire le client JS | Server Components, `next/font`, `next/image`, lazy map | Performance | Élevée | 5 j | Routes stables | P1 |
| Budgets Lighthouse | Lighthouse CI, Web Vitals terrain et seuils p75 | Garde-fou | Moyenne | 2 j | URL preview | P1 |
| Pipeline éditorial | CMS, workflow, auteur, dates, schema Article et maillage | Blog scalable | Élevée | 5 j | Choix CMS | P2 |

## Sprint 4+ — PWA, international et croissance

| Titre | Description | Impact | Difficulté | Estimation | Dépendances | Priorité |
|---|---|---|---|---:|---|---|
| PWA sûre | Cache limité, offline utile, icônes PNG maskable, mises à jour | Rétention mobile | Élevée | 4 j | Parcours stables | P2 |
| i18n FR/EN pilote | Routes locales, contenu, devise, emails et SEO hreflang | International | Élevée | 6 j | Modèle contenu | P2 |
| Road Trips réels | CRUD, étapes, partage, indexabilité et droits premium | Valeur membre | Élevée | 8 j | Carte + DB | P2 |
| Cockpit admin | Validation, recherche, audit log, exports et métriques | Opérations | Élevée | 8 j | RBAC | P2 |

## Indicateurs de sortie du sprint 0

- 100 % des paiements test Stripe rattachés à une commande et traités une seule fois.
- Aucun accès admin/pro avec un rôle inadéquat.
- Build, lint, TypeScript et E2E critiques verts en CI.
- Aucun secret dans le client ou le dépôt.
- Rollback et rejeu webhook documentés et testés.
