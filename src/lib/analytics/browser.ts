"use client";

import type { AnalyticsEventName } from "./events";
import { readAnalyticsConsent } from "@/lib/privacy/consent";

const ANONYMOUS_ID_KEY = "lv_analytics_id";
const SESSION_ID_KEY = "lv_analytics_session";
const ANONYMOUS_ID_MAX_AGE_MS = 180 * 24 * 60 * 60 * 1_000;

function randomId(): string {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function storedId(storage: Storage, key: string, maxAgeMs?: number): string {
  const existing = storage.getItem(key);
  if (existing) {
    if (!maxAgeMs) return existing;
    try {
      const parsed = JSON.parse(existing) as { id?: unknown; expiresAt?: unknown };
      if (typeof parsed.id === "string" && typeof parsed.expiresAt === "number" && parsed.expiresAt > Date.now()) {
        return parsed.id;
      }
    } catch {
      // Replace legacy or malformed analytics identifiers.
    }
  }
  const created = randomId();
  storage.setItem(key, maxAgeMs
    ? JSON.stringify({ id: created, expiresAt: Date.now() + maxAgeMs })
    : created);
  return created;
}

function attribution(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ["utm_source", "utm_medium", "utm_campaign"]
      .map((key) => [key, params.get(key)?.slice(0, 100) || ""])
      .filter(([, value]) => value),
  );
}

export function trackEvent(
  name: AnalyticsEventName,
  options: {
    entityType?: string;
    entityId?: string;
    properties?: Record<string, string | number | boolean | null>;
  } = {},
): void {
  if (
    typeof window === "undefined"
    || navigator.doNotTrack === "1"
    || readAnalyticsConsent() !== "accepted"
  ) return;

  let anonymousId: string | undefined;
  let sessionId: string | undefined;
  try {
    anonymousId = storedId(window.localStorage, ANONYMOUS_ID_KEY, ANONYMOUS_ID_MAX_AGE_MS);
    sessionId = storedId(window.sessionStorage, SESSION_ID_KEY);
  } catch {
    // Analytics remains best-effort when browser storage is unavailable.
  }

  const payload = JSON.stringify({
    name,
    path: window.location.pathname,
    anonymousId,
    sessionId,
    entityType: options.entityType,
    entityId: options.entityId,
    properties: { ...attribution(), ...options.properties },
  });

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
    credentials: "same-origin",
  }).catch(() => undefined);
}
