# Le Mag — première version locale

- /blog devient Le Mag, menu principal et pied de page reliés.
- Quatre anciennes URL conservées ; quatre articles réécrits sans faux classement de dix lieux, faux témoignages ou dates de publication inventées.
- Une seule source de contenu src/data/mag.ts alimente index, articles et sitemap.
- Rubriques reliées aux guides, catalogue et philosophie existants. Les articles Bretagne et Provence renvoient à leurs guides régionaux, et non au catalogue général.
- Illustrations Facebook réutilisées sans génération supplémentaire ; next/image, dimensions, tailles responsive et chargement différé hors premier écran.
- Contact contribution par mail uniquement ; aucun formulaire de collecte ou publication automatique ajouté.
- Article inconnu : notFound(), pas une fausse page HTTP 200.

Contrôles : lint ciblé et typage réussis ; 135 tests passent. Build Next.js --webpack réussi, 80 pages générées. Build Turbopack bloqué par accès refusé au lancement du processus Node, même avec demande d'exécution étendue ; configuration de build du projet inchangée.

Aperçu http://localhost:3016/blog, session locale 14222. Rendu desktop et mobile inspectés ; largeur document 375 = largeur viewport 375, aucun débordement horizontal. Navigation index → article Bretagne → guide Bretagne effectuée. Aucun log navigateur de niveau error observé sur l'index lors du contrôle. Les images hors écran restent chargées à la demande.

Non déployé. Pas de modification de paiement, base de données, droits membres ou campagnes email.
