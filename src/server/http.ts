import { NextResponse } from "next/server";
import { AuthenticationError, AuthorizationError } from "@/server/auth";
import { DatabaseConfigurationError } from "@/lib/prisma";
import { ServerConfigurationError } from "@/server/env";
import { OriginError, RateLimitError } from "@/server/request-security";

export function apiError(error: unknown, context: string): NextResponse {
  if (error instanceof AuthenticationError) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (error instanceof OriginError) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }
  if (error instanceof RateLimitError) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429, headers: { "Retry-After": String(error.retryAfter) } },
    );
  }
  if (
    error instanceof DatabaseConfigurationError ||
    error instanceof ServerConfigurationError
  ) {
    console.error(`[${context}] server configuration error`, error.message);
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }

  console.error(`[${context}] request failed`, error);
  return NextResponse.json({ error: "Unable to process the request" }, { status: 500 });
}
