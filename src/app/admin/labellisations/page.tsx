"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckCircle2, Clock, Loader2, RotateCcw, XCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ReviewStatus = "PENDING" | "ACCEPTED" | "REJECTED";
type Order = {
  id: string;
  status: "PAID" | "REFUNDED";
  amount: number;
  currency: string;
  createdAt: string;
  paidAt?: string | null;
  payload?: {
    establishmentName?: string;
    contactName?: string;
    email?: string;
    city?: string;
    discountPercent?: number;
    draftId?: string;
    reviewStatus?: ReviewStatus;
    reviewReason?: string;
  } | null;
};

export default function AdminLabellisations() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/labellisations", { cache: "no-store" });
    if (!response.ok) { setError(response.status === 403 ? "Accès réservé à l'administration Label Vanlife." : "Impossible de charger les candidatures."); setLoading(false); return; }
    const result = await response.json() as { orders: Order[] };
    setOrders(result.orders);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const decide = async (order: Order, decision: "ACCEPTED" | "REJECTED") => {
    const reason = decision === "REJECTED" ? window.prompt("Motif de non-conformité communiqué au candidat :", "Critères de labellisation non remplis") : "";
    if (decision === "REJECTED" && reason === null) return;
    if (!window.confirm(decision === "REJECTED" ? "Confirmer le refus et le remboursement intégral Stripe ?" : "Confirmer la validation de cette labellisation ?")) return;
    setWorkingId(order.id);
    setError("");
    const response = await fetch("/api/admin/labellisations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: order.id, decision, reason }) });
    const result = await response.json();
    if (!response.ok) setError(result.error || "La décision n'a pas pu être enregistrée.");
    else await load();
    setWorkingId("");
  };

  if (loading) return <div className="min-h-screen grid place-items-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-600" /></div>;

  return (
    <main className="min-h-screen bg-neutral-50 px-4 pb-24 pt-28">
      <div className="mx-auto max-w-5xl space-y-7">
        <header><p className="text-sm font-semibold text-emerald-600">Administration sécurisée</p><h1 className="mt-1 text-3xl font-bold text-neutral-900">Candidatures payées</h1><p className="mt-2 text-neutral-500">Une non-conformité déclenche un remboursement Stripe intégral et un email au candidat.</p></header>
        {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
        {orders.length === 0 ? <Card className="p-12 text-center"><Clock className="mx-auto h-12 w-12 text-neutral-300" /><p className="mt-3 text-neutral-500">Aucune candidature payée à étudier.</p></Card> : <div className="space-y-4">{orders.map((order) => {
          const review = order.payload?.reviewStatus || (order.status === "REFUNDED" ? "REJECTED" : "PENDING");
          return <Card key={order.id} className="p-6"><div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h2 className="text-lg font-bold text-neutral-900">{order.payload?.establishmentName || "Établissement"}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${review === "ACCEPTED" ? "bg-emerald-100 text-emerald-700" : review === "REJECTED" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}>{review === "ACCEPTED" ? "Validée" : review === "REJECTED" ? "Refusée · remboursée" : "À étudier"}</span></div><p className="mt-2 text-sm text-neutral-500">{order.payload?.contactName} · {order.payload?.email} · {order.payload?.city}</p><p className="mt-1 text-sm text-neutral-500">Paiement : {(order.amount / 100).toLocaleString("fr-FR", { style: "currency", currency: order.currency.toUpperCase() })} · Réduction membres : {order.payload?.discountPercent || "—"}%</p><p className="mt-2 text-xs text-neutral-400">Dossier {order.payload?.draftId || order.id} · {new Date(order.paidAt || order.createdAt).toLocaleDateString("fr-FR")}</p>{order.payload?.reviewReason && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">Motif : {order.payload.reviewReason}</p>}</div>{review === "PENDING" && <div className="flex shrink-0 gap-2"><Button size="sm" variant="primary" onClick={() => decide(order, "ACCEPTED")} disabled={workingId === order.id}><CheckCircle2 className="h-4 w-4" /> Valider</Button><Button size="sm" variant="secondary" onClick={() => decide(order, "REJECTED")} disabled={workingId === order.id}>{workingId === order.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Refuser et rembourser</Button></div>}</div></Card>;
        })}</div>}
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-xs leading-relaxed text-neutral-500"><RotateCcw className="mr-2 inline h-4 w-4" />Le remboursement est créé côté serveur à partir du PaymentIntent Stripe. Une seconde décision contradictoire est bloquée.</div>
      </div>
    </main>
  );
}
