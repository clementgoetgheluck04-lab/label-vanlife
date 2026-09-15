"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, ExternalLink, Loader2, MapPin, RotateCcw, X } from "lucide-react";

type Recommendation = {
  id: string;
  placeName: string;
  placeType: string;
  city: string;
  region?: string | null;
  country: string;
  website?: string | null;
  placeContactEmail?: string | null;
  recommenderEmail?: string | null;
  reason: string;
  matchedSourceId?: string | null;
  status: "PENDING" | "VALIDATED" | "REJECTED" | "CONVERTED";
  createdAt: string;
};

const STATUS_LABEL = { PENDING: "À vérifier", VALIDATED: "Validée", REJECTED: "Refusée", CONVERTED: "Convertie" } as const;

export default function AdminRecommendationsPage() {
  const [items, setItems] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/admin/recommendations", { cache: "no-store" });
    if (!response.ok) { setError("Impossible de charger les recommandations."); setLoading(false); return; }
    const data = await response.json() as { recommendations: Recommendation[] };
    setItems(data.recommendations);
    setLoading(false);
  }
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/recommendations", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json() as Promise<{ recommendations: Recommendation[] }>;
      })
      .then((data) => {
        if (!cancelled) setItems(data.recommendations);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les recommandations.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  async function update(id: string, status: Recommendation["status"]) {
    setWorking(id); setError("");
    const response = await fetch("/api/admin/recommendations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (!response.ok) setError("La décision n’a pas pu être enregistrée.");
    else await load();
    setWorking("");
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f8f6f1]"><Loader2 className="h-8 w-8 animate-spin text-emerald-700" /></main>;
  return (
    <main className="min-h-screen bg-[#f8f6f1] px-4 pb-24 pt-28 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-7">
        <header><Link href="/admin/prospection" className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-neutral-600"><ArrowLeft className="h-4 w-4" /> Prospection</Link><p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-emerald-700">Sourcing communautaire</p><h1 className="mt-2 text-3xl font-black text-neutral-950">Lieux recommandés</h1><p className="mt-2 text-sm text-neutral-600">Chaque proposition doit être vérifiée humainement avant publication ou prise de contact.</p></header>
        {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
        {items.length === 0 ? <div className="rounded-3xl border border-stone-200 bg-white p-12 text-center text-stone-500">Aucune recommandation pour le moment.</div> : <section className="grid gap-4 lg:grid-cols-2">{items.map((item) => <article key={item.id} className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm"><div className="flex items-start justify-between gap-4"><div><span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-stone-600">{STATUS_LABEL[item.status]}</span><h2 className="mt-3 text-xl font-black text-neutral-950">{item.placeName}</h2><p className="mt-1 flex items-center gap-1.5 text-sm text-stone-600"><MapPin className="h-4 w-4" /> {item.city}{item.region ? ` · ${item.region}` : ""} · {item.country}</p></div>{item.matchedSourceId && <span className="rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold text-amber-800">Déjà repéré</span>}</div><p className="mt-4 text-sm leading-6 text-stone-700">{item.reason}</p><div className="mt-4 space-y-1 text-xs text-stone-500">{item.placeContactEmail && <p>Email public : {item.placeContactEmail}</p>}{item.recommenderEmail && <p>Recommandé par : {item.recommenderEmail}</p>}{item.website && <a href={item.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-emerald-700">Voir le site <ExternalLink className="h-3 w-3" /></a>}</div><div className="mt-5 flex flex-wrap gap-2"><button disabled={working === item.id} onClick={() => update(item.id, "VALIDATED")} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-emerald-700 px-4 text-xs font-bold text-white"><Check className="h-4 w-4" /> Valider</button><button disabled={working === item.id} onClick={() => update(item.id, "REJECTED")} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl bg-red-50 px-4 text-xs font-bold text-red-700"><X className="h-4 w-4" /> Refuser</button><button disabled={working === item.id} onClick={() => update(item.id, "PENDING")} className="inline-flex min-h-10 items-center gap-1.5 rounded-xl border border-stone-200 px-4 text-xs font-bold text-stone-700"><RotateCcw className="h-4 w-4" /> Remettre à vérifier</button></div></article>)}</section>}
      </div>
    </main>
  );
}
