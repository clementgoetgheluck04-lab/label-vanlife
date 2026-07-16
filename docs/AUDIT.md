# Audit CTO initial

Date : 13 juillet 2026  
Périmètre : dépôt local uniquement. Aucun accès aux journaux Vercel, à la base Supabase distante, au compte Stripe, à Resend ou à des métriques Lighthouse de production.

## Résumé exécutif

Le projet possède une direction visuelle cohérente et un périmètre produit riche, mais reste un prototype. Il ne doit pas être présenté comme prêt à encaisser : le parcours membre appelle une API qui exige un identifiant non envoyé, le parcours labellisation ne crée pas l'objet attendu par le webhook, et le webhook tente ses écritures avec la clé publique Supabase. Les rôles admin et pro ne sont pas autorisés côté serveur.

Contrôles exécutés :

- ESLint : échec, 202 problèmes (81 erreurs, 121 avertissements).
- TypeScript : échec sur `@prisma/config` introuvable.
- Build Next.js : compilation réussie puis échec du contrôle TypeScript pour la même raison.
- Prisma : schéma syntaxiquement valide.
- Tests : aucun script ni suite de tests configurés.

## Critique

### C1 — Tunnel membre interrompu et identité non fiable

`/devenir-membre` appelle `/api/stripe/checkout` sans corps, alors que l'API exige `body.userId`. Si cet identifiant était envoyé, il serait malgré tout contrôlé par le client et pourrait être falsifié. Le prix visible est 29 €/an, le brief indique 39 €, et Stripe fonctionne en abonnement alors que la demande décrit aussi un paiement simple.

Impact : perte directe de ventes, activation du mauvais compte, litiges.  
Action : décider l'offre, dériver l'utilisateur de la session serveur, créer la commande interne avant Checkout et ne jamais accepter le montant ou le propriétaire depuis le navigateur.

### C2 — Labellisation payée mais non enregistrée

Checkout ne crée ni candidature persistée, ni `applicationId`, ni `userId`. Le webhook ne traite une labellisation que si ces deux métadonnées existent ; sinon il tombe dans la branche adhésion. Le tarif affiché est 250 €, contre 220 € dans le brief.

Impact : paiement encaissé sans dossier fiable, activation erronée possible.  
Action : transaction de création de candidature, Checkout lié à cette candidature, état `PENDING_PAYMENT`, puis transition idempotente par webhook.

### C3 — Webhook non fiable

Les écritures utilisent la clé anonyme Supabase, les erreurs de requête sont ignorées, les événements Stripe ne sont pas journalisés ni dédupliqués, et le numéro de carte repose sur `count + 1`, sujet aux collisions. Aucun traitement explicite des paiements asynchrones, remboursements ou échecs.

Impact : incohérences silencieuses, doubles traitements, cartes dupliquées.  
Action : service role exclusivement serveur, table `stripe_events` unique, transactions Prisma, identifiant de carte généré par séquence/UUID, observabilité et rejeu sécurisé.

### C4 — Autorisations absentes

Le middleware vérifie seulement la présence d'un utilisateur. Tout utilisateur connecté peut atteindre `/admin` ou `/pro`; la page admin modifie directement les candidatures depuis le navigateur. La route `/api` entière est publique.

Impact : accès horizontal/vertical non autorisé si les RLS ne compensent pas parfaitement.  
Action : contrôles de rôle serveur à chaque frontière, Server Actions/API autorisées, politiques RLS testées et accès admin refusé par défaut.

### C5 — Inscription privilégiée exposée

`/api/auth/signup` est publique, utilise la service role et confirme automatiquement toute adresse. Il n'y a ni validation robuste, ni anti-abus, ni rate limiting, ni protection bot.

Impact : comptes frauduleux, abus de quota et contournement de la vérification email.  
Action : inscription Supabase standard, confirmation email, limitation de débit et messages d'erreur non révélateurs.

### C6 — RLS et production non auditables

Les deux fichiers SQL ne contiennent aucune politique RLS. Aucun historique standard `prisma/migrations/*` n'est présent. Les données Supabase distantes n'ont pas été accessibles pendant l'audit.

Impact : exposition potentielle des données ou déploiements non reproductibles.  
Action : inventaire distant, politiques par table, tests RLS et baseline de migration avant toute production.

## Important

### I1 — Build et qualité bloquants

Le build échoue ; 54 des 82 composants TSX sont des Client Components ; plusieurs `any`, effets instables, images HTML et imports inutilisés sont signalés. `middleware.ts` est déprécié sous Next.js 16.

### I2 — Modèle de données non dimensionné

Aucun `@@index` non unique. Les clés étrangères et requêtes fréquentes (`status`, `userId`, `placeId`, géographie, dates) ne sont pas indexées explicitement. Latitude/longitude en `Float` ne permet pas une recherche géospatiale scalable. De nombreux champs filtrables sont en JSON.

