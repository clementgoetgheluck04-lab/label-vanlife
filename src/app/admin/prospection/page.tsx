"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, CheckCircle2, Clock3, Mail, MessageSquareReply, MousePointerClick, Pause, Play, RefreshCw, Send, ShieldCheck, Target, Users } from "lucide-react";

type ProspectStatus = "NEW" | "SENDING" | "CONTACTED" | "FOLLOW_UP_1" | "FOLLOW_UP_2" | "ENGAGED" | "INTERESTED" | "QUALIFIED" | "CONVERTED" | "NOT_INTERESTED" | "UNSUBSCRIBED" | "INVALID" | "NEEDS_HUMAN" | "PAUSED" | "ERROR";
type Prospect = {
  id: string;
  name: string;
  email: string;
  city?: string | null;
  status: ProspectStatus;
  followUpCount: number;
  nextActionAt?: string | null;
  updatedAt: string;
  messages: Array<{ direction: string; subject: string; createdAt: string }>;
};
type Dashboard = {
  settings: { enabled: boolean; dailyLimit: number; replyTo: string; webhookConfigured: boolean };
  totals: { prospects: number; sent: number; replies: number; clickers: number; counts: Partial<Record<ProspectStatus, number>> };
  experiments: {
    initialSubject: Record<"direction" | "opportunity", { sent: number; engaged: number }>;
  };
  prospects: Prospect[];
};

const LABELS: Record<ProspectStatus, string> = {
  NEW: "À contacter", SENDING: "Envoi en cours", CONTACTED: "Contacté", FOLLOW_UP_1: "Relance 1", FOLLOW_UP_2: "Cycle terminé",
  ENGAGED: "Parcours éditorial",
  INTERESTED: "Intéressé", QUALIFIED: "Qualifié", CONVERTED: "Vendu", NOT_INTERESTED: "Refus", UNSUBSCRIBED: "Désinscrit",
  INVALID: "Adresse invalide", NEEDS_HUMAN: "À traiter", PAUSED: "En pause", ERROR: "Erreur",
};
const STATUS_STYLE: Record<ProspectStatus, string> = {
  NEW: "bg-sky-50 text-sky-700", SENDING: "bg-blue-50 text-blue-700", CONTACTED: "bg-stone-100 text-stone-700", FOLLOW_UP_1: "bg-amber-50 text-amber-700", FOLLOW_UP_2: "bg-stone-100 text-stone-500",
  ENGAGED: "bg-violet-100 text-violet-800",
  INTERESTED: "bg-emerald-100 text-emerald-800", QUALIFIED: "bg-emerald-100 text-emerald-800", CONVERTED: "bg-[#174936] text-white", NOT_INTERESTED: "bg-stone-100 text-stone-500", UNSUBSCRIBED: "bg-stone-100 text-stone-500",
  INVALID: "bg-red-50 text-red-700", NEEDS_HUMAN: "bg-orange-100 text-orange-800", PAUSED: "bg-stone-100 text-stone-600", ERROR: "bg-red-100 text-red-800",
};

function Metric({ icon: Icon, label, value, tone = "text-emerald-700" }: { icon: typeof Users; label: string; value: number; tone?: string }) {
  return <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><Icon className={`h-5 w-5 ${tone}`} /><p className="mt-4 text-3xl font-black text-neutral-950">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-wider text-stone-500">{label}</p></div>;
}

function engagementRate(value: { sent: number; engaged: number }): number {
  return value.sent ? Math.round((value.engaged / value.sent) * 1_000) / 10 : 0;
}

