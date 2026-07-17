"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Building2, Check, ClipboardCheck, FileText, Loader2, Percent, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LABELLISATION_CRITERIA } from "@/config/labellisation-criteria";
import { getSpottedPlace } from "@/data/spotted-places";

const STEPS = [
  { title: "Contact", icon: Building2 },
  { title: "Accueil & engagement", icon: ClipboardCheck },
  { title: "Réduction", icon: Percent },
  { title: "Fiche", icon: FileText },
] as const;

const PLACE_TYPES = [
  ["CAMPING", "Camping"], ["CAMPING_FERME", "Ferme / camping à la ferme"],
  ["HEBERGEMENT_INSOLITE", "Hébergement insolite"], ["PARKING", "Aire ou parking"],
  ["ETAPE_NATURE", "Étape nature"], ["RESTAURANT", "Restaurant ou domaine"],
  ["ACTIVITE", "Activité touristique"],
] as const;

type CriterionAnswer = { status: "yes" | "no" | ""; examples: string[]; detail: string };

function scrollToTopImmediately() {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  window.scrollTo({ top: 0, left: 0 });
  root.style.scrollBehavior = previousBehavior;
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(normalizeWebsite(value));
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".");
  } catch {
    return false;
  }
}

const initialCriteria = Object.fromEntries(
  LABELLISATION_CRITERIA.map((criterion) => [criterion.id, { status: "", examples: [], detail: "" }]),
) as Record<string, CriterionAnswer>;

const initialForm = {
  establishmentName: "", placeType: "CAMPING", address: "", postalCode: "", city: "", region: "",
  website: "", facebook: "", contactName: "", jobTitle: "", email: "", phone: "", siret: "",
  operatingAuthorization: false, followFacebook: false, comments: "",
  criteria: initialCriteria, planFileName: "", welcomeMessage: "",
  hasParityClause: false, publicPrice: "", minimumAllowedPrice: "",
  discountPercent: "15", reservationModes: [] as string[], promoCode: "", discountConditions: "",
  totalPitches: "", couplePitchNumbers: "", familyPitchNumbers: "", bookingUrl: "", bookingSoftware: "", bookingChannelManager: "",
  activities: "", discoveryUrl: "", foodOptions: "", practicalInfo: "", photoFileNames: [] as string[],
  description: "", motivation: "", acceptCharter: false,
};

