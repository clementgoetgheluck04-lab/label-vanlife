import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { adminPreviewCodeMatches } from "@/server/admin-preview";
import { getAppUrl, requireServerEnv } from "@/server/env";
import { apiError } from "@/server/http";
import {
  generateMemberAccessCode,
  hashMemberAccessCode,
  hashMemberAccessLookupCode,
} from "@/server/member-access";

export const dynamic = "force-dynamic";

type CompanionInput = {
  firstName?: unknown;
  lastName?: unknown;
  age?: unknown;
};

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asOptionalText(value: unknown): string | undefined {
  const text = asText(value);
  return text || undefined;
}

function asAge(value: unknown): number | undefined {
  const age = typeof value === "number" ? value : Number.parseInt(asText(value), 10);
  return Number.isFinite(age) && age > 0 && age < 120 ? age : undefined;
}

function normalizeEmail(value: unknown): string {
  return asText(value).toLowerCase();
}

function addOneYear(date: Date): Date {
  const next = new Date(date);
  next.setUTCFullYear(next.getUTCFullYear() + 1);
  return next;
}

async function findOrCreateSupabaseUser(email: string, firstName: string, lastName: string): Promise<string> {
  const supabase = createAdminClient();
  const { data: listedUsers, error: listError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (listError) throw listError;
  const existing = listedUsers.users.find((user) => user.email?.toLowerCase() === email);
  if (existing) return existing.id;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: {
      firstName,
      lastName,
      source: "label-vanlife-admin-grant",
    },
  });
  if (error || !data.user) throw error || new Error("Impossible de créer le compte Supabase");
  return data.user.id;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const adminCode = asText(body.adminCode);
    if (!adminPreviewCodeMatches(adminCode)) {
      return NextResponse.json({ error: "Accès admin refusé" }, { status: 401 });
    }

    const email = normalizeEmail(body.email);
    const firstName = asText(body.firstName);
    const lastName = asText(body.lastName);
    const phone = asOptionalText(body.phone);
    const age = asAge(body.age);
    const address = asOptionalText(body.address);
    const vehicle = asOptionalText(body.vehicle);
    const notes = asOptionalText(body.notes);
    const companions = Array.isArray(body.companions)
      ? body.companions
        .map((companion: CompanionInput) => ({
          firstName: asText(companion.firstName),
          lastName: asText(companion.lastName),
          age: asAge(companion.age),
        }))
        .filter((companion) => companion.firstName && companion.lastName && companion.age)
      : [];

    if (!email || !email.includes("@") || !firstName || !lastName) {
      return NextResponse.json({ error: "Email, prénom et nom sont obligatoires" }, { status: 400 });
    }

    const prisma = getPrisma();
    const secret = requireServerEnv("MEMBER_ACCESS_CODE_SECRET");
    const now = new Date();
    const expiresAt = addOneYear(now);
    const code = generateMemberAccessCode();
    const codeHash = hashMemberAccessCode(email, code, secret);
    const codeLookupHash = hashMemberAccessLookupCode(code, secret);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    const userId = existingUser?.id || await findOrCreateSupabaseUser(email, firstName, lastName);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.upsert({
        where: { email },
        create: {
          id: userId,
          email,
          role: "MEMBER",
        },
        update: {
          role: "MEMBER",
        },
      });

      await tx.profile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          firstName,
          lastName,
          phone,
          age,
        },
        update: {
          firstName,
          lastName,
          phone,
          age,
        },
      });

      await tx.memberCompanion.deleteMany({ where: { userId: user.id } });
      if (companions.length > 0) {
        await tx.memberCompanion.createMany({
          data: companions.map((companion) => ({
            userId: user.id,
            firstName: companion.firstName,
            lastName: companion.lastName,
            age: companion.age!,
          })),
        });
      }

      await tx.membership.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          offer: "YEARLY",
          status: "ACTIVE",
          startedAt: now,
          expiresAt,
        },
        update: {
          offer: "YEARLY",
          status: "ACTIVE",
          canceledAt: null,
          expiresAt,
        },
      });

      const card = await tx.memberCard.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          cardNumber: `LV-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`,
        },
        update: {},
      });

      const order = await tx.checkoutOrder.create({
        data: {
          userId: user.id,
          product: "MEMBERSHIP",
          status: "PAID",
          amount: 0,
          currency: "eur",
          paidAt: now,
          payload: {
            source: "admin_grant",
            adminGrant: true,
            memberAccessCodeHash: codeHash,
            memberAccessCodeLookupHash: codeLookupHash,
            memberAccessCodeExpiresAt: expiresAt.toISOString(),
            memberAccessCodeUsedAt: null,
            grantedAt: now.toISOString(),
            address,
            vehicle,
            notes,
          } as Prisma.InputJsonObject,
        },
      });

      await tx.payment.create({
        data: {
          userId: user.id,
          orderId: order.id,
          amount: 0,
          currency: "eur",
          status: "SUCCEEDED",
          type: "MEMBERSHIP",
          description: "Carte membre Label Vanlife offerte — accès test",
        },
      });

      return { user, card, order };
    });

    return NextResponse.json({
      ok: true,
      email,
      code,
      loginUrl: `${getAppUrl()}/member-login`,
      memberUrl: `${getAppUrl()}/member`,
      expiresAt: expiresAt.toISOString(),
      cardNumber: result.card.cardNumber,
      orderId: result.order.id,
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    return apiError(error, "admin-grant-member");
  }
}