### I3 — Deux sources de vérité

Prisma modélise l'application mais les pages utilisent directement Supabase, avec des conventions de noms potentiellement différentes. La majorité de la carte et de l'espace membre lit des fichiers `mock-*` ou `enriched-lieux.ts`.

### I4 — SEO incomplet

Pas de `robots.ts`/`robots.txt`, pas de canonicals explicites, image OpenGraph référencée mais absente, métadonnées limitées à quelques layouts. Le sitemap utilise `new Date()` à chaque requête et des données locales. Les pages sont majoritairement clientes, les pages lieu utilisent un `id` plutôt qu'un slug sémantique, et aucun maillage pays/région/département n'existe.

### I5 — Performance non mesurable à 100

Polices Google chargées par `<link>` au lieu de `next/font`, nombreux `<img>`/background images non optimisés, grande quantité de JavaScript client, carte et données volumineuses incluses côté client. Aucun budget ni CI Lighthouse. Un objectif « 100 » absolu n'est pas une garantie réaliste ; les objectifs doivent porter sur les Core Web Vitals p75 et des budgets reproductibles.

### I6 — PWA fragile

Le service worker met en cache des pages authentifiées et sert `/` comme fallback universel. Les icônes sont SVG, moins compatibles avec certains critères installables. Il n'y a pas de stratégie de version applicative, de page offline adaptée ni de gestion sûre des données privées en cache.

### I7 — Accessibilité et conformité

Des images n'ont pas d'alternative, des interactions reposent sur des éléments non sémantiques et les focus/annonces d'erreur ne sont pas systématiques. Pas de page CGV, gestion du consentement ou politique cookies visible alors que paiement et analytics sont prévus.

### I8 — Sécurité HTTP à durcir

La CSP autorise `unsafe-inline` et `unsafe-eval`, ne référence pas explicitement Stripe/Supabase/Leaflet et risque donc soit de bloquer des intégrations, soit d'être élargie excessivement. Les API contact/newsletter n'ont ni validation, ni limite de taille, ni rate limiting ; certaines erreurs internes sont renvoyées au client.

## Amélioration

- Consolider `/membre` et `/devenir-membre`, `/map` et `/explorer`, `/member` et `/compte`.
- Retirer la route de sauvegarde `_conseil-camping-backup` du code routable.
- Ajouter instrumentation de conversion, événements produit et suivi des abandons respectueux du consentement.
- Centraliser prix, promesses, compteurs et textes dans un référentiel produit.
- Préparer l'i18n par préfixe de locale et contenus traduisibles, sans lancer 16 langues avant validation du marché français.
- Ajouter états `loading.tsx`, `error.tsx`, empty states et erreurs actionnables aux parcours critiques.

## Audit UX par page

| Page | État observé | Frein de conversion principal | Priorité |
|---|---|---|---|
| Accueil | Visuel cohérent, très long, entièrement client | Prix et volumes contradictoires, claims non sourcés, CTA vers une route redirigée | P1 |
| Carte membre | Deux pages de vente concurrentes | 29/39 €, « résiliable » et abonnement contredisent le paiement simple | P0 |
| Label | Proposition claire mais tunnel dissocié | 220/250 €, données gardées en localStorage, dossier non persisté avant paiement | P0 |
| Blog | Présent, contenu statique | Pas de CMS/pagination/maillage à l'échelle de 1 000 articles | P2 |
| Carte | `/map` et `/explorer` se chevauchent | Faux token localStorage, distances simulées, aucune recherche géospatiale serveur | P1 |
| Road Trips | Présentation et données mock | Promesse premium non réellement livrée | P2 |
| FAQ | Page dédiée absente | Objections achat, remboursement, durée et éligibilité non traitées | P1 |
| Dashboard | UI riche mais mock | Donne une fausse impression d'activation ; peu d'actions persistées | P1 |
| Connexion | Email/mot de passe et OTP | Inscription admin auto-confirmée, redirection/erreurs à sécuriser | P0 |
| Paiement | Pas de page de récapitulatif interne | Pas de commande, CGV, consentement ni récupération d'échec | P0 |
| Profil | Route `/compte` séparée de `/member` | Architecture et navigation incohérentes | P1 |

## Risques externes non vérifiés

- Erreurs console navigateur et rendu multi-device.
- Journaux Vercel et configuration des domaines.
- Variables et secrets réellement configurés.
- État des tables, migrations, RLS et sauvegardes Supabase.
- Produits, taxes, webhooks et portail client Stripe.
- Délivrabilité et domaines Resend.
- Scores Lighthouse réels.

Ces éléments requièrent des accès en lecture aux environnements concernés pendant le sprint 0.
