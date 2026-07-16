"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { ArrowLeft, Save, Loader2, Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function ProFichePage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    establishmentName: "", phone: "", website: "",
    addressLine1: "", city: "", postalCode: "", region: "",
    description: "", services: "",
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) { router.replace("/member-login"); return; }
      const { data: pro } = await supabase
        .from("establishment_profiles")
        .select("*")
        .eq("userId", user.id)
        .single();
      if (pro) {
        setForm({
          establishmentName: pro.establishmentName || "",
          phone: pro.phone || "",
          website: pro.website || "",
          addressLine1: pro.addressLine1 || "",
          city: pro.city || "",
          postalCode: pro.postalCode || "",
          region: pro.region || "",
          description: "",
          services: "",
        });
      }
      setLoading(false);
    });
  }, []);

  const update = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("establishment_profiles").upsert({
      userId: user.id,
      establishmentName: form.establishmentName,
      phone: form.phone,
      website: form.website,
      addressLine1: form.addressLine1,
      city: form.city,
      postalCode: form.postalCode,
      region: form.region,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setSaving(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 text-emerald-500 animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <Link href="/pro/dashboard" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700">
          <ArrowLeft className="h-4 w-4" /> Retour au dashboard
        </Link>

        <h1 className="text-2xl font-bold text-neutral-900">Ma fiche établissement</h1>

        <Card className="p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-neutral-700 block mb-1">Nom *</label>
              <input value={form.establishmentName} onChange={e => update({ establishmentName: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Téléphone</label>
              <input value={form.phone} onChange={e => update({ phone: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Site web</label>
              <input value={form.website} onChange={e => update({ website: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" placeholder="https://..." />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-neutral-700 block mb-1">Adresse</label>
              <input value={form.addressLine1} onChange={e => update({ addressLine1: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Ville</label>
              <input value={form.city} onChange={e => update({ city: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Code postal</label>
              <input value={form.postalCode} onChange={e => update({ postalCode: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 block mb-1">Région</label>
              <input value={form.region} onChange={e => update({ region: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5">
            <p className="text-sm font-medium text-neutral-700 mb-3">Photos</p>
            <div className="flex items-center gap-3 p-4 border-2 border-dashed border-neutral-200 rounded-xl">
              <Upload className="h-8 w-8 text-neutral-300" />
              <div>
                <p className="text-sm text-neutral-500">Glisse tes photos ici</p>
                <p className="text-xs text-neutral-400">ou clique pour parcourir (bientôt)</p>
              </div>
            </div>
          </div>

          <Button onClick={handleSave} variant="primary" size="lg" className="w-full gap-2" disabled={saving}>
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : saved ? <Check className="h-5 w-5" /> : <Save className="h-5 w-5" />}
            {saved ? "Enregistré !" : "Enregistrer"}
          </Button>
        </Card>
      </div>
    </div>
  );
}