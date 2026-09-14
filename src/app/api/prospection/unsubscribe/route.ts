import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { suppressProspect } from "@/server/prospection";

export const dynamic = "force-dynamic";

async function tokenFrom(request: NextRequest): Promise<string> {
  const queryToken = request.nextUrl.searchParams.get("token") || "";
  if (queryToken) return queryToken.slice(0, 200);
  const type = request.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = await request.json() as { token?: unknown };
    return typeof body.token === "string" ? body.token.slice(0, 200) : "";
  }
  const form = await request.formData();
  const value = form.get("token");
  return typeof value === "string" ? value.slice(0, 200) : "";
}

export async function POST(request: NextRequest) {
  const token = await tokenFrom(request);
  const prospect = token ? await getPrisma().prospect.findUnique({ where: { unsubscribeToken: token } }) : null;
  if (!prospect) return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  await suppressProspect(prospect.email, "unsubscribe", "unsubscribe-link");
  return NextResponse.json({ success: true }, { headers: { "Cache-Control": "no-store" } });
}
