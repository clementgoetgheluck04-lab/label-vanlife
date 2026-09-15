import "server-only";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";

export async function getMemberData() {
  const authenticated = await requireActiveMember();

  if (!authenticated) {
    return {
      preview: true as const,
      id: "admin-preview",
      email: "Prévisualisation administrateur",
      profile: {
        firstName: "",
        lastName: "",
        points: 0,
        level: "PRÉVISUALISATION",
      },
      membership: null,
      memberCard: null,
      memberCompanions: [],
      favorites: [],
      roadTrips: [],
      userBadges: [],
      passportStamps: [],
      notifications: [],
    };
  }

  const member = await getPrisma().user.findUnique({
    where: { id: authenticated.id },
    include: {
      profile: true,
      membership: true,
      memberCard: true,
      memberCompanions: { orderBy: { createdAt: "asc" } },
      favorites: {
        include: { place: true },
        orderBy: { createdAt: "desc" },
      },
      roadTrips: {
        include: {
          etapes: {
            include: { place: true },
            orderBy: { order: "asc" },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
      userBadges: {
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      },
      passportStamps: {
        include: { place: true },
        orderBy: { visitedAt: "desc" },
      },
      notifications: {
        orderBy: { createdAt: "desc" },
        take: 100,
      },
    },
  });

  if (!member) {
    throw new Error("Active member record is missing");
  }

  return { preview: false as const, ...member };
}
