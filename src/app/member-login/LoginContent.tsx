"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Mail, Lock, ArrowRight, AlertCircle, Check, Compass, KeyRound, Loader2, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { isSafeRedirectPath } from "@/lib/urls";
import { MemberDigitalAccess } from "@/components/MemberDigitalAccess";
import { MembershipCardPreview, MembershipJourneyNav } from "@/components/MembershipWelcome";

type AuthMode = "login" | "register" | "code";

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<AuthMode>(requestedMode === "register" || requestedMode === "code" ? requestedMode : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "code") {
        const response = await fetch("/api/auth/verify-member-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: accessCode }),
        });
        const result = await response.json();
        if (!response.ok || !result.url) throw new Error(result.error || "Code invalide");
        window.location.href = result.url;
        return;
      } else if (mode === "login") {
        const normalizedEmail = email.trim().toLowerCase();
        const isPreviewEmail = normalizedEmail === "contact@labelvanlife.com" || normalizedEmail === "clement.goetgheluck@hotmail.fr";
        if (isPreviewEmail && password.trim().toUpperCase().startsWith("LV-")) {
          const response = await fetch("/api/auth/verify-member-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code: password }),
          });
          const result = await response.json();
          if (!response.ok || !result.url) throw new Error(result.error || "Code invalide");
          window.location.href = result.url;
          return;
        }
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName, phone }),
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error || "Erreur lors de l'inscription");
        
        setSuccess(true);
        setLoading(false);
        return;
      }

      const requestedRedirect = searchParams.get("redirect");
      const redirectTo = isSafeRedirectPath(requestedRedirect) ? requestedRedirect : "/member";
      setSuccess(true);
      setTimeout(() => router.push(redirectTo), 500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) { setError("Entre ton email d'abord"); return; }
    setError("");
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback?next=/member` },
    });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          {mode === "register" ? (
            <>
              <h2 className="text-2xl font-bold text-neutral-900">Inscription réussie !</h2>
              <p className="text-neutral-500 mt-2">Un email de confirmation t'a été envoyé. Après validation, reconnecte-toi : tu seras dirigé vers le paiement.</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-neutral-900">Connexion réussie !</h2>
              <p className="text-neutral-500 mt-2">Redirection...</p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center pt-28 pb-16 px-4">
      <div className="w-full max-w-6xl space-y-8">
        <MembershipJourneyNav active="login" />
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_28rem]">
        <div className="space-y-5">
          <MembershipCardPreview compact />
          <MemberDigitalAccess compact />
          <p className="px-2 text-center text-sm leading-relaxed text-neutral-500">Label Vanlife n'est pas une simple map à spots : chaque lieu est sélectionné, évalué et présenté avec les informations utiles à votre séjour.</p>
        </div>
        <Card className="p-8 space-y-6 border-emerald-100/50 shadow-xl shadow-emerald-500/5">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <Compass className="h-8 w-8 text-emerald-500" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              Espace membres <span className="text-emerald-500">Label Vanlife</span>
            </h1>
            <p className="text-sm text-neutral-500">
              {mode === "login"
                ? "Connecte-toi pour accéder à ta carte membre, à la map interactive et à tes favoris."
                : mode === "register"
                  ? "Renseigne tes informations. Après validation de ton email, tu pourras payer et activer ta carte."
                  : "Saisis le code à usage unique reçu après ton paiement."}
            </p>
          </div>

          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "login" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
            >Connexion</button>
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === "register" ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}
            >Inscription</button>
          </div>

          <button type="button" onClick={() => { setMode("code"); setError(""); }} className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${mode === "code" ? "border-[#c39960] bg-[#c39960]/10 text-[#7a5a35]" : "border-neutral-200 text-neutral-600 hover:border-[#c39960]"}`}>
            <KeyRound className="h-4 w-4" /> J'ai reçu mon code d'accès
          </button>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><label className="text-sm font-medium text-neutral-600 block">Prénom</label><div className="relative"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="w-full h-12 pl-10 pr-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" required minLength={2} autoComplete="given-name" /></div></div>
                <div className="space-y-2"><label className="text-sm font-medium text-neutral-600 block">Nom</label><input value={lastName} onChange={(event) => setLastName(event.target.value)} className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" required minLength={2} autoComplete="family-name" /></div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  placeholder="ton@email.com"
                  className="w-full h-12 pl-10 pr-4 text-base bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 text-neutral-900" required />
              </div>
            </div>
            {mode === "register" && <div className="space-y-2"><label className="text-sm font-medium text-neutral-600 block">Téléphone</label><div className="relative"><Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="w-full h-12 pl-10 pr-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" required minLength={6} autoComplete="tel" /></div></div>}
            {mode !== "code" ? <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-600 block">{mode === "login" ? "Mot de passe ou code d’accès" : "Mot de passe"}</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder={mode === "register" ? "12 caractères minimum" : "Mot de passe ou code LV-…"}
                  className="w-full h-12 pl-10 pr-4 text-base bg-white rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500 text-neutral-900" required minLength={mode === "register" ? 12 : 6} />
              </div>
            </div> : <div className="space-y-2"><label className="text-sm font-medium text-neutral-600 block">Code d'accès reçu par email</label><div className="relative"><KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" /><input value={accessCode} onChange={(event) => setAccessCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 19))} placeholder="1234-5678" className="w-full h-12 pl-10 pr-4 text-base tracking-[0.12em] rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" required autoCapitalize="characters" /></div><p className="text-xs text-neutral-400">Code membre à usage unique, ou code administrateur de prévisualisation en local.</p></div>}
            {error && <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertCircle className="h-3.5 w-3.5" />{error}</p>}
            <Button type="submit" variant="cta" size="lg" className="w-full gap-2 text-base" disabled={loading || !email || (mode === "code" ? !(accessCode.replace(/\D/g, "").length === 8 || (["contact@labelvanlife.com", "clement.goetgheluck@hotmail.fr"].includes(email.trim().toLowerCase()) && accessCode.length >= 12)) : !password) || (mode === "register" && (!firstName || !lastName || !phone))}>
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {mode === "login" ? "Se connecter" : mode === "register" ? "Créer mon compte" : "Accéder à mon espace"}
            </Button>
          </form>

          {mode !== "code" && <div className="text-center">
            <button onClick={handleMagicLink} disabled={loading}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50">
              Envoyer un lien magique par email
            </button>
          </div>}

          {mode === "login" && (
            <div className="text-center space-y-2 pt-2">
              <p className="text-sm text-neutral-500">Pas encore membre ?</p>
              <Link href="/devenir-membre">
                <Button variant="cta" size="sm" className="gap-1">
                  Devenir membre — 29 € cette année au lieu de 39 €
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
        </div>
      </div>
    </div>
  );
}
