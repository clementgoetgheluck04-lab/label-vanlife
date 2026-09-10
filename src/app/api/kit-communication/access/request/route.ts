import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getLabelledPlaceByEmail } from "@/data/place-contacts";
import { signKitAccessToken } from "@/lib/kit-access-token";
import { getAppUrl, getTransactionalEmailFrom, requireServerEnv } from "@/server/env";
import { labelVanlifeEmail } from "@/server/email-template";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";
import { parseEmail } from "@/server/validation";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "kit-access-request", 5, 60 * 60 * 1_000);
    const input = await readJsonRequest(request, 2_048) as Record<string, unknown>;
    const email = parseEmail(input.email)?.toLowerCase();
    if (!email) return NextResponse.json({ error: "Adresse e-mail invalide" }, { status: 400 });

    const labelledPlace = getLabelledPlaceByEmail(email);
    if (labelledPlace) {
      const placeName = ENRICHED_LIEUX.find((place) => place.id === labelledPlace.placeId)?.nom || "votre établissement";
      const token = signKitAccessToken({
        version: 1,
        kind: "magic-link",
        email,
        placeId: labelledPlace.placeId,
        expiresAt: Date.now() + 15 * 60 * 1_000,
      });
      const accessUrl = `${getAppUrl()}/api/kit-communication/access/confirm?token=${encodeURIComponent(token)}`;
      const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
      const { error } = await resend.emails.send({
        from: getTransactionalEmailFrom(),
        to: email,
        replyTo: "contact@labelvanlife.com",
        subject: "Votre accès au kit partenaire Label Vanlife 2027",
        text: `Bonjour,\n\nVoici le lien sécurisé permettant à ${placeName} d’accéder au kit de communication Label Vanlife 2027 :\n${accessUrl}\n\nCe lien expire dans 15 minutes.\n\nL’équipe Label Vanlife`,
        html: labelVanlifeEmail({
          preheader: "Votre lien sécurisé vers le kit partenaire 2027",
          eyebrow: "ESPACE PARTENAIRE 2027",
          title: "Accédez à votre kit de communication",
          greeting: `Bonjour ${placeName},`,
          paragraphs: ["Votre adresse professionnelle a bien été reconnue parmi les lieux labellisés Label Vanlife."],
          action: { label: "Ouvrir le kit 2027", href: accessUrl },
          notice: "Ce lien personnel expire dans 15 minutes. Après ouverture, votre accès restera actif sur cet appareil pendant 30 jours.",
        }),
      });
      if (error) throw new Error(`Resend kit access failed: ${error.message || error.name}`);
    }

    // Réponse identique, que l'adresse soit connue ou non, afin de ne pas exposer la liste des partenaires.
    return NextResponse.json({ success: true });
  } catch (error) {
    return apiError(error, "kit-access-request");
  }
}