export default function CandidaturePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [planError, setPlanError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [form, setForm] = useState(initialForm);
  const [progressRestored, setProgressRestored] = useState(false);
  const [showCharterDetails, setShowCharterDetails] = useState(false);
  const [claimedPlaceName, setClaimedPlaceName] = useState("");
  const update = (patch: Partial<typeof form>) => setForm((current) => ({ ...current, ...patch }));

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const saved = localStorage.getItem("labellisation-form-progress");
      let restored: Partial<typeof initialForm> = {};
      if (saved) {
        try {
          restored = JSON.parse(saved) as Partial<typeof initialForm>;
        } catch {
          localStorage.removeItem("labellisation-form-progress");
        }
      }
      const claimId = new URLSearchParams(window.location.search).get("claim");
      const claimedPlace = claimId ? getSpottedPlace(claimId) : undefined;
      const claimPrefill: Partial<typeof initialForm> = claimedPlace ? {
        establishmentName: claimedPlace.name,
        address: claimedPlace.address,
        postalCode: claimedPlace.postalCode,
        city: claimedPlace.city,
        region: claimedPlace.region,
        website: claimedPlace.website || "",
      } : {};
      if (claimedPlace) setClaimedPlaceName(claimedPlace.name);
      setForm((current) => ({
        ...current,
        ...restored,
        ...claimPrefill,
        criteria: { ...initialCriteria, ...(restored.criteria || {}) },
        planFileName: "",
        photoFileNames: [],
      }));
      setProgressRestored(true);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (progressRestored) localStorage.setItem("labellisation-form-progress", JSON.stringify(form));
  }, [form, progressRestored]);

  useEffect(() => {
    const timeout = window.setTimeout(scrollToTopImmediately, 0);
    return () => window.clearTimeout(timeout);
  }, [step]);

  const setCriterion = (id: string, patch: Partial<CriterionAnswer>) => update({
    criteria: { ...form.criteria, [id]: { ...form.criteria[id], ...patch } },
  });
  const toggleExample = (id: string, example: string) => {
    const answer = form.criteria[id];
    setCriterion(id, {
      status: "yes",
      examples: answer.examples.includes(example) ? answer.examples.filter((item) => item !== example) : [...answer.examples, example],
    });
  };
  const toggleReservation = (mode: string) => update({
    reservationModes: form.reservationModes.includes(mode)
      ? form.reservationModes.filter((item) => item !== mode)
      : [...form.reservationModes, mode],
  });

  const answeredCriteria = Object.values(form.criteria).filter((answer) => answer.status).length;
  const publicPrice = Number(form.publicPrice);
  const minimumAllowedPrice = Number(form.minimumAllowedPrice);
  const parityMaximum = form.hasParityClause && publicPrice > 0 && minimumAllowedPrice >= 0 && minimumAllowedPrice <= publicPrice
    ? Math.floor(((publicPrice - minimumAllowedPrice) / publicPrice) * 100)
    : null;
  const discountIsParitySafe = parityMaximum === null || Number(form.discountPercent) <= parityMaximum;
  const canContinue = [
    Boolean(form.establishmentName.trim() && form.address.trim() && form.postalCode.trim() && form.city.trim() && isValidWebsite(form.website) && form.contactName.trim() && form.email.includes("@") && /^\d{14}$/.test(form.siret.replace(/\s/g, ""))),
    answeredCriteria === LABELLISATION_CRITERIA.length && Boolean(form.planFileName) && form.welcomeMessage.trim().length >= 20,
    form.reservationModes.length > 0 && Number(form.discountPercent) >= 10 && Number(form.discountPercent) <= 20 && discountIsParitySafe && (!form.hasParityClause || parityMaximum !== null),
    Boolean(Number(form.totalPitches) > 0 && photoFiles.length >= 1 && photoFiles.length <= 3 && form.acceptCharter),
  ][step];

  const missingMessage = [
    "Renseignez le nom, l'adresse, la ville, un site internet valide, le contact, l'email et le SIRET à 14 chiffres.",
    `Renseignez les ${LABELLISATION_CRITERIA.length} critères, ajoutez le plan et décrivez votre accueil en au moins 20 caractères.`,
    "Choisissez un mode de réservation et une réduction valide entre 10 % et 20 % compatible avec votre éventuelle clause de parité.",
    "Indiquez le nombre d'emplacements, ajoutez au moins une photo et acceptez la charte Label Vanlife.",
  ][step];

  const next = () => {
    if (!canContinue) return;
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const handlePreAudit = async () => {
    if (!canContinue) return;
    setLoading(true);
    setSubmitError("");
    try {
      if (!planFile || photoFiles.length < 1) throw new Error("Le plan et au moins une photo sont obligatoires.");
      const draft = {
        ...form,
        capacity: Number(form.totalPitches),
        services: [],
        description: form.welcomeMessage,
        motivation: form.welcomeMessage,
        planFileName: planFile.name,
        photoFileNames: photoFiles.map((file) => file.name),
      };
      const body = new FormData();
      body.append("payload", JSON.stringify(draft));
      body.append("plan", planFile);
      photoFiles.forEach((file) => body.append("photos", file));
      const response = await fetch("/api/labellisation/submit-draft", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Impossible d'envoyer la candidature.");
      const finalizedDraft = { ...draft, draftId: result.draftId, attachmentPaths: result.attachmentPaths };
      localStorage.setItem("labellisation-draft", JSON.stringify(finalizedDraft));
      localStorage.removeItem("labellisation-form-progress");
      sessionStorage.setItem("labellisation-confirmation", JSON.stringify({ establishmentName: form.establishmentName, email: form.email, draftId: result.draftId }));
      const checkoutResponse = await fetch("/api/stripe/checkout-labellisation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalizedDraft),
      });
      const checkoutResult = await checkoutResponse.json();
      if (!checkoutResponse.ok || !checkoutResult.url) {
        router.push("/labellisation/paiement?checkout=retry");
        return;
      }
      window.location.href = checkoutResult.url;
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Impossible d'envoyer la candidature.");
      setLoading(false);
    }
  };

  const fieldClass = "mt-2 h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 outline-none transition focus:border-[#c39960] focus:ring-2 focus:ring-[#c39960]/25";
  const textareaClass = "mt-2 w-full resize-y rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 outline-none transition focus:border-[#c39960] focus:ring-2 focus:ring-[#c39960]/25";

  return (
    <main id="candidature-top" className="min-h-screen bg-gradient-to-b from-[#f7f1e8] to-white px-4 pb-20 pt-24">
      <div className="mx-auto max-w-4xl space-y-8">
        {claimedPlaceName && (
          <div className="rounded-2xl border border-[#c39960]/35 bg-[#f7f1e8] p-4 text-sm text-neutral-700">
            <strong className="text-neutral-950">Revendication de fiche :</strong> les informations connues pour « {claimedPlaceName} » ont été préremplies. Vérifiez-les avant de continuer.
          </div>
        )}
        <Link href="/labellisation" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900"><ArrowLeft className="h-4 w-4" /> Retour à la labellisation</Link>
        <header className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7445]">Candidature partenaire</p>
          <h1 className="mt-3 text-3xl font-bold text-neutral-900 sm:text-4xl">Devenir un lieu Label Vanlife</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">Un dossier complet nous permet d'évaluer votre accueil et de créer une fiche vraiment utile aux membres.</p>
        </header>

        <div className="grid grid-cols-4 gap-2" aria-label={`Étape ${step + 1} sur ${STEPS.length}`}>
          {STEPS.map((item, index) => { const Icon = item.icon; const active = index === step; const done = index < step; return (
            <div key={item.title} className="text-center">
              <div className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${done || active ? "bg-[#c39960] text-white" : "bg-neutral-100 text-neutral-400"}`}>{done ? <Check className="h-5 w-5" /> : <Icon className="h-5 w-5" />}</div>
              <p className={`mt-2 text-[11px] sm:text-xs ${active ? "font-semibold text-[#8b673d]" : "text-neutral-400"}`}>{item.title}</p>
            </div>
          ); })}
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-[#c39960] transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} /></div>

        <Card className="border-[#c39960]/20 p-6 shadow-lg shadow-[#c39960]/5 sm:p-8">
          {step === 0 && <section className="space-y-5">
            <div><h2 className="text-2xl font-bold text-neutral-900">Vos informations</h2><p className="mt-1 text-sm text-neutral-500">Les champs marqués d'un astérisque sont nécessaires à l'étude du dossier.</p></div>
            <label className="block text-sm font-medium text-neutral-700">Nom du lieu *<input autoComplete="organization" className={fieldClass} value={form.establishmentName} onChange={(e) => update({ establishmentName: e.target.value })} placeholder="Ex : Camping de la Vallée Verte" /></label>
            <label className="block text-sm font-medium text-neutral-700">Adresse complète *<input autoComplete="street-address" className={fieldClass} value={form.address} onChange={(e) => update({ address: e.target.value })} placeholder="Numéro, rue ou lieu-dit" /></label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-neutral-700">Code postal *<input autoComplete="postal-code" className={fieldClass} inputMode="numeric" value={form.postalCode} onChange={(e) => update({ postalCode: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Ville *<input autoComplete="address-level2" className={fieldClass} value={form.city} onChange={(e) => update({ city: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Région<input autoComplete="address-level1" className={fieldClass} value={form.region} onChange={(e) => update({ region: e.target.value })} /></label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700">Type de lieu *<select className={fieldClass} value={form.placeType} onChange={(e) => update({ placeType: e.target.value })}>{PLACE_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
              <label className="block text-sm font-medium text-neutral-700">Site internet *<input type="text" inputMode="url" autoComplete="url" required className={fieldClass} value={form.website} onChange={(e) => update({ website: e.target.value })} onBlur={(e) => update({ website: normalizeWebsite(e.target.value) })} placeholder="www.votrelieu.fr" /></label>
              <label className="block text-sm font-medium text-neutral-700">Page Facebook<input type="url" className={fieldClass} value={form.facebook} onChange={(e) => update({ facebook: e.target.value })} placeholder="https://facebook.com/..." /></label>
              <label className="block text-sm font-medium text-neutral-700">Prénom et nom *<input autoComplete="name" className={fieldClass} value={form.contactName} onChange={(e) => update({ contactName: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Poste / Fonction<input className={fieldClass} value={form.jobTitle} onChange={(e) => update({ jobTitle: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Email *<input type="email" autoComplete="email" className={fieldClass} value={form.email} onChange={(e) => update({ email: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Téléphone<input type="tel" autoComplete="tel" className={fieldClass} value={form.phone} onChange={(e) => update({ phone: e.target.value })} /></label>
              <label className="block text-sm font-medium text-neutral-700">Numéro SIRET *<input className={fieldClass} inputMode="numeric" maxLength={17} value={form.siret} onChange={(e) => update({ siret: e.target.value })} placeholder="14 chiffres" /></label>
            </div>
            <label className="flex gap-3 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600"><input type="checkbox" className="mt-0.5 accent-[#c39960]" checked={form.operatingAuthorization} onChange={(e) => update({ operatingAuthorization: e.target.checked })} /> Je confirme disposer des autorisations nécessaires à l'exploitation de mon établissement.</label>
            <label className="flex gap-3 rounded-xl border border-neutral-200 p-4 text-sm text-neutral-600"><input type="checkbox" className="mt-0.5 accent-[#c39960]" checked={form.followFacebook} onChange={(e) => update({ followFacebook: e.target.checked })} /> Je suis ou souhaite suivre la page Facebook Label Vanlife.</label>
            <label className="block text-sm font-medium text-neutral-700">Commentaires ou informations complémentaires<textarea rows={3} className={textareaClass} value={form.comments} onChange={(e) => update({ comments: e.target.value })} /></label>
          </section>}

          {step === 1 && <section className="space-y-6">
            <div><h2 className="text-2xl font-bold text-neutral-900">Auto-évaluation Label Vanlife</h2><p className="mt-1 text-sm text-neutral-500">Cochez ce que vous proposez — ou Non si ce n'est pas le cas.</p><div className="mt-4 flex items-center justify-between rounded-xl bg-[#f7f1e8] px-4 py-3"><span className="text-2xl font-bold text-[#8b673d]">{answeredCriteria}/{LABELLISATION_CRITERIA.length}</span><span className="text-sm text-neutral-600">renseignés</span></div></div>
            {LABELLISATION_CRITERIA.map((criterion, index) => { const answer = form.criteria[criterion.id]; const showCategory = index === 0 || LABELLISATION_CRITERIA[index - 1].category !== criterion.category; return (
              <div key={criterion.id} className="space-y-4">
                {showCategory && <h3 className="flex items-center gap-3 border-b border-[#c39960]/25 pb-3 pt-3 text-lg font-bold text-neutral-900"><span aria-hidden="true">{criterion.category === "Accueil chaleureux" ? "👋" : criterion.category === "Respect de l'environnement" ? "🌿" : criterion.category === "Qualité & confort" ? "✨" : criterion.category === "Sécurité & tranquillité" ? "🛡️" : "🤝"}</span>{criterion.category}</h3>}
              <fieldset className="rounded-2xl border border-neutral-200 p-5">
                <legend className="px-2 text-sm font-bold text-neutral-900"><span aria-hidden="true">{criterion.emoji}</span> {criterion.title}</legend>
                <p className="mb-4 text-sm text-neutral-500">{criterion.description}</p>
                <div className="flex flex-wrap gap-2">
                  {criterion.examples.map((example) => <button key={example} type="button" onClick={() => toggleExample(criterion.id, example)} className={`rounded-full border px-3 py-2 text-xs transition ${answer.examples.includes(example) ? "border-[#c39960] bg-[#f7f1e8] text-[#7c5a34]" : "border-neutral-200 text-neutral-600 hover:border-[#c39960]"}`}>{answer.examples.includes(example) && "✓ "}{example}</button>)}
                  <button type="button" onClick={() => setCriterion(criterion.id, { status: "no", examples: [], detail: "" })} className={`rounded-full border px-3 py-2 text-xs ${answer.status === "no" ? "border-neutral-700 bg-neutral-800 text-white" : "border-neutral-200 text-neutral-600"}`}>Non</button>
                </div>
                {answer.status !== "no" && <input className={`${fieldClass} h-11`} value={answer.detail} onFocus={() => setCriterion(criterion.id, { status: "yes" })} onChange={(e) => setCriterion(criterion.id, { status: "yes", detail: e.target.value })} placeholder="+ Autres" />}
              </fieldset>
              </div>
            ); })}
            <label className="block text-sm font-medium text-neutral-700">Plan de votre établissement <span className="text-red-500">— Obligatoire</span><span className="mt-1 block font-normal text-neutral-500">Partagez le plan de votre établissement pour aider les vanlifers à s'orienter.</span><span className="mt-3 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c39960]/40 bg-[#f7f1e8]/50 p-4 text-[#8b673d]"><Upload className="h-6 w-6" /><strong>{form.planFileName || "Cliquez pour télécharger"}</strong><small>Image ou PDF (max 10MB)</small></span><input className="sr-only" type="file" accept="image/jpeg,image/png,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file && file.size > 10 * 1024 * 1024) { setPlanError("Le fichier dépasse la limite de 10MB."); setPlanFile(null); update({ planFileName: "" }); } else { setPlanError(""); setPlanFile(file || null); update({ planFileName: file?.name || "" }); } }} /></label>
            {planError && <p role="alert" className="text-sm font-medium text-red-600">{planError}</p>}
            <label className="block text-sm font-medium text-neutral-700">Pourquoi souhaitez-vous accueillir des vanlifers ? Qu'est-ce qui rend votre lieu spécial ? *<textarea rows={5} className={textareaClass} value={form.welcomeMessage} onChange={(e) => update({ welcomeMessage: e.target.value })} placeholder="Ex : Nous proposons 5 emplacements au calme en bordure de rivière, à l'ombre des chênes. Les vanlifers apprécient notre accueil familial et nos produits du jardin..." /></label>
            <div className="flex flex-wrap gap-2">{["Calme assuré", "Proche rivière", "Vue montagne", "Produits locaux", "Animaux acceptés", "Électricité", "Wifi", "Point d'eau"].map((suggestion) => <button type="button" key={suggestion} onClick={() => update({ welcomeMessage: `${form.welcomeMessage}${form.welcomeMessage.trim() ? " · " : ""}${suggestion}` })} className="rounded-full border border-[#c39960]/40 bg-white px-3 py-2 text-xs font-medium text-[#7c5a34] hover:bg-[#f7f1e8]">+ {suggestion}</button>)}</div>
            <div className="rounded-xl bg-neutral-50 p-4 text-sm text-neutral-600"><p className="font-semibold">Progression : {answeredCriteria}/{LABELLISATION_CRITERIA.length} critères renseignés</p><p className="mt-1">Pour chaque critère : sélectionnez ce que vous proposez, ou cliquez Non.</p></div>
          </section>}

          {step === 2 && <section className="space-y-6">
            <div><h2 className="text-2xl font-bold text-neutral-900">Réduction membres</h2><p className="mt-1 text-sm text-neutral-500">Choisissez la réduction que vous offrirez aux détenteurs de la carte Label Vanlife.</p></div>

            <div className="rounded-2xl border border-[#c39960]/30 bg-[#f7f1e8]/60 p-5 sm:p-6">
              <h3 className="font-bold text-neutral-900">Vous avez une clause de parité tarifaire ?</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">Si votre contrat avec un partenaire commercial vous interdit de vendre en dessous d'un certain tarif, ce simulateur vous aide à trouver la réduction maximale que vous pouvez accorder aux membres Label Vanlife sans enfreindre votre clause.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button type="button" onClick={() => update({ hasParityClause: true })} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${form.hasParityClause ? "border-[#c39960] bg-[#c39960] text-white" : "border-neutral-200 bg-white text-neutral-600"}`}>Oui</button>
                <button type="button" onClick={() => update({ hasParityClause: false, publicPrice: "", minimumAllowedPrice: "" })} className={`rounded-xl border px-4 py-3 text-sm font-semibold ${!form.hasParityClause ? "border-[#c39960] bg-[#c39960] text-white" : "border-neutral-200 bg-white text-neutral-600"}`}>Non</button>
              </div>
              {form.hasParityClause && <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-neutral-700">Votre tarif public (€)<input type="number" min="0" step="0.01" className={fieldClass} value={form.publicPrice} onChange={(e) => update({ publicPrice: e.target.value })} placeholder="Ex : 35" /></label>
                  <label className="block text-sm font-medium text-neutral-700">Tarif minimum autorisé (€)<input type="number" min="0" step="0.01" className={fieldClass} value={form.minimumAllowedPrice} onChange={(e) => update({ minimumAllowedPrice: e.target.value })} placeholder="Ex : 19" /></label>
                </div>
                {parityMaximum !== null && <div className={`rounded-xl p-4 text-sm ${parityMaximum >= 10 ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}><strong>Réduction maximale calculée : {parityMaximum}%</strong><p className="mt-1">{parityMaximum >= 10 ? `Vous pouvez sélectionner jusqu'à ${Math.min(20, parityMaximum)}% ci-dessous.` : "La marge disponible est inférieure au minimum de 10%. Contactez-nous pour étudier votre situation."}</p></div>}
              </div>}
            </div>

            <fieldset><legend className="text-sm font-bold text-neutral-900">Réduction accordée aux membres *</legend><p className="mt-1 text-sm text-neutral-500">Entre 10% et 20% — choisissez ce qui correspond à votre situation.</p><div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6">{Array.from({ length: 11 }, (_, i) => i + 10).map((value) => { const unavailable = parityMaximum !== null && value > parityMaximum; return <button type="button" key={value} disabled={unavailable} onClick={() => update({ discountPercent: String(value) })} className={`rounded-xl border py-3 text-sm font-semibold ${Number(form.discountPercent) === value && !unavailable ? "border-[#c39960] bg-[#c39960] text-white" : unavailable ? "cursor-not-allowed border-neutral-100 bg-neutral-100 text-neutral-300 line-through" : "border-neutral-200 text-neutral-600"}`}>{value} %</button>; })}</div></fieldset>

            <fieldset><legend className="text-sm font-bold text-neutral-900">Comment les membres peuvent-ils réserver ? *</legend><p className="mt-1 text-sm text-neutral-500">Cochez toutes les options disponibles.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{[["online", "En ligne sur votre site"], ["email", "Par email"], ["phone", "Par téléphone"], ["onsite", "Directement sur place"]].map(([value, label]) => <label key={value} className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm text-neutral-700 ${form.reservationModes.includes(value) ? "border-[#c39960] bg-[#f7f1e8]/60" : "border-neutral-200"}`}><input type="checkbox" className="h-4 w-4 accent-[#c39960]" checked={form.reservationModes.includes(value)} onChange={() => toggleReservation(value)} />{label}</label>)}</div></fieldset>

            <label className="block text-sm font-bold text-neutral-900">Code promo pour la réservation en ligne <span className="font-normal text-neutral-400">(facultatif)</span><span className="mt-1 block font-normal text-neutral-500">Si vous avez un code promo qui applique automatiquement la réduction pour les réservations en ligne.</span><input className={fieldClass} value={form.promoCode} onChange={(e) => update({ promoCode: e.target.value.toUpperCase() })} placeholder="Ex : LABELVANLIFE15" /></label>
            <label className="block text-sm font-bold text-neutral-900">Précisions complémentaires <span className="font-normal text-neutral-400">(facultatif)</span><textarea rows={4} className={textareaClass} value={form.discountConditions} onChange={(e) => update({ discountConditions: e.target.value })} placeholder="Périodes, hébergements concernés, durée minimale..." /></label>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
              <h3 className="font-bold">Conditions d'application de la réduction</h3>
              <ul className="mt-3 space-y-3 leading-relaxed">
                <li className="flex gap-3"><span aria-hidden="true">•</span><span>La réduction s'applique <strong>uniquement au moment du paiement</strong> sur présentation de la carte membre Label Vanlife.</span></li>
                <li className="flex gap-3"><span aria-hidden="true">•</span><span>Il appartient au lieu de <strong>vérifier que le membre possède bien une carte à jour</strong> avant d'appliquer la réduction.</span></li>
                <li className="flex gap-3"><span aria-hidden="true">•</span><span>Une carte expirée ou non valide ne donne droit à aucune réduction.</span></li>
              </ul>
            </div>
          </section>}

          {step === 3 && <section className="space-y-5">
            <div><h2 className="text-2xl font-bold text-neutral-900">Votre fiche établissement</h2><p className="mt-1 text-sm text-neutral-500">Ces informations apparaîtront sur votre fiche Label Vanlife.</p></div>

            <div className="rounded-2xl border border-neutral-200 p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-neutral-900">Photos vanlife</h3><span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700">Obligatoire</span></div>
              <p className="mt-2 text-sm text-neutral-500">Emplacements, vue, ambiance — au moins 1 photo est obligatoire, avec un maximum de 3 photos.</p>
              <label className="mt-4 block"><span className="flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#c39960]/40 bg-[#f7f1e8]/50 p-5 text-center text-[#8b673d]"><Upload className="h-6 w-6" /><strong>Glissez ou cliquez pour sélectionner 1 à 3 photos</strong><small>JPG, PNG — chaque photo est téléchargée une par une · max. 3 photos</small></span><input className="sr-only" type="file" accept="image/jpeg,image/png" onChange={(e) => { const file = e.target.files?.[0]; e.target.value = ""; if (!file) return; if (file.size > 10 * 1024 * 1024) { setSubmitError("Chaque photo doit faire moins de 10MB."); return; } setSubmitError(""); setPhotoFiles((current) => current.length >= 3 ? current : [...current, file]); update({ photoFileNames: photoFiles.length >= 3 ? form.photoFileNames : [...form.photoFileNames, file.name] }); }} /></label>
              {photoFiles.length > 0 && <div className="mt-3 space-y-2">{photoFiles.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600"><span className="truncate">{index + 1}. {file.name}</span><button type="button" aria-label={`Supprimer ${file.name}`} onClick={() => { setPhotoFiles((current) => current.filter((_, itemIndex) => itemIndex !== index)); update({ photoFileNames: form.photoFileNames.filter((_, itemIndex) => itemIndex !== index) }); }} className="ml-3 rounded-full p-1 text-neutral-400 hover:bg-red-50 hover:text-red-600"><X className="h-4 w-4" /></button></div>)}</div>}
            </div>

            <fieldset className="rounded-2xl border border-neutral-200 p-5 sm:p-6"><legend className="px-2 font-bold text-neutral-900">Emplacements</legend><div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm font-medium text-neutral-700">Nombre total d'emplacements *<input type="number" min="1" className={fieldClass} value={form.totalPitches} onChange={(e) => update({ totalPitches: e.target.value })} placeholder="Ex : 30" /></label>
              <label className="block text-sm font-medium text-neutral-700">Numéros adaptés aux couples<input className={fieldClass} value={form.couplePitchNumbers} onChange={(e) => update({ couplePitchNumbers: e.target.value })} placeholder="Ex : 5, 6, 12" /></label>
              <label className="block text-sm font-medium text-neutral-700">Numéros adaptés aux familles<input className={fieldClass} value={form.familyPitchNumbers} onChange={(e) => update({ familyPitchNumbers: e.target.value })} placeholder="Ex : 20, 21, 22" /></label>
            </div></fieldset>

            <fieldset className="rounded-2xl border border-neutral-200 p-5 sm:p-6"><legend className="px-2 font-bold text-neutral-900">Réservation</legend><p className="mb-4 text-sm text-neutral-500">URL vers laquelle les vanlifers seront dirigés pour réserver.</p><div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-neutral-700 sm:col-span-2">Lien de réservation<input type="url" className={fieldClass} value={form.bookingUrl} onChange={(e) => update({ bookingUrl: e.target.value })} placeholder="https://booking.votrelieu.com" /></label>
              <label className="block text-sm font-medium text-neutral-700">Logiciel de réservation<input className={fieldClass} value={form.bookingSoftware} onChange={(e) => update({ bookingSoftware: e.target.value })} placeholder="Ex : Camping.care, Eseason, Rentlio, Amenitiz, Bokun, autre…" /></label>
              <label className="block text-sm font-medium text-neutral-700">Channel manager / synchronisation<input className={fieldClass} value={form.bookingChannelManager} onChange={(e) => update({ bookingChannelManager: e.target.value })} placeholder="Ex : Camping.care, Eseason, aucun…" /></label>
            </div></fieldset>

            <div className="space-y-5">
              <label className="block text-sm font-bold text-neutral-900">Bons plans & activités à proximité <span className="ml-1 rounded-full bg-[#f7f1e8] px-2 py-1 text-[10px] uppercase tracking-wider text-[#8b673d]">Recommandé</span><span className="mt-2 block font-normal leading-relaxed text-neutral-500">Ce qui transforme une nuit en une vraie expérience — nom, description courte, lien si possible.</span><textarea rows={5} className={textareaClass} value={form.activities} onChange={(e) => update({ activities: e.target.value })} placeholder={'• Base nautique de Michel — catamaran sur le lac → www.basenautiquemichel.fr\n• Grotte des Merveilles — visite guidée spéléo, 2h, réservation conseillée\n• Marché du village tous les mardis — produits locaux, fromages, miel'} /></label>
              <label className="block text-sm font-medium text-neutral-700">Page « À découvrir »<input type="url" className={fieldClass} value={form.discoveryUrl} onChange={(e) => update({ discoveryUrl: e.target.value })} placeholder="https://www.votrecamping.fr/a-decouvrir" /></label>
              <label className="block text-sm font-bold text-neutral-900">🍽️ Restauration <span className="ml-1 rounded-full bg-[#f7f1e8] px-2 py-1 text-[10px] uppercase tracking-wider text-[#8b673d]">Recommandé</span><span className="mt-2 block font-normal text-neutral-500">Sur place ou à deux pas — donnez envie !</span><textarea rows={5} className={textareaClass} value={form.foodOptions} onChange={(e) => update({ foodOptions: e.target.value })} placeholder={'• Snack du camping — burgers, salades, glaces. Ouvert midi et soir en juillet-août.\n• Pizzeria Chez Marco (500m) — cuites au feu de bois. Ouvert le soir.\n• Restaurant du lac (2km) — terrasse face à l’eau, poissons du jour.'} /></label>
              <label className="block text-sm font-bold text-neutral-900">Autres infos pratiques<textarea rows={4} className={textareaClass} value={form.practicalInfo} onChange={(e) => update({ practicalInfo: e.target.value })} placeholder="Animaux acceptés en laisse · Wifi dans le bloc sanitaire · Électricité 10A disponible · Accueil jusqu'à 22h en été · English spoken…" /></label>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4">
              <div className="flex items-start gap-3">
                <input id="accept-charter" type="checkbox" className="mt-1 accent-[#c39960]" checked={form.acceptCharter} onChange={(e) => update({ acceptCharter: e.target.checked })} />
                <div className="text-sm text-neutral-600">
                  <label htmlFor="accept-charter">Je m'engage à respecter </label>
                  <button type="button" aria-expanded={showCharterDetails} onClick={() => setShowCharterDetails((current) => !current)} className="font-semibold text-[#8b673d] underline decoration-[#c39960]/60 underline-offset-2">la charte Label Vanlife et les conditions d'accueil annoncées</button>. *
                </div>
              </div>
              {showCharterDetails && <div className="mt-4 rounded-xl bg-[#f7f1e8]/70 p-4 text-sm leading-relaxed text-neutral-700"><p className="font-bold text-neutral-900">Ce que cet engagement implique</p><ul className="mt-3 list-disc space-y-2 pl-5"><li>Fournir des informations sincères et tenir à jour les tarifs, horaires, équipements et conditions d'accueil publiés.</li><li>Accueillir les vanlifers avec respect, sans discrimination, dans le respect des règles de sécurité, d'hygiène, de l'environnement et de la réglementation locale.</li><li>Appliquer la réduction annoncée de 10 à 20 % après vérification d'une carte membre Label Vanlife en cours de validité.</li><li>Prévenir Label Vanlife de tout changement important, incident ou indisponibilité affectant l'accueil.</li><li>Accepter que Label Vanlife demande des justificatifs ou contrôle la conformité du lieu et puisse suspendre ou retirer le label en cas de manquement.</li><li>Protéger les données et codes membres communiqués. Le label ne garantit aucun volume de réservation.</li></ul></div>}
            </div>

            <div className="rounded-2xl border border-[#c39960]/30 bg-[#f7f1e8]/60 p-5 sm:p-6"><h3 className="font-bold text-neutral-900">Récapitulatif de votre candidature</h3><div className="mt-4 space-y-2 text-sm text-neutral-700"><p><strong className="text-lg text-[#8b673d]">{answeredCriteria}</strong> critères remplis</p><p>Réduction : <strong>{form.discountPercent}%</strong></p><p><strong>{form.establishmentName || "Votre établissement"}</strong> · {form.address || "Adresse"}, {form.postalCode || "Code postal"} {form.city || "Ville"}</p><p>{form.contactName || "Contact"} · {form.email || "Email"}</p></div><div className="mt-5 border-t border-[#c39960]/20 pt-4"><p className="font-bold text-neutral-900">📨 Votre candidature sera envoyée automatiquement avec toutes les pièces jointes</p><p className="mt-1 text-sm text-neutral-600">{photoFiles.length} photo{photoFiles.length > 1 ? "s" : ""} et plan inclus · Confirmation envoyée à {form.email || "votre adresse email"}</p></div></div>
            {submitError && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">{submitError}</p>}
          </section>}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-neutral-100 pt-6 sm:flex-row sm:justify-between">
            <Button variant="ghost" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || loading}><ArrowLeft className="h-4 w-4" /> Étape précédente</Button>
            {step < STEPS.length - 1 ? <Button variant="cta" onClick={next} disabled={!canContinue}>Continuer <ArrowRight className="h-4 w-4" /></Button> : <Button variant="cta" onClick={handlePreAudit} disabled={!canContinue || loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />} Envoyer ma candidature</Button>}
          </div>
          {!canContinue && <p className="mt-3 text-center text-xs text-neutral-500">{missingMessage}</p>}
        </Card>
        <div className="grid gap-3 text-center text-xs text-neutral-500 sm:grid-cols-3"><p>✓ Aucune commission</p><p>✓ Dossier enregistré avant paiement</p><p>✓ Offre 2026 : 110 € au lieu de 220 €</p></div>
      </div>
    </main>
  );
}
