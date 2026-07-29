"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertCircle, ArrowRight, Check, Download, KeyRound, Loader2, Lock, Mail, Phone, Plus, UserRound, Users, X } from "lucide-react";
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
  const [age, setAge] = useState("");
  const [companions, setCompanions] = useState<Array<{ firstName: string; lastName: string; age: string }>>([]);
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryMessage, setRecoveryMessage] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [confirmationLoading, setConfirmationLoading] = useState(false);

  const updateCompanion = (index: number, patch: Partial<(typeof companions)[number]>) => {
    setCompanions((current) => current.map((companion, companionIndex) => companionIndex === index ? { ...companion, ...patch } : companion));
  };

  const handleConfirmationResend = async () => {
    setConfirmationLoading(true);
    setConfirmationMessage("");
    try {
      const response = await fetch("/api/auth/resend-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Envoi impossible");
      setConfirmationMessage(result.message);
    } catch (caughtError: unknown) {
      setConfirmationMessage(caughtError instanceof Error ? caughtError.message : "Envoi impossible");
    } finally {
      setConfirmationLoading(false);
    }
  };

  const handleCodeRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    setRecoveryLoading(true);
    setRecoveryMessage("");
    try {
      const response = await fetch("/api/auth/resend-member-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Envoi impossible");
      setRecoveryMessage(result.message);
    } catch (caughtError: unknown) {
      setRecoveryMessage(caughtError instanceof Error ? caughtError.message : "Envoi impossible");
    } finally {
      setRecoveryLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isRegister) {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            firstName,
            lastName,
            phone,
            age: Number(age),
            companions: companions.map((companion) => ({ ...companion, age: Number(companion.age) })),
          }),
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
        <div className="w-full max-w-lg space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Check className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Inscription réussie</h1>
          <p className="text-neutral-500">Un email vient d’être envoyé à <strong className="text-neutral-800">{email}</strong>.</p>
          <ol className="grid gap-3 text-left sm:grid-cols-3">
            {["Confirmez votre email", "Le paiement Stripe s’ouvre", "Votre carte est activée"].map((label, index) => (
              <li key={label} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm font-medium text-neutral-700">
                <span className="mb-2 grid h-7 w-7 place-items-center rounded-full bg-emerald-600 text-xs font-bold text-white">{index + 1}</span>
                {label}
              </li>
            ))}
          </ol>
          <p className="text-sm leading-relaxed text-neutral-500">Cliquez sur le lien reçu : vous reviendrez automatiquement vers le paiement sécurisé.</p>
          <Button type="button" variant="secondary-dark" className="w-full" onClick={handleConfirmationResend} disabled={confirmationLoading}>
            {confirmationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
            Renvoyer l’email de confirmation
          </Button>
          {confirmationMessage && <p className="text-xs text-neutral-500" role="status">{confirmationMessage}</p>}
          <p className="text-xs text-neutral-400">Pensez à vérifier vos courriers indésirables.</p>
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
                  <span>Âge du titulaire</span>
                  <input type="number" min={18} max={120} value={age} onChange={(event) => setAge(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 px-4 focus:ring-2 focus:ring-emerald-500" required inputMode="numeric" autoComplete="off" />
                </label>
                <div className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-neutral-800"><Users className="h-4 w-4 text-emerald-600" /> Accompagnants</p>
                      <p className="mt-1 text-xs leading-relaxed text-neutral-500">Ajoutez toutes les personnes qui apparaîtront sur la carte membre.</p>
                    </div>
                    <button type="button" onClick={() => setCompanions((current) => current.length < 7 ? [...current, { firstName: "", lastName: "", age: "" }] : current)} disabled={companions.length >= 7} className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-xl border border-emerald-200 bg-white px-3 text-xs font-semibold text-emerald-700 disabled:opacity-40">
                      <Plus className="h-4 w-4" /> Ajouter
                    </button>
                  </div>
                  {companions.length === 0 && <p className="rounded-xl bg-white p-3 text-xs text-neutral-400">Aucun accompagnant — la carte couvrira uniquement le titulaire.</p>}
                  {companions.map((companion, index) => (
                    <div key={index} className="relative grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-[1fr_1fr_90px]">
                      <button type="button" onClick={() => setCompanions((current) => current.filter((_, companionIndex) => companionIndex !== index))} aria-label={`Supprimer l’accompagnant ${index + 1}`} className="absolute -right-2 -top-2 grid h-8 w-8 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-500 shadow-sm"><X className="h-4 w-4" /></button>
                      <label className="space-y-1 text-xs font-medium text-neutral-600"><span>Prénom</span><input value={companion.firstName} onChange={(event) => updateCompanion(index, { firstName: event.target.value })} className="h-11 w-full rounded-lg border border-neutral-200 px-3" required minLength={2} /></label>
                      <label className="space-y-1 text-xs font-medium text-neutral-600"><span>Nom</span><input value={companion.lastName} onChange={(event) => updateCompanion(index, { lastName: event.target.value })} className="h-11 w-full rounded-lg border border-neutral-200 px-3" required minLength={2} /></label>
                      <label className="space-y-1 text-xs font-medium text-neutral-600"><span>Âge</span><input type="number" min={0} max={120} value={companion.age} onChange={(event) => updateCompanion(index, { age: event.target.value })} className="h-11 w-full rounded-lg border border-neutral-200 px-3" required inputMode="numeric" /></label>
                    </div>
                  ))}
                </div>
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
                    onChange={(event) => setAccessCode(event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "").slice(0, 22))}
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
              disabled={loading || (isRegister ? !email || !password || !firstName || !lastName || !phone || !age || companions.some((companion) => !companion.firstName || !companion.lastName || !companion.age) : accessCode.replace(/[^A-Z0-9]/g, "").length < 14)}
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              {isRegister ? "Créer mon compte" : "Accéder à mon espace"}
            </Button>
          </form>

          {!isRegister && (
            <>
              <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-left">
                <Download className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <p className="text-xs leading-relaxed text-emerald-800">
                  Une fois connecté, vous pourrez installer l&apos;application Label Vanlife directement depuis votre espace membre.
                </p>
              </div>

              <div className="text-center">
                <button type="button" onClick={() => setShowRecovery((value) => !value)} className="min-h-11 text-sm font-medium text-emerald-700 hover:text-emerald-800">
                  Je n&apos;ai plus mon code
                </button>
              </div>

              {showRecovery && (
                <form onSubmit={handleCodeRecovery} className="space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <label className="block space-y-2 text-left text-sm font-medium text-neutral-600">
                    <span>Email utilisé lors de l&apos;adhésion</span>
                    <input type="email" value={recoveryEmail} onChange={(event) => setRecoveryEmail(event.target.value)} className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 focus:ring-2 focus:ring-emerald-500" required autoComplete="email" />
                  </label>
                  <Button type="submit" variant="secondary-dark" className="w-full" disabled={recoveryLoading || !recoveryEmail}>
                    {recoveryLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Renvoyer mon code"}
                  </Button>
                  {recoveryMessage && <p className="text-xs leading-relaxed text-neutral-500" role="status">{recoveryMessage}</p>}
                  <p className="text-[11px] leading-relaxed text-neutral-400">
                    Le renvoi concerne uniquement une carte membre payée et encore active. Pensez à vérifier les dossiers indésirables et l&apos;adresse utilisée lors de l&apos;adhésion.
                  </p>
                </form>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
