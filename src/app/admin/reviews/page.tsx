"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, MessageCircleWarning, Star, XCircle } from "lucide-react";

type ReviewRow = {
  id: string; rating: number; comment: string | null; isVerified: boolean; updatedAt: string;
  place: { name: string; slug: string; city: string; email: string | null };
  member: { name: string; email: string };
  proof: { displayedPriceCents: number; paidPriceCents: number; expectedMemberPriceCents: number; discountPercent: number; status: "PENDING" | "MEDIATION" | "PUBLISHED" | "REJECTED" };
  photoUrls: string[];
};

const euros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

async function fetchReviews() {
  const response = await fetch("/api/admin/reviews", { cache: "no-store" });
  const result = await response.json() as { reviews?: ReviewRow[]; error?: string };
  if (!response.ok) throw new Error(result.error || "Chargement impossible.");
  return result.reviews || [];
}

export default function ReviewsAdminPage() {
  const [rows, setRows] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetchReviews().then((reviews) => { if (active) { setRows(reviews); setLoading(false); } }).catch((cause) => { if (active) { setError(cause instanceof Error ? cause.message : "Chargement impossible."); setLoading(false); } });
    return () => { active = false; };
  }, []);
  async function act(id: string, action: "publish" | "mediate" | "reject") { setWorking(`${id}:${action}`); setError(""); const response = await fetch("/api/admin/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, action }) }); const result = await response.json() as { error?: string }; if (!response.ok) setError(result.error || "Action impossible."); else setRows(await fetchReviews()); setWorking(""); }
  return <main className="min-h-screen bg-[#f8f6f1] px-4 pb-24 pt-28 sm:px-6"><div className="mx-auto max-w-6xl space-y-7"><header><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-neutral-600"><ArrowLeft className="h-4 w-4" />Dashboard</Link><p className="mt-6 text-xs font-black uppercase tracking-[.2em] text-emerald-700">Confiance et qualité</p><h1 className="mt-2 text-3xl font-black text-neutral-950">Retours après visite</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-600">Les photos servent uniquement de preuve. Seuls les textes validés sont publiés. Un retour de 1 ou 2 étoiles doit passer par « Échange avec le lieu » avant publication.</p></header>{error ? <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">{error}</p> : null}{loading ? <Loader2 className="h-7 w-7 animate-spin text-emerald-700" /> : <section className="space-y-5">{rows.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-neutral-500">Aucun retour à modérer.</div> : rows.map((row) => <article key={row.id} className={`rounded-3xl border bg-white p-5 shadow-sm sm:p-7 ${row.rating <= 2 && row.proof.status !== "PUBLISHED" ? "border-amber-300" : "border-neutral-200"}`}><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex items-center gap-2"><h2 className="text-xl font-black text-neutral-950">{row.place.name}</h2><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-600">{row.proof.status}</span></div><p className="mt-1 text-sm text-neutral-500">{row.place.city} · {row.member.name} · {row.member.email}</p><div className="mt-3 flex gap-1">{[1,2,3,4,5].map((value) => <Star key={value} className={`h-5 w-5 ${row.rating >= value ? "fill-amber text-amber" : "text-neutral-200"}`} />)}</div></div>{row.rating <= 2 ? <span className="inline-flex items-center gap-2 rounded-xl bg-amber-100 px-3 py-2 text-xs font-black text-amber-900"><AlertTriangle className="h-4 w-4" />Échange préalable requis</span> : null}</div><blockquote className="mt-5 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-700">« {row.comment} »</blockquote><div className="mt-4 grid gap-3 sm:grid-cols-3">{row.photoUrls.map((url, index) => <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-neutral-100"><Image src={url} alt={index === 0 ? "Photo de l’emplacement" : index === 1 ? "Photo des tarifs" : "Photo libre de la visite"} fill unoptimized className="object-cover" /></div>)}</div><div className="mt-4 grid gap-2 rounded-2xl bg-[#f7f1e8] p-4 text-sm sm:grid-cols-4"><p>Affiché<br/><strong>{euros(row.proof.displayedPriceCents)}</strong></p><p>Remise<br/><strong>−{row.proof.discountPercent}%</strong></p><p>Attendu<br/><strong>{euros(row.proof.expectedMemberPriceCents)}</strong></p><p>Payé<br/><strong>{euros(row.proof.paidPriceCents)}</strong></p></div><div className="mt-5 flex flex-wrap gap-2"><button onClick={() => act(row.id, "publish")} disabled={working !== "" || row.proof.status === "PUBLISHED"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-800 px-4 text-sm font-black text-white disabled:opacity-40"><CheckCircle2 className="h-4 w-4" />Publier</button><button onClick={() => act(row.id, "mediate")} disabled={working !== "" || row.proof.status === "MEDIATION"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-amber-100 px-4 text-sm font-black text-amber-900 disabled:opacity-40"><MessageCircleWarning className="h-4 w-4" />Échange avec le lieu</button><button onClick={() => act(row.id, "reject")} disabled={working !== "" || row.proof.status === "REJECTED"} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-red-200 px-4 text-sm font-black text-red-700 disabled:opacity-40"><XCircle className="h-4 w-4" />Ne pas publier</button></div></article>)}</section>}</div></main>;
}
