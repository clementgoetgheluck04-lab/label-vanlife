import "dotenv/config";
import { defineConfig } from "prisma/config";

// `prisma generate` does not connect to the database, but Prisma still parses
// the datasource URL during dependency installation (including on Vercel).
// Runtime and migration commands must continue to receive the real DATABASE_URL.
const datasourceUrl =
  process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: datasourceUrl,
  },
});
