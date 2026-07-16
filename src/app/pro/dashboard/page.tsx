"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { BarChart3, Eye, Star, Percent, MapPin, Settings, Download, ChevronRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type ProPlace = { id: string; name: string; city: string; region: string };
type ProProfile = { establishmentName: string; status: string; places?: ProPlace[] };

export default function ProDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [pro, setPro] = useState<ProProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/member-login"); return; }
      const { data: profile } = await supabase
        .from("establishment_profiles")
        .select("*, places(*)")
        .eq("userId", user.id)
        .single();
      setPro(profile);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-emerald-500 animate-spin" /></div>;

  const places = pro?.places || [];
  const stats = { vues: 0, favoris: 0, clics: 0 };

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-2">
          <p className="text-sm text-emerald-600 font-semibold">Espace Pro</p>
          <h1 className="text-2xl font-bold text-neutral-900">{pro?.establishmentName || "Mon établissement"}</h1>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
              pro?.status === "CERTIFIED" ? "bg-emerald-50 text-emerald-700" :
              pro?.status === "AUDIT" ? "bg-amber-50 text-amber-700" :
              "bg-neutral-100 text-neutral-500"
            }`}>
              {pro?.status === "CERTIFIED" ? "✅ Certifié" : pro?.status === "AUDIT" ? "🔍 En audit" : "📝 Prospect"}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Eye, label: "Vues", value: stats.vues, color: "text-blue-500", bg: "bg-blue-50" },
            { icon: Star, label: "Favoris", value: stats.favoris, color: "text-amber-500", bg: "bg-amber-50" },
            { icon: Percent, label: "Clics", value: stats.clics, color: "text-emerald-500", bg: "bg-emerald-50" },
          ].map(s => (
            <Card key={s.label} className="p-5 text-center">
              <div className={`inline-flex h-10 w-10 rounded-xl ${s.bg} items-center justify-center mx-auto mb-2`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-neutral-900">{s.value}</p>
              <p className="text-xs text-neutral-500">{s.label}</p>
            </Card>
          ))}
        </div>

        {/* My places */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-neutral-900">Mes lieux</h2>
          {places.length === 0 ? (
            <Card className="p-8 text-center">
              <MapPin className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-500 font-medium">Aucun lieu pour l'instant</p>
              <p className="text-sm text-neutral-400 mt-1">Finalise ta labellisation pour apparaître sur la carte</p>
            </Card>
          ) : places.map((p) => (
            <Link key={p.id} href={`/map/${p.id}`} className="block">
              <Card className="p-5 flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900">{p.name}</p>
                    <p className="text-sm text-neutral-500">{p.city} · {p.region}</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-300" />
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick links */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link href="/pro/fiche">
            <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Settings className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Ma fiche</p>
                <p className="text-sm text-neutral-500">Modifier mes informations</p>
              </div>
            </Card>
          </Link>
          <Link href="/labellisation">
            <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Obtenir le label</p>
                <p className="text-sm text-neutral-500">Offre 2026 — 110€ au lieu de 220€</p>
              </div>
            </Card>
          </Link>
          <Link href="/pro/kit-communication">
            <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                <Download className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-neutral-900">Kit communication</p>
                <p className="text-sm text-neutral-500">Certificat, logos, guides</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
