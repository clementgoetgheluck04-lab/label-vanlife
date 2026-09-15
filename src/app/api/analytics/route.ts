import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPrisma } from "@/lib/prisma";
import { ensureAppUser } from "@/server/auth";
import { apiError } from "@/server/http";
import { assertSameOrigin, enforceRateLimit, readJsonRequest } from "@/server/request-security";
import { isAnalyticsEventName } from "@/lib/analytics/events";

const SAFE_KEY = /^[a-zA-Z0-9_.-]{1,64}$/;

function shortText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized && normalized.length <= max ? normalized : null;
}

function safeProperties(value: unknown): Record<string, string | number | boolean | null> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value as Record<string, unknown>).slice(0, 12);
  const safe: Record<string, string | number | boolean | null> = {};
  for (const [key, item] of entries) {
    if (!SAFE_KEY.test(key)) continue;
    if (typeof item === "string") safe[key] = item.slice(0, 200);
    else if (typeof item === "number" && Number.isFinite(item)) safe[key] = item;
    else if (typeof item === "boolean" || item === null) safe[key] = item;
  }
  return Object.keys(safe).length ? safe : null;
}

export async function POST(request: NextRequest) {
  try {
    assertSameOrigin(request);
    enforceRateLimit(request, "analytics", 120, 10 * 60 * 1_000);
    const body = await readJsonRequest(request, 8_192) as Record<string, unknown>;
    if (!isAnalyticsEventName(body.name)) {
      return NextResponse.json({ error: "Unknown event" }, { status: 400 });
    }

    const path = shortText(body.path, 300);
    if (path && !path.startsWith("/")) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    let userId: string | null = null;
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await ensureAppUser(data.user);
      userId = data.user.id;
    }

    const properties = safeProperties(body.properties);
    const prisma = getPrisma();
    await prisma.$transaction([
      prisma.analyticsEvent.deleteMany({
        where: { createdAt: { lt: new Date(Date.now() - 25 * 30.44 * 24 * 60 * 60 * 1_000) } },
      }),
      prisma.analyticsEvent.create({
      data: {
        name: body.name,
        userId,
        anonymousId: shortText(body.anonymousId, 80),
        sessionId: shortText(body.sessionId, 80),
        path,
        entityType: shortText(body.entityType, 50),
        entityId: shortText(body.entityId, 120),
        source: shortText(properties?.utm_source, 100),
        medium: shortText(properties?.utm_medium, 100),
        campaign: shortText(properties?.utm_campaign, 100),
        properties: properties || undefined,
      },
      }),
    ]);

    return new NextResponse(null, { status: 202, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiError(error, "analytics");
  }
}
