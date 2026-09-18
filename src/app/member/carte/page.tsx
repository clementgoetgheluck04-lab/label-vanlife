import Link from "next/link";
import { ArrowLeft, ShieldCheck, Sparkles, UserRound, Users } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getMemberData } from "@/server/member-data";
import { MemberCardInteractive } from "./MemberCardInteractive";
import { MemberContactEditor } from "./MemberContactEditor";

export const dynamic = "force-dynamic";

export default async function MemberCardPage() {
  const member = await getMemberData();

  if (member.preview) {
    return <main className="mx-auto max-w-md px-4 py-12"><Link href="/member" className="inline-flex items-center gap-2 text-sm text-stone"><ArrowLeft className="h-4 w-4" />Retour</Link><Card className="mt-6 py-12 text-center"><ShieldCheck className="mx-auto h-12 w-12 text-sage" /><h1 className="mt-4 text-xl font-bold text-charcoal">Prévisualisation sécurisée</h1><p className="mt-2 text-sm text-stone">Aucune fausse carte n’est générée en mode administrateur. Connectez un vrai compte membre actif pour tester la carte personnelle.</p></Card></main>;
  }

  const card = member.memberCard;
  const membership = member.membership;
  if (!card || membership?.status !== "ACTIVE") {
    return <main className="mx-auto max-w-md px-4 py-12 text-center"><h1 className="text-xl font-bold text-charcoal">Carte indisponible</h1><p className="mt-2 text-sm text-stone">Aucune carte active n’est associée à ce compte.</p><Link href="/devenir-membre" className="mt-5 inline-flex rounded-xl bg-sage px-5 py-3 text-sm font-bold text-white">Découvrir l’offre membre</Link></main>;
  }

  const profile = member.profile;
  const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "Membre Label Vanlife";
  const year = membership.expiresAt?.getFullYear() ?? 2027;
  const people = [
    { id: member.id, name: fullName, number: `${card.cardNumber}-01`, role: "Titulaire" },
    ...member.memberCompanions.map((person, index) => ({ id: person.id, name: `${person.firstName} ${person.lastName}`, number: `${card.cardNumber}-${String(index + 2).padStart(2, "0")}`, role: "Accompagnant" })),
  ];
  return (
    <main className="min-h-screen bg-gradient-to-b from-sage/10 to-white px-4 py-8 pb-24">
      <div className="mx-auto max-w-md space-y-7">
        <Link href="/member" className="inline-flex items-center gap-2 text-sm text-stone"><ArrowLeft className="h-4 w-4" />Retour à l’espace membre</Link>
        <header className="text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/10"><Sparkles className="h-7 w-7 text-sage" /></span><h1 className="mt-3 text-2xl font-bold text-charcoal">Ma carte membre</h1><p className="mt-2 text-sm text-stone">Touchez la carte pour afficher les personnes couvertes. Vos coordonnées restent séparées et privées.</p></header>

        <MemberCardInteractive cardNumber={card.cardNumber} year={year} fullName={fullName} level={profile?.level ?? "EXPLORATEUR"} points={profile?.points ?? 0} people={people.map(({ name, number, role }) => ({ name, number, role }))} />

        <MemberContactEditor initial={{ phone: profile?.phone ?? "", addressLine1: profile?.addressLine1 ?? "", addressLine2: profile?.addressLine2 ?? "", postalCode: profile?.postalCode ?? "", city: profile?.city ?? "", country: profile?.country ?? "France" }} />

        <Card className="overflow-hidden p-0"><div className="flex items-center gap-3 border-b border-border bg-sage/5 px-5 py-4"><Users className="h-5 w-5 text-sage" /><div><h2 className="text-sm font-bold text-charcoal">Personnes couvertes</h2><p className="text-xs text-stone">Un numéro distinct par personne.</p></div></div><div className="divide-y divide-border">{people.map((person) => <div key={person.id} className="flex items-center gap-3 px-5 py-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage/10"><UserRound className="h-5 w-5 text-sage" /></span><div className="min-w-0 flex-1"><p className="font-semibold text-charcoal">{person.name}</p><p className="text-xs text-stone">{person.role}</p></div><span className="rounded-lg bg-neutral-100 px-2 py-1 font-mono text-[10px] text-stone">{person.number}</span></div>)}</div></Card>

        <Card className="flex items-start gap-3 border-sage/20 bg-sage/5"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sage" /><div><h2 className="text-sm font-bold text-charcoal">Carte personnelle et privée</h2><p className="mt-1 text-xs leading-relaxed text-stone">L’image téléchargée contient uniquement votre identité, les personnes couvertes, les numéros de carte et la validité. Email, téléphone et adresse ne sont jamais exportés.</p></div></Card>
      </div>
    </main>
  );
}
