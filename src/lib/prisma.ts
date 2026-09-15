import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is not configured");
    this.name = "DatabaseConfigurationError";
  }
}

export function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new DatabaseConfigurationError();

  const client = new PrismaClient({
    // Every Vercel function instance owns its own pg pool. The adapter default
    // is 10 connections, which can exhaust a small pooled database after only
    // a few routes. One connection per warm instance is enough because Prisma
    // queues concurrent queries on the pool.
    adapter: new PrismaPg({
      connectionString,
      max: 1,
      connectionTimeoutMillis: 10_000,
      idleTimeoutMillis: 250,
    }),
  });

  if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = client;
  return client;
}
