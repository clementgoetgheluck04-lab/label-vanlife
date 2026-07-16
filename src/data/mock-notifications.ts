// Aperçu local du canal d'offres sponsorisées réservé aux membres.
// La facturation sera branchée ultérieurement ; `billingStatus` prépare ce flux.
export interface Notification {
  id: string;
  type: "promo" | "offre_speciale";
  title: string;
  body: string;
  sponsorName: string;
  placeId: string;
  validUntil: string;
  date: string;
  isRead: boolean;
  actionUrl: string;
  icon: string;
  sponsored: true;
  billingStatus: "planned";
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "offer-camping-le-verger",
    type: "offre_speciale",
    title: "−20 % sur votre prochaine nuitée",
    body: "Le Camping Le Verger propose une offre ponctuelle réservée aux membres Label Vanlife. Présentez votre carte membre à l'arrivée.",
    sponsorName: "Camping Le Verger",
    placeId: "camping-le-verger",
    validUntil: "2026-08-31T23:59:59",
    date: "2026-07-15T10:30:00",
    isRead: false,
    actionUrl: "/lieux/camping-le-verger",
    icon: "🌙",
    sponsored: true,
    billingStatus: "planned",
  },
  {
    id: "offer-domaine-mepillat",
    type: "promo",
    title: "Dégustation locale offerte",
    body: "Une dégustation est offerte aux membres séjournant au Domaine de Mépillat, sur présentation d'une carte membre valide.",
    sponsorName: "Domaine de Mépillat",
    placeId: "domaine-de-mepillat",
    validUntil: "2026-09-30T23:59:59",
    date: "2026-07-12T14:00:00",
    isRead: false,
    actionUrl: "/lieux/domaine-de-mepillat",
    icon: "🍷",
    sponsored: true,
    billingStatus: "planned",
  },
  {
    id: "offer-camping-saint-lambert",
    type: "offre_speciale",
    title: "Offre membres en bord de rivière",
    body: "Découvrez l'offre saisonnière proposée par le Camping Saint Lambert aux détenteurs de la carte Label Vanlife.",
    sponsorName: "Camping Saint Lambert",
    placeId: "camping-saint-lambert",
    validUntil: "2026-08-31T23:59:59",
    date: "2026-07-08T09:00:00",
    isRead: true,
    actionUrl: "/lieux/camping-saint-lambert",
    icon: "🏕️",
    sponsored: true,
    billingStatus: "planned",
  },
];

export const NON_LUS = MOCK_NOTIFICATIONS.filter((notification) => !notification.isRead).length;
