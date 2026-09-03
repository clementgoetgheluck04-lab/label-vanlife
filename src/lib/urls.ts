export function isSafeRedirectPath(value: string | null): value is string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return false;
  if (/[\\\u0000-\u001f\u007f]/.test(value) || /^\/(?:%2f|%5c)/i.test(value)) return false;
  try {
    const base = "https://redirect-validation.invalid";
    return new URL(value, base).origin === base;
  } catch {
    return false;
  }
}
