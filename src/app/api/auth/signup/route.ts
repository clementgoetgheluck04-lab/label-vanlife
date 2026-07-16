import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { parseEmail, parseText } from "@/server/validation";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "signup", 5, 60 * 60 * 1_000);
    const body = await request.json();
    const email = parseEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";
    const firstName = parseText(body.firstName, { min: 2, max: 80, required: true });
    const lastName = parseText(body.lastName, { min: 2, max: 100, required: true });
    const phone = parseText(body.phone, { min: 6, max: 30, required: true });
    if (!email || !firstName || !lastName || !phone || password.length < 12 || password.length > 128) {
      return NextResponse.json(
        { error: "Use a valid email and a password of at least 12 characters" },
        { status: 400 },
      );
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback?next=/devenir-membre`,
        data: { firstName, lastName, phone },
      },
    });
    if (error) console.warn("[signup] Supabase rejected the request", error.code);
    if (!error && data.user) {
      const prisma = getPrisma();
      await prisma.user.upsert({
        where: { id: data.user.id },
        create: { id: data.user.id, email },
        update: { email },
      });
      await prisma.profile.upsert({
        where: { userId: data.user.id },
        create: { userId: data.user.id, firstName, lastName, phone },
        update: { firstName, lastName, phone },
      });
    }

    return NextResponse.json({
      success: true,
      message: "If this address can be registered, a confirmation email has been sent.",
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    return apiError(error, "signup");
  }
}
