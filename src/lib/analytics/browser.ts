"use client";

import type { AnalyticsEventName } from "./events";

const ANONYMOUS_ID_KEY = "lv_analytics_id";
const SESSION_ID_KEY = "lv_analytics_session";

function randomId(): string {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function storedId(storage: Storage, key: string): string {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const created = randomId();
  storage.setItem(key, created);
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
  if (typeof window === "undefined" || navigator.doNotTrack === "1") return;

  let anonymousId: string | undefined;
  let sessionId: string | undefined;
  try {
    anonymousId = storedId(window.localStorage, ANONYMOUS_ID_KEY);
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
