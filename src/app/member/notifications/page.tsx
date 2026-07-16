"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Bell, BellRing, Building2, CheckCheck, Clock, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MOCK_NOTIFICATIONS } from "@/data/mock-notifications";

const TYPE_CONFIG = {
  promo: { label: "Offre partenaire", className: "bg-emerald-50 text-emerald-700" },
  offre_speciale: { label: "Offre spéciale", className: "bg-[#c39960]/15 text-[#7a5a35]" },
} as const;

export default function MemberNotificationsPage() {
  const [offers, setOffers] = useState(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const browserPermission = useSyncExternalStore<NotificationPermission | "unavailable">(
    () => () => undefined,
    () => "Notification" in window ? Notification.permission : "unavailable",
    () => "unavailable",
  );
  const [requestedPermission, setRequestedPermission] = useState<NotificationPermission | null>(null);
  const pushPermission = requestedPermission ?? browserPermission;

  const filteredOffers = useMemo(
    () => filter === "unread" ? offers.filter((offer) => !offer.isRead) : offers,
    [filter, offers],
  );
  const unreadCount = useMemo(() => offers.filter((offer) => !offer.isRead).length, [offers]);

  const requestPush = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setRequestedPermission(permission);
    if (permission === "granted" && "serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.ready;
      await registration.showNotification("Offres Label Vanlife activées", {
        body: "Vous recevrez les offres ponctuelles proposées aux membres par les lieux.",
        icon: "/icons/icon-192.svg",
      });
    }
  };

  const markRead = (id: string) => {
    setOffers((current) => current.map((offer) => offer.id === id ? { ...offer, isRead: true } : offer));
  };

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/member" aria-label="Retour à l’espace membre" className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <Bell className="h-6 w-6 text-emerald-600" />
              {unreadCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">{unreadCount}</span>}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">Offres membres</h1>
              <p className="text-sm text-neutral-500">Les promotions proposées par les lieux Label Vanlife</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button onClick={() => setOffers((current) => current.map((offer) => ({ ...offer, isRead: true })))} className="hidden items-center gap-1 text-xs font-semibold text-emerald-700 sm:flex">
              <CheckCheck className="h-4 w-4" /> Tout marquer lu
            </button>
          )}
        </header>

        <div className="flex gap-2">
          <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "all" ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600"}`}>Toutes</button>
          <button onClick={() => setFilter("unread")} className={`rounded-full px-4 py-2 text-xs font-semibold ${filter === "unread" ? "bg-emerald-600 text-white" : "bg-neutral-100 text-neutral-600"}`}>Non lues {unreadCount > 0 && `(${unreadCount})`}</button>
        </div>

        {pushPermission !== "granted" && pushPermission !== "unavailable" && (
          <Card className="border-emerald-200/60 bg-gradient-to-r from-emerald-50 to-white p-4">
            <div className="flex items-start gap-3">
              <BellRing className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
              <div className="flex-1">
                <h2 className="text-sm font-bold text-neutral-900">Activez les alertes d’offres</h2>
                <p className="mt-1 text-xs leading-relaxed text-neutral-600">Recevez les promotions ponctuelles des lieux sans avoir à consulter la page.</p>
                <Button variant="cta" size="sm" className="mt-3 gap-1.5" onClick={requestPush}><Bell className="h-3.5 w-3.5" /> Activer</Button>
              </div>
            </div>
          </Card>
        )}

        <Card className="border-[#c39960]/30 bg-gradient-to-r from-[#c39960]/10 to-emerald-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white"><Sparkles className="h-5 w-5 text-[#c39960]" /></div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900">Un canal sponsorisé et transparent</h2>
              <p className="mt-1 text-xs leading-relaxed text-neutral-600">Les lieux pourront payer pour diffuser une offre aux membres. Chaque contenu sponsorisé est clairement identifié. La facturation sera connectée dans une prochaine mise à jour.</p>
            </div>
          </div>
        </Card>

        {filteredOffers.length === 0 ? (
          <Card className="p-12 text-center"><Bell className="mx-auto mb-3 h-12 w-12 text-neutral-300" /><p className="font-medium text-neutral-500">Aucune offre en cours</p></Card>
        ) : (
          <section className="space-y-3" aria-label="Offres des lieux">
            {filteredOffers.map((offer) => {
              const config = TYPE_CONFIG[offer.type];
              return (
                <article key={offer.id} onClick={() => markRead(offer.id)} className={`relative rounded-2xl border p-5 transition ${offer.isRead ? "border-neutral-200 bg-white" : "border-emerald-200 bg-emerald-50/40"}`}>
                  {!offer.isRead && <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-emerald-500" />}
                  <div className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-2xl shadow-sm">{offer.icon}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 pr-4">
                        <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${config.className}`}>{config.label}</span>
                        <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-bold text-neutral-500">Sponsorisé</span>
                      </div>
                      <h2 className="mt-2 text-base font-bold text-neutral-900">{offer.title}</h2>
                      <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-neutral-500"><Building2 className="h-3.5 w-3.5" /> {offer.sponsorName}</p>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-600">{offer.body}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-200/70 pt-3">
                        <span className="flex items-center gap-1 text-[11px] text-neutral-500"><Clock className="h-3.5 w-3.5" /> Valable jusqu’au {formatValidity(offer.validUntil)}</span>
                        <Link href={offer.actionUrl} onClick={() => markRead(offer.id)} className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline">Voir le lieu <ArrowRight className="h-3.5 w-3.5" /></Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}

function formatValidity(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
