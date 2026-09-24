# Référencement recherche et assistants IA — 23 septembre 2026

## État initial avant publication

- Production : robots.txt, sitemap.xml et /blog répondent HTTP 200 sans X-Robots-Tag noindex. Le robots actuel autorise déjà les pages publiques via `User-Agent: *`.
- Le Mag enrichi n'est pas encore publié : ne pas confondre l'aperçu local et les pages accessibles aux moteurs.
- Google Search Console : compte du propriétaire connecté, ajout du préfixe https://www.labelvanlife.fr/ commencé ; preuve HTML fournie par Google et ajoutée aux métadonnées locales. Validation non terminée, sitemap non soumis.
- Bing : connexion Google autorisée explicitement par le propriétaire et réussie. Site ajouté, statut « Not verified ». Balise publique msvalidate.01 ajoutée localement ; validation après publication.

## Changements locaux

- Groupes OAI-SearchBot et PerplexityBot explicités avec toutes les exclusions privées conservées. Ajout d'exclusions pour kits, vérification de carte, désinscription, voyages privés et confirmations. Ne modifie pas l'authentification ni le pare-feu ; robots.txt n'est pas un contrôle de sécurité.
- Données structurées Article sur les carnets, auteur éditorial, éditeur relié à l'identité Organization et citation de la source externe quand présente. Pas de faux avis, de date de mise à jour automatique ou de prétendue accréditation.
- Clé publique IndexNow et script `scripts/submit-mag-indexnow.mjs` : dry-run par défaut, contrôle de la présence en production avant un envoi explicite avec `--submit`. Un seul lot de 25 URL du Mag (nouvelles ou modifiées), pas un envoi quotidien de tout le site.

## Publication et soumissions effectuées

- Déploiement production READY : dpl_CYMWK2FxC58XiC5np3BEr7Bkmv1a, https://label-vanlife-lrpxro7gp-clement-projects.vercel.app, alias https://www.labelvanlife.fr. Build distant réussi, aucune migration en attente.
- Google : propriété validée par balise HTML. Sitemap envoyé, état « Opération effectuée », 78 pages découvertes le 23/09/2026. Cela ne signifie pas 78 pages indexées.
- Bing : propriété validée, sitemap soumis, état « Processing ».
- IndexNow : un lot de 25 URL envoyé après contrôle HTTP des pages et de la clé publique ; réponse HTTP 202 (accepté pour traitement, pas preuve d'indexation).
- Production : accueil, article Morbihan, référentiel, robots et sitemap HTTP 200 ; balises Google/Bing présentes, données Article présentes, OAI-SearchBot présent. Sitemap : 78 URL.
- Logs Vercel de niveau erreur sur ce déploiement : aucun résultat sur la fenêtre de 10 minutes inspectée. Cela ne constitue pas une garantie d'absence d'erreurs futures.
- Inspection Google du Mag avant la nouvelle demande : « Détectée, actuellement non indexée ». Après test, confirmation « Indexation demandée » : URL ajoutée à la file d'exploration prioritaire. Pas de soumission répétée nécessaire.

## Étapes restantes (plan initial, points 1 à 4 réalisés ci-dessus)

1. Revoir et publier le lot local Le Mag + référencement (le répertoire comporte aussi des modifications antérieures).
2. Valider la propriété Google à partir de la balise publiée ; soumettre https://www.labelvanlife.fr/sitemap.xml. Inspecter l'index, un itinéraire corse et le référentiel.
3. Valider la propriété Bing avec la balise publiée et soumettre le même sitemap.
4. Lancer le script IndexNow avec --submit après vérification du déploiement ; conserver son résultat. HTTP 200/202 confirme la notification, pas l'indexation.
5. Suivre impressions, clics, pages indexées et candidatures ; relever les visites provenant des assistants avec les limites du consentement analytics. Aucune citation IA ni visite de robot mesurée aujourd'hui.
6. Renforcer les sources de confiance : liens volontaires depuis les campings partenaires, office de tourisme pertinent et médias vanlife. Ne pas créer de faux témoignages, acheter de liens, spammer les annuaires ou inventer une reconnaissance officielle du label.
7. Enrichir les guides avec des informations de terrain réellement vérifiées, sources datées et conditions d'accueil mises à jour. Les illustrations ne prouvent pas un séjour ou une inspection.

## Références officielles

### Contrôle complémentaire après publication

- Audit en lecture seule des 78 URL du sitemap : deux canoniques absentes repérées sur /le-label et /recommander-un-lieu, corrigées dans leurs layouts.
- Déploiement correctif READY : dpl_4iTacJwDH5HXF7Y9braGaA7uVVCG, https://label-vanlife-2ftgekrti-clement-projects.vercel.app, alias production conservé. Build Next.js réussi ; typage, lint ciblé et 141 tests réussis.
- Audit public final : 78 pages, aucune anomalie sur les contrôles HTTP, titre, description, canonical, noindex et H1 ; aucun titre dupliqué. Ce périmètre n'est pas un audit exhaustif de contenu ou de performance.
- Aucun log de niveau erreur retourné sur le dernier déploiement pour la fenêtre de 10 minutes.
- Google : rapport global d'indexation en préparation. Bing : recommandations « No data available ». Aucune nouvelle soumission répétée.
- Script reproductible : scripts/audit-public-seo.mjs.

- https://developers.openai.com/api/docs/bots : OAI-SearchBot pour la recherche, indépendant de GPTBot pour l'entraînement.
- https://developers.google.com/search/docs/appearance/ai-features : indexation et bonnes pratiques SEO ; aucun fichier IA ni balisage spécial requis, aucune garantie d'apparition.
- https://docs.perplexity.ai/docs/resources/perplexity-crawlers : PerplexityBot pour la recherche ; vérifier les IP officielles avant toute exception de pare-feu, jamais le seul User-Agent.
- https://www.bing.com/indexnow/getstarted : notification des changements, pas une garantie d'indexation.

Pas de registre universel où inscrire un site dans tous les LLM. Aucun service payant engagé et aucune promesse de classement.
