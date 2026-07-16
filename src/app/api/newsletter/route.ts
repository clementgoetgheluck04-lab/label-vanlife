import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { getPrisma } from "@/lib/prisma";
import { requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { parseEmail, parseText } from "@/server/validation";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "newsletter", 5, 60 * 60 * 1_000);
    const body = await request.json();
    const email = parseEmail(body.email);
    const source = parseText(body.source, { max: 80 }) || "web";
    if (!email) return NextResponse.json({ error: "Invalid email" }, { status: 400 });

    await getPrisma().newsletterSubscriber.upsert({
      where: { email },
      create: { email, source },
      update: { source, consentAt: new Date(), unsubscribedAt: null },
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
      const { error } = await resend.emails.send({
        from: "Label Vanlife <contact@labelvanlife.com>",
        to: email,
        subject: "Bienvenue sur Label Vanlife",
        text: "Merci pour votre inscription. Vous recevrez désormais les actualités de Label Vanlife.",
      });
      if (error) console.error("[newsletter] welcome email failed", error.name);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    return apiError(error, "newsletter");
  }
}
