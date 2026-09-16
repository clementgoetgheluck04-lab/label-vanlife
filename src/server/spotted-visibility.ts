import "server-only";
import { SPOTTED_PLACES, getSpottedPlace, type SpottedPlace } from "@/data/spotted-places";
import { getPrisma } from "@/lib/prisma";

const HIDDEN_PROSPECT_STATUSES = ["NOT_INTERESTED", "UNSUBSCRIBED"] as const;

/**
 * A refusal or an opt-out applies to both prospecting and publication as a
 * "lieu repere". Labelled places use a separate catalogue and are unaffected.
 * Database failures deliberately hide spotted places instead of risking the
 * republication of an establishment that asked to be removed.
 */
export async function getVisibleSpottedPlaces(): Promise<SpottedPlace[]> {
  try {
    const hiddenProspects = await getPrisma().prospect.findMany({
      where: {
        sourceId: { not: null },
        status: { in: [...HIDDEN_PROSPECT_STATUSES] },
      },
      select: { sourceId: true },
    });
    const hiddenSourceIds = new Set(
      hiddenProspects.flatMap((prospect) => prospect.sourceId ? [prospect.sourceId] : []),
    );
    return SPOTTED_PLACES.filter((place) => !hiddenSourceIds.has(place.id));
  } catch (error) {
    console.error("[spotted-visibility] unable to enforce catalogue removals", error);
    return [];
  }
}

export async function getVisibleSpottedPlace(id: string): Promise<SpottedPlace | null> {
  const place = getSpottedPlace(id);
  if (!place) return null;

  try {
    const hiddenProspect = await getPrisma().prospect.findFirst({
      where: {
        sourceId: id,
        status: { in: [...HIDDEN_PROSPECT_STATUSES] },
      },
      select: { id: true },
    });
    return hiddenProspect ? null : place;
  } catch (error) {
    console.error("[spotted-visibility] unable to enforce place removal", error);
    return null;
  }
}
