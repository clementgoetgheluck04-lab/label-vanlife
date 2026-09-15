"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";

export function FavoriteButton({ slug, initialFavorite = false, compact = false }: { slug: string; initialFavorite?: boolean; compact?: boolean }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function toggle() {
    const nextFavorite = !favorite;
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/member/favorites", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ slug, favorite: nextFavorite }) });
      const result = await response.json().catch(() => ({})) as { error?: string; favorite?: boolean };
      if (!response.ok) throw new Error(result.error || "Impossible de modifier ce favori.");
      setFavorite(Boolean(result.favorite));
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Impossible de modifier ce favori.");
    } finally {
      setLoading(false);
    }
  }

  return <div className={compact ? "text-right" : "space-y-1 text-center"}><button type="button" onClick={toggle} disabled={loading} aria-pressed={favorite} aria-label={favorite ? "Retirer des favoris" : "Ajouter aux favoris"} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-sm font-bold transition disabled:opacity-60 ${favorite ? "border-rose-200 bg-rose-50 text-rose-700" : "border-neutral-200 bg-white text-neutral-700 hover:border-rose-200 hover:text-rose-700"}`}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className={`h-4 w-4 ${favorite ? "fill-current" : ""}`} />}{compact ? (favorite ? "Retirer" : "Favori") : (favorite ? "Dans mes favoris" : "Ajouter aux favoris")}</button>{error ? <p role="status" className="text-xs font-semibold text-red-700">{error}</p> : null}</div>;
}
