import { CONTACT_EMAIL } from "@/config/contact";

export class ServerConfigurationError extends Error {
  constructor(variable: string) {
    super(`Missing server configuration: ${variable}`);
    this.name = "ServerConfigurationError";
  }
}

export function requireServerEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new ServerConfigurationError(name);
  return value;
}

export function getAppUrl(): string {
  const value = process.env.NEXT_PUBLIC_APP_URL
    || process.env.VERCEL_PROJECT_PRODUCTION_URL
    || process.env.VERCEL_URL
    || (process.env.NODE_ENV !== "production" ? "http://localhost:3000" : "");
  if (!value) throw new ServerConfigurationError("NEXT_PUBLIC_APP_URL");
  const normalized = value.includes("://") ? value : `https://${value}`;
  const url = new URL(normalized);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ServerConfigurationError("NEXT_PUBLIC_APP_URL");
  }
  return url.origin;
}

export function getTransactionalEmailFrom(): string {
  return process.env.RESEND_FROM_EMAIL || "Label Vanlife <onboarding@resend.dev>";
}

export function getBackOfficeEmail(): string {
  return getBackOfficeEmails()[0] || CONTACT_EMAIL;
}

export function getBackOfficeEmails(): string[] {
  const raw = process.env.BACKOFFICE_EMAILS || process.env.BACKOFFICE_EMAIL || CONTACT_EMAIL;
  const emails = raw
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
  return emails.length > 0 ? emails : [CONTACT_EMAIL];
}
