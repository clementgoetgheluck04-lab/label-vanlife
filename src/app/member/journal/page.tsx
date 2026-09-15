import Link from "next/link";
import { ArrowLeft, BookOpen, MapPin } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMemberData } from "@/server/member-data";

export default async function MemberJournalPage() {
  const member = await getMemberData();
  const entries = member.preview ? [] : member.passportStamps.filter((stamp) => Boolean(stamp.comment));

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0"><div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3"><Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage/10"><BookOpen className="h-6 w-6 text-sage" /></span><div><h1 className="text-2xl font-bold text-charcoal">Mon journal</h1><p className="text-sm text-stone">Les souvenirs enregistrés avec vos visites</p></div></header>
      {entries.length === 0 ? <Card className="py-12 text-center"><BookOpen className="mx-auto h-12 w-12 text-stone/30" /><p className="mt-3 font-medium text-stone">Aucun souvenir enregistré</p><p className="mt-1 text-sm text-stone/60">Votre journal se construit à partir de vos visites réelles.</p></Card> : <div className="space-y-3">{entries.map((entry) => <Card key={entry.id} className="p-5"><p className="flex items-center gap-2 text-sm font-bold text-charcoal"><MapPin className="h-4 w-4 text-sage" />{entry.place.name}</p><p className="mt-1 text-xs text-stone">{entry.visitedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p><p className="mt-4 text-sm leading-relaxed text-charcoal">{entry.comment}</p></Card>)}</div>}
    </div></main>
  );
}
