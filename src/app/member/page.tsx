import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  Heart,
  Map,
  Navigation,
  QrCode,
  Route,
  ShieldCheck,
  Stamp,
  WalletCards,
} from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMemberData } from "@/server/member-data";

const shortcuts = [
  { href: "/member/map", label: "MAP", icon: Map },
  { href: "/member/lieux", label: "Favoris", icon: Heart, count: "favorites" },
  { href: "/member/roadtrips", label: "Road Trips", icon: Route, count: "roadTrips" },
  { href: "/member/passeport", label: "Passeport", icon: Stamp, count: "passportStamps" },
  { href: "/member/badges", label: "Badges", icon: Award, count: "userBadges" },
  { href: "/member/journal", label: "Journal", icon: BookOpen },
  { href: "/member/notifications", label: "Alertes", icon: Bell, count: "notifications" },
] as const;

function formatDate(date: Date | null | undefined) {
  if (!date) return "en cours de validation";
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function MemberDashboard() {
  const member = await getMemberData();
  const profile = member.profile;
  const firstName = profile?.firstName?.trim() || "voyageur";
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Membre Label Vanlife";
  const cardNumber = member.memberCard?.cardNumber ?? "Carte en préparation";
  const unreadNotifications = member.notifications.filter((notification) => !notification.isRead).length;
  const totalSavingsCents = member.passportStamps.reduce((total, stamp) => total + (stamp.amountSavedCents ?? 0), 0);
  const isAdmin = !member.preview && member.role === "ADMIN";
  const counts: Record<string, number> = {
    favorites: member.favorites.length,
    roadTrips: member.roadTrips.length,
    passportStamps: member.passportStamps.length,
    userBadges: member.userBadges.length,
    notifications: unreadNotifications,
  };

  return (
    <div className="min-h-screen px-4 pb-24 pt-4 lg:px-0 lg:pt-0">
      <div className="mx-auto max-w-2xl space-y-8">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Espace membre</p>
          <h1 className="mt-2 text-3xl font-bold text-charcoal">Bonjour {firstName}</h1>
          <p className="mt-2 text-sm leading-relaxed text-stone">
            Préparez votre voyage, retrouvez vos lieux et présentez votre carte chez les partenaires.
          </p>
          {member.preview && (
            <p className="mt-4 rounded-xl border border-amber/20 bg-amber/10 px-4 py-3 text-sm text-charcoal">
              Mode prévisualisation administrateur : aucune donnée membre fictive n’est affichée.
            </p>
          )}
        </section>

        {isAdmin && (
          <Link href="/admin" className="group block" aria-label="Ouvrir le dashboard administrateur">
            <Card variant="interactive" className="border-[#c39960]/40 bg-gradient-to-r from-neutral-950 to-[#173e32] p-5 text-white shadow-lg">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10"><ShieldCheck className="h-7 w-7 text-[#dfc59f]" /></span>
                <div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[0.16em] text-[#dfc59f]">Accès fondateur sécurisé</p><h2 className="mt-1 font-bold text-white">Dashboard administrateur</h2><p className="mt-1 text-xs leading-5 text-white/70">Prospection, candidatures, avis membres et indicateurs commerciaux.</p></div>
                <ArrowRight className="h-5 w-5 shrink-0 text-[#dfc59f] transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        )}

        <Link href="/member/carte" className="block" aria-label="Afficher ma carte membre">
          <div className="relative min-h-52 overflow-hidden rounded-3xl bg-gradient-to-br from-sage to-forest p-6 text-white shadow-xl transition-transform hover:-translate-y-0.5">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative flex h-full min-h-40 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/70">Carte membre</p>
                  <p className="mt-1 font-mono text-sm">{cardNumber}</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
                  {member.membership?.status === "ACTIVE" ? "Active" : "À activer"}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold uppercase">{fullName}</p>
                <p className="mt-1 text-sm text-white/75">
                  Valable jusqu’au {formatDate(member.membership?.expiresAt)}
                </p>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-xs text-white/70">Touchez pour afficher et vérifier la carte</p>
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-forest">
                  <QrCode className="h-7 w-7" />
                </span>
              </div>
            </div>
          </div>
        </Link>

        <section className="grid gap-3 sm:grid-cols-2">
          <Link href="/member/map" className="group">
            <Card variant="interactive" className="p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage text-white"><Map className="h-7 w-7" /></span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-sage">Explorer</p>
                  <h2 className="mt-1 font-bold text-charcoal">Ouvrir la MAP</h2>
                  <p className="mt-1 text-xs text-stone">Lieux labellisés, avantages et itinéraire.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-sage transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
          <Link href="/member/roadtrips" className="group">
            <Card variant="interactive" className="p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8c673e] text-white"><Navigation className="h-7 w-7" /></span>
                <div className="flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9a7445]">Préparer</p>
                  <h2 className="mt-1 font-bold text-charcoal">Mon road trip</h2>
                  <p className="mt-1 text-xs text-stone">Conservez vos étapes et ouvrez votre GPS.</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#9a7445] transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </Link>
        </section>

        <Link href="/member/passeport" className="block">
          <Card variant="interactive" className="border-emerald-200 bg-emerald-50/60 p-5">
            <div className="flex items-center gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-700 text-white"><WalletCards className="h-7 w-7" /></span><div className="min-w-0 flex-1"><p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Valeur de ma carte</p><p className="mt-1 text-2xl font-black text-forest">{(totalSavingsCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} économisés</p><p className="mt-1 text-xs leading-5 text-stone">Total déclaré après vos visites. Complétez une visite dans votre passeport pour le mettre à jour.</p></div><ArrowRight className="h-5 w-5 shrink-0 text-emerald-700" /></div>
          </Card>
        </Link>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {shortcuts.map(({ href, label, icon: Icon, ...shortcut }) => {
            const count = "count" in shortcut ? counts[shortcut.count] : undefined;
            return (
              <Link href={href} key={href}>
                <Card variant="interactive" className="h-full p-4 text-center">
                  <Icon className="mx-auto h-6 w-6 text-sage" />
                  <span className="mt-2 block text-xs font-semibold text-charcoal">{label}</span>
                  {typeof count === "number" && <span className="mt-1 block text-[11px] text-stone">{count}</span>}
                </Card>
              </Link>
            );
          })}
        </section>

        <Card className="p-5">
          <h2 className="font-bold text-charcoal">Vos données, réellement</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
            <div><strong className="block text-2xl text-forest">{member.favorites.length}</strong><span className="text-xs text-stone">favoris</span></div>
            <div><strong className="block text-2xl text-forest">{member.roadTrips.length}</strong><span className="text-xs text-stone">road trips</span></div>
            <div><strong className="block text-2xl text-forest">{member.passportStamps.length}</strong><span className="text-xs text-stone">visites</span></div>
            <div><strong className="block text-2xl text-forest">{profile?.points ?? 0}</strong><span className="text-xs text-stone">points</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
