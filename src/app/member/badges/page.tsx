import Link from "next/link";
import { ArrowLeft, Award, Trophy } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMemberData } from "@/server/member-data";

export default async function MemberBadgesPage() {
  const member = await getMemberData();
  const badges = member.preview ? [] : member.userBadges;

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0"><div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3"><Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50"><Trophy className="h-6 w-6 text-amber" /></span><div><h1 className="text-2xl font-bold text-charcoal">Mes badges</h1><p className="text-sm text-stone">{badges.length} badge{badges.length > 1 ? "s" : ""} obtenu{badges.length > 1 ? "s" : ""}</p></div></header>
      {badges.length === 0 ? <Card className="py-12 text-center"><Award className="mx-auto h-12 w-12 text-stone/30" /><p className="mt-3 font-medium text-stone">Aucun badge obtenu</p><p className="mt-1 text-sm text-stone/60">Les badges apparaîtront ici après vos actions vérifiées.</p></Card> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{badges.map(({ badge, earnedAt }) => <Card key={badge.id} className="p-4 text-center"><div className="text-3xl">{badge.icon}</div><h2 className="mt-2 text-sm font-bold text-charcoal">{badge.name}</h2><p className="mt-1 text-xs text-stone">{badge.description}</p><p className="mt-3 text-[11px] text-sage">Obtenu le {earnedAt.toLocaleDateString("fr-FR")}</p></Card>)}</div>}
    </div></main>
  );
}
