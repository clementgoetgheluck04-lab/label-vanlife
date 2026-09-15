export const ANALYTICS_CONSENT_COOKIE = "lv_analytics_consent";
export const ANALYTICS_CONSENT_EVENT = "labelvanlife:analytics-consent";
export const OPEN_CONSENT_EVENT = "labelvanlife:open-consent";

export type AnalyticsConsent = "accepted" | "refused" | null;

export function readAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${ANALYTICS_CONSENT_COOKIE}=`))
    ?.split("=")[1];
  return value === "accepted" || value === "refused" ? value : null;
}

export function writeAnalyticsConsent(value: Exclude<AnalyticsConsent, null>): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value }));
}
