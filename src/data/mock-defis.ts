// Données fictives — Défis Label Vanlife
import type { Defi } from "@/lib/types";

export const MOCK_DEFIS: Defi[] = [
  {
    id: "defi-weekend-3-nuits",
    titre: "Week-end Vanlife Éclair",
    description:
      "Passez 3 nuits dans 3 lieux labellisés différents en un seul week-end (vendredi au lundi). L'occasion de découvrir la diversité des hébergements !",
    recompense: 300,
    type: "visite",
    progression: 33,
    termine: false,
  },
  {
    id: "defi-ambassadeur-avis",
    titre: "Ambassadeur Local",
    description:
      "Laissez un avis détaillé (minimum 50 caractères) sur 5 lieux différents que vous avez visités. Aidez la communauté à choisir ses prochaines étapes.",
    recompense: 200,
    type: "avis",
    progression: 40,
    termine: false,
  },
  {
    id: "defi-partage-reseaux",
    titre: "Viral Vanlife",
    description:
      "Partagez votre plus belle photo de vanlife sur Instagram avec le hashtag #LabelVanlife. La photo avec le plus de likes gagne des points bonus !",
    recompense: 250,
    type: "partage",
    progression: 0,
    termine: false,
  },
  {
    id: "defi-parrainage",
    titre: "Parrain & Marraine",
    description:
      "Invitez un ami à rejoindre Label Vanlife grâce à votre code de parrainage. Quand il réserve sa première nuit, vous gagnez des points tous les deux.",
    recompense: 500,
    type: "parrainage",
    progression: 0,
    termine: false,
  },
  {
    id: "defi-insolite",
    titre: "Nuit Insolite",
    description:
      "Réservez une nuit dans un hébergement insolite (cabane, yourte, roulotte, bulle). Sortez des sentiers battus pour une expérience inoubliable.",
    recompense: 350,
    type: "visite",
    progression: 0,
    termine: false,
  },
];