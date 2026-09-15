import "server-only";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";

async function readMemberResource<T>(
  resource: string,
  operation: () => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "UNKNOWN";
    console.error("Member resource unavailable", { resource, code });
    return fallback;
  }
}

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

  const prisma = getPrisma();
  const member = await prisma.user.findUnique({
    where: { id: authenticated.id },
    select: { id: true, email: true },
  });

  if (!member) {
    throw new Error("Active member record is missing");
  }

  // Optional member modules are isolated so one unavailable legacy table cannot
  // take down the card and the whole member area. Every fallback is an honest
  // empty state; no sample data is substituted.
  const profile = await readMemberResource(
    "profile",
    () => prisma.profile.findUnique({ where: { userId: member.id } }),
    null,
  );
  const membership = await readMemberResource(
    "membership",
    () => prisma.membership.findUnique({ where: { userId: member.id } }),
    null,
  );
  const memberCard = await readMemberResource(
    "memberCard",
    () => prisma.memberCard.findUnique({ where: { userId: member.id } }),
    null,
  );
  const memberCompanions = await readMemberResource(
    "memberCompanions",
    () => prisma.memberCompanion.findMany({ where: { userId: member.id }, orderBy: { createdAt: "asc" } }),
    [],
  );
  const favorites = await readMemberResource(
    "favorites",
    () => prisma.favorite.findMany({ where: { userId: member.id }, include: { place: true }, orderBy: { createdAt: "desc" } }),
    [],
  );
  const roadTrips = await readMemberResource(
    "roadTrips",
    () => prisma.roadTrip.findMany({
      where: { userId: member.id },
      include: { etapes: { include: { place: true }, orderBy: { order: "asc" } } },
      orderBy: { updatedAt: "desc" },
    }),
    [],
  );
  const userBadges = await readMemberResource(
    "userBadges",
    () => prisma.userBadge.findMany({ where: { userId: member.id }, include: { badge: true }, orderBy: { earnedAt: "desc" } }),
    [],
  );
  const passportStamps = await readMemberResource(
    "passportStamps",
    () => prisma.passportStamp.findMany({ where: { userId: member.id }, include: { place: true }, orderBy: { visitedAt: "desc" } }),
    [],
  );
  const notifications = await readMemberResource(
    "notifications",
    () => prisma.notification.findMany({ where: { userId: member.id }, orderBy: { createdAt: "desc" }, take: 100 }),
    [],
  );

  return {
    preview: false as const,
    ...member,
    profile,
    membership,
    memberCard,
    memberCompanions,
    favorites,
    roadTrips,
    userBadges,
    passportStamps,
    notifications,
  };
}
