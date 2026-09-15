import { NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const member = await requireActiveMember();
  if (!member) return NextResponse.json({ roadTrips: [] });

  const roadTrips = await getPrisma().roadTrip.findMany({
    where: { userId: member.id },
    include: {
      etapes: {
        include: { place: { select: { name: true, slug: true, city: true } } },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({
    roadTrips: roadTrips.map((trip) => ({
      ...trip,
      tags: Array.isArray(trip.tags) ? trip.tags : [],
    })),
  });
}
