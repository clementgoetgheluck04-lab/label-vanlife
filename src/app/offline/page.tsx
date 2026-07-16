"use client";

import Link from "next/link";
import { Compass, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white flex items-center justify-center px-4">
      <div className="max-w-sm text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <WifiOff className="h-10 w-10 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Pas de connexion</h1>
        <p className="text-neutral-500 text-sm leading-relaxed">
          Reviens quand tu auras du réseau. En attendant, vérifie les lieux que tu as déjà consultés — ils sont peut-être encore dans ton cache.
        </p>
        <Link href="/">
          <Button variant="cta" size="lg" className="gap-2">
            <Compass className="h-5 w-5" /> Retour à l'accueil
          </Button>
        </Link>
      </div>
    </div>
  );
}