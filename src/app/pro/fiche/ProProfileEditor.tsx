"use client";

import Link from "next/link";
import { useState } from "react";
import { AlertCircle, Check, ExternalLink, Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type EstablishmentForm = { establishmentName: string; phone: string; website: string; addressLine1: string; city: string; postalCode: string; region: string };
type PlaceForm = { id: string; name: string; slug: string; description: string; shortDesc: string; phone: string; email: string; website: string; addressLine1: string; city: string; postalCode: string; region: string; services: string[]; status: string };
type SaveState = "idle" | "saving" | "saved" | "error";

const inputClass = "mt-1 min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100";

export function ProProfileEditor({ establishment: initialEstablishment, places: initialPlaces }: { establishment: EstablishmentForm; places: PlaceForm[] }) {
  const [establishment, setEstablishment] = useState(initialEstablishment);
  const [places, setPlaces] = useState(initialPlaces);
  const [selectedId, setSelectedId] = useState(initialPlaces[0]?.id ?? "");
  const [state, setState] = useState<SaveState>("idle");
  const [message, setMessage] = useState("");
  const selectedPlace = places.find((place) => place.id === selectedId) ?? null;

  const updateEstablishment = (patch: Partial<EstablishmentForm>) => { setState("idle"); setEstablishment((current) => ({ ...current, ...patch })); };
  const updatePlace = (patch: Partial<PlaceForm>) => { setState("idle"); setPlaces((current) => current.map((place) => place.id === selectedId ? { ...place, ...patch } : place)); };

  async function save() {
    setState("saving"); setMessage("");
    try {
      const response = await fetch("/api/pro/profile", { method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ establishment, place: selectedPlace }) });
      const result = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(result.error || "Impossible d’enregistrer les modifications.");
      setState("saved"); setMessage("Vos informations ont bien été enregistrées.");
    } catch (error) {
      setState("error"); setMessage(error instanceof Error ? error.message : "Impossible d’enregistrer les modifications.");
    }
  }

  return <div className="space-y-6">
    <Card className="space-y-5 p-6">
      <div><h2 className="text-lg font-black text-neutral-900">Coordonnées de l’établissement</h2><p className="mt-1 text-xs leading-5 text-neutral-500">Ces informations permettent à l’équipe Label Vanlife de vous contacter et de gérer votre dossier.</p></div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Nom de l’établissement *<input required maxLength={120} value={establishment.establishmentName} onChange={(event) => updateEstablishment({ establishmentName: event.target.value })} className={inputClass} /></label>
        <label className="text-sm font-bold text-neutral-700">Téléphone *<input required maxLength={30} inputMode="tel" value={establishment.phone} onChange={(event) => updateEstablishment({ phone: event.target.value })} className={inputClass} /></label>
        <label className="text-sm font-bold text-neutral-700">Site internet<input maxLength={300} inputMode="url" placeholder="https://…" value={establishment.website} onChange={(event) => updateEstablishment({ website: event.target.value })} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Adresse *<input required maxLength={180} value={establishment.addressLine1} onChange={(event) => updateEstablishment({ addressLine1: event.target.value })} className={inputClass} /></label>
        <label className="text-sm font-bold text-neutral-700">Ville *<input required maxLength={100} value={establishment.city} onChange={(event) => updateEstablishment({ city: event.target.value })} className={inputClass} /></label>
        <label className="text-sm font-bold text-neutral-700">Code postal *<input required maxLength={12} inputMode="numeric" value={establishment.postalCode} onChange={(event) => updateEstablishment({ postalCode: event.target.value })} className={inputClass} /></label>
        <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Région *<input required maxLength={100} value={establishment.region} onChange={(event) => updateEstablishment({ region: event.target.value })} className={inputClass} /></label>
      </div>
    </Card>

    <Card className="space-y-5 p-6">
      <div><h2 className="text-lg font-black text-neutral-900">Fiche visible par les voyageurs</h2><p className="mt-1 text-xs leading-5 text-neutral-500">Le texte, les services et les coordonnées ci-dessous apparaissent sur la fiche publique de votre lieu.</p></div>
      {places.length === 0 ? <div className="rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Aucune fiche publique n’est encore rattachée à ce compte. L’équipe Label Vanlife finalise ce rattachement après validation du label.</div> : <>
        {places.length > 1 ? <label className="block text-sm font-bold text-neutral-700">Lieu à modifier<select value={selectedId} onChange={(event) => setSelectedId(event.target.value)} className={inputClass}>{places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label> : null}
        {selectedPlace ? <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-neutral-50 p-4"><div><p className="font-bold text-neutral-900">{selectedPlace.name}</p><p className="text-xs text-neutral-500">Statut : {selectedPlace.status === "PUBLISHED" ? "publiée" : selectedPlace.status.toLowerCase()}</p></div><Link href={`/lieux/${selectedPlace.slug}`} target="_blank" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 text-xs font-bold text-neutral-700">Voir la fiche <ExternalLink className="h-3.5 w-3.5" /></Link></div>
          <label className="block text-sm font-bold text-neutral-700">Nom public *<input required maxLength={120} value={selectedPlace.name} onChange={(event) => updatePlace({ name: event.target.value })} className={inputClass} /></label>
          <label className="block text-sm font-bold text-neutral-700">Résumé<input maxLength={220} value={selectedPlace.shortDesc} onChange={(event) => updatePlace({ shortDesc: event.target.value })} className={inputClass} /><span className="mt-1 block text-right text-xs font-normal text-neutral-400">{selectedPlace.shortDesc.length}/220</span></label>
          <label className="block text-sm font-bold text-neutral-700">Description *<textarea required maxLength={3000} rows={7} value={selectedPlace.description} onChange={(event) => updatePlace({ description: event.target.value })} className={`${inputClass} py-3`} /><span className="mt-1 block text-right text-xs font-normal text-neutral-400">{selectedPlace.description.length}/3000</span></label>
          <label className="block text-sm font-bold text-neutral-700">Services proposés<input maxLength={800} placeholder="Électricité, eau, sanitaires…" value={selectedPlace.services.join(", ")} onChange={(event) => updatePlace({ services: event.target.value.split(",").map((service) => service.trim()).filter(Boolean).slice(0, 20) })} className={inputClass} /><span className="mt-1 block text-xs font-normal text-neutral-500">Séparez les services par une virgule.</span></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-bold text-neutral-700">Téléphone public<input maxLength={30} inputMode="tel" value={selectedPlace.phone} onChange={(event) => updatePlace({ phone: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-bold text-neutral-700">Email public<input maxLength={254} inputMode="email" value={selectedPlace.email} onChange={(event) => updatePlace({ email: event.target.value })} className={inputClass} /></label>
            <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Site internet<input maxLength={300} inputMode="url" placeholder="https://…" value={selectedPlace.website} onChange={(event) => updatePlace({ website: event.target.value })} className={inputClass} /></label>
            <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Adresse<input maxLength={180} value={selectedPlace.addressLine1} onChange={(event) => updatePlace({ addressLine1: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-bold text-neutral-700">Ville *<input required maxLength={100} value={selectedPlace.city} onChange={(event) => updatePlace({ city: event.target.value })} className={inputClass} /></label>
            <label className="text-sm font-bold text-neutral-700">Code postal<input maxLength={12} value={selectedPlace.postalCode} onChange={(event) => updatePlace({ postalCode: event.target.value })} className={inputClass} /></label>
            <label className="sm:col-span-2 text-sm font-bold text-neutral-700">Région *<input required maxLength={100} value={selectedPlace.region} onChange={(event) => updatePlace({ region: event.target.value })} className={inputClass} /></label>
          </div>
        </div> : null}
      </>}
    </Card>

    <div className="sticky bottom-4 rounded-2xl border border-neutral-200 bg-white/95 p-4 shadow-xl backdrop-blur"><Button type="button" onClick={save} disabled={state === "saving"} variant="primary" size="lg" className="w-full gap-2">{state === "saving" ? <Loader2 className="h-5 w-5 animate-spin" /> : state === "saved" ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}{state === "saving" ? "Enregistrement…" : "Enregistrer mes informations"}</Button>{message ? <p role="status" className={`mt-3 flex items-center justify-center gap-2 text-center text-sm font-semibold ${state === "error" ? "text-red-700" : "text-emerald-700"}`}>{state === "error" ? <AlertCircle className="h-4 w-4" /> : <Check className="h-4 w-4" />}{message}</p> : null}</div>
  </div>;
}
