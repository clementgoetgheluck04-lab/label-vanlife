import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import QRCode from "qrcode";
import { ArrowLeft, Download, ExternalLink, MessageCircle, ShieldCheck, Stamp } from "lucide-react";
import { KIT_ACCESS_COOKIE, verifyKitAccessToken } from "@/lib/kit-access-token";
import { getPrisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getLabelledPlace } from "@/server/labelled-place";
import { createPlaceCheckInToken } from "@/server/place-checkin-token";
import { getAppUrl } from "@/server/env";
import KitAccessGate from "./KitAccessGate";

export const metadata: Metadata = {
  title: "Kit de communication 2027 | Label Vanlife",
  description: "Téléchargez les logos et bannières officiels Label Vanlife 2027.",
  robots: { index: false, follow: false },
};

const ASSETS = [
  {
    name: "Logo transparent",
    description: "PNG transparent, idéal pour vos propres visuels.",
    href: "/kits/label-vanlife-2027/logo-transparent-label-vanlife-2027.png",
    preview: "/kits/label-vanlife-2027/logo-transparent-label-vanlife-2027.png",
  },
  {
    name: "Logo vert",
    description: "Format carré pour le web et les réseaux sociaux.",
    href: "/kits/label-vanlife-2027/logo-vert-label-vanlife-2027.jpg",
    preview: "/kits/label-vanlife-2027/logo-vert-label-vanlife-2027.jpg",
  },
  {
    name: "Logo noir",
    description: "Format carré adapté aux univers sombres.",
    href: "/kits/label-vanlife-2027/logo-noir-label-vanlife-2027.jpg",
    preview: "/kits/label-vanlife-2027/logo-noir-label-vanlife-2027.jpg",
  },
  {
    name: "Logo blanc",
    description: "Format carré adapté aux fonds clairs.",
    href: "/kits/label-vanlife-2027/logo-blanc-label-vanlife-2027.jpg",
    preview: "/kits/label-vanlife-2027/logo-blanc-label-vanlife-2027.jpg",
  },
  {
    name: "Bannière verte",
    description: "Format horizontal pour les publications et pages web.",
    href: "/kits/label-vanlife-2027/banniere-verte-label-vanlife-2027.jpg",
    preview: "/kits/label-vanlife-2027/banniere-verte-label-vanlife-2027.jpg",
  },
  {
    name: "Bannière noire",
    description: "Format horizontal sur fond sombre.",
    href: "/kits/label-vanlife-2027/banniere-noire-label-vanlife-2027.jpg",
    preview: "/kits/label-vanlife-2027/banniere-noire-label-vanlife-2027.jpg",
  },
] as const;

