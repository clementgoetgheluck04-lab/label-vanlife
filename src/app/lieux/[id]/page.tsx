"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
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
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { getPlaceContact } from "@/data/place-contacts";
import { getPlaceMedia } from "@/data/place-media";

const SERVICE_ICONS: Record<string, { icon: LucideIcon; label: string }> = {
  wifi: { icon: Wifi, label: "Wi-Fi" },
  electricite: { icon: PlugZap, label: "Électricité" },
  eau: { icon: Droplets, label: "Eau potable" },
  douche: { icon: ShowerHead, label: "Douches" },
  vidange: { icon: Gauge, label: "Aire de vidange" },
  piscine: { icon: Waves, label: "Piscine" },
  restaurant: { icon: Utensils, label: "Restauration" },
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
  const phone = verifiedContact.phone || lieu.telephone;
  const email = verifiedContact.email || lieu.email;
  const website = verifiedContact.website || lieu.siteWeb;

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
              {TYPE_LABELS[lieu.type] || lieu.type}
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
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold tracking-wide text-emerald-700">LABELLISÉ LABEL VANLIFE</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-sm text-neutral-500">
              <Star className="h-4 w-4 fill-[#c39960] text-[#c39960]" />
              <span className="font-medium text-neutral-700">{lieu.note.toFixed(1)}</span>
              <span>({lieu.avisCount} avis)</span>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-neutral-900">À propos du lieu</h2>
          <p className="max-w-4xl leading-7 text-neutral-600">{lieu.description}</p>
        </section>

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

        {(phone || email || website || lieu.horaires || lieu.address) && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-neutral-900">Informations pratiques</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {phone && <a href={`tel:${phone}`} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Phone className="h-5 w-5 text-emerald-700" /><span>{phone}</span></a>}
              {email && <a href={`mailto:${email}`} className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Mail className="h-5 w-5 text-emerald-700" /><span className="truncate">{email}</span></a>}
              {website && <a href={website} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4 transition hover:border-emerald-300"><Globe2 className="h-5 w-5 text-emerald-700" /><span>Site officiel</span><ExternalLink className="ml-auto h-4 w-4" /></a>}
              {lieu.horaires && <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"><Clock3 className="h-5 w-5 text-emerald-700" /><span>{lieu.horaires}</span></div>}
              {lieu.address && <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-4"><MapPin className="h-5 w-5 text-emerald-700" /><span>{lieu.address}</span></div>}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-xl font-bold text-neutral-900">S’y rendre</h2>
          <div className="grid grid-cols-2 gap-3 sm:max-w-xl">
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${lieu.coordonnees.lat},${lieu.coordonnees.lng}`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100"><Navigation className="h-4 w-4" /> Google Maps</a>
            <a href={`https://waze.com/ul?ll=${lieu.coordonnees.lat}%2C${lieu.coordonnees.lng}&navigate=yes`} target="_blank" rel="noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-100"><Navigation className="h-4 w-4" /> Waze</a>
          </div>
        </section>

        {media.photos.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">Photos du lieu</h2>
                <p className="mt-1 text-sm text-neutral-500">{media.photos.length} visuel{media.photos.length > 1 ? "s" : ""} transmis par l’établissement.</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {media.photos.map((photo, index) => (
                <a key={photo} href={photo} target="_blank" rel="noreferrer" className={`group relative overflow-hidden rounded-2xl bg-neutral-100 ${index === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <div className="relative aspect-[4/3]">
                    <Image src={photo} alt={`${lieu.nom} — photo ${index + 1}`} fill sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "(max-width: 640px) 50vw, 33vw"} className="object-cover transition duration-300 group-hover:scale-[1.03]" />
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
