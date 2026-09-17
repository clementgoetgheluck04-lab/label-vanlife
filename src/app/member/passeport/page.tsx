import Link from "next/link";
import { ArrowLeft, Clock3, Quote, ShieldCheck, Stamp, Star } from "lucide-react";

import { Card } from "@/components/ui/Card";
import StampMemoryForm from "@/components/member/StampMemoryForm";
import VisitProofForm from "@/components/member/VisitProofForm";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getMemberData } from "@/server/member-data";
import { readVisitProofMetadata } from "@/server/visit-proof";

export default async function MemberPasseportPage() {
  const member = await getMemberData();
  const stamps = member.preview ? [] : member.passportStamps;
  const reviews = member.preview ? [] : member.reviews;
  const places = ENRICHED_LIEUX.filter((place) => place.status === "actif").map((place) => ({ slug: place.id, name: place.nom, city: place.ville, discountPercent: place.discountPercent || 0 })).sort((left, right) => left.name.localeCompare(right.name, "fr"));

  return (
    <main className="px-4 pb-24 pt-4 lg:px-0 lg:pt-0"><div className="mx-auto max-w-2xl space-y-6">
      <header className="flex items-center gap-3"><Link href="/member" aria-label="Retour à l’espace membre" className="rounded-full p-2 text-stone hover:bg-neutral-100"><ArrowLeft className="h-5 w-5" /></Link><div><h1 className="flex items-center gap-2 text-2xl font-bold text-charcoal"><Stamp className="h-6 w-6 text-amber" />Mon passeport</h1><p className="text-sm text-stone">{stamps.length} visite{stamps.length > 1 ? "s" : ""} enregistrée{stamps.length > 1 ? "s" : ""}</p></div></header>
      {stamps.length === 0 ? <Card className="py-10 text-center"><Stamp className="mx-auto h-12 w-12 text-stone/30" /><p className="mt-3 font-medium text-stone">Votre passeport attend sa première visite</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone/70">Après votre séjour, ajoutez une photo de l’emplacement, une photo des tarifs et une photo au choix. Votre badge de passage sera créé automatiquement.</p></Card> : <div className="space-y-3">{stamps.map((stamp) => { const review = reviews.find((item) => item.placeId === stamp.placeId); const proof = readVisitProofMetadata(review?.photos); return <Card key={stamp.id} className="p-5"><div className="flex gap-4"><span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sage/20 to-amber/20 text-2xl">📍</span><div className="flex-1"><h2 className="font-bold text-charcoal">{stamp.place.name}</h2><p className="text-xs text-stone">{stamp.place.city}, {stamp.place.region}</p><p className="mt-1 text-xs font-medium text-sage">{stamp.visitedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>{stamp.amountSavedCents !== null ? <p className="mt-1 text-xs font-bold text-emerald-700">{(stamp.amountSavedCents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" })} économisés</p> : null}{review ? <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${review.isVerified ? "bg-emerald-100 text-emerald-800" : proof?.status === "MEDIATION" ? "bg-amber-100 text-amber-800" : "bg-neutral-100 text-neutral-600"}`}>{review.isVerified ? <ShieldCheck className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}{review.isVerified ? "Retour validé et publié" : proof?.status === "MEDIATION" ? "Échange qualité en cours" : "Retour en attente de validation"}</p> : null}{stamp.note ? <div className="mt-2 flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`h-3 w-3 ${index < stamp.note! ? "fill-amber text-amber" : "text-stone/20"}`} />)}</div> : null}</div></div>{stamp.comment ? <p className="mt-4 flex gap-2 rounded-xl bg-cream p-3 text-sm italic text-stone"><Quote className="h-4 w-4 shrink-0 text-sage" />{stamp.comment}</p> : null}<StampMemoryForm stampId={stamp.id} initialNote={stamp.note} initialComment={stamp.comment} initialAmountSavedCents={stamp.amountSavedCents} /></Card>; })}</div>}
      {member.preview ? <Card className="p-5 text-sm text-stone">Le formulaire de preuve de visite est disponible pour les membres connectés.</Card> : <VisitProofForm places={places} />}
    </div></main>
  );
}
