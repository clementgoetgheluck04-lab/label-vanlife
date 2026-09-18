"use client";

import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/config/contact";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const reference = error.digest ? `Référence : ${error.digest}` : "Référence : erreur sans identifiant serveur";

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-neutral-50 px-6 py-24">
      <section role="alert" className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-7 text-center shadow-sm sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-700">
          <AlertTriangle className="h-7 w-7" />
        </span>
        <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-red-700">Erreur technique identifiée</p>
        <h1 className="mt-3 text-3xl font-black text-neutral-950">Cette page n’a pas pu se charger</h1>
        <p className="mt-4 text-sm leading-6 text-neutral-600">Vos données ne sont pas présentées comme supprimées. Réessayez une fois ; si le problème continue, transmettez la référence ci-dessous à notre équipe.</p>
        <p className="mt-5 rounded-xl bg-neutral-100 px-4 py-3 font-mono text-xs text-neutral-700">{reference}</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={reset} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 text-sm font-bold text-white hover:bg-neutral-800">
            <RefreshCw className="h-4 w-4" /> Réessayer
          </button>
          <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 text-sm font-bold text-neutral-800 hover:bg-neutral-50">
            <Home className="h-4 w-4" /> Retour à l’accueil
          </Link>
        </div>
        <a href={`${CONTACT_MAILTO}?subject=${encodeURIComponent(`Erreur technique Label Vanlife — ${reference}`)}`} className="mt-6 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-4">Signaler le problème à {CONTACT_EMAIL}</a>
      </section>
    </main>
  );
}
