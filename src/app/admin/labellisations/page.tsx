"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock, ExternalLink, FileCheck2, Loader2, RotateCcw, ShieldCheck, XCircle } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { LABELLISATION_CRITERIA } from "@/config/labellisation-criteria";
import { LABEL_REVIEW_CONTROLS, LABEL_STANDARD_VERSION, type LabelReviewControlId } from "@/config/label-standard";

type ReviewStatus = "PENDING" | "ACCEPTED" | "REJECTED";
type CriterionAnswer = { status?: "yes" | "no"; examples?: string[]; detail?: string };
type ReviewChecklist = Partial<Record<LabelReviewControlId, boolean>>;
type Order = {
  id: string;
  status: "PAID" | "REFUNDED";
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string | null;
  evidenceLinks: Array<{ name: string; url: string }>;
  payload?: {
    establishmentName?: string;
    contactName?: string;
    email?: string;
    city?: string;
    website?: string;
    siret?: string;
    discountPercent?: number;
    operatingAuthorization?: boolean;
    acceptCharter?: boolean;
    draftId?: string;
    criteria?: Record<string, CriterionAnswer>;
    reviewStatus?: ReviewStatus;
    reviewReason?: string;
    reviewNote?: string;
    reviewChecklist?: ReviewChecklist;
    standardVersion?: string;
  } | null;
};

type ReviewForm = { checks: ReviewChecklist; note: string };

function initialReviewForm(order: Order): ReviewForm {
  return { checks: order.payload?.reviewChecklist || {}, note: order.payload?.reviewNote || order.payload?.reviewReason || "" };
}

