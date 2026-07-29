import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";
import { parseEmail } from "@/server/validation";

const GENERIC_MESSAGE = "Si cette adresse attend une confirmation, un nouvel email vient d’être envoyé.";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "resend-signup-confirmation", 3, 60 * 60 * 1_000);
    const body = await request.json() as Record<string, unknown>;
    const email = parseEmail(body.email);
    if (!email) return NextResponse.json({ success: true, message: GENERIC_MESSAGE });

    const supabase = await createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent("/devenir-membre?checkout=ready")}`,
      },
    });
    if (error) console.warn("[resend-signup-confirmation] Supabase rejected the request", error.code);

    return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "resend-signup-confirmation");
  }
}
