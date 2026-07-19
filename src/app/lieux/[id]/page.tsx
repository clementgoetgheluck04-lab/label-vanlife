"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Droplets,
  ExternalLink,
  FileText,
  Gauge,
  Globe2,
  Mail,
  MapPin,
  Navigation,
  PawPrint,
  Phone,
  PlugZap,
  ShowerHead,
  Star,
  Utensils,
  Users,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getPlaceContact } from "@/data/place-contacts";
import { getPlaceMedia } from "@/data/place-media";
import { cleanSourceActivities, cleanSourceCapacity, cleanSourceOpeningHours, getLabelledSourceDetails } from "@/data/labelled-source-details";
import { getRichPlaceDetails } from "@/data/rich-place-details";
import { getVerifiedPlaceGps } from "@/data/verified-place-gps";

const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  electricite: { icon: PlugZap, label: "Électricité" },
  eau: { icon: Droplets, label: "Eau potable" },
  douche: { icon: ShowerHead, label: "Douches" },
  vidange: { icon: Gauge, label: "Aire de vidange" },
  piscine: { icon: Waves, label: "Piscine" },
  restaurant: { icon: Utensils, label: "Restauration" },
  parking: { icon: MapPin, label: "Aire camping-car H24" },
  animaux: { icon: PawPrint, label: "Animaux acceptés" },
  animal_accepted: { icon: PawPrint, label: "Animaux acceptés" },
  plage: { icon: Waves, label: "Accès plage" },
};

const TYPE_LABELS: Record<string, string> = {
  camping: "Camping",
  parking: "Parking",
  etape_nature: "Étape nature",
  hebergement_insolite: "Hébergement insolite",
  restaurant: "Restaurant",
  activite: "Activité",
};

