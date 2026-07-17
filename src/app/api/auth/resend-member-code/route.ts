import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { Resend } from "resend";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { generateMemberAccessCode, hashMemberAccessCode, hashMemberAccessLookupCode } from "@/server/member-access";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { parseEmail } from "@/server/validation";

const GENERIC_MESSAGE = "Si une carte membre active correspond à cette adresse, un nouveau code vient d’être envoyé.";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "resend-member-code", 3, 60 * 60 * 1_000);
    const body = await request.json() as Record<string, unknown>;
    const email = parseEmail(body.email);
    if (!email) return NextResponse.json({ success: true, message: GENERIC_MESSAGE });

    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        membership: true,
        checkoutOrders: {
          where: { product: "MEMBERSHIP", status: "PAID" },
          orderBy: { paidAt: "desc" },
          take: 1,
        },
      },
    });
    const order = user?.checkoutOrders[0];
    const active = user?.membership?.status === "ACTIVE"
      && (!user.membership.expiresAt || user.membership.expiresAt > new Date());
    if (!user || !order || !active) {
      return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    }

    const secret = requireServerEnv("MEMBER_ACCESS_CODE_SECRET");
    const code = generateMemberAccessCode();
    const payload = order.payload && typeof order.payload === "object" && !Array.isArray(order.payload)
      ? { ...(order.payload as Record<string, unknown>) }
      : {};
    const expiresAt = user.membership?.expiresAt ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1_000);

    const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
    const { error } = await resend.emails.send({
      from: "Label Vanlife <contact@labelvanlife.com>",
      to: email,
      subject: "Votre nouveau code d’accès Label Vanlife",
      text: `Bonjour ${user.profile?.firstName || ""},\n\nVoici votre nouveau code d'accès personnel : ${code}\n\nIl remplace le précédent et reste valable pendant toute la durée de votre carte membre.\n\nConnexion : ${getAppUrl()}/member-login\n\nL'équipe Label Vanlife`,
    });
    if (error) throw new Error("Member access code email failed");

    // Le code précédent reste valide tant que l'email n'a pas été accepté par
    // le prestataire. Cela évite de bloquer un membre si Resend est indisponible.
    await prisma.checkoutOrder.update({
      where: { id: order.id },
      data: {
        payload: {
          ...payload,
          memberAccessCodeHash: hashMemberAccessCode(email, code, secret),
          memberAccessCodeLookupHash: hashMemberAccessLookupCode(code, secret),
          memberAccessCodeExpiresAt: expiresAt.toISOString(),
          memberAccessCodeRegeneratedAt: new Date().toISOString(),
        } as Prisma.InputJsonObject,
      },
    });

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "resend-member-code");
  }
}
