"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  OPEN_CONSENT_EVENT,
  readAnalyticsConsent,
  writeAnalyticsConsent,
  type AnalyticsConsent,
} from "@/lib/privacy/consent";

const ANALYTICS_ID_KEY = "lv_analytics_id";
const SESSION_ID_KEY = "lv_analytics_session";

export default function CookieConsent() {
  const [choice, setChoice] = useState<AnalyticsConsent>("refused");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const current = readAnalyticsConsent();
      setChoice(current);
      setOpen(current === null);
    }, 0);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  const decide = (value: Exclude<AnalyticsConsent, null>) => {
    writeAnalyticsConsent(value);
    setChoice(value);
    setOpen(false);
    if (value === "refused") {
      try {
        window.localStorage.removeItem(ANALYTICS_ID_KEY);
        window.sessionStorage.removeItem(SESSION_ID_KEY);
      } catch {
        // Storage can be unavailable in hardened browsers.
      }
    }
  };

  if (!open) return null;

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl border border-neutral-200 bg-white p-5 text-neutral-900 shadow-2xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p id="cookie-consent-title" className="font-bold">Vos choix de confidentialité</p>
          <p id="cookie-consent-description" className="mt-2 text-sm leading-6 text-neutral-600">
            Les traceurs indispensables assurent la connexion et mémorisent votre choix. Avec votre accord, nos statistiques internes nous aident à améliorer le site. Aucun traceur publicitaire n’est utilisé.
          </p>
          <Link href="/politique-confidentialite#cookies" className="mt-2 inline-flex text-sm font-semibold text-emerald-800 underline underline-offset-2">
            Comprendre les cookies et les données
          </Link>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-1">
          <button type="button" onClick={() => decide("refused")} className="min-h-11 rounded-xl border border-neutral-400 bg-white px-5 text-sm font-bold text-neutral-900 hover:bg-neutral-50">
            Tout refuser
          </button>
          <button type="button" onClick={() => decide("accepted")} className="min-h-11 rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white hover:bg-emerald-900">
            Accepter les statistiques
          </button>
        </div>
      </div>
      {choice !== null && <p className="sr-only">Choix actuel : {choice === "accepted" ? "statistiques acceptées" : "statistiques refusées"}</p>}
    </aside>
  );
}
