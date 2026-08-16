"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Plus, Route } from "lucide-react";
import { cn } from "@/lib/utils";

export type RoadTripDraftPlace = {
  id: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  href: string;
  kind: "labelled" | "spotted";
};

export const ROADTRIP_DRAFT_STORAGE_KEY = "label-vanlife-roadtrip-draft";
const ROADTRIP_DRAFT_UPDATED_EVENT = "label-vanlife-roadtrip-draft-updated";

type AddToRoadTripButtonProps = {
  place: RoadTripDraftPlace;
  className?: string;
  showViewLink?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "white" | "gold" | "dark" | "outline";
  visibility?: "always" | "member-query";
};

function readDraft(): RoadTripDraftPlace[] {
  try {
    const saved = window.localStorage.getItem(ROADTRIP_DRAFT_STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved) as RoadTripDraftPlace[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => item.id && item.name && typeof item.lat === "number" && typeof item.lng === "number");
  } catch {
    return [];
  }
}

function writeDraft(draft: RoadTripDraftPlace[]) {
  try {
    window.localStorage.setItem(ROADTRIP_DRAFT_STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Le bouton reste utilisable pendant la session même si le stockage local est indisponible.
  }

  if (typeof window.CustomEvent === "function") {
    window.dispatchEvent(new CustomEvent(ROADTRIP_DRAFT_UPDATED_EVENT, { detail: draft }));
    return;
  }

  const event = document.createEvent("CustomEvent");
  event.initCustomEvent(ROADTRIP_DRAFT_UPDATED_EVENT, false, false, draft);
  window.dispatchEvent(event);
}

export default function AddToRoadTripButton({
  place,
  className,
  showViewLink = false,
  size = "md",
  variant = "white",
  visibility = "always",
}: AddToRoadTripButtonProps) {
  const [canRender] = useState(() => {
    if (visibility === "always") return true;
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("member") === "1";
  });
  const [isAdded, setIsAdded] = useRoadTripPlaceState(place.id);

  function addPlace() {
    const current = readDraft();
    if (current.some((item) => item.id === place.id)) {
      setIsAdded(true);
      return;
    }
    writeDraft([...current, place]);
    setIsAdded(true);
  }

  if (!canRender) return null;

  return (
    <div className={cn("flex flex-col gap-2", showViewLink && isAdded ? "items-stretch" : "", className)}>
      <button
        type="button"
        onClick={addPlace}
        disabled={isAdded}
        aria-pressed={isAdded}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-bold transition",
          size === "sm" && "min-h-10 px-3 py-2 text-xs",
          size === "md" && "min-h-11 px-4 py-2.5 text-sm",
          size === "lg" && "min-h-12 px-5 py-3 text-sm",
          variant === "white" && (isAdded ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-neutral-200 bg-white text-neutral-700 hover:border-emerald-300 hover:text-emerald-800"),
          variant === "gold" && (isAdded ? "bg-emerald-50 text-emerald-700" : "bg-[#c39960] text-white shadow-sm hover:bg-[#ad8250]"),
          variant === "dark" && (isAdded ? "bg-emerald-50 text-emerald-700" : "bg-neutral-950 text-white hover:bg-neutral-800"),
          variant === "outline" && (isAdded ? "border border-emerald-200 bg-emerald-50 text-emerald-700" : "border border-[#c39960]/40 bg-[#f7f1e8] text-[#7d5d38] hover:bg-[#efe2cf]"),
        )}
      >
        {isAdded ? <CheckCircle2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {isAdded ? "Ajouté au road trip" : "Ajouter au road trip"}
      </button>

      {showViewLink && isAdded && (
        <Link href="/member/roadtrips" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50">
          <Route className="h-4 w-4" />
          Voir mon road trip
        </Link>
      )}
    </div>
  );
}

function useRoadTripPlaceState(placeId: string) {
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const refresh = () => setIsAdded(readDraft().some((item) => item.id === placeId));
    refresh();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ROADTRIP_DRAFT_STORAGE_KEY) refresh();
    };
    const handleDraftUpdated = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(ROADTRIP_DRAFT_UPDATED_EVENT, handleDraftUpdated);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(ROADTRIP_DRAFT_UPDATED_EVENT, handleDraftUpdated);
    };
  }, [placeId]);

  return [isAdded, setIsAdded] as const;
}
