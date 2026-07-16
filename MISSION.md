# Mission — Label Vanlife

Version : 1.0  
Owner : Clément Goetgheluck  
Rôle technique : CTO / Product Engineer

## Notre mission

Construire la plateforme qui deviendra la référence mondiale des voyageurs en van et des établissements Vanlife Friendly. Label Vanlife n'est ni un GPS, ni une liste de coordonnées : la marque vend la confiance.

## Notre promesse

- Un voyageur achète sa carte membre en moins de deux minutes.
- Un établissement dépose une demande de labellisation en moins de dix minutes.
- Chaque interaction est simple, rapide, accessible et rassurante.

## Modèle économique à valider

- Carte membre : prix de référence du brief, 39 €, jusqu'à cinq personnes.
- Labellisation : prix de référence du brief, 220 €, paiement unique puis étude du dossier.

Le code affiche actuellement d'autres prix et utilise un abonnement Stripe pour la carte. La source de vérité produit doit être décidée avant remise en service du paiement.

## Priorités

1. Tunnel de vente et paiements
2. Authentification, autorisations et expérience membre
3. Carte interactive
4. SEO et performance
5. PWA et internationalisation

## Principes

- Mobile first, WCAG 2.2 AA et performance mesurée.
- Server Components par défaut ; JavaScript client uniquement lorsqu'il apporte une interaction.
- Validation et autorisation côté serveur, RLS Supabase et secrets hors du dépôt.
- Paiements idempotents, webhooks vérifiés et journalisés.
- Petites livraisons testées, documentées et réversibles.
- Une dépendance ou une abstraction n'est ajoutée que si elle réduit un risque ou un coût démontrable.

## Objectif 2035

Plus de 100 000 membres, 10 000 établissements, plusieurs continents et une marque reconnue comme le Michelin de la vanlife.
