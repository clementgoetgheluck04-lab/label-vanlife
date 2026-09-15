import Link from "next/link";
import Image from "next/image";
import QRCode from "qrcode";
import { ArrowLeft, Compass, Download, ShieldCheck, Sparkles, UserRound, Users } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getAppUrl } from "@/server/env";
import { getMemberData } from "@/server/member-data";
import { createMemberCardToken } from "@/server/member-card-token";

export const dynamic = "force-dynamic";

export default async function MemberCardPage() {
  const member = await getMemberData();

  if (member.preview) {
    return <main className="mx-auto max-w-md px-4 py-12"><Link href="/member" className="inline-flex items-center gap-2 text-sm text-stone"><ArrowLeft className="h-4 w-4" />Retour</Link><Card className="mt-6 py-12 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-sage" /><h1 className="mt-4 text-xl font-bold text-charcoal">Prévisualisation sécurisée</h1><p className="mt-2 text-sm text-stone">Aucune fausse carte ni faux QR n’est généré en mode administrateur. Connectez un vrai compte membre actif pour tester la vérification.</p></Card></main>;
  }

  const card = member.memberCard;
  const membership = member.membership;
  if (!card || membership?.status !== "ACTIVE") {
    return <main className="mx-auto max-w-md px-4 py-12 text-center"><h1 className="text-xl font-bold text-charcoal">Carte indisponible</h1><p className="mt-2 text-sm text-stone">Aucune carte active n’est associée à ce compte.</p><Link href="/devenir-membre" className="mt-5 inline-flex rounded-xl bg-sage px-5 py-3 text-sm font-bold text-white">Découvrir l’offre membre</Link></main>;
  }

  const token = createMemberCardToken(card.cardNumber, membership.expiresAt);
  const verificationUrl = `${getAppUrl()}/verifier-carte?token=${encodeURIComponent(token)}`;
  const qrDataUrl = await QRCode.toDataURL(verificationUrl, { width: 320, margin: 1, color: { dark: "#174437", light: "#ffffff" } });
  const profile = member.profile;
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Membre Label Vanlife";
  const year = membership.expiresAt?.getFullYear() ?? 2027;
  const people = [
    { id: member.id, firstName: profile?.firstName || "Membre", lastName: profile?.lastName || "", number: `${card.cardNumber}-01`, role: "Titulaire" },
    ...member.memberCompanions.map((person, index) => ({ id: person.id, firstName: person.firstName, lastName: person.lastName, number: `${card.cardNumber}-${String(index + 2).padStart(2, "0")}`, role: "Accompagnant" })),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/10 to-white px-4 py-8 pb-24">
      <div className="mx-auto max-w-md space-y-7">
        <Link href="/member" className="inline-flex items-center gap-2 text-sm text-stone"><ArrowLeft className="h-4 w-4" />Retour à l’espace membre</Link>
        <header className="text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10"><Sparkles className="h-7 w-7 text-sage" /></span><h1 className="mt-3 text-2xl font-bold text-charcoal">Ma carte membre</h1><p className="mt-2 text-sm text-stone">Présentez ce QR au lieu partenaire : il vérifie en direct la validité de la carte.</p></header>

        <section id="member-card" className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sage to-forest p-6 text-white shadow-xl">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative space-y-6">
            <div className="flex justify-between gap-3"><div><p className="text-xs uppercase tracking-[0.18em] text-white/70">Label Vanlife {year}</p><p className="mt-1 font-mono text-xs">{card.cardNumber}</p></div><span className="h-fit rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Active</span></div>
            <div><p className="text-2xl font-bold uppercase tracking-wide">{fullName}</p><p className="mt-1 text-sm text-white/75">Membre Label Vanlife</p></div>
            <div className="flex items-end justify-between gap-4"><p className="flex items-center gap-2 text-xs text-white/70"><Compass className="h-4 w-4" />{profile?.level ?? "EXPLORATEUR"} · {profile?.points ?? 0} pts</p><Image unoptimized src={qrDataUrl} alt="QR de vérification de la carte membre" width={104} height={104} className="rounded-xl bg-white p-1" /></div>
          </div>
        </section>

        <a href={qrDataUrl} download={`carte-label-vanlife-${card.cardNumber}.png`} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-sage px-5 text-sm font-bold text-sage hover:bg-sage/10"><Download className="h-5 w-5" />Télécharger le QR de vérification</a>

        <Card className="overflow-hidden p-0"><div className="flex items-center gap-3 border-b border-border bg-sage/5 px-5 py-4"><Users className="h-5 w-5 text-sage" /><div><h2 className="text-sm font-bold text-charcoal">Personnes couvertes</h2><p className="text-xs text-stone">Un numéro distinct par personne.</p></div></div><div className="divide-y divide-border">{people.map((person) => <div key={person.id} className="flex items-center gap-3 px-5 py-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10"><UserRound className="h-5 w-5 text-sage" /></span><div className="min-w-0 flex-1"><p className="font-semibold text-charcoal">{person.firstName} {person.lastName}</p><p className="text-xs text-stone">{person.role}</p></div><span className="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-[10px] text-stone">{person.number}</span></div>)}</div></Card>

        <Card className="flex items-start gap-3 border-sage/20 bg-sage/5"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" /><div><h2 className="text-sm font-bold text-charcoal">Vérification respectueuse</h2><p className="mt-1 text-xs leading-relaxed text-stone">Le QR ne contient ni email, ni téléphone. La page publique confirme seulement la validité, le prénom et l’initiale du nom.</p></div></Card>
      </div>
    </main>
  );
}
