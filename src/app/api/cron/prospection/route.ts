import { NextRequest, NextResponse } from "next/server";
import { runProspectionBatch } from "@/server/prospection";
import { secretsMatch } from "@/server/request-security";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  if (secret.length < 32) return false;
  const authorization = request.headers.get("authorization") || "";
  return authorization.startsWith("Bearer ") && secretsMatch(authorization.slice(7), secret);
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const result = await runProspectionBatch();
  return NextResponse.json({ success: true, ...result }, { headers: { "Cache-Control": "no-store" } });
}
