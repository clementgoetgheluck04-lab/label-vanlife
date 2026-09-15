"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, MapPin, Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics/browser";

const PLACE_TYPES = ["Camping", "Ferme", "Domaine", "Restaurant", "Producteur", "Activité", "Artisan", "Commerce", "Aire", "Hébergement", "Musée", "Autre"];
const fieldClass = "mt-2 min-h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-950 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export default function RecommendPlacePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<{ matchedSourceId?: string | null; duplicate?: boolean } | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const response = await fetch("/api/place-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "La recommandation n’a pas pu être enregistrée.");
      trackEvent("place_recommend", { entityType: "place", entityId: result.matchedSourceId || result.id });
      setSuccess(result);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "La recommandation n’a pas pu être enregistrée.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50/70 to-white px-4 pb-20 pt-28">
      <div className="mx-auto max-w-2xl">
        <Link href="/explorer" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-neutral-950"><ArrowLeft className="h-4 w-4" /> Retour aux lieux</Link>
        <header className="mt-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700"><MapPin className="h-7 w-7" /></div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">La communauté construit la carte</p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-950 sm:text-4xl">Recommander un lieu</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-600">Vous connaissez un lieu où les vans sont réellement bien accueillis ? Signalez-le-nous. Une recommandation n’accorde jamais automatiquement le label : notre équipe vérifie chaque proposition.</p>
        </header>

        {success ? (
          <section className="mt-10 rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-900/5">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-4 text-2xl font-bold text-neutral-950">Merci, la recommandation est enregistrée</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">{success.duplicate ? "Ce lieu nous avait déjà été signalé récemment. Votre intérêt est bien pris en compte." : success.matchedSourceId ? "Ce lieu figure déjà parmi les lieux repérés. Votre recommandation nous aide à prioriser sa vérification." : "Nous allons vérifier les informations avant toute publication ou prise de contact."}</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/explorer" className="inline-flex min-h-11 items-center justify-center rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white">Explorer la carte</Link><button onClick={() => setSuccess(null)} className="min-h-11 rounded-xl border border-neutral-200 px-5 text-sm font-bold text-neutral-700">Recommander un autre lieu</button></div>
          </section>
        ) : (
          <form onSubmit={submit} className="mt-10 space-y-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-neutral-900/5 sm:p-8">
            <input name="companyWebsite" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-neutral-700 sm:col-span-2">Nom du lieu *<input name="placeName" required minLength={2} maxLength={160} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700">Type de lieu *<select name="placeType" required className={fieldClass}>{PLACE_TYPES.map((type) => <option key={type} value={type.toLocaleLowerCase("fr")}>{type}</option>)}</select></label>
              <label className="text-sm font-semibold text-neutral-700">Ville *<input name="city" required minLength={2} maxLength={120} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700">Région<input name="region" maxLength={120} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700">Pays *<input name="country" required defaultValue="France" maxLength={80} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700 sm:col-span-2">Site internet du lieu<input name="website" inputMode="url" maxLength={300} placeholder="https://..." className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700 sm:col-span-2">Pourquoi ce lieu mérite-t-il notre attention ? *<textarea name="reason" required minLength={10} maxLength={1000} rows={5} className={`${fieldClass} py-3`} placeholder="Décrivez l’accueil, l’accès et ce qui vous a marqué." /></label>
              <label className="text-sm font-semibold text-neutral-700">Email public du lieu, si vous le connaissez<input name="placeContactEmail" type="email" maxLength={254} className={fieldClass} /></label>
              <label className="text-sm font-semibold text-neutral-700">Votre email, facultatif<input name="recommenderEmail" type="email" maxLength={254} className={fieldClass} /></label>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-[#f7f1e8] p-4 text-xs leading-5 text-neutral-600"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#9a7445]" /> Les coordonnées ne sont utilisées que pour vérifier la recommandation. Elles ne sont pas publiées et aucun email automatique n’est envoyé au lieu sans validation.</div>
            {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:opacity-60">{loading && <Loader2 className="h-4 w-4 animate-spin" />} Envoyer ma recommandation</button>
          </form>
        )}
      </div>
    </main>
  );
}
