import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ENRICHED_LIEUX } from "../src/data/enriched-lieux.ts";

const PLACE_TYPES = {
  camping: "CAMPING",
  parking: "PARKING",
  etape_nature: "ETAPE_NATURE",
  hebergement_insolite: "HEBERGEMENT_INSOLITE",
  restaurant: "RESTAURANT",
  activite: "ACTIVITE",
} as const;

export type PlaceImportRow = {
  slug: string;
  name: string;
  type: (typeof PLACE_TYPES)[keyof typeof PLACE_TYPES];
  description: string;
  shortDesc: string;
  city: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  mainImageUrl: string | null;
  images: string[];
  discountPercent: number;
  tags: string[];
  services: string[];
  features: {
    importSource: "labelvanlife-v1";
    sourceId: string;
    legacyCreatedAt: string;
    legacyLabels: string[];
    logoUrl: string | null;
  };
  phone: string | null;
  email: string | null;
  website: string | null;
  hours: string | null;
};

export type PlaceValidationReport = {
  total: number;
  errors: string[];
  warnings: string[];
  stats: {
    types: Record<string, number>;
    regions: Record<string, number>;
    missingPhone: number;
    missingEmail: number;
    missingWebsite: number;
    missingLocalImages: number;
  };
};

function compact(values: Array<string | undefined>): string[] {
  return [...new Set(values.filter((value): value is string => Boolean(value?.trim())))];
}

function shortDescription(description: string): string {
  if (description.length <= 220) return description;
  const shortened = description.slice(0, 217);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 150 ? lastSpace : 217)}…`;
}

export function buildPlaceImportRows(): PlaceImportRow[] {
  return ENRICHED_LIEUX.map((place) => ({
    slug: place.id,
    name: place.nom,
    type: PLACE_TYPES[place.type],
    description: place.description.trim(),
    shortDesc: shortDescription(place.description.trim()),
    city: place.ville.trim(),
    region: place.region.trim(),
    country: place.pays.trim() || "France",
    lat: place.coordonnees.lat,
    lng: place.coordonnees.lng,
    mainImageUrl: place.photoUrl || null,
    images: compact([place.photoUrl, ...(place.photos ?? [])]),
    discountPercent: place.discountPercent,
    tags: compact(place.tags),
    services: compact(place.services),
    features: {
      importSource: "labelvanlife-v1",
      sourceId: place.id,
      legacyCreatedAt: place.created_at,
      legacyLabels: compact(place.labels),
      logoUrl: place.logoUrl || null,
    },
    phone: place.telephone?.trim() || null,
    email: place.email?.trim().toLowerCase() || null,
    website: place.siteWeb?.trim() || null,
    hours: place.horaires?.trim() || null,
  }));
}

function increment(target: Record<string, number>, key: string): void {
  target[key] = (target[key] ?? 0) + 1;
}

export function validatePlaceImportRows(
  rows = buildPlaceImportRows(),
  publicDirectory = resolve("public"),
): PlaceValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];
  const slugs = new Set<string>();
  const names = new Set<string>();
  const coordinates = new Set<string>();
  const types: Record<string, number> = {};
  const regions: Record<string, number> = {};
  let missingPhone = 0;
  let missingEmail = 0;
  let missingWebsite = 0;
  let missingLocalImages = 0;

  if (rows.length !== 26) errors.push(`26 établissements attendus, ${rows.length} trouvés.`);

  for (const row of rows) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) errors.push(`${row.slug}: slug invalide.`);
    if (slugs.has(row.slug)) errors.push(`${row.slug}: slug dupliqué.`);
    slugs.add(row.slug);

    const normalizedName = row.name.toLocaleLowerCase("fr");
    if (names.has(normalizedName)) errors.push(`${row.name}: nom dupliqué.`);
    names.add(normalizedName);

    const coordinateKey = `${row.lat.toFixed(6)},${row.lng.toFixed(6)}`;
    if (coordinates.has(coordinateKey)) warnings.push(`${row.name}: coordonnées partagées avec un autre lieu.`);
    coordinates.add(coordinateKey);

    if (!row.name || !row.description || !row.city || !row.region) errors.push(`${row.slug}: champ obligatoire vide.`);
    if (!Number.isFinite(row.lat) || row.lat < -90 || row.lat > 90) errors.push(`${row.slug}: latitude invalide.`);
    if (!Number.isFinite(row.lng) || row.lng < -180 || row.lng > 180) errors.push(`${row.slug}: longitude invalide.`);
    if (row.discountPercent < 0 || row.discountPercent > 100) errors.push(`${row.slug}: réduction invalide.`);

    if (!row.phone) missingPhone += 1;
    if (!row.email) missingEmail += 1;
    if (!row.website) missingWebsite += 1;
    if (row.mainImageUrl?.startsWith("/")) {
      const imagePath = resolve(publicDirectory, row.mainImageUrl.slice(1));
      if (!existsSync(imagePath)) {
        missingLocalImages += 1;
        errors.push(`${row.slug}: image principale introuvable (${row.mainImageUrl}).`);
      }
    }

    increment(types, row.type);
    increment(regions, row.region);
  }

  if (missingPhone) warnings.push(`${missingPhone} établissement(s) sans téléphone.`);
  if (missingEmail) warnings.push(`${missingEmail} établissement(s) sans email.`);
  if (missingWebsite) warnings.push(`${missingWebsite} établissement(s) sans site web.`);
  warnings.push("Notes, avis et favoris de la V1 exclus de l’import car leur origine n’est pas vérifiée.");

  return {
    total: rows.length,
    errors,
    warnings,
    stats: { types, regions, missingPhone, missingEmail, missingWebsite, missingLocalImages },
  };
}

