import { NextRequest, NextResponse } from "next/server";

import { getPrisma } from "@/lib/prisma";
import { AuthorizationError, getAuthenticatedUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest, RequestBodyError } from "@/server/request-security";

export const dynamic = "force-dynamic";

function text(value: unknown, label: string, max: number, required = false): string {
  if (typeof value !== "string") throw new RequestBodyError(`${label} invalide`, 400);
  const normalized = value.trim().replace(/[\t ]+/g, " ");
  if ((required && normalized.length < 2) || normalized.length > max) throw new RequestBodyError(`${label} invalide`, 400);
  return normalized;
}

function optionalUrl(value: unknown, label: string): string | null {
  const raw = text(value, label, 300);
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    return url.toString();
  } catch {
    throw new RequestBodyError(`${label} doit être une adresse http ou https valide`, 400);
  }
}

function optionalEmail(value: unknown): string | null {
  const email = text(value, "Email public", 254).toLowerCase();
  if (!email) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new RequestBodyError("Email public invalide", 400);
  return email;
}

export async function PATCH(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "pro-profile", 20, 60 * 60 * 1_000);
    const user = await getAuthenticatedUser();
    const body = await readJsonRequest(request, 20_000) as Record<string, unknown>;
    const establishment = body.establishment as Record<string, unknown> | null;
    if (!establishment || typeof establishment !== "object") throw new RequestBodyError("Coordonnées invalides", 400);

    const prisma = getPrisma();
    const pro = await prisma.establishmentProfile.findUnique({ where: { userId: user.id }, select: { id: true } });
    if (!pro) return NextResponse.json({ error: "Établissement introuvable" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.establishmentProfile.update({
        where: { id: pro.id },
        data: {
          establishmentName: text(establishment.establishmentName, "Nom de l’établissement", 120, true),
          phone: text(establishment.phone, "Téléphone", 30, true),
          website: optionalUrl(establishment.website, "Site internet"),
          addressLine1: text(establishment.addressLine1, "Adresse", 180, true),
          city: text(establishment.city, "Ville", 100, true),
          postalCode: text(establishment.postalCode, "Code postal", 12, true),
          region: text(establishment.region, "Région", 100, true),
        },
      });

      if (body.place !== null && body.place !== undefined) {
        if (typeof body.place !== "object") throw new RequestBodyError("Fiche publique invalide", 400);
        const place = body.place as Record<string, unknown>;
        const placeId = text(place.id, "Lieu", 64, true);
        const ownedPlace = await tx.place.findFirst({ where: { id: placeId, ownerId: pro.id }, select: { id: true } });
        if (!ownedPlace) throw new AuthorizationError();
        if (!Array.isArray(place.services) || place.services.length > 20) throw new RequestBodyError("Services invalides", 400);
        const services = place.services.map((service) => text(service, "Service", 50, true));
        await tx.place.update({
          where: { id: ownedPlace.id },
          data: {
            name: text(place.name, "Nom public", 120, true),
            shortDesc: text(place.shortDesc, "Résumé", 220) || null,
            description: text(place.description, "Description", 3_000, true),
            phone: text(place.phone, "Téléphone public", 30) || null,
            email: optionalEmail(place.email),
            website: optionalUrl(place.website, "Site public"),
            addressLine1: text(place.addressLine1, "Adresse publique", 180) || null,
            city: text(place.city, "Ville publique", 100, true),
            postalCode: text(place.postalCode, "Code postal public", 12) || null,
            region: text(place.region, "Région publique", 100, true),
            services,
          },
        });
      }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "pro-profile");
  }
}
