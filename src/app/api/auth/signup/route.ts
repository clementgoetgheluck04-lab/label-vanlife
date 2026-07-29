import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { getAppUrl } from "@/server/env";
import { apiError } from "@/server/http";
import { parseMemberSignupPayload } from "@/server/validation";
import { assertSameOrigin, enforceRateLimit } from "@/server/request-security";

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "signup", 5, 60 * 60 * 1_000);
    const body = await request.json();
    const signup = parseMemberSignupPayload(body);
    if (!signup) {
      return NextResponse.json(
        { error: "Vérifiez vos coordonnées, votre âge et les informations des accompagnants." },
        { status: 400 },
      );
    }
    const { email, password, firstName, lastName, phone, age, companions } = signup;

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAppUrl()}/auth/callback?next=${encodeURIComponent("/devenir-membre?checkout=ready")}`,
        data: { firstName, lastName, phone },
      },
    });
    if (error) {
      const duplicate = ["user_already_exists", "email_exists", "user_already_registered"].includes(error.code || "");
      if (!duplicate) {
        console.warn("[signup] Supabase rejected the request", error.code);
        return NextResponse.json(
          { error: "Impossible de créer le compte pour le moment. Réessayez dans quelques minutes." },
          { status: 503 },
        );
      }
    }
    const createdUser = data.user;
    if (createdUser && createdUser.identities?.length !== 0) {
      const prisma = getPrisma();
      await prisma.$transaction(async (tx) => {
        await tx.user.upsert({
          where: { id: createdUser.id },
          create: { id: createdUser.id, email },
          update: { email },
        });
        await tx.profile.upsert({
          where: { userId: createdUser.id },
          create: { userId: createdUser.id, firstName, lastName, phone, age },
          update: { firstName, lastName, phone, age },
        });
        await tx.memberCompanion.deleteMany({ where: { userId: createdUser.id } });
        if (companions.length > 0) {
          await tx.memberCompanion.createMany({
            data: companions.map((companion) => ({ ...companion, userId: createdUser.id })),
          });
        }
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