export default async function KitCommunication2027Page({ searchParams }: { searchParams: Promise<{ erreur?: string }> }) {
  const cookieStore = await cookies();
  let placeId: string | null = null;
  let authorized = false;
  try {
    const access = verifyKitAccessToken(cookieStore.get(KIT_ACCESS_COOKIE)?.value);
    authorized = access?.kind === "access";
    placeId = authorized ? access!.placeId : null;
  } catch {
    authorized = false;
  }

  if (!authorized) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        const profile = await getPrisma().establishmentProfile.findUnique({
          where: { userId: data.user.id },
          select: { status: true, managedPlaces: { select: { slug: true }, take: 1 } },
        });
        authorized = profile?.status === "CERTIFIED" || profile?.status === "ACTIVE";
        placeId = authorized ? profile?.managedPlaces[0]?.slug || null : null;
      }
    } catch {
      // The signed partner link remains available if account lookup is unavailable.
    }
  }

  if (!authorized) {
    const query = await searchParams;
    return <KitAccessGate invalidLink={Boolean(query.erreur)} />;
  }

  const checkInPlace = placeId ? getLabelledPlace(placeId) : undefined;
  const checkInUrl = checkInPlace
    ? `${getAppUrl()}/visite/${checkInPlace.id}?token=${encodeURIComponent(createPlaceCheckInToken(checkInPlace.id, Date.UTC(2028, 0, 1)))}`
    : null;
  const checkInQr = checkInUrl
    ? await QRCode.toDataURL(checkInUrl, { width: 800, margin: 2, color: { dark: "#173e32", light: "#ffffff" } })
    : null;

  return (
    <main className="min-h-screen bg-[#eef1eb] px-4 py-10 text-[#20332b] sm:py-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-900 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Retour à Label Vanlife
        </Link>

        <section className="overflow-hidden rounded-[2rem] bg-white shadow-xl shadow-emerald-950/10">
          <div className="bg-[#173e32] px-6 py-9 text-white sm:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d7c39a]">Kit partenaire officiel</p>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Label Vanlife 2027</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Retrouvez tous les formats du logo prêts à être utilisés sur vos supports numériques et imprimés.
            </p>
          </div>

          <Image
            src="/kits/label-vanlife-2027/banniere-verte-label-vanlife-2027.jpg"
            alt="Bannière Label Vanlife 2027"
            width={1500}
            height={900}
            priority
            className="h-auto w-full"
          />

          <div className="px-6 py-9 sm:px-10 sm:py-12">
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-900">
              Accès partenaire vérifié · Les fichiers sont réservés aux lieux labellisés Label Vanlife.
            </div>
            <div className="rounded-3xl border border-[#e7dcc1] bg-[#f5f0e3] p-6 text-center sm:p-8">
              <h2 className="text-2xl font-bold text-[#173e32]">Tout télécharger en une fois</h2>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
                L’archive ZIP contient les six fichiers officiels en haute définition.
              </p>
              <a
                href="/kits/kit-communication-label-vanlife-2027.zip"
                download
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#173e32] px-6 py-4 font-bold text-white transition hover:bg-[#245645]"
              >
                <Download className="h-5 w-5" /> Télécharger le kit complet
              </a>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ASSETS.map((asset) => (
                <article key={asset.href} className="overflow-hidden rounded-3xl border border-emerald-950/10 bg-white shadow-sm">
                  <div className="relative aspect-square bg-[#202120]">
                    <Image src={asset.preview} alt={asset.name} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-contain" />
                  </div>
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-[#173e32]">{asset.name}</h2>
                    <p className="mt-1 min-h-10 text-sm leading-relaxed text-neutral-600">{asset.description}</p>
                    <a href={asset.href} download className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:underline">
                      <Download className="h-4 w-4" /> Télécharger ce fichier
                    </a>
                  </div>
                </article>
              ))}
            </div>

            {checkInPlace && checkInQr ? (
              <section className="mt-10 grid gap-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-6 sm:grid-cols-[220px_1fr] sm:items-center sm:p-8">
                <div className="rounded-2xl bg-white p-3 shadow-sm">
                  <Image unoptimized src={checkInQr} alt={`QR Passeport pour ${checkInPlace.nom}`} width={800} height={800} className="h-auto w-full" />
                </div>
                <div>
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-800"><Stamp className="h-4 w-4" />Passeport des visiteurs</p>
                  <h2 className="mt-3 text-2xl font-bold text-[#173e32]">QR de visite · {checkInPlace.nom}</h2>
                  <p className="mt-3 leading-relaxed text-neutral-700">Affichez ce QR à l’accueil. Les membres actifs peuvent confirmer leur passage, recevoir un tampon dans leur Passeport et gagner 25 points. Aucune position GPS personnelle n’est enregistrée.</p>
                  <a href={checkInQr} download={`qr-visite-label-vanlife-${checkInPlace.id}.png`} className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-full bg-[#173e32] px-5 font-bold text-white"><Download className="h-4 w-4" />Télécharger le QR de visite</a>
                  <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-emerald-900"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />Le QR identifie uniquement votre établissement. Il est valable pour la saison 2027 et ne contient aucune donnée de membre.</p>
                </div>
              </section>
            ) : null}

            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              <section className="rounded-3xl bg-[#f4f6f3] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#173e32]">Utilisation autorisée</h2>
                <p className="mt-3 leading-relaxed text-neutral-700">
                  Le logo peut être utilisé sur tous vos supports : site internet, réseaux sociaux, newsletters, signatures e-mail,
                  brochures, affiches, panneaux et documents d’accueil. Veillez à conserver ses proportions et ses couleurs.
                </p>
              </section>
              <section className="rounded-3xl bg-[#f4f6f3] p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#173e32]">Logo cliquable sur votre site</h2>
                <p className="mt-3 leading-relaxed text-neutral-700">
                  En pied de page, utilisez une largeur de 160 à 220 px et faites pointer l’image vers
                  {" "}<strong>https://www.labelvanlife.fr/</strong>.
                </p>
              </section>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="https://www.facebook.com/labelvanlife" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#dfe9df] px-5 py-3 font-bold text-[#173e32]">
                <MessageCircle className="h-5 w-5" /> Page Facebook
              </a>
              <Link href="/explorer" className="inline-flex items-center gap-2 rounded-full border border-emerald-900/20 px-5 py-3 font-bold text-[#173e32]">
                Voir les lieux labellisés <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
