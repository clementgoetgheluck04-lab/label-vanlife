import { createHash, timingSafeEqual } from "node:crypto";

export const ADMIN_PREVIEW_COOKIE = "lv-admin-preview";
const ADMIN_PREVIEW_EMAILS = new Set([
  "contact@labelvanlife.com",
  "clement.goetgheluck@hotmail.fr",
]);
const ADMIN_PREVIEW_CODE_HASH = "8483721c7fcc806d21f20b436874af63d72218f78db5b81adaaa0b29142ddace";
const ADMIN_PREVIEW_COOKIE_VALUE = createHash("sha256").update(`preview:${ADMIN_PREVIEW_CODE_HASH}`).digest("hex");

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminPreviewCodeMatches(code: string): boolean {
  const hash = createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
  return safeEqual(hash, ADMIN_PREVIEW_CODE_HASH);
}

export function isAdminPreviewEmail(email?: string | null): boolean {
  return Boolean(email) && ADMIN_PREVIEW_EMAILS.has(email!.trim().toLowerCase());
}

export function getAdminPreviewCookieValue(): string {
  return ADMIN_PREVIEW_COOKIE_VALUE;
}

export function isAdminPreviewCookie(value?: string): boolean {
  return Boolean(value) && safeEqual(value || "", ADMIN_PREVIEW_COOKIE_VALUE);
}

export function isLocalPreviewHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}
