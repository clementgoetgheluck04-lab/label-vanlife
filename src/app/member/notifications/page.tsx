import Link from "next/link";
import { ArrowLeft, Bell, BellRing } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMemberData } from "@/server/member-data";

export default async function MemberNotificationsPage() {
  const member = await getMemberData();
  const notifications = member.preview ? [] : member.notifications;
  const unread = notifications.filter((notification) => !notification.isRead).length;

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0"><div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3"><Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link><span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-sage/10"><Bell className="h-6 w-6 text-sage" />{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{unread}</span>}</span><div><h1 className="text-2xl font-bold text-charcoal">Mes alertes</h1><p className="text-sm text-stone">Informations utiles liées à votre compte</p></div></header>
      {notifications.length === 0 ? <Card className="py-12 text-center"><BellRing className="mx-auto h-12 w-12 text-stone/30" /><p className="mt-3 font-medium text-stone">Aucune alerte</p><p className="mt-1 text-sm text-stone/60">Les informations importantes apparaîtront ici.</p></Card> : <div className="space-y-3">{notifications.map((notification) => <Card key={notification.id} className={`p-5 ${notification.isRead ? "" : "border-sage/30 bg-sage/5"}`}><div className="flex items-start justify-between gap-3"><div><h2 className="font-bold text-charcoal">{notification.title}</h2><p className="mt-2 text-sm leading-relaxed text-stone">{notification.body}</p></div>{!notification.isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sage" />}</div><p className="mt-3 text-xs text-stone/60">{notification.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p></Card>)}</div>}
    </div></main>
  );
}
