# Design system

## Principes

Premium calme, minimal, naturel et très lisible. Les références Apple, Airbnb, Stripe, Linear, Notion, Arc et Framer guident la qualité, pas la copie visuelle.

## Fondations actuelles

- Émeraude pour la marque et la réussite.
- Ambre pour la conversion et les avantages.
- Neutres chauds, surfaces blanches, grands rayons et ombres sobres.
- Outfit pour les titres et Inter pour le corps.

## Règles d'interface

- Une action primaire par écran ; CTA identique en libellé et destination.
- Largeur de lecture 65–75 caractères.
- Cibles tactiles d'au moins 44 × 44 px.
- Focus visible, contraste WCAG AA et navigation clavier complète.
- Mouvement désactivable via `prefers-reduced-motion`.
- Skeleton uniquement quand la structure est connue ; sinon progression ou message.
- Chaque vue couvre chargement, vide, erreur, succès et hors ligne si pertinent.
- Dark mode « prêt » signifie tokens sémantiques, pas couleurs codées dans chaque composant.

## À corriger

- Remplacer les styles inline et couleurs répétées par des tokens.
- Charger les polices avec `next/font`.
- Utiliser `next/image` avec dimensions et `sizes`.
- Documenter Button, Input, Card, Modal, Toast, Badge, Skeleton et leurs états accessibles.
