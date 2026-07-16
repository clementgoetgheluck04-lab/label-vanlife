"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function PwaInstall() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(display-mode: standalone)").matches
  );
  const [isDismissed, setIsDismissed] = useState(false);
  const [showManualHelp, setShowManualHelp] = useState(false);

  const isMemberArea = pathname === "/member" || pathname.startsWith("/member/");

  useEffect(() => {
    const handleInstallPrompt = (event: BeforeInstallPromptEvent) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };
    const handleInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) {
      setShowManualHelp(true);
      return;
    }

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "dismissed") setIsDismissed(true);
  }, [deferredPrompt]);

  if (!isMemberArea || isInstalled || isDismissed) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md">
      <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/90 p-4 shadow-xl backdrop-blur-lg">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10B981] to-[#065F46] shadow-sm" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-charcoal">Installer l&apos;application membre</p>
          <p className="text-xs text-muted-foreground">
            Votre carte membre et la MAP accessibles depuis votre téléphone
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            onClick={handleInstall}
            className="min-h-11 rounded-lg bg-[#10B981] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#059669]"
          >
            Installer
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-black/5 hover:text-charcoal"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {showManualHelp && (
        <p className="mt-2 rounded-xl border border-emerald-100 bg-white px-4 py-3 text-xs text-neutral-600 shadow-lg">
          Si le navigateur ne propose pas l&apos;installation, ouvrez son menu puis choisissez
          <strong> « Ajouter à l&apos;écran d&apos;accueil »</strong>.
        </p>
      )}
    </div>
  );
}
