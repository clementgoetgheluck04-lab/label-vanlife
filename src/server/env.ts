import "server-only";
import { CONTACT_EMAIL } from "@/config/contact";

export class ServerConfigurationError extends Error {
  constructor(variable: string, reason = "missing") {
    super(`Invalid server configuration (${reason}): ${variable}`);
    this.name = "ServerConfigurationError";
  }
}

export function requireSecretEnv(name: string, minLength = 32): string {
  const value = requireServerEnv(name);
  if (value.length < minLength || /replace|example|changeme/i.test(value)) {
    throw new ServerConfigurationError(name, "weak secret");
  }
  return value;
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
  if (!['http:', 'https:'].includes(url.protocol) || (process.env.NODE_ENV === "production" && url.protocol !== "https:")) {
    throw new ServerConfigurationError("NEXT_PUBLIC_APP_URL");
  }
  return url.origin;
}

export function getTransactionalEmailFrom(): string {
  const value = process.env.RESEND_FROM_EMAIL;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new ServerConfigurationError("RESEND_FROM_EMAIL");
  return "Label Vanlife <onboarding@resend.dev>";
}

export function getProspectionEmailFrom(): string {
  const value = process.env.PROSPECTION_FROM_EMAIL;
  if (value) return value;
  if (process.env.NODE_ENV === "production") throw new ServerConfigurationError("PROSPECTION_FROM_EMAIL");
  return getTransactionalEmailFrom();
}

export function getBackOfficeEmail(): string {
  return getBackOfficeEmails()[0] || CONTACT_EMAIL;
}

export function getBackOfficeEmails(): string[] {
  return [CONTACT_EMAIL];
}
