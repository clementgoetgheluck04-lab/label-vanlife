import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, LockKeyhole, MapPin, ShieldCheck, Stamp } from "lucide-react";

import { Card } from "@/components/ui/Card";
import { getLabelledPlace } from "@/server/labelled-place";
import { hasActiveMemberAccess } from "@/server/auth";
import { verifyPlaceCheckInToken } from "@/server/place-checkin-token";
import ConfirmVisitButton from "./ConfirmVisitButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Confirmer une visite | Label Vanlife", robots: { index: false, follow: false } };

export default async function PlaceVisitPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ token?: string }> }) {
  const { slug } = await params;
  const token = (await searchParams).token || "";
  const payload = verifyPlaceCheckInToken(token);
  const place = payload?.placeSlug === slug ? getLabelledPlace(slug) : undefined;

  if (!place) {
    return <main className="flex min-h-screen items-center justify-center bg-[#eef1eb] px-4 py-12"><Card className="w-full max-w-md p-8 text-center"><LockKeyhole className="mx-auto h-12 w-12 text-red-500" /><h1 className="mt-4 text-2xl font-bold text-neutral-950">QR de visite non valide</h1><p className="mt-2 text-sm leading-6 text-neutral-600">Demandez à l’établissement de vous présenter son QR officiel Label Vanlife.</p><Link href="/member" className="mt-6 inline-flex font-bold text-emerald-800 underline">Retour à mon espace</Link></Card></main>;
  }

  const activeMember = await hasActiveMemberAccess();
  const redirectPath = `/visite/${slug}?token=${encodeURIComponent(token)}`;

  return <main className="flex min-h-screen items-center justify-center bg-[#eef1eb] px-4 py-12"><Card className="w-full max-w-lg overflow-hidden p-0"><div className="bg-[#173e32] px-7 py-8 text-white"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d7c39a]">Passeport Label Vanlife</p><Stamp className="mt-5 h-12 w-12" /><h1 className="mt-4 text-3xl font-black">Confirmer votre visite</h1></div><div className="p-7"><p className="flex items-start gap-3 text-lg font-bold text-neutral-950"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />{place.nom}</p><p className="mt-1 pl-8 text-sm text-neutral-500">{place.ville} · {place.region}</p><div className="my-6 flex items-start gap-3 rounded-2xl bg-neutral-50 p-4 text-sm leading-6 text-neutral-600"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /><p>Cette confirmation enregistre uniquement le lieu et la date dans votre Passeport. Aucune position GPS personnelle n’est collectée ou publiée.</p></div>{activeMember ? <ConfirmVisitButton token={token} /> : <div className="space-y-3"><Link href={`/member-login?redirect=${encodeURIComponent(redirectPath)}`} className="flex min-h-14 items-center justify-center rounded-full bg-[#173e32] px-6 text-center font-bold text-white">Me connecter pour confirmer</Link><Link href="/devenir-membre" className="flex min-h-12 items-center justify-center gap-2 text-center text-sm font-bold text-emerald-800 underline"><CheckCircle2 className="h-4 w-4" />Découvrir la Carte membre</Link></div>}</div></Card></main>;
}
