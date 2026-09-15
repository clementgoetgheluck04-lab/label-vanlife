"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Star } from "lucide-react";

export default function StampMemoryForm({ stampId, initialNote, initialComment, initialAmountSavedCents }: { stampId: string; initialNote: number | null; initialComment: string | null; initialAmountSavedCents: number | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState<number | null>(initialNote);
  const [comment, setComment] = useState(initialComment || "");
  const [amountSaved, setAmountSaved] = useState(initialAmountSavedCents === null ? "" : (initialAmountSavedCents / 100).toFixed(2));
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function save() {
    setState("saving");
    try {
      const response = await fetch(`/api/member/passport/stamps/${encodeURIComponent(stampId)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ note, comment, amountSaved }),
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
    return <div className="mt-4"><button type="button" onClick={() => { setEditing(true); setState("idle"); }} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-emerald-200 px-4 text-sm font-bold text-emerald-800"><Pencil className="h-4 w-4" />{comment || note || initialAmountSavedCents !== null ? "Modifier ma visite" : "Compléter ma visite"}</button>{state === "saved" ? <span className="ml-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><Check className="h-4 w-4" />Enregistré</span> : null}</div>;
  }

  return <div className="mt-4 space-y-3 rounded-2xl bg-neutral-50 p-4"><fieldset><legend className="text-xs font-bold text-neutral-700">Votre note</legend><div className="mt-2 flex gap-1">{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setNote(value)} aria-label={`${value} étoile${value > 1 ? "s" : ""}`} aria-pressed={note === value}><Star className={`h-6 w-6 ${note && value <= note ? "fill-amber text-amber" : "text-neutral-300"}`} /></button>)}</div></fieldset><label className="block text-xs font-bold text-neutral-700" htmlFor={`saving-${stampId}`}>Économie réellement obtenue <span className="font-normal text-neutral-400">(facultatif)</span></label><div className="relative"><input id={`saving-${stampId}`} type="number" inputMode="decimal" min="0" max="1000" step="0.01" value={amountSaved} onChange={(event) => setAmountSaved(event.target.value)} placeholder="Ex : 8,50" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3 pr-9 text-sm outline-none focus:border-emerald-600" /><span className="pointer-events-none absolute right-3 top-2.5 text-sm font-bold text-neutral-500">€</span></div><p className="text-[11px] leading-4 text-neutral-500">Indiquez uniquement une économie constatée. Ce montant reste privé et sert à calculer la valeur de votre carte.</p><label className="block text-xs font-bold text-neutral-700" htmlFor={`memory-${stampId}`}>Votre souvenir privé</label><textarea id={`memory-${stampId}`} value={comment} onChange={(event) => setComment(event.target.value.slice(0, 800))} maxLength={800} rows={4} placeholder="Une rencontre, une découverte, une impression…" className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-emerald-600" /><div className="flex items-center justify-between gap-3"><span className="text-xs text-neutral-400">{comment.length}/800</span><div className="flex gap-2"><button type="button" onClick={() => setEditing(false)} className="min-h-10 rounded-full px-4 text-sm font-bold text-neutral-500">Annuler</button><button type="button" onClick={save} disabled={state === "saving" || note === null} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#173e32] px-4 text-sm font-bold text-white disabled:opacity-50">{state === "saving" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Enregistrer</button></div></div>{state === "error" ? <p className="text-xs font-bold text-red-700">Impossible d’enregistrer. Réessayez.</p> : null}</div>;
}
