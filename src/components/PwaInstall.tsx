"use client";

import { useState, useEffect, useCallback } from "react";

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
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Vérifie si l'app est déjà installée (display-mode: standalone)
  // Intercepte l'événement beforeinstallprompt
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      const dismissedAt = Number(localStorage.getItem("pwa-install-dismissed") || 0);
      if (dismissedAt && Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1_000) return;
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Détecte l'installation réussie
  useEffect(() => {
    const handler = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA installée par l'utilisateur");
    } else {
      console.log("Installation PWA refusée");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setIsVisible(false);
    // Ne pas réafficher pendant 7 jours
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  }, []);

  // Vérifie si l'utilisateur a déjà dismiss récemment
  if (!isVisible || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="backdrop-blur-lg bg-white/80 dark:bg-charcoal/80 border border-white/20 shadow-xl rounded-2xl p-4 flex items-center gap-3">
        {/* Icone native */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#065F46] flex items-center justify-center shadow-sm">
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 text-white"
            fill="currentColor"
          >
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
          </svg>
        </div>

        {/* Texte */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-charcoal dark:text-white">
            Installez Label Vanlife
          </p>
          <p className="text-xs text-muted-foreground">
            Ajoutez à votre écran d&apos;accueil pour un accès rapide
          </p>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 flex items-center gap-1">
          <button
            onClick={handleInstall}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-[#10B981] hover:bg-[#059669] text-white transition-colors shadow-sm"
          >
            Installer
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 text-muted-foreground hover:text-charcoal dark:hover:text-white transition-colors rounded-lg hover:bg-black/5"
            aria-label="Fermer"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
