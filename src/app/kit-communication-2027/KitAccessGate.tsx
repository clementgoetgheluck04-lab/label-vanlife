"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Loader2, LockKeyhole, Mail } from "lucide-react";

export default function KitAccessGate({ invalidLink = false }: { invalidLink?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/kit-communication/access/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("request_failed");
      setSent(true);
    } catch {
      setError("Impossible d’envoyer le lien pour le moment. Réessayez dans quelques instants.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#eef1eb] px-4 py-12 text-[#20332b]">
      <section className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-emerald-950/10">
        <div className="bg-[#173e32] px-7 py-8 text-white sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7c39a]">Accès réservé aux partenaires</p>
          <h1 className="mt-3 text-3xl font-bold">Kit Label Vanlife 2027</h1>
          <p className="mt-3 leading-relaxed text-white/75">Les fichiers sont exclusivement réservés aux établissements labellisés.</p>
        </div>
        <div className="p-7 sm:p-10">
          {sent ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-700" />
              <h2 className="mt-5 text-2xl font-bold">Consultez votre boîte mail</h2>
              <p className="mt-3 leading-relaxed text-neutral-600">
                Si cette adresse correspond à un lieu labellisé, un lien personnel valable 15 minutes vient d’être envoyé.
              </p>
              <button type="button" onClick={() => setSent(false)} className="mt-6 text-sm font-bold text-emerald-800 hover:underline">
                Utiliser une autre adresse
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-bold">Vérifiez votre adresse professionnelle</h2>
              <p className="mt-3 leading-relaxed text-neutral-600">
                Saisissez l’adresse e-mail enregistrée pour votre établissement. Vous recevrez un lien d’accès sécurisé.
              </p>
              {invalidLink && <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">Ce lien a expiré ou n’est plus valide. Demandez-en un nouveau.</p>}
              <label htmlFor="kit-email" className="mt-6 block text-sm font-bold text-neutral-800">E-mail professionnel</label>
              <div className="mt-2 flex items-center rounded-2xl border border-neutral-200 bg-white px-4 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-100">
                <Mail className="h-5 w-5 shrink-0 text-neutral-400" />
                <input
                  id="kit-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="contact@votre-lieu.fr"
                  className="w-full bg-transparent px-3 py-4 outline-none"
                />
              </div>
              {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
              <button disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#173e32] px-6 py-4 font-bold text-white transition hover:bg-[#245645] disabled:cursor-wait disabled:opacity-70">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mail className="h-5 w-5" />}
                Recevoir mon lien sécurisé
              </button>
              <p className="mt-5 text-center text-xs leading-relaxed text-neutral-500">L’adresse saisie n’est utilisée que pour vérifier votre accès partenaire.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
