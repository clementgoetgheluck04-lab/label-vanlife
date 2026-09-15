import Link from "next/link";
import { ArrowRight, BadgeEuro, Building2, CreditCard, Map, Route, ShieldCheck, Users, WalletCards } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getPrisma } from "@/lib/prisma";
import { requirePageRole } from "@/server/auth";

export const dynamic = "force-dynamic";

const euros = (cents: number) => (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

export default async function FounderDashboardPage() {
  await requirePageRole(["ADMIN"]);
  const prisma = getPrisma();
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const [revenue, revenueByType, activeMembers, newMembers, labelledPlaces, newPlaces, paidOrders, checkoutOrders, analytics, memberSavings, prospectGroups, pendingRecommendations, pendingApplications, openSupport] = await Promise.all([
    prisma.payment.aggregate({ where: { status: "SUCCEEDED", createdAt: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.payment.groupBy({ by: ["type"], where: { status: "SUCCEEDED", createdAt: { gte: monthStart } }, _sum: { amount: true } }),
    prisma.membership.count({ where: { status: "ACTIVE", OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.membership.count({ where: { startedAt: { gte: thirtyDaysAgo } } }),
    prisma.place.count({ where: { status: "PUBLISHED" } }),
    prisma.place.count({ where: { status: "PUBLISHED", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.checkoutOrder.count({ where: { status: "PAID", createdAt: { gte: thirtyDaysAgo } } }),
    prisma.checkoutOrder.count({ where: { status: { in: ["CHECKOUT_CREATED", "PAID", "FAILED", "CANCELED"] }, createdAt: { gte: thirtyDaysAgo } } }),
    prisma.analyticsEvent.groupBy({ by: ["name"], where: { createdAt: { gte: thirtyDaysAgo }, name: { in: ["map_open", "place_view", "route_start", "qr_scan", "benefit_view"] } }, _count: { _all: true } }),
    prisma.passportStamp.aggregate({ where: { visitedAt: { gte: thirtyDaysAgo }, amountSavedCents: { not: null } }, _sum: { amountSavedCents: true }, _count: { amountSavedCents: true } }),
    prisma.prospect.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.placeRecommendation.count({ where: { status: "PENDING" } }),
    prisma.placeApplication.count({ where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } } }),
    prisma.supportTicket.count({ where: { status: { in: ["OPEN", "IN_PROGRESS"] } } }),
  ]);
  const byEvent = Object.fromEntries(analytics.map((row) => [row.name, row._count._all]));
  const qualifiedConnections = (byEvent.route_start ?? 0) + (byEvent.qr_scan ?? 0) + (byEvent.benefit_view ?? 0);
  const b2cRevenue = revenueByType.find((row) => row.type === "MEMBERSHIP")?._sum.amount ?? 0;
  const b2bRevenue = revenueByType.filter((row) => row.type === "LABELLISATION" || row.type === "RENEWAL").reduce((sum, row) => sum + (row._sum.amount ?? 0), 0);
  const prospects = prospectGroups.reduce((sum, row) => sum + row._count._all, 0);
  const convertedProspects = prospectGroups.find((row) => row.status === "CONVERTED")?._count._all ?? 0;
  const checkoutConversion = checkoutOrders > 0 ? Math.round((paidOrders / checkoutOrders) * 100) : null;
  const metrics = [
    { label: "Revenu du mois", value: euros(revenue._sum.amount ?? 0), detail: `B2C ${euros(b2cRevenue)} · B2B ${euros(b2bRevenue)}`, icon: BadgeEuro },
    { label: "Membres actifs", value: String(activeMembers), detail: `+${newMembers} sur 30 jours`, icon: Users },
    { label: "Lieux publiés", value: String(labelledPlaces), detail: `+${newPlaces} sur 30 jours`, icon: Building2 },
    { label: "Conversion checkout", value: checkoutConversion === null ? "—" : `${checkoutConversion} %`, detail: `${paidOrders} paiement(s) / ${checkoutOrders} checkout(s)`, icon: CreditCard },
    { label: "MAP ouverte", value: String(byEvent.map_open ?? 0), detail: `${byEvent.place_view ?? 0} fiches vues sur 30 jours`, icon: Map },
    { label: "Connexions qualifiées", value: String(qualifiedConnections), detail: "Itinéraires + QR + avantages sur 30 jours", icon: Route },
    { label: "Économies déclarées", value: euros(memberSavings._sum.amountSavedCents ?? 0), detail: `${memberSavings._count.amountSavedCents} visite(s) renseignée(s) sur 30 jours`, icon: WalletCards },
  ];

  return <main className="min-h-screen bg-[#f8f6f1] px-4 pb-24 pt-28 sm:px-6"><div className="mx-auto max-w-6xl space-y-8">
    <header><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-700">Pilotage fondateur</p><h1 className="mt-2 text-3xl font-black text-neutral-950">Ce qui crée réellement de la valeur</h1><p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">Revenus encaissés, clients actifs et connexions qualifiées. Le MRR et l’ARR ne sont pas affichés : les offres actuelles sont des paiements annuels ponctuels, pas des abonnements récurrents Stripe.</p></header>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{metrics.map(({ label, value, detail, icon: Icon }) => <Card key={label} className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-stone">{label}</p><strong className="mt-2 block text-3xl text-charcoal">{value}</strong></div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage/10"><Icon className="h-5 w-5 text-sage" /></span></div><p className="mt-3 text-xs text-stone">{detail}</p></Card>)}</section>
    <section className="grid gap-4 lg:grid-cols-3"><Card className="p-5"><h2 className="font-black text-charcoal">Pipeline B2B</h2><p className="mt-3 text-3xl font-black text-forest">{prospects}</p><p className="text-xs text-stone">prospects · {convertedProspects} converti(s)</p><Link href="/admin/prospection" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-sage">Piloter la prospection <ArrowRight className="h-4 w-4" /></Link></Card><Card className="p-5"><h2 className="font-black text-charcoal">Confiance à traiter</h2><p className="mt-3 text-sm text-stone"><strong className="text-xl text-charcoal">{pendingRecommendations}</strong> recommandation(s)</p><p className="mt-2 text-sm text-stone"><strong className="text-xl text-charcoal">{pendingApplications}</strong> candidature(s)</p><Link href="/admin/recommendations" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-sage">Ouvrir la validation <ArrowRight className="h-4 w-4" /></Link></Card><Card className="p-5"><h2 className="flex items-center gap-2 font-black text-charcoal"><ShieldCheck className="h-5 w-5 text-sage" />Qualité de service</h2><p className="mt-3 text-3xl font-black text-forest">{openSupport}</p><p className="text-xs text-stone">ticket(s) support ouvert(s)</p><p className="mt-5 text-xs leading-relaxed text-stone">CAC, LTV, churn et NPS restent « inconnus » tant que leurs sources ne sont pas fiables. Aucun chiffre n’est fabriqué.</p></Card></section>
  </div></main>;
}
