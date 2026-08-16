"use client";

import { useEffect, useState } from "react";
import AddToRoadTripButton, { type RoadTripDraftPlace } from "@/components/roadtrip/AddToRoadTripButton";
import { cn } from "@/lib/utils";

type MemberRoadTripPanelProps = {
  place: RoadTripDraftPlace;
  title: string;
  description: string;
  variant?: "labelled" | "spotted";
  visibility?: "always" | "member-query";
  className?: string;
};

export default function MemberRoadTripPanel({
  place,
  title,
  description,
  variant = "labelled",
  visibility = "always",
  className,
}: MemberRoadTripPanelProps) {
  const [canRender, setCanRender] = useState(visibility === "always");

  useEffect(() => {
    if (visibility === "always") {
      setCanRender(true);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setCanRender(params.get("member") === "1");
  }, [visibility]);

  if (!canRender) return null;

  const isSpotted = variant === "spotted";

  return (
    <section
      className={cn(
        "flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between",
        isSpotted
          ? "border-y border-[#c39960]/20 bg-[#fffaf2] sm:p-6"
          : "rounded-3xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-[#f7f1e8]",
        className,
      )}
    >
      <div>
        <p className={cn("text-xs font-bold uppercase tracking-[0.18em]", isSpotted ? "text-[#8b673d]" : "text-emerald-700")}>
          Préparer mon itinéraire
        </p>
        <h2 className="mt-1 text-lg font-bold text-neutral-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-neutral-600">{description}</p>
      </div>
      <AddToRoadTripButton
        place={place}
        variant={isSpotted ? "outline" : "gold"}
        size="lg"
        showViewLink
        className="sm:w-64"
      />
    </section>
  );
}