export default function LieuDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const lieu = ENRICHED_LIEUX.find((item) => item.id === id);

  if (!lieu) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="space-y-4 text-center">
          <MapPin className="mx-auto h-12 w-12 text-neutral-300" />
          <h1 className="text-xl font-bold text-neutral-900">Lieu non trouvé</h1>
          <Link href="/explorer"><Button variant="ghost">Retour aux lieux</Button></Link>
        </div>
      </main>
    );
  }

  const media = getPlaceMedia(lieu.id);
  const verifiedContact = getPlaceContact(lieu.id);
  const richDetails = getRichPlaceDetails(lieu.id);
  const sourceDetails = getLabelledSourceDetails(lieu.id);
  const phones = [...new Set([verifiedContact.phone, lieu.telephone, ...sourceDetails.flatMap((source) => source.phones ?? [])].filter((value): value is string => Boolean(value)))];
  const emails = [...new Set([verifiedContact.email, lieu.email, ...sourceDetails.flatMap((source) => source.emails ?? [])].filter((value): value is string => Boolean(value)))];
  const contactNames = [...new Set([richDetails?.contactName, ...sourceDetails.map((source) => source.contactName)].filter((value): value is string => Boolean(value)))];
  const website = verifiedContact.website || lieu.siteWeb || sourceDetails.find((source) => source.website)?.website;
  const verifiedGps = getVerifiedPlaceGps(lieu.id);
  const supplementaryDescriptions = sourceDetails
    .map((source) => source.description?.trim())
    .filter((description): description is string => Boolean(description && !lieu.description.includes(description)));
  const capacities = [...new Set(sourceDetails.map((source) => cleanSourceCapacity(source.capacity)).filter((value): value is string => Boolean(value)))];
  const openingHours = [...new Set(sourceDetails.map((source) => cleanSourceOpeningHours(source.openingHours)).filter((value): value is string => Boolean(value)))];
  const practicalDetails = [...new Set(sourceDetails.flatMap((source) => source.details ?? []))];
  const activities = [...new Set([
    ...cleanSourceActivities(sourceDetails.flatMap((source) => source.activities ?? [])),
    ...(richDetails?.activities ?? []),
  ])];
  const allPhotos = [...new Set([...media.photos, ...sourceDetails.flatMap((source) => source.images ?? [])])];
  const displayAddress = richDetails?.displayAddress || lieu.address;

  return (
    <main className="min-h-screen bg-white pb-24">
      <section className="relative h-64 overflow-hidden bg-emerald-950 sm:h-80 lg:h-[30rem]">
        <Image
          src={lieu.photoUrl || media.photos[0]}
          alt={`Vue de ${lieu.nom}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
        <Link
          href="/explorer"
          aria-label="Retour aux lieux Label Vanlife"
          className="absolute left-4 top-4 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm transition hover:bg-white"
        >
          <ArrowLeft className="h-5 w-5 text-neutral-700" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 mx-auto flex max-w-5xl items-end justify-between gap-4 px-4 pb-6 sm:px-6">
          <div>
            <span className="mb-2 inline-block rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-800 shadow-sm backdrop-blur-sm">
              {richDetails?.displayType || TYPE_LABELS[lieu.type] || lieu.type}
            </span>
            <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-4xl">{lieu.nom}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-white/85">
              <MapPin className="h-4 w-4" /> {lieu.ville}, {lieu.region}
            </p>
          </div>
          {lieu.discountPercent > 0 && (
            <div className="shrink-0 rounded-2xl bg-[#c39960] px-4 py-2 text-center text-white shadow-lg">
              <span className="text-xs font-medium">Avantage membre</span>
              <p className="text-2xl font-bold">−{lieu.discountPercent}%</p>
            </div>
          )}
          {lieu.discountPercent === 0 && lieu.priceHighlight && (
            <div className="shrink-0 rounded-2xl bg-[#c39960] px-4 py-2 text-center text-white shadow-lg">
              <span className="text-xs font-medium">Tarif public accessible</span>
              <p className="text-lg font-bold">{lieu.priceHighlight}</p>
            </div>
          )}
        </div>
      </section>

      <div className="mx-auto mt-7 max-w-5xl space-y-10 px-4 sm:px-6">
        <section className="flex items-start gap-4">
          {lieu.logoUrl ? (
            <Image src={lieu.logoUrl} alt={`Logo ${lieu.nom}`} width={64} height={64} className="h-16 w-16 rounded-2xl border border-neutral-200 bg-white object-contain p-1 shadow-sm" />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50 text-2xl font-bold text-emerald-700">{lieu.nom.charAt(0)}</div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold text-neutral-900">{lieu.nom}</h2>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-700">LABELLISÉ LABEL VANLIFE{richDetails?.labelYear ? ` · ${richDetails.labelYear}` : ""}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
              <Star className="h-4 w-4 fill-[#c39960] text-[#c39960]" />
              <span className="font-medium text-neutral-700">{lieu.note.toFixed(1)}</span>
              <span>({lieu.avisCount} avis)</span>
            </div>
          </div>
        </section>

        {richDetails?.discountInstructions && richDetails.discountInstructions.length > 0 && (
          <section className="overflow-hidden rounded-3xl border border-[#c39960]/35 bg-[#f7f1e8]">
            <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8b673d]">Réduction membres</p>
                <p className="mt-2 text-5xl font-black text-neutral-950">−{lieu.discountPercent}%</p>
              </div>
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-neutral-900">Comment profiter de l’avantage</h2>
                {richDetails.promoCode && <p className="inline-flex rounded-xl border border-[#c39960]/40 bg-white px-4 py-2 text-sm text-neutral-700">Code de réservation : <strong className="ml-2 font-mono text-neutral-950">{richDetails.promoCode}</strong></p>}
                {richDetails.discountInstructions.map((instruction) => (
                  <p key={instruction} className="flex gap-3 text-sm leading-6 text-neutral-700"><span className="font-bold text-[#8b673d]">→</span><span>{instruction}</span></p>
                ))}
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-xl font-bold text-neutral-900">À propos du lieu</h2>
          <p className="max-w-4xl leading-7 text-neutral-600">{lieu.description}</p>
          {supplementaryDescriptions.map((description) => (
            <p key={description} className="mt-4 max-w-4xl leading-7 text-neutral-600">{description}</p>
          ))}
        </section>

        {richDetails?.venueQuote && (
          <section className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-9">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dfc59f]">Le mot du lieu</p>
            <blockquote className="mt-4 max-w-4xl text-xl font-medium italic leading-8 text-white/90">« {richDetails.venueQuote} »</blockquote>
          </section>
        )}

        {richDetails?.vanliferExperience && richDetails.vanliferExperience.length > 0 && (
          <section>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Destination</span>
            <h2 className="mt-2 text-2xl font-bold text-neutral-900">L’expérience vanlifer</h2>
            <div className="mt-5 max-w-4xl space-y-4">
              {richDetails.vanliferExperience.map((paragraph) => <p key={paragraph} className="leading-7 text-neutral-600">{paragraph}</p>)}
            </div>
          </section>
        )}

        {lieu.services.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Équipements et services</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {lieu.services.map((service) => {
                const serviceData = SERVICE_ICONS[service];
                const Icon = serviceData?.icon ?? Star;
                return (
                  <div key={service} className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5">
                    <Icon className="h-5 w-5 shrink-0 text-emerald-700" />
                    <span className="text-sm font-medium text-neutral-700">{serviceData?.label ?? service}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {(capacities.length > 0 || openingHours.length > 0 || practicalDetails.length > 0) && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Accueil et informations détaillées</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {capacities.map((capacity) => (
                <div key={capacity} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400"><Users className="h-4 w-4" /> Capacité</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-800">{capacity}</p>
                </div>
              ))}
              {openingHours.map((hours) => (
                <div key={hours} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400"><CalendarDays className="h-4 w-4" /> Période d’ouverture</p>
                  <p className="mt-2 text-sm font-semibold text-neutral-800">{hours}</p>
                </div>
              ))}
              {practicalDetails.map((detail) => (
                <div key={detail} className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 sm:col-span-2">
                  <p className="text-sm leading-6 text-emerald-950">{detail}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activities.length > 0 && (
          <section>
            <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-900"><Activity className="h-5 w-5 text-emerald-700" /> Loisirs et activités</h2>
            <div className="flex flex-wrap gap-2">
              {activities.map((activity) => (
                <span key={activity} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-900">{activity}</span>
              ))}
            </div>
          </section>
        )}

        {(richDetails?.vanSpecifics || richDetails?.opening || richDetails?.swimming || richDetails?.dining) && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Préparer votre séjour</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {richDetails.vanSpecifics && <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><MapPin className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-bold text-neutral-900">Spécificités van</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{richDetails.vanSpecifics}</p></div>}
              {richDetails.opening && <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><Clock3 className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-bold text-neutral-900">Ouverture et horaires</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{richDetails.opening}</p>{richDetails.openingMonths && <div className="mt-3 flex flex-wrap gap-1.5">{richDetails.openingMonths.map((month) => <span key={month} className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-emerald-800 shadow-sm">{month}</span>)}</div>}</div>}
              {richDetails.swimming && <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><Waves className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-bold text-neutral-900">Piscine et baignade</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{richDetails.swimming}</p></div>}
              {richDetails.dining && <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><Utensils className="h-5 w-5 text-emerald-700" /><h3 className="mt-3 font-bold text-neutral-900">Restauration</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{richDetails.dining}</p></div>}
            </div>
          </section>
        )}

        {richDetails?.otherInfo && richDetails.otherInfo.length > 0 && (
          <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-emerald-950">Autres informations</h2>
            <div className="mt-3 space-y-2">{richDetails.otherInfo.map((info) => <p key={info} className="text-sm leading-6 text-emerald-900">{info}</p>)}</div>
          </section>
        )}

        {(phones.length > 0 || emails.length > 0 || contactNames.length > 0 || website || richDetails?.facebookUrl || lieu.horaires || displayAddress) && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Informations pratiques</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {contactNames.map((contactName) => <div key={contactName} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"><Users className="h-5 w-5 text-emerald-700" /><span><span className="block text-xs text-neutral-400">Contact sur place</span>{contactName}</span></div>)}
              {phones.map((phone) => <a key={phone} href={`tel:${phone}`} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Phone className="h-5 w-5 text-emerald-700" /><span>{phone}</span></a>)}
              {emails.map((email) => <a key={email} href={`mailto:${email}`} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Mail className="h-5 w-5 text-emerald-700" /><span className="truncate">{email}</span></a>)}
              {website && <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Globe2 className="h-5 w-5 text-emerald-700" /><span>Site officiel</span><ExternalLink className="ml-auto h-4 w-4" /></a>}
              {richDetails?.facebookUrl && <a href={richDetails.facebookUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><ExternalLink className="h-5 w-5 text-emerald-700" /><span>Page Facebook</span><ExternalLink className="ml-auto h-4 w-4" /></a>}
              {lieu.horaires && <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"><Clock3 className="h-5 w-5 text-emerald-700" /><span>{lieu.horaires}</span></div>}
              {displayAddress && <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"><MapPin className="h-5 w-5 text-emerald-700" /><span>{displayAddress}</span></div>}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">S’y rendre</h2>
          <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${lieu.coordonnees.lat},${lieu.coordonnees.lng}&travelmode=driving`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"><Navigation className="h-4 w-4" /> Y aller avec Maps</a>
            <a href={`https://waze.com/ul?ll=${lieu.coordonnees.lat}%2C${lieu.coordonnees.lng}&navigate=yes`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"><Navigation className="h-4 w-4" /> Waze</a>
          </div>
          {verifiedGps && <p className="mt-3 text-xs text-neutral-500">Point GPS exact de l&apos;établissement vérifié sur Google Maps le 18 juillet 2026 · {lieu.coordonnees.lat}, {lieu.coordonnees.lng}.</p>}
        </section>

        {(richDetails?.reservationUrl || richDetails?.tourismUrl || richDetails?.regionLink) && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Réservation et activités aux alentours</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {richDetails.reservationUrl && <a href={richDetails.reservationUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl bg-[#c39960] px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-[#ad8250]"><CalendarDays className="h-4 w-4" /> {richDetails.reservationLabel || "Réserver un emplacement"} <ExternalLink className="h-4 w-4" /></a>}
              {richDetails.tourismUrl && <a href={richDetails.tourismUrl} target="_blank" rel="noreferrer" className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-center text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"><Activity className="h-4 w-4" /> Activités et tourisme <ExternalLink className="h-4 w-4" /></a>}
              {richDetails.regionLink && <Link href={richDetails.regionLink.href} className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 py-3 text-center text-sm font-bold text-neutral-700 transition hover:border-emerald-300"><MapPin className="h-4 w-4" /> {richDetails.regionLink.label} <ArrowRight className="h-4 w-4" /></Link>}
            </div>
            {richDetails.bookingMethods && <p className="mt-4 text-sm text-neutral-500">Réservation possible : <strong className="font-semibold text-neutral-700">{richDetails.bookingMethods.join(" · ")}</strong></p>}
          </section>
        )}

        {allPhotos.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Photos du lieu</h2>
                <p className="mt-1 text-sm text-neutral-500">{allPhotos.length} visuel{allPhotos.length > 1 ? "s" : ""} disponible{allPhotos.length > 1 ? "s" : ""} pour préparer votre séjour.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {allPhotos.map((photo, index) => (
                <a key={photo} href={photo} target="_blank" rel="noreferrer" className={`group relative overflow-hidden rounded-2xl bg-neutral-100 ${index === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <div className="relative aspect-[4/3]">
                    <Image src={photo} alt={`${lieu.nom} — photo ${index + 1}`} fill unoptimized={photo.startsWith("http")} sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"} className="object-cover transition duration-300 group-hover:scale-[1.03]" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}

        {media.documents.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Plans et documents utiles</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {media.documents.map((document) => (
                <a key={document.url} href={document.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 font-medium text-neutral-800 transition hover:border-[#c39960] hover:bg-white">
                  <FileText className="h-6 w-6 text-[#c39960]" />
                  <span>{document.label}</span>
                  <ExternalLink className="ml-auto h-4 w-4 text-neutral-400" />
                </a>
              ))}
            </div>
          </section>
        )}

        <section className="flex flex-wrap gap-2">
          {lieu.labels.map((label) => <Badge key={label} variant="info">{label}</Badge>)}
          {lieu.tags.map((tag) => <span key={tag} className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1.5 text-xs capitalize text-neutral-600"># {tag}</span>)}
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-emerald-700 to-emerald-600 p-7 text-center shadow-lg sm:p-10">
          <div className="flex items-baseline justify-center gap-2 text-white">
            <span className="text-xl text-emerald-200 line-through">39€</span>
            <span className="text-4xl font-bold">29€</span>
            <span className="text-emerald-100">/ 12 mois</span>
          </div>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-emerald-50">
            {lieu.discountPercent > 0
              ? <>Devenez membre pour profiter de <strong className="text-white">−{lieu.discountPercent}%</strong> chez {lieu.nom} et des avantages de tous les lieux labellisés.</>
              : <>Repérez {lieu.nom} et tous les lieux labellisés depuis votre espace membre et la carte interactive Label Vanlife.</>}
          </p>
          <Link href="/devenir-membre" className="mt-5 inline-block">
            <Button variant="primary" className="gap-2 bg-white px-8 text-emerald-800 hover:bg-emerald-50">Obtenir ma carte membre — 29€ <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </section>

        <div className="text-center">
          <Link href="/explorer"><Button variant="ghost" className="gap-1 text-neutral-500"><ArrowLeft className="h-4 w-4" /> Retour à la liste</Button></Link>
        </div>
      </div>
    </main>
  );
}
