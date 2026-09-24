# Modèle tarifaire 2027 — proposition en attente

Date de réception : 23 septembre 2026. Compléments validés le même jour.
Source complète : `C:/Users/cleme/.codex/attachments/05760fb0-b5fe-4a56-813b-ce2499947218/Texte collé.txt`.

## Consignes confirmées

- Conserver les tarifs actuellement affichés jusqu'au 31 décembre 2026.
- Nouveaux tarifs affichés pour adhésion à partir du **2 février 2027** ; ne pas modifier Stripe ni activer de renouvellement automatique à ce stade.
- Demander clarification avant toute modification du site.
- Prévoir dans la candidature des lieux une mention indiquant que seule l'offre Essentiel est actuellement disponible.
- Prévoir une case facultative, non précochée, demandant un contact pour une proposition promotionnelle Excellence avant fin 2026.
- Permettre de consulter le détail et la comparaison des deux offres.

## Proposition reçue — pas une grille en vigueur

### Carte membre (foyer, jusqu'à cinq personnes)

- Équivalent mensuel : 4,90 € en année 1, 3,90 € en année 2, 2,90 € à partir de l'année 3.
- Paiement trimestriel envisagé : 14,70 €, 11,70 €, puis 8,70 €.
- Alternative annuelle envisagée : 49 €, 39 €, puis 29 €.
- Ancienneté liée à la continuité de l'abonnement ; retour au tarif d'entrée après interruption, avec éventuelle grâce de 30 jours pour incidents de paiement.
- Affichage de l'ancienneté, du tarif fidélité et de la prochaine baisse.

### Essentiel

- Proposition : 24,90 €/mois en année 1 (298,80 €/an), 19,90 € en année 2, 14,90 € ensuite ; engagement initial de 12 mois.
- Contrôle des critères, label, fiche, carte, recherches, avantage membre, kit de communication, publication Facebook d'arrivée et contrôle périodique.

### Excellence

- Proposition : 59,90 €/mois en année 1 (718,80 €/an), 54,90 € en année 2, 49,90 € ensuite ; engagement initial de 12 mois.
- Essentiel inclus, plus publication éditorialisée, road trip autour du lieu, présentation par email/newsletter, visibilité renforcée pertinente, statistiques et boost annuel.
- Exclusivité envisagée entre établissements Excellence de même catégorie dans un rayon de 15 km ; les établissements Essentiel resteraient possibles.
- Notifications géolocalisées et événementielles envisagées : distinguer les fonctionnalités réellement disponibles des développements futurs.
- L'exclusivité cesse à l'arrêt ou au déclassement de l'offre.

## Décisions confirmées après lecture

- Les droits achetés ou offerts restent inchangés jusqu'à leur échéance, sans conversion automatique en abonnement.
- Comparatif avec prix : Essentiel 24,90 €/mois ; Excellence 59,90 €/mois ; engagement initial de 12 mois.
- Promotion Excellence de −20 % jusqu'au 1er février 2027 inclus : 47,92 €/mois sur le tarif de base, soit 575,04 € sur 12 mois.
- **La remise de 20 % est conservée aux renouvellements**, et n'est pas limitée aux 12 premiers mois (confirmation explicite du dirigeant).
- Pas de devis personnalisé : le tarif de l'offre est annoncé.
- Critères identiques entre Essentiel et Excellence ; seules les prestations supplémentaires diffèrent.
- Ne pas afficher « prévu pour 2027 ». Confirmer la mise en place des services et la zone avant toute souscription, sans prétendre que les fonctionnalités sont déjà déployées.
- Case facultative, non précochée, avec le libellé validé demandant un contact avant le 31 décembre 2026 ; comparatif dépliable sans quitter la candidature.

## Points restant à arrêter avant la bascule de facturation

1. Règles exactes de facturation, renouvellement, résiliation, ancienneté des membres historiques, grâce et taxes.
2. Définition précise des catégories et de la mesure des territoires.
3. Interruption et reprise : préciser les modalités contractuelles sans inventer de règles.

## Cumul confirmé

Le dirigeant confirme le cumul de la remise permanente de 20 % avec la fidélité : Excellence promotionnel à 47,92 €/mois en année 1, 43,92 € en année 2, puis 39,92 € en année 3 et suivantes. Bascule des nouvelles formules demandée au 02/02/2027 à 00:00 Europe/Paris. Le raccordement Stripe aux abonnements et à leur cycle de vie reste à réaliser ; ne pas confondre cette présentation avec une facturation déjà active.

## État

### Carte membre — décisions confirmées

- Grille applicable aux nouvelles offres à partir du 02/02/2027 ; paiement annuel ou trimestriel uniquement, pas de prélèvement mensuel.
- 30 jours de grâce pour régulariser un incident de paiement en conservant l’ancienneté ; résiliation puis réinscription : retour au tarif d’entrée.
- Tarif fondateur pour les cartes achetées avec l’offre actuelle à 29 € : première validité jusqu’au 31/12/2027, puis renouvellements à 29 €/an tant que l’adhésion est continue. Pas de carte perpétuelle contre un paiement unique.
- Aucun prélèvement ni conversion automatique sans consentement. Ne pas attribuer par défaut cet avantage aux cartes offertes, qui ne sont pas des achats à 29 €.
- Confirmation du 23 septembre : le tarif fondateur est réservé au paiement annuel, sans option à 7,25 € par trimestre.
- Présentation et paramètres préparés ; cycle de facturation et suivi réel de fidélité non encore raccordés. Ne pas afficher un faux tarif personnel ou une ancienneté fictive dans l’espace membre.

### Préparation technique des règles

`src/lib/subscription-pricing.ts` calcule les anniversaires de fidélité, la limite de grâce de 30 jours, l’éligibilité fondateur à partir d’un paiement vérifié et les remises Excellence cumulées. Tests aux limites de dates inclus. Ce module reste déconnecté du paiement de production : il ne crée ni abonnement ni prélèvement.

Comparatif et demande de contact implémentés localement. Présentation revue à la demande du dirigeant : offre actuelle isolée, comparatif des services sans prix, tarifs futurs dans un panneau fermé par défaut intitulé « Voir les tarifs des offres disponibles à partir du 02/02/2027 ». Ce panneau présente les trois paliers de fidélité des deux abonnements mensuels. Promotion anticipée dans un sous-panneau distinct. Prix de paiement existants inchangés. Aucun abonnement ou basculement automatique créé dans Stripe ; les paliers sont présentés uniquement, pas facturés.
