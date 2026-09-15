import Link from "next/link";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getPrisma } from "@/lib/prisma";
import { verifyMemberCardToken } from "@/server/member-card-token";

export const dynamic = "force-dynamic";

export default async function VerifyCardPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const token = (await searchParams).token ?? "";
  const payload = verifyMemberCardToken(token);
  const record = payload ? await getPrisma().memberCard.findUnique({ where: { cardNumber: payload.cardNumber }, include: { user: { include: { profile: true, membership: true } } } }) : null;
  const membership = record?.user.membership;
  const active = Boolean(record && membership?.status === "ACTIVE" && (!membership.expiresAt || membership.expiresAt > new Date()));
  const displayName = active ? `${record?.user.profile?.firstName || "Membre"} ${(record?.user.profile?.lastName || "").slice(0, 1).toUpperCase()}.` : "";
  if (record) {
    await getPrisma().analyticsEvent.create({ data: { name: "qr_scan", entityType: "member_card", entityId: record.id, path: "/verifier-carte", properties: { valid: active } } });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-4 py-12"><Card className="w-full max-w-md p-8 text-center">{active ? <><CheckCircle2 className="mx-auto h-16 w-16 text-sage" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-sage">Carte valide</p><h1 className="mt-2 text-2xl font-bold text-charcoal">{displayName}</h1><p className="mt-2 text-sm text-stone">Membre Label Vanlife actif{membership?.expiresAt ? ` jusqu’au ${membership.expiresAt.toLocaleDateString("fr-FR")}` : ""}.</p><p className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-sage/5 p-3 text-xs text-stone"><ShieldCheck className="h-4 w-4 text-sage" />Vérification effectuée en direct.</p></> : <><XCircle className="mx-auto h-16 w-16 text-red-500" /><p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-red-600">Carte non valide</p><h1 className="mt-2 text-2xl font-bold text-charcoal">Vérification impossible</h1><p className="mt-2 text-sm text-stone">Le lien est expiré, incorrect ou la carte n’est plus active.</p></>}<Link href="/" className="mt-6 inline-flex text-sm font-bold text-sage hover:underline">Découvrir Label Vanlife</Link></Card></main>
  );
}
