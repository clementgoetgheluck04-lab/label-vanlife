import Link from "next/link";
import { ArrowLeft, Quote, Stamp, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import StampMemoryForm from "@/components/member/StampMemoryForm";
import { getMemberData } from "@/server/member-data";

export default async function MemberPasseportPage() {
  const member = await getMemberData();
  const stamps = member.preview ? [] : member.passportStamps;

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0"><div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3"><Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link><div><h1 className="flex items-center gap-2 text-2xl font-bold text-charcoal"><Stamp className="h-6 w-6 text-amber" />Mon passeport</h1><p className="text-sm text-stone">{stamps.length} visite{stamps.length > 1 ? "s" : ""} enregistrée{stamps.length > 1 ? "s" : ""}</p></div></header>
      {stamps.length === 0 ? <Card className="py-12 text-center"><Stamp className="mx-auto h-12 w-12 text-stone/30" /><p className="mt-3 font-medium text-stone">Votre passeport attend sa première visite</p><p className="mt-1 text-sm text-stone/60">Scannez le QR Passeport affiché chez un lieu labellisé pour confirmer votre passage.</p></Card> : <div className="space-y-3">{stamps.map((stamp) => <Card key={stamp.id} className="p-5"><div className="flex gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage/20 to-amber/20 text-2xl">📍</span><div className="flex-1"><h2 className="font-bold text-charcoal">{stamp.place.name}</h2><p className="text-xs text-stone">{stamp.place.city}, {stamp.place.region}</p><p className="mt-1 text-xs font-medium text-sage">{stamp.visitedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>{stamp.amountSavedCents !== null ? <p className="mt-1 text-xs font-bold text-emerald-700">{(stamp.amountSavedCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} économisés</p> : null}{stamp.note ? <div className="mt-2 flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-3 w-3 ${index < stamp.note! ? "fill-amber text-amber" : "text-stone/20"}`} />)}</div> : null}</div></div>{stamp.comment ? <p className="mt-4 flex gap-2 rounded-xl bg-cream p-3 text-sm italic text-stone"><Quote className="h-4 w-4 shrink-0 text-sage" />{stamp.comment}</p> : null}<StampMemoryForm stampId={stamp.id} initialNote={stamp.note} initialComment={stamp.comment} initialAmountSavedCents={stamp.amountSavedCents} /></Card>)}</div>}
    </div></main>
  );
}
