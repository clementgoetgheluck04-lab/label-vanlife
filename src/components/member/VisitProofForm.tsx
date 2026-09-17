"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Loader2, Star } from "lucide-react";

type PlaceOption = { slug: string; name: string; city: string; discountPercent: number };

const photoFields = [
  { name: "photoPlacement", label: "1. L’emplacement", help: "Montrez l’endroit où vous avez séjourné." },
  { name: "photoTariff", label: "2. Les tarifs affichés", help: "Photographiez le panneau ou la grille tarifaire." },
  { name: "photoChoice", label: "3. Votre photo au choix", help: "Ambiance, accueil, paysage ou détail utile." },
] as const;

export default function VisitProofForm({ places }: { places: PlaceOption[] }) {
  const router = useRouter();
  const [placeSlug, setPlaceSlug] = useState("");
  const [displayedPrice, setDisplayedPrice] = useState("");
  const [paidPrice, setPaidPrice] = useState("");
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const selected = places.find((place) => place.slug === placeSlug);
  const expectedPrice = useMemo(() => {
    const amount = Number(displayedPrice.replace(",", "."));
    return selected && Number.isFinite(amount) && amount > 0
      ? amount * (1 - selected.discountPercent / 100)
      : null;
  }, [displayedPrice, selected]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("saving");
    setMessage("");
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/member/passport/visit-proof", { method: "POST", credentials: "same-origin", body: formData });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "La visite n’a pas pu être enregistrée.");
      setState("saved");
      setMessage("Votre badge de passage est créé. Votre retour attend maintenant la validation de Label Vanlife.");
      event.currentTarget.reset();
      setPlaceSlug(""); setDisplayedPrice(""); setPaidPrice(""); setRating(0); setExperience("");
      router.refresh();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "La visite n’a pas pu être enregistrée.");
    }
  }

  return <form onSubmit={submit} className="space-y-5 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-7">
    <div><p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Preuve de passage</p><h2 className="mt-2 text-xl font-black text-neutral-950">Ajouter une visite à mon passeport</h2><p className="mt-2 text-sm leading-6 text-neutral-600">Trois photos simples remplacent le QR : elles confirment votre passage et nous aident à vérifier les informations du lieu.</p></div>
    <label className="block text-sm font-bold text-neutral-800">Lieu visité<select name="placeSlug" required value={placeSlug} onChange={(event) => setPlaceSlug(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-emerald-700"><option value="">Choisir un lieu labellisé</option>{places.map((place) => <option key={place.slug} value={place.slug}>{place.name} — {place.city} · −{place.discountPercent}%</option>)}</select></label>
    <div className="grid gap-3 sm:grid-cols-3">{photoFields.map((field) => <label key={field.name} className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50/50 p-4 text-sm font-bold text-neutral-800"><Camera className="mb-3 h-6 w-6 text-emerald-700" />{field.label}<span className="mt-1 block min-h-10 text-xs font-normal leading-5 text-neutral-500">{field.help}</span><input name={field.name} type="file" accept="image/jpeg,image/png,image/webp" capture="environment" required className="mt-3 block w-full text-xs file:mr-2 file:rounded-full file:border-0 file:bg-emerald-800 file:px-3 file:py-2 file:font-bold file:text-white" /></label>)}</div>
    <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-bold text-neutral-800">Tarif affiché (€)<input name="displayedPrice" type="number" inputMode="decimal" min="0.01" max="10000" step="0.01" required value={displayedPrice} onChange={(event) => setDisplayedPrice(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-3 outline-none focus:border-emerald-700" /></label><label className="text-sm font-bold text-neutral-800">Tarif réellement payé (€)<input name="paidPrice" type="number" inputMode="decimal" min="0" max="10000" step="0.01" required value={paidPrice} onChange={(event) => setPaidPrice(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-300 px-3 outline-none focus:border-emerald-700" /></label></div>
    {selected && expectedPrice !== null ? <div className="rounded-2xl bg-[#f7f1e8] p-4 text-sm text-neutral-700"><strong>Calcul Label Vanlife :</strong> avec −{selected.discountPercent} %, le tarif membre attendu est <strong>{expectedPrice.toLocaleString("fr-FR", { style: "currency", currency: "EUR" })}</strong>. Le tarif payé reste déclaré séparément pour repérer un éventuel écart.</div> : null}
    <fieldset><legend className="text-sm font-bold text-neutral-800">Votre expérience</legend><div className="mt-2 flex gap-1">{[1,2,3,4,5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} étoile${value > 1 ? "s" : ""}`} aria-pressed={rating === value}><Star className={`h-8 w-8 ${rating >= value ? "fill-amber text-amber" : "text-neutral-300"}`} /></button>)}</div><input type="hidden" name="rating" value={rating} /></fieldset>
    <label className="block text-sm font-bold text-neutral-800">Votre retour d’expérience<textarea name="experience" required minLength={20} maxLength={1200} rows={5} value={experience} onChange={(event) => setExperience(event.target.value)} placeholder="Accueil, calme, équipements, avantage membre, points utiles pour les prochains voyageurs…" className="mt-2 w-full rounded-xl border border-neutral-300 p-3 text-sm outline-none focus:border-emerald-700" /><span className="mt-1 block text-xs font-normal text-neutral-500">Publié uniquement après validation. Un retour très négatif est d’abord traité avec le lieu concerné.</span></label>
    <button type="submit" disabled={state === "saving" || rating === 0} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#173e32] px-5 text-sm font-black text-white disabled:opacity-50">{state === "saving" ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}Créer mon badge de passage</button>
    {message ? <p role="status" className={`rounded-xl p-3 text-sm font-bold ${state === "saved" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>{message}</p> : null}
  </form>;
}