export default function AdminProspectionPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "attention" | "active" | "won">("all");

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/prospection", { cache: "no-store" });
    if (!response.ok) { setError("Impossible de charger le tableau de bord."); setLoading(false); return; }
    setData(await response.json() as Dashboard);
    setLoading(false);
  }, []);
  useEffect(() => {
    const timeout = window.setTimeout(() => { void load(); }, 0);
    return () => window.clearTimeout(timeout);
  }, [load]);

  const action = async (actionName: string, prospectId = "") => {
    setWorking(`${actionName}:${prospectId}`); setError("");
    const response = await fetch("/api/admin/prospection", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: actionName, prospectId }) });
    if (!response.ok) setError("L’action n’a pas pu être enregistrée.");
    else await load();
    setWorking("");
  };

  const visible = useMemo(() => (data?.prospects || []).filter((prospect) => {
    if (filter === "attention") return ["INTERESTED", "NEEDS_HUMAN", "ERROR"].includes(prospect.status);
    if (filter === "active") return ["NEW", "SENDING", "CONTACTED", "FOLLOW_UP_1", "ENGAGED"].includes(prospect.status);
    if (filter === "won") return prospect.status === "CONVERTED";
    return true;
  }), [data, filter]);

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#f8f6f1]"><RefreshCw className="h-8 w-8 animate-spin text-emerald-700" /></main>;
  if (!data) return <main className="min-h-screen bg-[#f8f6f1] px-6 pt-32"><p className="mx-auto max-w-3xl rounded-2xl bg-red-50 p-5 text-red-800">{error}</p></main>;

  const attention = (data.totals.counts.INTERESTED || 0) + (data.totals.counts.NEEDS_HUMAN || 0) + (data.totals.counts.ERROR || 0);
  const direction = data.experiments.initialSubject.direction;
  const opportunity = data.experiments.initialSubject.opportunity;
  const directionRate = engagementRate(direction);
  const opportunityRate = engagementRate(opportunity);
  const experimentReady = direction.sent >= 30 && opportunity.sent >= 30 && direction.engaged + opportunity.engaged >= 5;
  return (
    <main className="min-h-screen bg-[#f8f6f1] px-4 pb-24 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="text-xs font-black uppercase tracking-[.2em] text-emerald-700">Pilotage commercial</p><h1 className="mt-2 text-3xl font-black text-neutral-950 sm:text-4xl">Prospection autonome</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600">Le moteur envoie au maximum trois messages sans engagement. Après un clic, un parcours éditorial progressif peut continuer jusqu’au dixième et dernier message.</p></div>
          <div className="flex flex-wrap gap-2"><Link href="/admin" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-800 px-5 text-sm font-bold text-white">Dashboard fondateur</Link><Link href="/admin/recommendations" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-5 text-sm font-bold text-neutral-800">Recommandations <ArrowUpRight className="h-4 w-4" /></Link><Link href="/admin/labellisations" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-300 bg-white px-5 text-sm font-bold text-neutral-800">Candidatures <ArrowUpRight className="h-4 w-4" /></Link><button onClick={() => action("sync")} disabled={working !== ""} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-neutral-950 px-5 text-sm font-bold text-white"><RefreshCw className={`h-4 w-4 ${working.startsWith("sync") ? "animate-spin" : ""}`} />Synchroniser les prospects</button></div>
        </header>

        {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-800">{error}</p>}
        <section className={`rounded-2xl border p-5 ${data.settings.enabled && data.settings.webhookConfigured ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3">{data.settings.enabled && data.settings.webhookConfigured ? <ShieldCheck className="mt-0.5 h-6 w-6 text-emerald-700" /> : <AlertTriangle className="mt-0.5 h-6 w-6 text-amber-700" />}<div><p className="font-black text-neutral-950">{data.settings.enabled ? "Envois automatiques activés" : "Envois automatiques en attente d’activation"}</p><p className="mt-1 text-sm text-stone-600">{data.settings.dailyLimit} contacts maximum par jour ouvré · réponses vers {data.settings.replyTo} · webhook {data.settings.webhookConfigured ? "connecté" : "à connecter"}</p></div></div>{!data.settings.webhookConfigured && <button onClick={() => action("notify_setup")} className="shrink-0 rounded-full border border-amber-300 bg-white px-4 py-2 text-xs font-bold text-amber-900">M’envoyer les instructions par email</button>}</div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <Metric icon={Users} label="Prospects" value={data.totals.prospects} />
          <Metric icon={Send} label="Emails envoyés" value={data.totals.sent} tone="text-sky-700" />
          <Metric icon={MousePointerClick} label="Prospects ayant cliqué" value={data.totals.clickers} tone="text-indigo-700" />
          <Metric icon={MessageSquareReply} label="Réponses" value={data.totals.replies} tone="text-violet-700" />
          <Metric icon={Target} label="À traiter" value={attention} tone="text-orange-700" />
          <Metric icon={CheckCircle2} label="Ventes" value={data.totals.counts.CONVERTED || 0} tone="text-emerald-700" />
        </section>

        <section className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div><p className="text-xs font-black uppercase tracking-[.18em] text-indigo-700">Test des objets du premier email</p><h2 className="mt-2 text-xl font-black text-neutral-950">Direction ou opportunité commerciale ?</h2></div>
            <p className={`rounded-full px-3 py-1.5 text-xs font-bold ${experimentReady ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>{experimentReady ? "Résultat exploitable" : "Échantillon encore insuffisant"}</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><p className="text-sm font-black text-neutral-900">« À l’attention de la direction »</p><p className="mt-3 text-3xl font-black text-indigo-800">{directionRate.toLocaleString("fr-FR")} %</p><p className="mt-1 text-xs text-stone-500">{direction.engaged} prospect(s) engagé(s) sur {direction.sent} emails</p></div>
            <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4"><p className="text-sm font-black text-neutral-900">« Les vans peuvent devenir des clients »</p><p className="mt-3 text-3xl font-black text-indigo-800">{opportunityRate.toLocaleString("fr-FR")} %</p><p className="mt-1 text-xs text-stone-500">{opportunity.engaged} prospect(s) engagé(s) sur {opportunity.sent} emails</p></div>
          </div>
          <p className="mt-4 text-sm leading-6 text-stone-600">{experimentReady ? (directionRate > opportunityRate ? "L’objet adressé à la direction est actuellement le plus performant." : opportunityRate > directionRate ? "L’objet centré sur l’opportunité commerciale est actuellement le plus performant." : "Les deux formulations sont actuellement à égalité.") : "Aucun objet ne sera déclaré gagnant avant au moins 30 envois par variante et 5 engagements cumulés."}</p>
        </section>

        <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-stone-200 p-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-xl font-black text-neutral-950">Pipeline des 100 derniers prospects</h2><p className="mt-1 text-sm text-stone-500">Les réponses ambiguës restent bloquées jusqu’à votre décision.</p></div><div className="flex gap-1 rounded-full bg-stone-100 p-1">{([['all','Tous'],['attention','À traiter'],['active','Actifs'],['won','Vendus']] as const).map(([id,label]) => <button key={id} onClick={() => setFilter(id)} className={`rounded-full px-3 py-2 text-xs font-bold ${filter === id ? "bg-white text-neutral-950 shadow-sm" : "text-stone-500"}`}>{label}</button>)}</div></div>
          <div className="divide-y divide-stone-100">
            {visible.length === 0 && <p className="p-10 text-center text-sm text-stone-500">Aucun prospect dans cette vue.</p>}
            {visible.map((prospect) => <article key={prospect.id} className="grid gap-4 p-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center">
              <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h3 className="truncate font-black text-neutral-950">{prospect.name}</h3><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_STYLE[prospect.status]}`}>{LABELS[prospect.status]}</span></div><p className="mt-1 truncate text-sm text-stone-500">{prospect.email}{prospect.city ? ` · ${prospect.city}` : ""}</p></div>
              <div className="text-xs text-stone-500">{prospect.messages[0] ? <><p className="truncate font-semibold text-stone-700"><Mail className="mr-1 inline h-3.5 w-3.5" />{prospect.messages[0].subject}</p><p className="mt-1">{new Date(prospect.messages[0].createdAt).toLocaleString("fr-FR")}</p></> : <p><Clock3 className="mr-1 inline h-3.5 w-3.5" />En attente du premier contact</p>}</div>
              <div className="flex flex-wrap justify-start gap-2 lg:justify-end">{["NEW","CONTACTED","FOLLOW_UP_1","ENGAGED"].includes(prospect.status) && <button title="Mettre en pause" onClick={() => action("pause", prospect.id)} className="rounded-full border border-stone-200 p-2 text-stone-600"><Pause className="h-4 w-4" /></button>}{["PAUSED","ERROR"].includes(prospect.status) && <button title="Reprendre" onClick={() => action(prospect.status === "ERROR" ? "retry" : "resume", prospect.id)} className="rounded-full border border-stone-200 p-2 text-emerald-700"><Play className="h-4 w-4" /></button>}{["INTERESTED","NEEDS_HUMAN"].includes(prospect.status) && <button onClick={() => action("qualified", prospect.id)} className="rounded-full bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800">Qualifier</button>}{["INTERESTED","QUALIFIED","NEEDS_HUMAN"].includes(prospect.status) && <button onClick={() => action("converted", prospect.id)} className="rounded-full bg-neutral-950 px-3 py-2 text-xs font-bold text-white">Vente conclue</button>}{!["CONVERTED","UNSUBSCRIBED","NOT_INTERESTED","INVALID"].includes(prospect.status) && <button onClick={() => action("suppress", prospect.id)} className="rounded-full border border-stone-200 px-3 py-2 text-xs font-bold text-stone-600">Ne plus contacter</button>}</div>
            </article>)}
          </div>
        </section>
      </div>
    </main>
  );
}
