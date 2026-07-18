import places from "./member-camping-network.json";
import { getLabelledSourceIds } from "./place-deduplication";

export type LabelledSourceDetails = {
  id: string;
  name: string;
  network: string;
  website?: string | null;
  description?: string | null;
  contactName?: string | null;
  phone?: string | null;
  phones?: string[];
  emails?: string[];
  images?: string[];
  details?: string[];
  activities?: string[];
  capacity?: string | null;
  openingHours?: string | null;
  source: string;
};

const SOURCE_PLACES = places as LabelledSourceDetails[];

export function getLabelledSourceDetails(labelledPlaceId: string): LabelledSourceDetails[] {
  const sourceIds = new Set(getLabelledSourceIds(labelledPlaceId));
  return SOURCE_PLACES.filter((place) => sourceIds.has(place.id));
}

export function cleanSourceCapacity(value: string | null | undefined) {
  return value?.split(/\s+Loisirs\s*&\s*activités/i)[0].trim() || null;
}

export function cleanSourceOpeningHours(value: string | null | undefined) {
  return value?.split(/\s+Services\s*:/i)[0].trim() || null;
}

export function cleanSourceActivities(values: string[] | undefined) {
  return [...new Set((values ?? []).map((value) => value
    .replace(/\s+Date d[’']ouverture\s*:.*$/i, "")
    .replace(/\s+Offre\s+\d+%.*$/i, "")
    .trim()).filter(Boolean))];
}
