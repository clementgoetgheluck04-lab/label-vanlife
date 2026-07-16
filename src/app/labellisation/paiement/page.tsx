"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronLeft, Loader2, RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Draft = Record<string, unknown> & {
  establishmentName?: string;
  email?: string;
  discountPercent?: number | string;
  draftId?: string;
};

export default function LabellisationPaymentPage() {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const saved = localStorage.getItem("labellisation-draft");
      if (!saved) return;
      try { setDraft(JSON.parse(saved) as Draft); } catch { setDraft(null); }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  const handlePay = async () => {
    if (!draft) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/checkout-labellisation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (response.status === 401) {
        router.push("/member-login?redirect=/labellisation/paiement");
        return;
      }
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Le paiement ne peut pas être lancé.");
      window.location.href = result.url;
    } catch (paymentError) {
      setError(paymentError instanceof Error ? paymentError.message : "Le paiement ne peut pas être lancé.");
      setLoading(false);
    }
  };

  if (!draft) return (
    <main className="min-h-screen bg-neutral-50 px-4 pb-20 pt-28">
      <Card className="mx-auto max-w-lg p-8 text-center"><h1 className="text-2xl font-bold text-neutral-900">Dossier introuvable</h1><p className="mt-3 text-neutral-500">Reprenez le formulaire sur cet appareil pour finaliser la labellisation.</p><Link href="/labellisation/candidature"><Button variant="cta" className="mt-6">Reprendre ma candidature</Button></Link></Card>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f1e8] to-white px-4 pb-20 pt-28">
      <div className="mx-auto max-w-2xl space-y-7">
        <Link href="/labellisation/candidature/confirmee" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"><ChevronLeft className="h-4 w-4" /> Retour à la confirmation</Link>
        <header className="text-center"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a7445]">Dernière étape</p><h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">Finaliser la labellisation</h1><p className="mt-3 text-neutral-500">Votre dossier est enregistré. Le paiement permet de lancer son étude complète.</p></header>

        <Card className="overflow-hidden border-[#c39960]/30 shadow-xl shadow-[#c39960]/10">
          <div className="bg-neutral-950 p-7 text-white sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-5"><div><p className="text-sm text-white/60">{draft.establishmentName || "Votre établissement"}</p><h2 className="mt-1 text-2xl font-bold">Étude et labellisation annuelle</h2></div><span className="rounded-full bg-[#c39960] px-3 py-1.5 text-xs font-bold">OFFRE 2026 · -50%</span></div>
            <div className="mt-7 flex items-end gap-3"><span className="text-2xl text-white/35 line-through">220 €</span><strong className="text-5xl">110 €</strong><span className="pb-1 text-sm text-white/50">paiement unique</span></div>
            <p className="mt-2 text-xs text-[#dfc59f]">Offre valable jusqu'au 31 décembre 2026.</p>
          </div>
          <div className="space-y-6 p-7 sm:p-9">
            <ul className="space-y-3 text-sm text-neutral-700">{["Analyse des 22 critères et des pièces jointes", "Création de la fiche établissement", "Validation humaine par Label Vanlife", "Kit partenaire après acceptation", "Aucune commission sur les réservations"].map((item) => <li key={item} className="flex gap-3"><Check className="h-5 w-5 shrink-0 text-emerald-600" />{item}</li>)}</ul>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"><div className="flex gap-3"><RotateCcw className="h-6 w-6 shrink-0 text-emerald-700" /><div><h3 className="font-bold text-emerald-950">Garantie de remboursement en cas de non-conformité</h3><p className="mt-1 text-sm leading-relaxed text-emerald-800">Si l'étude conclut que le lieu ne respecte pas les critères nécessaires à la labellisation, les 110 € sont remboursés intégralement sur le moyen de paiement utilisé.</p></div></div></div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{error}</p>}
            <Button variant="cta" size="lg" className="w-full gap-2" onClick={handlePay} disabled={loading}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShieldCheck className="h-5 w-5" />} Payer 110 € et lancer l'étude <ArrowRight className="h-5 w-5" /></Button>
            <p className="text-center text-xs text-neutral-400">Paiement sécurisé Stripe · Remboursement intégral si la candidature est déclarée non conforme</p>
          </div>
        </Card>
      </div>
    </main>
  );
}
