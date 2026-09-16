"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function AdminLoginForm({ unauthorized }: { unauthorized: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Connexion momentanément indisponible.");
      setMessage(result.message);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Connexion momentanément indisponible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-emerald-50/40 to-white px-4 py-24">
      <Card className="w-full max-w-md space-y-6 border-emerald-100 p-7 shadow-xl shadow-emerald-950/5 sm:p-8">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-950 text-white">
            <LockKeyhole className="h-6 w-6" />
          </span>
          <p className="mt-5 text-xs font-black uppercase tracking-[.2em] text-emerald-700">Accès privé</p>
          <h1 className="mt-2 text-2xl font-black text-neutral-950">Administration Label Vanlife</h1>
          <p className="mt-3 text-sm leading-6 text-neutral-600">Recevez un lien de connexion à usage unique sur l’adresse de l’administrateur.</p>
        </div>

        {unauthorized && (
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p>La session actuellement ouverte est celle d’un membre et ne donne pas accès à l’administration. Elle sera fermée lors de cette connexion.</p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <label className="block space-y-2 text-sm font-semibold text-neutral-700">
            <span>Email administrateur</span>
            <span className="relative block">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-12 w-full rounded-xl border border-neutral-200 bg-white pl-11 pr-4 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                autoComplete="email"
                required
                autoFocus
              />
            </span>
          </label>
          <Button type="submit" variant="cta" size="lg" className="w-full gap-2" disabled={loading || !email}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
            Recevoir mon lien sécurisé
          </Button>
        </form>

        {message && <p className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-900" role="status"><ShieldCheck className="mr-2 inline h-5 w-5" />{message}</p>}
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-800" role="alert">{error}</p>}
        <p className="text-center text-xs leading-5 text-neutral-400">Aucun mot de passe n’est transmis par email. Le lien est temporaire et l’accès reste contrôlé par le rôle administrateur.</p>
      </Card>
    </main>
  );
}
