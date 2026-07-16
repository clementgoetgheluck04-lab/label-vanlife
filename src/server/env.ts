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
