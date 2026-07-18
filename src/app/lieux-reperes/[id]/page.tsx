import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Activity, ArrowLeft, Building2, CalendarDays, CircleAlert, ExternalLink, Mail, MapPin, Navigation, Phone, ShieldCheck, Users } from "lucide-react";
import { buildClaimHref, buildRemovalMailto, classifySpottedPlace, getSpottedPlace, normalizeExternalWebsite, PLACE_UNIVERSE_LABELS, SPOTTED_PLACES } from "@/data/spotted-places";

type PageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return SPOTTED_PLACES.map((place) => ({ id: place.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const place = getSpottedPlace((await params).id);
  if (!place) return {};
  return {
    title: `${place.name} — lieu repéré, non labellisé`,
    description: `${place.name} à ${place.city} a été repéré par Label Vanlife. Cet établissement n'est pas encore labellisé et ses informations restent à vérifier.`,
    robots: { index: false, follow: true },
  };
}

export default async function SpottedPlacePage({ params }: PageProps) {
  const place = getSpottedPlace((await params).id);
  if (!place) notFound();
  const website = normalizeExternalWebsite(place.website);
  const category = PLACE_UNIVERSE_LABELS[classifySpottedPlace(place)];
  const phones = [...new Set([place.phone, ...(place.phones ?? [])].filter((value): value is string => Boolean(value)))];

  return (
    <main className="min-h-screen bg-neutral-50 pb-20 pt-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Link href="/explorer#spotted-places-title" className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-neutral-600 hover:bg-white hover:text-neutral-900">
          <ArrowLeft className="h-4 w-4" /> Retour aux lieux
        </Link>

        <article className="mt-5 overflow-hidden rounded-3xl border border-[#c39960]/30 bg-white shadow-sm">
          <div className="bg-gradient-to-br from-[#f7f1e8] via-[#fbf8f3] to-white p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-900">
                <CircleAlert className="h-4 w-4" /> Lieu repéré — non labellisé
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-neutral-500 shadow-sm">Informations à vérifier</span>
            </div>
            <div className="mt-7 flex items-start gap-4">
              <div className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8b673d] shadow-sm sm:flex">
                <Building2 className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">{place.name}</h1>
                <p className="mt-3 flex items-start gap-2 text-neutral-600">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#c39960]" />
                  <span>{place.address}<br />{place.postalCode} {place.city}{place.region ? ` · ${place.region}` : ""}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_0.9fr]">
            <div>
              {place.images && place.images.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-neutral-900">Photos disponibles</h2>
                  <p className="mt-1 text-xs text-neutral-500">Visuels issus de la fiche source fournie à Label Vanlife.</p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {place.images.map((image, index) => (
                      <div key={image} className={`relative overflow-hidden rounded-2xl bg-neutral-100 ${index === 0 ? "col-span-2 aspect-[16/8]" : "aspect-[4/3]"}`}>
                        <Image src={image} alt={`${place.name} — photo ${index + 1}`} fill unoptimized sizes={index === 0 ? "(max-width: 1024px) 100vw, 520px" : "(max-width: 1024px) 50vw, 250px"} className="object-cover" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {place.description && (
                <section className="mb-8">
                  <h2 className="text-xl font-bold text-neutral-900">Présentation du lieu</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-700">{place.description}</p>
                </section>
              )}

              <h2 className="text-xl font-bold text-neutral-900">Ce que nous savons</h2>
              <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                <div className="rounded-2xl bg-neutral-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Réseau dans lequel le lieu a été repéré</dt><dd className="mt-1 font-semibold text-neutral-800">{place.network}</dd></div>
                <div className="rounded-2xl bg-neutral-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Type de lieu</dt><dd className="mt-1 font-semibold text-neutral-800">{category}</dd></div>
                <div className="rounded-2xl bg-neutral-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Localisation</dt><dd className="mt-1 font-semibold text-neutral-800">{place.city} · {place.region}</dd></div>
                {place.contactName && <div className="rounded-2xl bg-neutral-50 p-4"><dt className="text-xs font-bold uppercase tracking-wider text-neutral-400">Contact indiqué</dt><dd className="mt-1 font-semibold text-neutral-800">{place.contactName}</dd></div>}
                {place.capacity && <div className="rounded-2xl bg-neutral-50 p-4"><dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400"><Users className="h-3.5 w-3.5" /> Capacité</dt><dd className="mt-1 font-semibold text-neutral-800">{place.capacity}</dd></div>}
                {place.openingHours && <div className="rounded-2xl bg-neutral-50 p-4"><dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400"><CalendarDays className="h-3.5 w-3.5" /> Ouverture annoncée</dt><dd className="mt-1 font-semibold text-neutral-800">{place.openingHours}</dd></div>}
              </dl>

              {(phones.length > 0 || (place.emails?.length ?? 0) > 0) && (
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {phones.map((phone) => <a key={phone} href={`tel:${phone}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 hover:border-emerald-300"><Phone className="h-4 w-4 text-emerald-700" /> {phone}</a>)}
                  {place.emails?.map((email) => <a key={email} href={`mailto:${email}`} className="flex min-h-12 items-center gap-2 rounded-xl border border-neutral-200 px-4 text-sm font-semibold text-neutral-700 hover:border-emerald-300"><Mail className="h-4 w-4 text-emerald-700" /> <span className="truncate">{email}</span></a>)}
                </div>
              )}

              {place.details && place.details.length > 0 && (
                <section className="mt-8">
                  <h2 className="text-xl font-bold text-neutral-900">Accueil et prestations indiqués</h2>
                  <div className="mt-4 space-y-3">
                    {place.details.map((detail) => <p key={detail} className="rounded-2xl bg-emerald-50 p-4 text-sm leading-6 text-emerald-950">{detail}</p>)}
                  </div>
                </section>
              )}

              {place.activities && place.activities.length > 0 && (
                <section className="mt-8">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-neutral-900"><Activity className="h-5 w-5 text-emerald-700" /> Loisirs et activités indiqués</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {place.activities.map((activity) => <span key={activity} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">{activity}</span>)}
                  </div>
                </section>
              )}

              {place.memberOffer && (
                <div className="mt-8 rounded-2xl border border-[#c39960]/40 bg-[#f7f1e8] p-5 text-sm leading-6 text-neutral-800">
                  <strong>Information publiée par le réseau {place.network}</strong>
                  <p className="mt-1">{place.memberOffer}</p>
                  <p className="mt-2 text-xs text-neutral-500">Cette condition provient du document source et doit être vérifiée directement auprès du lieu. Ce n’est pas un avantage membre Label Vanlife.</p>
                </div>
              )}
              {website && (
                <a href={website} target="_blank" rel="noreferrer nofollow" className="mt-5 inline-flex min-h-12 items-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800">
                  Réserver ou visiter le site de l&apos;établissement <ExternalLink className="h-4 w-4" />
                </a>
              )}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}&travelmode=driving`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-center text-sm font-bold text-emerald-800 hover:bg-emerald-100"><Navigation className="h-4 w-4" /> Y aller avec Maps</a>
                <a href={`https://waze.com/ul?ll=${place.lat}%2C${place.lng}&navigate=yes`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-50 px-3 py-3 text-center text-sm font-bold text-blue-700 hover:bg-blue-100"><Navigation className="h-4 w-4" /> Waze</a>
              </div>
              <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
                <strong>Aucun partenariat ni avantage membre n&apos;est garanti.</strong>
                <p className="mt-1">Label Vanlife n&apos;a pas encore audité cet établissement. La présence de cette fiche ne vaut ni labellisation, ni recommandation commerciale.</p>
              </div>
              <p className="mt-4 text-xs leading-5 text-neutral-400">Source des informations : {place.source}. Point GPS : {place.lat}, {place.lng} · vérifié le 18 juillet 2026 d&apos;après {place.gpsSource ?? "la fiche source"}.</p>
            </div>

            <aside className="rounded-3xl bg-neutral-950 p-6 text-white sm:p-7">
              <ShieldCheck className="h-8 w-8 text-[#c39960]" />
              <h2 className="mt-5 text-2xl font-bold">Vous gérez cet établissement ?</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-300">Revendiquez cette fiche pour préremplir votre candidature, vérifier les informations et demander la labellisation.</p>
              <Link href={buildClaimHref(place)} className="mt-6 flex min-h-14 w-full items-center justify-center rounded-xl bg-[#c39960] px-5 py-4 text-center text-sm font-extrabold uppercase tracking-wide text-white shadow-lg transition-transform hover:-translate-y-0.5 hover:bg-[#ad8250]">
                Revendiquer cet établissement
              </Link>
              <div className="my-6 h-px bg-white/10" />
              <p className="text-xs leading-5 text-neutral-400">Une information est incorrecte ou vous ne souhaitez pas apparaître sur Label Vanlife ?</p>
              <a href={buildRemovalMailto(place)} className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
                <Mail className="h-4 w-4" /> Demander une correction ou le retrait
              </a>
            </aside>
          </div>
        </article>
      </div>
    </main>
  );
}
