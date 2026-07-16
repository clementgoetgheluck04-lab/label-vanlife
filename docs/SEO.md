# SEO

## État actuel

Métadonnées globales et quelques layouts existent, ainsi qu'un sitemap et du JSON-LD. En revanche, robots et canonicals manquent, l'image OpenGraph déclarée est absente, plusieurs pages critiques sont entièrement clientes, et le sitemap dépend de données locales avec une date modifiée recalculée.

## Architecture cible

- URLs localisées et sémantiques : `/fr/lieux/{slug}`, `/fr/france/{region}/{departement}`.
- Pages lieu, road trip, article, pays, région et département rendues serveur et indexables si leur contenu est unique et utile.
- Espaces auth, admin, compte, checkout et résultats pauvres en `noindex`.
- Canonical absolu par page et `hreflang` lorsque les traductions existent réellement.
- Sitemaps segmentés par type et dates issues de la base.
- `robots.ts` explicite, sans utiliser robots pour protéger des données privées.
- Breadcrumbs visibles et `BreadcrumbList`.

## Données structurées

- `Organization`/`WebSite` global.
- Type local pertinent pour les lieux, avec adresse, géo, images et avis vérifiés.
- `Article` pour le blog, `FAQPage` seulement si la FAQ est visible.
- Ne jamais publier de prix, note ou stock simulé dans le JSON-LD.

## Performance SEO

- `next/font`, `next/image`, dimensions réservées et priorité limitée au vrai LCP.
- Carte chargée après le contenu indexable.
- Budgets : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 au p75 mobile.

## Maillage

Chaque lieu relie sa ville, région, type, road trips et contenus éditoriaux utiles. Les pages géographiques ne sont publiées qu'avec suffisamment de lieux et de contenu original pour éviter les pages faibles.
