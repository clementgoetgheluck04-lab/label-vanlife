# Contrôle des parcours du Mag — 23 septembre 2026

Audit en lecture seule de 24 articles et de leurs 24 destinations distinctes :

- 8 fiches du réseau : HTTP 200, sans redirection, avec titre H1 et mention de millésime.
- 12 sources externes d'hébergement : HTTP 200 et HTTPS, sans changement d'adresse lors du contrôle.
- 4 destinations internes (explorer, guides Bretagne/Provence et philosophie) : HTTP 200.

La présentation distingue les suggestions documentaires non labellisées, sans visite de contrôle ou avantage garanti, des fiches du réseau avec leurs millésimes. Les illustrations sont signalées comme des illustrations d'ambiance.

Ce contrôle confirme la disponibilité des liens, pas les tarifs, disponibilités, qualités de service ni conditions d'accueil des exploitants. Les restrictions d'accès et dates doivent toujours être confirmées avant un voyage.

Script reproductible : `node --experimental-strip-types scripts/audit-mag-links.mjs`. Trois requêtes simultanées maximum, aucune écriture distante. Toute erreur externe doit être vérifiée manuellement : une protection antibot peut répondre comme une erreur réseau.

Aucune campagne, relance ni nouvelle soumission d'indexation déclenchée pendant ce contrôle. Pas de changement de contenu en production nécessaire.

## Amélioration de navigation suivante

Ajout d'un fil d'Ariane Accueil / Le Mag / zone / article et de trois lectures liées maximum. Les itinéraires liés restent dans la même grande zone ; une explication indique qu'ils ne constituent pas des étapes proches à enchaîner. Pas d'auto-lien, pas de doublon, pas de nouvelle promesse d'accueil.

Contrôles locaux : lint ciblé, typage et 143 tests réussis. Navigation réelle Balagne vers Porto/Piana vérifiée dans le navigateur. Les statuts non labellisés et les millésimes restent inchangés.
