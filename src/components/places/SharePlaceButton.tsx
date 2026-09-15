"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { trackEvent } from "@/lib/analytics/browser";

export default function SharePlaceButton({ slug, name }: { slug: string; name: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/lieux/${slug}?utm_source=place_share&utm_medium=referral`;
    const payload = {
      title: `${name} · Label Vanlife`,
      text: `Découvrez ${name}, un lieu labellisé pour accueillir les voyageurs en van.`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        trackEvent("place_share", { entityType: "lieux", entityId: slug, properties: { share_channel: "native" } });
      } catch {
        // A cancelled native dialog is not a completed share.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("place_share", { entityType: "lieux", entityId: slug, properties: { share_channel: "copy" } });
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      window.location.assign(`mailto:?subject=${encodeURIComponent(payload.title)}&body=${encodeURIComponent(`${payload.text}\n\n${url}`)}`);
    }
  }

  return (
    <button type="button" onClick={share} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-sm font-bold text-neutral-700 transition hover:border-emerald-300 hover:text-emerald-800" aria-label={`Partager ${name}`}>
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Lien copié" : "Partager"}
    </button>
  );
}
