# Audit produit Label Vanlife

Date : 17 septembre 2026
Périmètre : code, schéma Prisma, migrations, routes, parcours, documentation et contrôles locaux du dépôt. Les tableaux Stripe, Supabase, Resend et Vercel ne sont pas audités par ce document lorsqu’ils ne sont pas accessibles depuis le dépôt.

## Conclusion exécutive

Label Vanlife n’est plus un prototype vide. Le produit possède un socle commercial et technique réel : adhésion, paiement Stripe idempotent, carte membre, espace membre, carte de lieux, favoris, road-trips, passeport, candidatures professionnelles, stockage privé des justificatifs, revue administrateur, kit de communication, prospection et analytics minimisés.

Le principal risque n’est donc plus l’absence de fonctionnalités. Il est la différence entre **avoir un badge** et **faire reconnaître un label**. La priorité produit devient la preuve : référentiel public, portée exacte des contrôles, décisions traçables, statut et durée de validité visibles, retours terrain documentés et procédure de suspension.

Le produit doit être géré comme une boucle cumulative : chaque voyageur produit une intention utile, chaque voyage structure des préférences, chaque visite documentée rafraîchit une fiche, chaque contribution améliore la confiance et chaque nouveau lieu augmente la valeur de la carte. Une page qui ne produit ni signal, ni confiance, ni conversion n’est pas un actif produit.

La recommandation est de ne pas construire maintenant un réseau social, une IA de road-trip ou une expansion européenne. Ces chantiers dilueraient l’effort avant que le cœur de confiance et la conversion française soient prouvés.

## État technique observé

- Next.js 16.3.4, React 19.2.4, TypeScript, Tailwind CSS 4.
- Prisma 7.10, PostgreSQL/Supabase, Stripe, Resend et Leaflet.
- 60 routes de page et 37 routes API.
- 29 modèles Prisma, avec 12 migrations versionnées dont RLS, paiement, prospection, analytics et sécurité des sessions.
- 98 tests de contrat et de règles métier réussis lors de l’audit.
- ESLint et TypeScript réussissent.
- Le build Turbopack local est bloqué par Windows lors de la création d’un processus CSS Leaflet (`os error 5`). Le build de production Webpack a ensuite compilé avec succès les 79 pages générées. Il s’agit d’une incompatibilité locale Turbopack, pas d’une erreur TypeScript ou applicative.
- Le dépôt local ne contient pas les secrets de production ; seule l’identité Vercel locale est configurée. L’état distant des migrations et des services ne peut donc pas être affirmé depuis le dépôt seul.

## Ce qui fonctionne et doit être conservé

### Socle commercial

- Prix centralisés côté serveur : carte membre 2027 à 29 € au lieu de 39 €, labellisation à 110 € au lieu de 290 €.
- Paiements uniques, sans renouvellement automatique annoncé.
- Commande interne avant Stripe Checkout.
- Webhook signé, idempotent et transactionnel.
- Paiements et conversions alimentent les analytics et le pipeline commercial.

### Sécurité

- Autorisations membre, professionnel et administrateur appliquées côté serveur.
- Pages privées non indexables et non mises en cache publiquement.
- RLS versionnée pour les données privées.
- Validation des entrées, contrôle d’origine, limites de taille, honeypots et limitation de débit locale.
- Liens de kit, QR de visite et carte membre signés.
- Secrets réservés au serveur et clés absentes du frontend.

### Produit réel

- Espace membre connecté avec carte, favoris, road-trips, passeport, badges, journal et alertes.
- Session « rester connecté » révocable, avec expiration après dix jours d’inactivité.
- Visite prouvée par trois photos privées, prix constaté et retour modéré.
- Fiches publiques enrichies et catalogue statique contrôlé de 26 lieux labellisés.
- Candidature professionnelle complète : SIRET, charte, 22 indicateurs, plan, photos, avantage membre, paiement, revue et remboursement en cas de refus.
- Prospection avec suppression, arrêt sur opposition, limites d’envoi et suivi des réponses.

### Acquisition

- Métadonnées, canonical, sitemap, robots, image sociale, favicon et pages géographiques.
- Analytics produit sur liste fermée, sans email, position précise ni adresse IP brute.
- Consentement requis pour les statistiques navigateur ; conversions serveur conservées comme source de vérité.

## Parcours audités

### Voyageur → membre

Accueil → offre → création/connexion → commande interne → Stripe → webhook → activation → email/code → espace membre.

Le parcours est relié de bout en bout et testé par contrat. Le prochain enjeu n’est pas d’ajouter des écrans, mais de mesurer la conversion réelle, le premier lieu consulté, la première visite et la valeur constatée de la carte.

### Établissement → lieu labellisé

Page de vente → candidature → 22 réponses et justificatifs privés → commande → Stripe → étude administrateur → attribution ou refus/remboursement → kit.

Le tunnel est fonctionnel mais sa crédibilité dépend de la qualité de l’étude. Avant cet audit, l’administrateur pouvait accepter un dossier depuis un résumé sans checklist formelle ni accès durablement renouvelé aux justificatifs. La première correction P0 impose désormais six contrôles, une note de revue, la version du référentiel et des liens temporaires vers les pièces.

