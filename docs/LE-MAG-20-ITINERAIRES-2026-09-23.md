# Le Mag — extension à 20 itinéraires

## Réalisation

20 nouveaux carnets, dont 3 en Corse (Balagne, Porto–Piana, Bonifacio), en plus des quatre articles existants. Navigation par sept zones ; 60 étapes de visite, durées indicatives et précautions adaptées au parcours. Chaque carnet propose une base d'accueil : huit fiches du réseau et douze suggestions documentaires non labellisées. Les sources officielles des suggestions sont enregistrées dans `src/data/mag-itineraries.ts` et accessibles sur les pages.

Les millésimes des lieux du réseau utilisent les mêmes données que leurs fiches. Un lieu 2026 sans renouvellement confirmé affiche l'avertissement 2027. Aucun avantage carte n'est promis pour les suggestions extérieures. Les bases ne sont pas présentées comme couvrant toutes les nuits ni les visites comme des emplacements de nuit.

Illustrations existantes de la direction artistique Facebook réutilisées (sept visuels au total pour Le Mag, pas vingt illustrations géographiques uniques). Images explicitement présentées comme des ambiances, chargées via next/image. Aucun nouvel asset généré ni frais engagé.

## Vérifications

- Typage TypeScript et ESLint ciblé : réussis.
- Suite complète : 136 tests réussis.
- Compilation Next.js Webpack : réussie, 100 pages statiques générées.
- 20 nouvelles pages : HTTP 200 et nom de la base présent.
- Huit fiches du réseau référencées : HTTP 200.
- Navigateur : index, carnet Porto et encadré Ardèche vérifiés ; Le Coin Charmant affiche 2026 et 2027.
- Mobile Porto, viewport 390 : largeur document 375 et largeur défilante 375, sans débordement horizontal.
- Sources externes consultées via recherche web le 23 septembre 2026 ; pas d'appel aux campings, pas de garantie de disponibilité ni de validation terrain.

Version locale sur http://localhost:3016/blog ; aucun déploiement effectué dans ce lot.
