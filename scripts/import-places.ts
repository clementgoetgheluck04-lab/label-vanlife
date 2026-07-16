import "dotenv/config";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.ts";
import { buildPlaceImportRows, validatePlaceImportRows } from "./place-import.ts";

type Mode = "validate" | "plan" | "apply";

function readArgument(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv.find((argument) => argument.startsWith(prefix))?.slice(prefix.length);
}

function readMode(): Mode {
  if (process.argv.includes("--apply")) return "apply";
  if (process.argv.includes("--plan")) return "plan";
  return "validate";
}

function redactedTarget(connectionString: string): string {
  const url = new URL(connectionString);
  return `${url.protocol}//${url.hostname}:${url.port || "5432"}${url.pathname}`;
}

const mode = readMode();
const rows = buildPlaceImportRows();
const report = validatePlaceImportRows(rows);

console.log(JSON.stringify({ mode, ...report }, null, 2));
if (report.errors.length) process.exit(1);
if (mode === "validate") process.exit(0);

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL est requis pour --plan et --apply.");
console.log(`Base cible : ${redactedTarget(connectionString)}`);

if (mode === "apply") {
  if (readArgument("confirm") !== "IMPORT_26_PLACES") {
    throw new Error("Écriture refusée : utiliser --confirm=IMPORT_26_PLACES.");
  }
  const backupArgument = readArgument("backup");
  if (!backupArgument) throw new Error("Écriture refusée : fournir --backup=<fichier.dump>.");
  const backupPath = resolve(backupArgument);
  if (!existsSync(backupPath) || statSync(backupPath).size === 0) {
    throw new Error(`Sauvegarde absente ou vide : ${backupPath}`);
  }
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

try {
  const existing = await prisma.place.findMany({
    where: { slug: { in: rows.map((row) => row.slug) } },
    select: { id: true, slug: true, name: true },
  });
  const existingBySlug = new Map(existing.map((place) => [place.slug, place]));
  const conflicts = rows
    .filter((row) => existingBySlug.has(row.slug) && existingBySlug.get(row.slug)?.name !== row.name)
    .map((row) => ({ slug: row.slug, databaseName: existingBySlug.get(row.slug)?.name, importName: row.name }));
  const plan = {
    databasePlacesBefore: await prisma.place.count(),
    create: rows.filter((row) => !existingBySlug.has(row.slug)).map((row) => row.slug),
    update: rows.filter((row) => existingBySlug.has(row.slug)).map((row) => row.slug),
    conflicts,
  };
  console.log(JSON.stringify({ plan }, null, 2));

  if (conflicts.length) throw new Error("Conflits de noms détectés : vérification manuelle requise.");
  if (mode === "plan") process.exit(0);

  await prisma.$transaction(async (transaction) => {
    for (const row of rows) {
      const data = {
        name: row.name,
        type: row.type,
        description: row.description,
        shortDesc: row.shortDesc,
        city: row.city,
        region: row.region,
        country: row.country,
        lat: row.lat,
        lng: row.lng,
        mainImageUrl: row.mainImageUrl,
        images: row.images,
        discountPercent: row.discountPercent,
        tags: row.tags,
        services: row.services,
        features: row.features,
        status: "PUBLISHED" as const,
        phone: row.phone,
        email: row.email,
        website: row.website,
        hours: row.hours,
      };
      await transaction.place.upsert({
        where: { slug: row.slug },
        create: { slug: row.slug, ...data },
        update: data,
      });
    }
  });

  const imported = await prisma.place.findMany({
    where: { slug: { in: rows.map((row) => row.slug) } },
    select: { slug: true, name: true, status: true },
    orderBy: { slug: "asc" },
  });
  if (imported.length !== 26) throw new Error(`Vérification échouée : ${imported.length}/26 lieux présents.`);
  console.log(JSON.stringify({ result: "success", imported: imported.length, databasePlacesAfter: await prisma.place.count() }, null, 2));
} finally {
  await prisma.$disconnect();
}

