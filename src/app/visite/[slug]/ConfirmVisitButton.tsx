"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2, Stamp } from "lucide-react";

export default function ConfirmVisitButton({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "created" | "existing" | "error">("idle");
  const [error, setError] = useState("");

  async function confirm() {
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/member/passport/stamp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ token }),
      });
      const result = await response.json() as { created?: boolean; error?: string };
      if (!response.ok) throw new Error(result.error || "La visite n’a pas pu être confirmée.");
      setState(result.created ? "created" : "existing");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "La visite n’a pas pu être confirmée.");
      setState("error");
    }
  }

  if (state === "created" || state === "existing") {
    return <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center"><CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" /><p className="mt-3 font-bold text-emerald-950">{state === "created" ? "Visite ajoutée au Passeport" : "Cette visite est déjà dans votre Passeport"}</p>{state === "created" ? <p className="mt-1 text-sm text-emerald-800">Vous gagnez 25 points pour cette première confirmation.</p> : null}<Link href="/member/passeport" className="mt-4 inline-flex font-bold text-emerald-900 underline">Voir mon Passeport</Link></div>;
  }

  return <div><button type="button" onClick={confirm} disabled={state === "loading"} className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#173e32] px-6 font-bold text-white transition hover:bg-[#245645] disabled:cursor-wait disabled:opacity-70">{state === "loading" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Stamp className="h-5 w-5" />}Confirmer ma visite</button>{error ? <p className="mt-3 text-center text-sm font-medium text-red-700">{error}</p> : null}</div>;
}
