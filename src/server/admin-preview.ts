import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_PREVIEW_COOKIE = "lv-admin-preview";
const DEFAULT_PREVIEW_CODE_HASH = "8483721c7fcc806d21f20b436874af63d72218f78db5b81adaaa0b29142ddace";

function getPreviewCookieSecret(): string {
  return process.env.ADMIN_PREVIEW_COOKIE_SECRET
    || process.env.MEMBER_ACCESS_CODE_SECRET
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || (process.env.NODE_ENV !== "production" ? DEFAULT_PREVIEW_CODE_HASH : "");
}

export function isAdminPreviewEnabled(): boolean {
  return process.env.NODE_ENV !== "production"
    || Boolean(getPreviewCookieSecret());
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminPreviewCodeMatches(code: string): boolean {
  if (!isAdminPreviewEnabled()) return false;
  const expectedHash = process.env.ADMIN_PREVIEW_CODE_HASH
    || DEFAULT_PREVIEW_CODE_HASH;
  if (!expectedHash) return false;
  const hash = createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
  return safeEqual(hash, expectedHash);
}

export function getAdminPreviewCookieValue(): string {
  if (!isAdminPreviewEnabled()) throw new Error("Admin preview is disabled in production");
  const secret = getPreviewCookieSecret();
  if (!secret) throw new Error("Admin preview cookie secret is missing");
  return createHmac("sha256", secret).update("label-vanlife-admin-preview").digest("hex");
}

export function isAdminPreviewCookie(value?: string): boolean {
  return isAdminPreviewEnabled()
    && Boolean(value)
    && safeEqual(value || "", getAdminPreviewCookieValue());
}

export function isLocalPreviewHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
}
