import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { parseEmail, parseText } from "@/server/validation";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "contact", 5, 60 * 60 * 1_000);
    const body = await request.json();
    const name = parseText(body.name, { max: 120 });
    const email = parseEmail(body.email);
    const subject = parseText(body.subject, { max: 160 });
    const message = parseText(body.message, { min: 10, max: 5_000, required: true });
    if (name === null || !email || subject === null || !message) {
      return NextResponse.json({ error: "Invalid contact message" }, { status: 400 });
    }

    const resend = new Resend(requireServerEnv("RESEND_API_KEY"));
    const { error } = await resend.emails.send({
      from: "Label Vanlife <contact@labelvanlife.com>",
      to: "contact@labelvanlife.com",
      replyTo: email,
      subject: subject || "Nouveau message Label Vanlife",
      text: `Nom: ${name || "Non renseigné"}\nEmail: ${email}\n\n${message}`,
    });
    if (error) throw new Error("Email provider rejected the message");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    return apiError(error, "contact");
  }
}