### Carte

La carte publique différencie lieux labellisés et lieux repérés. Les coordonnées et avantages sensibles restent limités selon le statut de connexion. Le catalogue de production reste toutefois hybride : les fiches publiques reposent encore largement sur `ENRICHED_LIEUX`, tandis que les fonctions membre et opérationnelles utilisent PostgreSQL. Cette double source doit être résorbée progressivement, sans migration brutale.

## Écarts prioritaires

### P0 — Gouvernance et preuve du label

1. Publier un référentiel versionné et expliquer ce qui est déclaré, contrôlé sur dossier ou confirmé sur le terrain. **Implémenté dans ce lot.**
2. Empêcher une attribution sans contrôles tracés et note de revue. **Implémenté dans ce lot.**
3. Exiger la confirmation d’exploitation dès la validation serveur de la candidature. **Implémenté dans ce lot.**
4. Remplacer les formulations ambiguës « certification officielle » par « label privé indépendant » et « étude selon le référentiel ». **Commencé dans ce lot.**
5. Créer ensuite un registre public de validité par lieu : édition, date de décision, date d’expiration, portée et éventuelle suspension.

### P1 — Source de vérité et opérations

- Modéliser une attribution de label séparée du JSON de commande : version du référentiel, contrôles, décision, dates, auteur, statut et historique.
- Conserver les pièces selon une politique de rétention documentée puis les supprimer à échéance.
- Remplacer la limitation de débit en mémoire par une solution distribuée avant montée en volume.
- Unifier progressivement le catalogue statique et la base, avec sauvegarde, import idempotent et contrôle des 26 fiches.
- Ajouter des E2E navigateur sur les deux paiements, le webhook rejoué, l’accès membre et l’attribution/refus.

### P1 — Conversion

- Mesurer le tunnel réel par source/campagne et non seulement les ouvertures/clics email.
- Ajouter une FAQ de vente courte répondant aux objections : valeur, validité, remboursement, contrôle et absence de commission.
- Afficher sur chaque fiche labellisée la validité du label et la version du référentiel, sans inventer de score.
- Publier des preuves réelles : visites confirmées, informations mises à jour et témoignages explicitement autorisés.

### P2 — Data moat et rétention

- Transformer les visites documentées et retours modérés en signaux de fraîcheur.
- Construire un score uniquement après définition statistique, volume suffisant et documentation publique.
- Rendre les road-trips partageables lorsque leur usage réel est établi.
- Préparer PostGIS seulement lorsque le volume et les requêtes justifient la migration.

### Non prioritaire maintenant

- Réseau social complet, messagerie, followers et feed.
- IA de recommandation sans base terrain suffisamment dense.
- Internationalisation complète.
- Dashboard professionnel complexe.
- « Gamification » ou compteurs sans données réelles.

## Risques

| Risque | Impact | Réponse |
|---|---|---|
| Promesse de certification plus forte que le contrôle réel | Juridique, confiance, réputation | Employer « label privé », publier la portée et tracer chaque décision |
| Paiement interprété comme achat automatique du badge | Décrédibilisation du label | Séparer paiement et décision ; remboursement si non-conforme |
| Données publiques statiques et données privées DB divergentes | Erreurs et dette opérationnelle | Migration progressive, idempotente et auditée |
| Prospection plus rapide que la capacité de contrôle | Qualité du réseau | Piloter au nombre de dossiers correctement étudiés, pas seulement aux emails envoyés |
| Score opaque ou prématuré | Manipulation et perte de confiance | Ne pas publier de score avant méthode, échantillon et procédure de contestation |
| Dépendance aux services externes non surveillée | Vente ou emails silencieusement cassés | Alertes Vercel/Stripe/Resend et tests synthétiques quotidiens |

## Architecture recommandée

Conserver le monolithe Next.js et ses frontières serveur. Ajouter un domaine « confiance du label » plutôt qu’un nouveau service :

```text
Candidature + preuves privées
  -> revue selon un référentiel versionné
    -> décision traçable
      -> attribution avec validité
        -> fiche publique / kit
          -> retours terrain
            -> correction, renouvellement, suspension ou retrait
```

La future migration devra introduire une attribution structurée et un historique de contrôle. Elle ne doit pas supprimer les décisions existantes ni modifier Stripe. Une sauvegarde et une validation explicite seront requises avant application.

## Décisions produit

- Conserver les prix actuels approuvés ; le mandat mentionne d’autres prix historiques mais ne les remplace pas.
- Conserver les 22 indicateurs comme description du profil d’accueil, pas comme concours d’équipements.
- Ne pas exiger piscine, animations ou wifi pour labelliser une ferme ou un petit lieu.
- Refuser tout chiffre, avis, score ou témoignage fictif.
- Positionner le label comme privé et indépendant tant qu’aucune reconnaissance publique ou accréditation tierce n’existe.

## Vérification avant livraison

- ESLint.
- TypeScript.
- 98 tests existants, plus les tests du référentiel ajoutés dans ce lot.
- Build de production Webpack réussi ; le build Vercel devra confirmer le chemin Turbopack de l’environnement hébergé.
- Vérification manuelle mobile/desktop des pages publiques et de la revue admin avant promotion.
