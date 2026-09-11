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
      const greetingName = labelledPlace.contact.contactName || placeName;
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
        subject: `${placeName} — votre kit de communication Label Vanlife 2027`,
        text: `Bonjour ${greetingName},\n\nMerci de poursuivre l’aventure avec Label Vanlife. Le renouvellement 2027 de ${placeName} est confirmé. Votre fiche affiche les millésimes 2026 et 2027 ; le millésime 2026 disparaîtra automatiquement le 1er janvier 2027.\n\nVotre kit contient les six visuels officiels 2027, prêts pour votre site, vos réseaux sociaux, vos newsletters et vos supports imprimés. Vous pouvez également placer le logo dans le pied de page de votre site et rendre l’image cliquable vers https://www.labelvanlife.fr/.\n\nAccéder au kit :\n${accessUrl}\n\nCe lien personnel expire dans 15 minutes. Après ouverture, l’accès restera actif pendant 30 jours sur le même appareil.\n\nVotre fiche : https://www.labelvanlife.fr/lieux/${labelledPlace.placeId}\nPage Facebook : https://www.facebook.com/labelvanlife\n\nBelle saison 2027 à vos côtés,\nL’équipe Label Vanlife`,
        html: labelVanlifeEmail({
          preheader: `Le renouvellement 2027 de ${placeName} est confirmé : découvrez vos six visuels officiels.`,
          eyebrow: "LABEL VANLIFE · PARTENAIRE 2027",
          title: "Votre kit de communication 2027 est prêt",
          greeting: `Bonjour ${greetingName},`,
          paragraphs: [
            `Merci de poursuivre l’aventure avec Label Vanlife. Le renouvellement 2027 de ${placeName} est confirmé. Votre fiche affiche les millésimes 2026 et 2027 ; le millésime 2026 disparaîtra automatiquement le 1er janvier 2027.`,
            "Votre kit réunit les six visuels officiels 2027, prêts à être utilisés sur votre site internet, vos réseaux sociaux, vos newsletters, vos brochures et vos supports d’accueil.",
          ],
          details: [
            { label: "Kit", value: "6 fichiers haute définition" },
            { label: "Utilisation", value: "Web, réseaux sociaux et impression" },
            { label: "Lien conseillé", value: "www.labelvanlife.fr" },
          ],
          action: { label: "Ouvrir le kit 2027", href: accessUrl },
          notice: `Ce lien personnel expire dans 15 minutes. Après ouverture, votre accès restera actif sur cet appareil pendant 30 jours. Votre fiche : www.labelvanlife.fr/lieux/${labelledPlace.placeId} · Facebook : facebook.com/labelvanlife`,
          signature: "L’équipe Label Vanlife",
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
