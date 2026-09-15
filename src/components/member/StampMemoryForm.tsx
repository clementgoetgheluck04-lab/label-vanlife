"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Star } from "lucide-react";

export default function StampMemoryForm({ stampId, initialNote, initialComment }: { stampId: string; initialNote: number | null; initialComment: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState<number | null>(initialNote);
  const [comment, setComment] = useState(initialComment || "");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    try {
      const response = await fetch(`/api/member/passport/stamps/${encodeURIComponent(stampId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ note, comment }),
      });
      if (!response.ok) throw new Error("save_failed");
      setState("saved");
      setEditing(false);
      router.refresh();
    } catch {
      setState("error");
    }
  }

  if (!editing) {
    return <div className="mt-4"><button type="button" onClick={() => { setEditing(true); setState("idle"); }} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 px-4 text-sm font-bold text-emerald-800"><Pencil className="h-4 w-4" />{comment || note ? "Modifier mon souvenir" : "Ajouter un souvenir"}</button>{state === "saved" ? <span className="ml-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><Check className="h-4 w-4" />Enregistré</span> : null}</div>;
  }

  return <div className="mt-4 space-y-3 rounded-2xl bg-neutral-50 p-4"><fieldset><legend className="text-xs font-bold text-neutral-700">Votre note</legend><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setNote(value)} aria-label={`${value} étoile${value > 1 ? "s" : ""}`} aria-pressed={note === value}><Star className={`h-6 w-6 ${note && value <= note ? "fill-amber text-amber" : "text-neutral-300"}`} /></button>)}</div></fieldset><label className="block text-xs font-bold text-neutral-700" htmlFor={`memory-${stampId}`}>Votre souvenir privé</label><textarea id={`memory-${stampId}`} value={comment} onChange={(event) => setComment(event.target.value.slice(0, 800))} maxLength={800} rows={4} placeholder="Une rencontre, une découverte, une impression…" className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-emerald-600" /><div className="flex items-center justify-between gap-3"><span className="text-xs text-neutral-400">{comment.length}/800</span><div className="flex gap-2"><button type="button" onClick={() => setEditing(false)} className="min-h-10 rounded-full px-4 text-sm font-bold text-neutral-500">Annuler</button><button type="button" onClick={save} disabled={state === "saving" || note === null} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#173e32] px-4 text-sm font-bold text-white disabled:opacity-50">{state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Enregistrer</button></div></div>{state === "error" ? <p className="text-xs font-bold text-red-700">Impossible d’enregistrer. Réessayez.</p> : null}</div>;
}
