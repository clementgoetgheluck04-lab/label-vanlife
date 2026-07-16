# Sources de données

## Établissements labellisés

La V1 publique est accessible sur [labelvanlife.com](https://labelvanlife.com/). Dans le projet local, la source actuellement utilisée par l'accueil, l'explorateur, la carte, les fiches lieu et l'espace membre est :

`src/data/enriched-lieux.ts`

Cet instantané contient **26 établissements**. Les photos correspondantes sont stockées sous `public/images/lieux`.

## Jeux de données à ne pas confondre

- `extracted_lieux.json` : 28 entrées brutes, dont une page d'index ; 27 fiches après exclusion de cette page.
- `src/data/lieux-labellises.ts` : 39 entrées historiques mélangeant établissements et villages d'exception.
- `src/data/campings_kml.json` : import géographique de travail, non canonique.
- table Prisma `places` : modèle cible pour Supabase, mais pas encore alimenté par les 26 fiches dans l'environnement réel.

## Décision temporaire

Jusqu'à la migration contrôlée vers Supabase, `ENRICHED_LIEUX` est la seule référence produit pour les compteurs et les pages publiques. Toute migration devra préserver les identifiants, vérifier les coordonnées, les réductions, les contacts et les droits sur les images avant activation.

## Procédure de migration

1. `npm run places:validate` contrôle les 26 fiches et la présence des images sans contacter la base.
2. `npm run places:plan` compare les slugs avec la base réelle et n'écrit rien.
3. `scripts/backup-supabase.ps1` produit un dump PostgreSQL, son catalogue et son SHA-256.
4. `npm run places:import -- --confirm=IMPORT_26_PLACES --backup=<fichier.dump>` exécute les upserts dans une transaction unique.
5. L'import vérifie que les 26 slugs sont présents après écriture.

L'import ne remplace jamais les propriétaires, les relations, les dates de création réelles ni les métriques existantes. Les notes, nombres d'avis et favoris de la V1 ne sont pas importés, car leur origine n'est pas suffisamment vérifiée.
