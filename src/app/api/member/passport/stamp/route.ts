import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { requireActiveMember } from "@/server/auth";
import { apiError } from "@/server/http";
import { ensureLabelledPlaces } from "@/server/labelled-place";
import { verifyPlaceCheckInToken } from "@/server/place-checkin-token";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "passport-stamp", 12, 60 * 60 * 1_000);
    const member = await requireActiveMember();
    if (!member) return NextResponse.json({ error: "Real member required" }, { status: 403 });
    const body = await readJsonRequest(request, 4_096) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token : "";
    const payload = verifyPlaceCheckInToken(token);
    if (!payload) throw new RequestBodyError("Ce QR de visite est invalide ou expiré", 400);

    const prisma = getPrisma();
    const places = await ensureLabelledPlaces(prisma, [payload.placeSlug]);
    const place = places?.find((item) => item.slug === payload.placeSlug);
    if (!place) throw new RequestBodyError("Ce lieu labellisé n’est plus disponible", 400);

    const result = await prisma.$transaction(async (tx) => {
      const inserted = await tx.passportStamp.createMany({
        data: [{ userId: member.id, placeId: place.id }],
        skipDuplicates: true,
      });

      if (inserted.count === 1) {
        await tx.profile.updateMany({ where: { userId: member.id }, data: { points: { increment: 25 } } });
        const badge = await tx.badge.findUnique({ where: { code: "PREMIERE_ETAPE" }, select: { id: true } });
        if (badge) {
          await tx.userBadge.upsert({
            where: { userId_badgeId: { userId: member.id, badgeId: badge.id } },
            create: { userId: member.id, badgeId: badge.id },
            update: {},
          });
        }
        await tx.notification.create({
          data: {
            userId: member.id,
            type: "PASSPORT_STAMP",
            title: `Nouveau tampon · ${place.name}`,
            body: "Votre visite a été ajoutée au Passeport Label Vanlife et 25 points ont été crédités.",
            data: { placeSlug: place.slug },
          },
        });
      }

      await tx.analyticsEvent.create({
        data: {
          name: "visit_confirmed",
          userId: member.id,
          entityType: "lieux",
          entityId: place.slug,
          path: `/visite/${place.slug}`,
          properties: { firstConfirmation: inserted.count === 1 },
        },
      });

      return { created: inserted.count === 1 };
    });

    return NextResponse.json({ ...result, place: { name: place.name, slug: place.slug } });
  } catch (error) {
    return apiError(error, "passport-stamp");
  }
}
