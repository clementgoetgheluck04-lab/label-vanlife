"use client";

import { useState } from "react";
import { Check, Loader2, MapPin, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type MemberContactEditorProps = { initial: { phone: string; addressLine1: string; addressLine2: string; postalCode: string; city: string; country: string } };

export function MemberContactEditor({ initial }: MemberContactEditorProps) {
  const router = useRouter();
  const [open, setOpen] = useState(!initial.addressLine1 || !initial.postalCode || !initial.city);
  const [form, setForm] = useState(initial);
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setState("loading");
    setMessage("");
    try {
      const response = await fetch("/api/member/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Mise à jour impossible");
      setState("success");
      setMessage("Coordonnées enregistrées sur votre carte.");
      setOpen(false);
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Mise à jour impossible");
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <button type="button" onClick={() => setOpen((value) => !value)} className="flex min-h-14 w-full items-center justify-between gap-3 px-5 py-4 text-left"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-sage/10"><MapPin className="h-5 w-5 text-sage" /></span><span><span className="block text-sm font-bold text-charcoal">Coordonnées de la carte</span><span className="block text-xs text-stone">Compléter ou modifier le téléphone et l’adresse postale.</span></span></span><Pencil className="h-4 w-4 shrink-0 text-stone" /></button>
      {open ? <form onSubmit={save} className="space-y-4 border-t border-border bg-neutral-50 px-5 py-5">
        <label className="block space-y-1 text-xs font-semibold text-neutral-700"><span>Téléphone *</span><input type="tel" value={form.phone} onChange={(event) => update({ phone: event.target.value })} required minLength={6} maxLength={30} autoComplete="tel" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label>
        <label className="block space-y-1 text-xs font-semibold text-neutral-700"><span>Numéro et voie *</span><input value={form.addressLine1} onChange={(event) => update({ addressLine1: event.target.value })} required minLength={2} maxLength={180} autoComplete="address-line1" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label>
        <label className="block space-y-1 text-xs font-semibold text-neutral-700"><span>Complément d’adresse</span><input value={form.addressLine2} onChange={(event) => update({ addressLine2: event.target.value })} maxLength={180} autoComplete="address-line2" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label>
        <div className="grid gap-3 sm:grid-cols-[120px_1fr]"><label className="space-y-1 text-xs font-semibold text-neutral-700"><span>Code postal *</span><input value={form.postalCode} onChange={(event) => update({ postalCode: event.target.value })} required minLength={2} maxLength={20} autoComplete="postal-code" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label><label className="space-y-1 text-xs font-semibold text-neutral-700"><span>Ville *</span><input value={form.city} onChange={(event) => update({ city: event.target.value })} required minLength={2} maxLength={100} autoComplete="address-level2" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label></div>
        <label className="block space-y-1 text-xs font-semibold text-neutral-700"><span>Pays *</span><input value={form.country} onChange={(event) => update({ country: event.target.value })} required minLength={2} maxLength={80} autoComplete="country-name" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3" /></label>
        <button disabled={state === "loading"} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-sage px-5 text-sm font-bold text-white hover:bg-forest disabled:opacity-60">{state === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Enregistrer sur ma carte</button>
        {message ? <p role="status" className={`text-center text-xs font-medium ${state === "error" ? "text-red-700" : "text-emerald-700"}`}>{message}</p> : null}
      </form> : message ? <p role="status" className="border-t border-border px-5 py-3 text-center text-xs font-medium text-emerald-700">{message}</p> : null}
    </section>
  );
}
