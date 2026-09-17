# Roadmap produit Label Vanlife

Mise à jour : 17 septembre 2026

## Principe

La priorité n’est plus d’accumuler des fonctionnalités. Chaque chantier doit renforcer au moins un actif : confiance, donnée propriétaire, distribution, rétention ou revenu. Aucun prix, service payant ou migration destructive ne change sans décision explicite.

Label Vanlife est piloté comme un système, pas comme un site :

```text
nouveau voyageur
  → recherche et prépare un voyage
    → visite un lieu et apporte une preuve
      → améliore la fraîcheur et la fiabilité de la fiche
        → augmente la confiance et la conversion
          → attire un nouveau lieu de qualité
            → augmente la valeur de la carte membre
              → attire de nouveaux voyageurs
```

Une fonctionnalité n’entre dans la roadmap que si elle possède quatre éléments : un producteur du signal, une donnée conservée, un bénéficiaire identifiable et une métrique de résultat. Sans cette boucle, elle reste une page ou un effet visuel et n’est pas prioritaire.

## Score de priorité

Échelle de 1 à 5. La valeur combine impact utilisateur, revenu, confiance, rétention, acquisition et donnée. L’effort et le risque sont pénalisants.

| Chantier | Confiance | Revenu | Rétention | Acquisition | Donnée | Effort | Risque | Priorité |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| Référentiel public et décision traçable | 5 | 4 | 3 | 4 | 4 | 2 | 1 | P0 |
| Registre public des labels valides | 5 | 4 | 3 | 4 | 4 | 3 | 2 | P0 |
| Mesure du tunnel et preuve de valeur | 4 | 5 | 4 | 4 | 5 | 3 | 2 | P1 |
| Source de vérité unique des lieux | 5 | 4 | 4 | 4 | 5 | 5 | 4 | P1 |
| E2E paiements et permissions | 5 | 5 | 3 | 2 | 2 | 3 | 2 | P1 |
| Partage des road-trips | 2 | 2 | 4 | 5 | 3 | 4 | 2 | P2 |
| Score public | 4 | 2 | 3 | 3 | 5 | 5 | 5 | En attente |
| IA road-trip | 2 | 2 | 3 | 3 | 2 | 5 | 4 | En attente |
| Réseau social complet | 1 | 1 | 2 | 2 | 2 | 5 | 4 | Non prioritaire |

## Phase P0 — Faire du badge une preuve

### Livré dans le présent lot

- Référentiel public 2027 versionné.
- Portée claire : label privé indépendant, distinct d’une certification publique.
- Six conditions d’éligibilité publiées.
- 22 indicateurs présentés comme profil d’accueil, sans note opaque.
- Distinction entre déclaré, contrôlé sur dossier et confirmé sur le terrain.
- Confirmation d’exploitation obligatoire côté serveur.
- Revue admin avec pièces temporaires, six contrôles, note et version du référentiel.
- Suppression des principales formulations « officiel » ou « certifier » non démontrées.

### Prochain lot P0

1. Créer un registre public des labels valides.
2. Afficher sur chaque fiche : édition, date d’attribution, échéance, portée du contrôle et statut.
3. Ajouter une procédure de signalement, correction, suspension et retrait.
4. Ajouter une vue admin des renouvellements et labels arrivant à échéance.
5. Effectuer un contrôle documentaire rétrospectif des 26 lieux avant de leur attribuer publiquement un niveau de vérification.

La base actuelle ne possède pas de modèle d’attribution suffisamment structuré. Ce lot nécessitera une migration additive, jamais destructive, soumise à sauvegarde et validation avant application.

## Phase P1 — Prouver la valeur commerciale

### Voyageur

- Mesurer : arrivée → offre → compte → Checkout → paiement → première consultation → première visite.
- Afficher la valeur constatée de la carte uniquement à partir des économies réellement déclarées.
- Tester une seule proposition principale par page et comparer les conversions.
- Ajouter une FAQ courte sur validité, avantages, confidentialité et absence de renouvellement automatique.

### Établissement

- Mesurer : source → clic → candidature → paiement → validation → kit → visites confirmées.
- Donner au lieu un bilan simple : vues qualifiées, itinéraires lancés, visites confirmées et retours publiables.
- Ne jamais transformer une vue en réservation ou chiffre d’affaires estimé.
- Utiliser les refus et objections pour améliorer la page de vente, sans relancer les opposants.

### Fiabilité

- Ajouter des E2E navigateur : adhésion, labellisation, webhook rejoué, refus/remboursement et permissions.
- Remplacer le rate limit mémoire par un mécanisme distribué avant hausse importante des volumes.
- Ajouter un contrôle synthétique quotidien des parcours critiques et alertes uniquement sur anomalie.

## Phase P1 — Une source de vérité des lieux

1. Sauvegarder et inventorier la base distante.
2. Comparer les 26 fiches publiques au contenu PostgreSQL.
3. Définir l’identifiant canonique et les règles de fusion.
4. Importer de façon idempotente sans écraser propriétaire, contacts privés ni historique.
5. Basculer lecture par lecture derrière un drapeau de fonctionnalité.
6. Retirer le fichier statique seulement après contrôle de parité et rollback testé.

## Phase P2 — Transformer l’usage en actif défendable

- Les visites documentées alimentent la fraîcheur des fiches.
- Les retours modérés distinguent les expériences confirmées.
- Les corrections terrain sont datées et sourcées.
- Les road-trips publics deviennent partageables avec cartes Open Graph.
- Les badges valorisent une expérience réelle, pas des actions superficielles.
- Les QR physiques deviennent un canal d’acquisition uniquement lorsque les lieux sont équipés.

## Phase P3 — Score et recommandation

Ne pas publier de score avant :

- une définition publique des dimensions ;
- un volume minimal de visites et d’avis confirmés ;
- une pondération explicable ;
- une résistance au spam ;
- une gestion de la fraîcheur ;
- une procédure de contestation ;
- une différence visible entre déclaration, contrôle et expérience voyageur.

Le modèle `PlaceScore` existant est une structure technique, pas encore une méthodologie publiable.

## Phase P4 — Échelle

- PostGIS et clustering serveur lorsque les volumes le justifient.
- SEO géographique seulement pour les zones disposant de contenu utile.
- FR/EN pilote après validation du marché français.
- IA de road-trip avec retrieval sur les données Label Vanlife, sans lieux inventés.
- Expansion pays par pays, avec support, fiscalité et réseau local crédibles.

## Indicateurs de pilotage

### North Star

Nombre mensuel d’expériences vanlife utiles confirmées : visite documentée, itinéraire réellement lancé ou avantage utilisé. Une vue de page seule n’est pas une expérience.

### Confiance

- part des labels avec décision versionnée ;
- part des informations confirmées récemment ;
- délai médian de correction ;
- taux de signalements résolus ;
- renouvellements après contrôle.

### Business

- conversion visite → paiement membre ;
- conversion prospect → candidature → label ;
- coût opérationnel par label étudié ;
- activation à 7 jours ;
- visites confirmées par lieu ;
- renouvellement membre et établissement.

## Garde-fous

- Pas de fausses statistiques, faux avis, faux scores ou faux témoignages.
- Pas de revendication de label public ou officiel.
- Pas de modification de prix sans décision du fondateur.
- Pas de migration destructive, suppression massive ou changement Stripe production sans arrêt et validation.
- Pas d’expansion fonctionnelle si elle ne renforce pas la confiance, la donnée, la distribution, la rétention ou le revenu.