export default function AdminLabellisations() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");
  const [reviewForms, setReviewForms] = useState<Record<string, ReviewForm>>({});

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/labellisations", { cache: "no-store" });
    if (!response.ok) {
      setError(response.status === 403 ? "Accès réservé à l’administration Label Vanlife." : "Impossible de charger les candidatures.");
      setLoading(false);
      return;
    }
    const result = await response.json() as { orders: Order[] };
    setOrders(result.orders);
    setReviewForms(Object.fromEntries(result.orders.map((order) => [order.id, initialReviewForm(order)])));
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const pendingCount = useMemo(() => orders.filter((order) => !order.payload?.reviewStatus && order.status !== "REFUNDED").length, [orders]);

  const updateReview = (orderId: string, update: Partial<ReviewForm>) => {
    setReviewForms((current) => ({ ...current, [orderId]: { ...(current[orderId] || { checks: {}, note: "" }), ...update } }));
  };

  const updateCheck = (orderId: string, controlId: LabelReviewControlId, checked: boolean) => {
    const form = reviewForms[orderId] || { checks: {}, note: "" };
    updateReview(orderId, { checks: { ...form.checks, [controlId]: checked } });
  };

  const decide = async (order: Order, decision: "ACCEPTED" | "REJECTED") => {
    const form = reviewForms[order.id] || initialReviewForm(order);
    const allChecked = LABEL_REVIEW_CONTROLS.every((control) => form.checks[control.id]);
    if (form.note.trim().length < 10) {
      setError("Ajoutez une note de revue d’au moins 10 caractères pour tracer la décision.");
      return;
    }
    if (decision === "ACCEPTED" && !allChecked) {
      setError("Confirmez les six contrôles du référentiel avant de valider le label.");
      return;
    }
    const confirmation = decision === "REJECTED"
      ? "Confirmer le refus et le remboursement intégral Stripe ?"
      : `Confirmer l’attribution selon le référentiel ${LABEL_STANDARD_VERSION} ?`;
    if (!window.confirm(confirmation)) return;

    setWorkingId(order.id);
    setError("");
    const response = await fetch("/api/admin/labellisations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        decision,
        reason: decision === "REJECTED" ? form.note.trim() : "",
        reviewNote: form.note.trim(),
        reviewChecklist: form.checks,
      }),
    });
    const result = await response.json() as { error?: string };
    if (!response.ok) setError(result.error || "La décision n’a pas pu être enregistrée.");
    else await load();
    setWorkingId("");
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 pb-24 pt-28">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-semibold text-emerald-700">Administration sécurisée · référentiel {LABEL_STANDARD_VERSION}</p><h1 className="mt-1 text-3xl font-bold text-neutral-900">Revue des candidatures</h1><p className="mt-2 max-w-3xl text-neutral-500">Chaque attribution exige six contrôles tracés. Le paiement ne suffit jamais à obtenir le label.</p></div>
          <div className="flex flex-wrap gap-2"><Link href="/referentiel-label-vanlife" target="_blank" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white px-5 text-sm font-bold text-neutral-800">Référentiel public <ExternalLink className="h-4 w-4" /></Link><Link href="/admin/prospection" className="inline-flex min-h-11 items-center justify-center rounded-full bg-neutral-950 px-5 text-sm font-bold text-white">Pilotage prospection</Link></div>
        </header>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-neutral-400">À étudier</p><p className="mt-2 text-3xl font-black text-neutral-950">{pendingCount}</p></Card>
          <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Méthode</p><p className="mt-2 font-black text-neutral-950">6 contrôles obligatoires</p></Card>
          <Card className="p-5"><p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Traçabilité</p><p className="mt-2 font-black text-neutral-950">Version et note conservées</p></Card>
        </div>

        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {orders.length === 0 ? <Card className="p-12 text-center"><Clock className="mx-auto h-12 w-12 text-neutral-300" /><p className="mt-3 text-neutral-500">Aucune candidature payée à étudier.</p></Card> : <div className="space-y-5">{orders.map((order) => {
          const review = order.payload?.reviewStatus || (order.status === "REFUNDED" ? "REJECTED" : "PENDING");
          const form = reviewForms[order.id] || initialReviewForm(order);
          const criteria = order.payload?.criteria || {};
          const positiveCriteria = Object.values(criteria).filter((answer) => answer.status === "yes").length;
          const allChecked = LABEL_REVIEW_CONTROLS.every((control) => form.checks[control.id]);
          return <Card key={order.id} className="overflow-hidden"><div className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-bold text-neutral-900">{order.payload?.establishmentName || "Établissement"}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${review === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : review === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{review === "ACCEPTED" ? "Label attribué" : review === "REJECTED" ? "Refusée · remboursée" : "À étudier"}</span></div><p className="mt-2 text-sm text-neutral-500">{order.payload?.contactName} · {order.payload?.email} · {order.payload?.city}</p><p className="mt-1 text-sm text-neutral-500">SIRET : {order.payload?.siret || "—"} · Avantage membre : {order.payload?.discountPercent || "—"}% · {positiveCriteria}/22 indicateurs déclarés présents</p><p className="mt-2 text-xs text-neutral-400">Dossier {order.payload?.draftId || order.id} · paiement {(order.amount / 100).toLocaleString("fr-FR", { style: "currency", currency: order.currency.toUpperCase() })} · {new Date(order.paidAt || order.createdAt).toLocaleDateString("fr-FR")}</p></div><div className="flex flex-wrap gap-2">{order.payload?.website && <a href={order.payload.website} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-xs font-bold">Site du lieu <ExternalLink className="h-3.5 w-3.5" /></a>}{order.evidenceLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-full border border-neutral-300 px-4 text-xs font-bold"><FileCheck2 className="h-3.5 w-3.5" />{link.name}</a>)}</div></div>

            <details className="mt-5 rounded-2xl border border-neutral-200 bg-neutral-50 p-4"><summary className="cursor-pointer text-sm font-bold text-neutral-800">Examiner les 22 réponses du candidat</summary><div className="mt-4 grid gap-3 md:grid-cols-2">{LABELLISATION_CRITERIA.map((criterion) => { const answer = criteria[criterion.id]; return <div key={criterion.id} className="rounded-xl bg-white p-3 text-sm"><div className="flex items-start justify-between gap-3"><p className="font-bold text-neutral-800">{criterion.emoji} {criterion.title}</p><span className={`rounded-full px-2 py-0.5 text-[11px] font-black ${answer?.status === "yes" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-200 text-neutral-600"}`}>{answer?.status === "yes" ? "OUI" : "NON"}</span></div>{answer?.examples?.length ? <p className="mt-2 text-xs leading-5 text-neutral-500">{answer.examples.join(" · ")}</p> : null}{answer?.detail ? <p className="mt-1 text-xs font-medium text-neutral-700">Précision : {answer.detail}</p> : null}</div>; })}</div></details>

            {review === "PENDING" ? <section className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-emerald-800" /><h3 className="font-black text-neutral-900">Contrôles avant attribution</h3></div><div className="mt-4 grid gap-3 md:grid-cols-2">{LABEL_REVIEW_CONTROLS.map((control) => <label key={control.id} className="flex cursor-pointer gap-3 rounded-xl border border-emerald-100 bg-white p-3 text-sm font-medium text-neutral-700"><input type="checkbox" checked={form.checks[control.id] === true} onChange={(event) => updateCheck(order.id, control.id, event.target.checked)} className="mt-0.5 h-4 w-4 accent-emerald-700" />{control.label}</label>)}</div><label className="mt-4 block text-sm font-bold text-neutral-800">Note de revue obligatoire<textarea value={form.note} onChange={(event) => updateReview(order.id, { note: event.target.value.slice(0, 1200) })} minLength={10} maxLength={1200} rows={4} placeholder="Sources consultées, cohérence du dossier, éventuels points de vigilance…" className="mt-2 w-full rounded-xl border border-neutral-300 bg-white p-3 text-sm font-normal outline-none focus:border-emerald-700" /></label><div className="mt-4 flex flex-wrap gap-2"><Button size="sm" variant="primary" onClick={() => decide(order, "ACCEPTED")} disabled={workingId === order.id || !allChecked || form.note.trim().length < 10}><CheckCircle2 className="h-4 w-4" /> Attribuer le label 2027</Button><Button size="sm" variant="secondary" onClick={() => decide(order, "REJECTED")} disabled={workingId === order.id || form.note.trim().length < 10}>{workingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Refuser et rembourser</Button></div></section> : <div className={`mt-5 rounded-xl p-4 text-sm ${review === "ACCEPTED" ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-800"}`}><p className="font-black">Décision enregistrée · référentiel {order.payload?.standardVersion || "antérieur"}</p><p className="mt-1 leading-6">{order.payload?.reviewNote || order.payload?.reviewReason || "Aucune note disponible."}</p></div>}
          </div></Card>;
        })}</div>}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-xs leading-relaxed text-neutral-500"><RotateCcw className="mr-2 inline h-4 w-4" />Le remboursement est créé côté serveur à partir du PaymentIntent Stripe. Une seconde décision contradictoire est bloquée.</div>
      </div>
    </main>
  );
}
