"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MailX } from "lucide-react";
import { CONTACT_EMAIL } from "@/config/contact";

export function UnsubscribeForm({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  const unsubscribe = async () => {
    setState("loading");
    const response = await fetch("/api/prospection/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    setState(response.ok ? "done" : "error");
  };

  if (state === "done") return (
    <div className="text-center">
      <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-600" />
      <h1 className="mt-5 text-3xl font-bold text-neutral-950">C’est bien enregistré</h1>
      <p className="mx-auto mt-3 max-w-md text-neutral-600">Cette adresse ne recevra plus aucun message de prospection Label Vanlife.</p>
      <Link href="/" className="mt-7 inline-flex rounded-full bg-neutral-950 px-6 py-3 text-sm font-bold text-white">Retour à l’accueil</Link>
    </div>
  );

  return (
    <div className="text-center">
      <MailX className="mx-auto h-14 w-14 text-[#bd9462]" />
      <p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-emerald-700">Préférences de contact</p>
      <h1 className="mt-2 text-3xl font-bold text-neutral-950">Ne plus recevoir nos messages</h1>
      <p className="mx-auto mt-4 max-w-lg leading-7 text-neutral-600">La désinscription est immédiate et gratuite. Votre adresse sera placée sur notre liste d’opposition afin qu’elle ne soit pas réimportée lors d’une prochaine recherche.</p>
      <button type="button" onClick={unsubscribe} disabled={!token || state === "loading"} className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-neutral-950 px-7 text-sm font-bold text-white disabled:opacity-50">
        {state === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
        Confirmer la désinscription
      </button>
      {state === "error" && <p role="alert" className="mt-4 text-sm font-semibold text-red-700">Le lien est invalide ou a expiré. Écrivez-nous à {CONTACT_EMAIL}.</p>}
    </div>
  );
}
