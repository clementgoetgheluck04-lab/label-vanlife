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
  const value = requireServerEnv("NEXT_PUBLIC_APP_URL");
  const url = new URL(value);
  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new ServerConfigurationError("NEXT_PUBLIC_APP_URL");
  }
  return url.origin;
}
