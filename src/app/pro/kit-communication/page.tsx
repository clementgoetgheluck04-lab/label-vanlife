"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { Check, Download, ArrowLeft, FileText, Image, QrCode, BookOpen, Mail, Loader2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const KIT_ITEMS = [
  {
    icon: <FileText className="h-6 w-6 text-emerald-500" />,
    title: "Certificat Label Vanlife",
    desc: "Ton certificat officiel à imprimer et encadrer. Format PDF haute résolution.",
    download: "#",
    bg: "bg-emerald-50",
  },
  {
    icon: <Image className="h-6 w-6 text-blue-500" />,
    title: "Logo Label Vanlife",
    desc: "Pack complet : logo principal, variantes noir/blanc, favicon. PNG + SVG.",
    download: "#",
    bg: "bg-blue-50",
  },
  {
    icon: <Image className="h-6 w-6 text-amber-500" />,
    title: "Visuels réseaux sociaux",
    desc: "Templates Canva pour Instagram, Facebook et LinkedIn. Prêts à personnaliser.",
    download: "#",
    bg: "bg-amber-50",
  },
  {
    icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
    title: "Guide d'accueil vanlife",
    desc: "Bonnes pratiques pour accueillir les voyageurs itinérants. 12 pages illustrées.",
    download: "#",
    bg: "bg-emerald-50",
  },
  {
    icon: <QrCode className="h-6 w-6 text-purple-500" />,
    title: "QR Code fiche établissement",
    desc: "QR code personnalisé vers ta fiche Label Vanlife. À afficher à l'accueil.",
    download: "#",
    bg: "bg-purple-50",
  },
  {
    icon: <Mail className="h-6 w-6 text-orange-500" />,
    title: "Badge numérique pour ton site",
    desc: "Badge HTML à intégrer sur ton site web. \"Labellisé Label Vanlife\".",
    download: "#",
    bg: "bg-orange-50",
  },
];

type ProSummary = { establishmentName: string; status: string };

export default function KitCommunicationPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [pro, setPro] = useState<ProSummary | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/member-login"); return; }
      const { data: profile } = await supabase
        .from("establishment_profiles")
        .select("establishmentName, status")
        .eq("userId", user.id)
        .single();
      if (profile) setPro(profile);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-emerald-500 animate-spin" /></div>;

  if (!pro) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md space-y-4">
          <Sparkles className="h-12 w-12 text-neutral-300 mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Pas encore labellisé</h2>
          <p className="text-sm text-neutral-500">Le kit de communication est disponible après validation de ta labellisation.</p>
          <Link href="/labellisation">
            <Button variant="cta">Candidater — offre 2026 à 110€</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Back */}
        <Link href="/pro/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>

        {/* Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full text-emerald-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" /> KIT DE COMMUNICATION
          </div>
          <h1 className="text-3xl font-bold text-neutral-900">{pro.establishmentName}</h1>
          <p className="text-neutral-500">
            Bienvenue dans le réseau Label Vanlife. Télécharge les éléments pour afficher ton label et accueillir les vanlifers.
          </p>
        </div>

        {/* Items grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {KIT_ITEMS.map((item) => (
            <Card key={item.title} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-neutral-900 text-sm">{item.title}</h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{item.desc}</p>
                  <Button variant="primary" size="sm" className="mt-3 gap-1.5 text-xs" disabled>
                    <Download className="h-3.5 w-3.5" /> Télécharger
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Info */}
        <Card className="p-5 bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-100">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-neutral-800">Label valable 1 an</p>
              <p className="text-xs text-neutral-600 mt-1">
                N&apos;oublie pas de renouveler ton label chaque année pour continuer à profiter de ces ressources.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
