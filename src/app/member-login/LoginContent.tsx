"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Check, Download, KeyRound, Loader2, Lock, Mail, Phone, UserRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { MembershipJourneyNav } from "@/components/MembershipWelcome";

export function LoginContent() {
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, firstName, lastName, phone }),
        });
        const result = await response.json();
        if (!response.ok || result.error) throw new Error(result.error || "Erreur lors de l'inscription");
        setSuccess(true);
        return;
      }

      const response = await fetch("/api/auth/verify-member-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: accessCode }),
      });
      const result = await response.json();
      if (!response.ok || !result.url) throw new Error(result.error || "Code invalide");
      window.location.href = result.url;
    } catch (caughtError: unknown) {
      setError(caughtError instanceof Error ? caughtError.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6 pt-20">
        <div className="max-w-lg space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Inscription réussie</h1>
          <p className="text-neutral-500">
            Confirmez votre adresse email, puis poursuivez vers le paiement pour activer votre carte membre.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50/30 to-white px-4 pb-16 pt-28">
      <div className={`w-full space-y-8 ${isRegister ? "max-w-xl" : "max-w-md"}`}>
        <MembershipJourneyNav active={isRegister ? "join" : "login"} />

        <Card className="space-y-6 border-emerald-100/50 p-7 shadow-xl shadow-emerald-500/5 sm:p-8">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
              {isRegister ? <UserRound className="h-7 w-7 text-emerald-500" /> : <KeyRound className="h-7 w-7 text-emerald-500" />}
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {isRegister ? "Je deviens membre" : "J’ai déjà un compte"}
            </h1>
            <p className="text-sm text-neutral-500">
              {isRegister
                ? "Renseignez vos informations pour créer votre compte avant le paiement."
                : "Saisissez simplement le code personnel reçu après votre paiement."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm font-medium text-neutral-600">
                    <span>Prénom</span>
                    <span className="relative block">
                      <UserRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                      <input value={firstName} onChange={(event) => setFirstName(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500" required minLength={2} autoComplete="given-name" />
                    </span>
                  </label>
                  <label className="space-y-2 text-sm font-medium text-neutral-600">
                    <span>Nom</span>
                    <input value={lastName} onChange={(event) => setLastName(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 focus:ring-2 focus:ring-emerald-500" required minLength={2} autoComplete="family-name" />
                  </label>
                </div>
                <label className="space-y-2 text-sm font-medium text-neutral-600">
                  <span>Email</span>
                  <span className="relative block">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500" required autoComplete="email" />
                  </span>
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-600">
                  <span>Téléphone</span>
                  <span className="relative block">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500" required minLength={6} autoComplete="tel" />
                  </span>
                </label>
                <label className="space-y-2 text-sm font-medium text-neutral-600">
                  <span>Mot de passe</span>
                  <span className="relative block">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="12 caractères minimum" className="h-12 w-full rounded-xl border border-neutral-200 pl-10 pr-4 focus:ring-2 focus:ring-emerald-500" required minLength={12} autoComplete="new-password" />
                  </span>
                </label>
              </>
            ) : (
              <label className="space-y-2 text-sm font-medium text-neutral-600">
                <span>Code d’accès</span>
                <span className="relative block">
                  <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    value={accessCode}
                    onChange={(event) => setAccessCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 21))}
                    placeholder="LV-XXXX-XXXX-XXXX-XXXX"
                    className="h-14 w-full rounded-xl border border-neutral-200 pl-10 pr-4 text-center text-base font-semibold tracking-[0.12em] focus:ring-2 focus:ring-emerald-500"
                    required
                    autoCapitalize="characters"
                    autoComplete="one-time-code"
                    autoFocus
                  />
                </span>
              </label>
            )}

            {error && (
              <p className="flex items-center gap-1.5 text-xs text-red-500" role="alert">
                <AlertCircle className="h-3.5 w-3.5" /> {error}
              </p>
            )}

            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full gap-2 text-base"
              disabled={loading || (isRegister ? !email || !password || !firstName || !lastName || !phone : accessCode.replace(/[^A-Z0-9]/g, "").length < 18)}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {isRegister ? "Créer mon compte" : "Accéder à mon espace"}
            </Button>
          </form>

          {!isRegister && (
            <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-left">
              <Download className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <p className="text-xs leading-relaxed text-emerald-800">
                Une fois connecté, vous pourrez installer l&apos;application Label Vanlife directement depuis votre espace membre.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
