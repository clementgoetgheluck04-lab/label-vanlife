"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

import { trackEvent } from "@/lib/analytics/browser";

export default function ShareTripButton({ tripId, title }: { tripId: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = `${window.location.origin}/trip/${tripId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: `Découvrez mon road trip ${title} avec Label Vanlife.`, url });
        trackEvent("recap_shared", { entityType: "road_trip", entityId: tripId, properties: { share_channel: "native" } });
        return;
      } catch {
        // A cancelled native share must not be counted as a share.
        return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      trackEvent("recap_shared", { entityType: "road_trip", entityId: tripId, properties: { share_channel: "copy" } });
      window.setTimeout(() => setCopied(false), 2_500);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copiedWithFallback = document.execCommand("copy");
      textarea.remove();
      if (copiedWithFallback) {
        setCopied(true);
        trackEvent("recap_shared", { entityType: "road_trip", entityId: tripId, properties: { share_channel: "copy_fallback" } });
        window.setTimeout(() => setCopied(false), 2_500);
      }
    }
  }

  return (
    <button type="button" onClick={share} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-800">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Lien copié" : "Partager mon récap"}
    </button>
  );
}
