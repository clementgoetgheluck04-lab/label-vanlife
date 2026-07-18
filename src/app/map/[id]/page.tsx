"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Heart,
  Share2,
  Navigation,
  Wifi,
  Droplets,
  Zap,
  ShowerHead,
  Truck,
  Sofa,
  PawPrint,
  ChefHat,
  ShoppingCart,
  Accessibility,
  Car,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ENRICHED_LIEUX } from "@/data/enriched-lieux";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { Service } from "@/lib/types";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

const SERVICE_ICONS: Partial<Record<Service, typeof Wifi>> = {
  wifi: Wifi,
  eau: Droplets,
  electricite: Zap,
  douche: ShowerHead,
  vidange: Truck,
  "lave-linge": Sofa,
  animal_accepted: PawPrint,
  accessible: Accessibility,
  parking: Car,
  restaurant: ChefHat,
  epicerie: ShoppingCart,
  piscine: Sparkles,
};

const SERVICE_LABELS: Record<string, string> = {
  wifi: "WiFi",
  eau: "Eau potable",
  electricite: "\u00c9lectricit\u00e9",
  douche: "Douche",
  vidange: "Vidange",
  "lave-linge": "Lave-linge",
  animal_accepted: "Animaux accept\u00e9s",
  accessible: "Acc\u00e8s handicap\u00e9s",
  parking: "Parking",
  restaurant: "Restaurant",
  epicerie: "\u00c9picerie",
  piscine: "Piscine",
};

export default function LieuDetailPage() {
  const params = useParams();
  const router = useRouter();

  const lieu = ENRICHED_LIEUX.find((l) => l.id === params.id);

  if (!lieu) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center bg-cream">
        <div className="text-center space-y-4 px-6">
          <span className="text-6xl">🔍</span>
          <h1 className="text-3xl font-bold text-charcoal">
            Lieu non trouv\u00e9
          </h1>
          <p className="text-stone">
            Ce lieu n&apos;existe pas ou n&apos;est plus labellis\u00e9.
          </p>
          <Link
            href="/map"
            className="inline-block px-6 py-3 bg-sage text-white font-semibold rounded-full hover:bg-sage/90 transition-colors"
          >
            Retour \u00e0 l&apos;explorateur
          </Link>
        </div>
      </div>
    );
  }

  const nearbyLieux = ENRICHED_LIEUX.filter(
    (l) => l.region === lieu.region && l.id !== lieu.id
  ).slice(0, 4);

  const stars = renderStarsArray(lieu.note);
  const typeLabel = getTypeLabel(lieu.type);

  return (
    <div className="min-h-screen bg-cream">
      <LocalBusinessJsonLd
        name={lieu.nom}
        description={lieu.description}
        url={`https://label-vanlife-v1.vercel.app/map/${lieu.id}`}
        image={lieu.photoUrl}
        telephone={lieu.telephone}
        addressCity={lieu.ville}
        addressRegion={lieu.region}
        addressCountry={lieu.pays}
        latitude={lieu.coordonnees.lat}
        longitude={lieu.coordonnees.lng}
        priceRange={lieu.discountPercent > 0 ? `${lieu.discountPercent}% réduction membre` : ""}
      />
      {/* Hero photo */}
      <div className="relative h-[280px] sm:h-[380px] lg:h-[460px] overflow-hidden bg-gradient-to-br from-sage/30 to-cream">
        {lieu.photoUrl ? (
          <div
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${lieu.photoUrl})`,
              backgroundAttachment: "scroll",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <MapPin className="h-20 w-20 text-sage/30" />
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-20 left-4 sm:top-24 sm:left-6 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm"
          aria-label="Retour"
        >
          <ArrowLeft className="h-5 w-5 text-charcoal" />
        </button>

        {/* Action buttons */}
        <div className="absolute top-20 right-4 sm:top-24 sm:right-6 z-10 flex gap-2">
          <button
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm group"
            aria-label="Favori"
          >
            <Heart className="h-5 w-5 text-stone group-hover:text-red-400 transition-colors" />
          </button>
          <button
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors shadow-sm group"
            aria-label="Partager"
          >
            <Share2 className="h-5 w-5 text-stone group-hover:text-sage transition-colors" />
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-5xl mx-auto">
            <span className="inline-block text-xs font-semibold tracking-[0.15em] uppercase text-white/80 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
              {typeLabel}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-serif leading-tight">
              {lieu.nom}
            </h1>
            <p className="text-white/80 text-sm sm:text-base mt-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {lieu.ville}, {lieu.region}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rating card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/30 shadow-sm">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {stars.map((filled, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        filled ? "text-amber fill-amber" : "text-sand"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-charcoal">
                  {lieu.note.toFixed(1)}
                </span>
                <span className="text-sm text-stone">
                  ({lieu.avisCount} avis)
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/30 shadow-sm">
              <h2 className="text-xl font-bold text-charcoal mb-4 font-serif">
                \u00c0 propos de ce lieu
              </h2>
              <p className="text-stone leading-relaxed text-[15px]">
                {lieu.description}
              </p>
            </div>

            {/* Services */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/30 shadow-sm">
              <h2 className="text-xl font-bold text-charcoal mb-6 font-serif">
                Services &amp; \u00e9quipements
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {lieu.services.map((service) => {
                  const Icon = SERVICE_ICONS[service];
                  return (
                    <div
                      key={service}
                      className="flex items-center gap-3 bg-cream rounded-xl px-4 py-3.5 hover:bg-sage/10 hover:scale-[1.02] transition-all duration-200 cursor-default"
                    >
                      {Icon && (
                        <Icon className="h-5 w-5 text-sage shrink-0" />
                      )}
                      <span className="text-sm font-medium text-charcoal">
                        {SERVICE_LABELS[service] || service}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Labels */}
            {lieu.labels.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/30 shadow-sm">
                <h2 className="text-xl font-bold text-charcoal mb-4 font-serif">
                  Labels obtenus
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lieu.labels.map((label) => (
                    <Badge key={label} variant="success">
                      {formatLabel(label)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews (Mock) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border/30 shadow-sm">
              <h2 className="text-xl font-bold text-charcoal mb-6 font-serif">
                Avis r\u00e9cents
              </h2>
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-sage">
                        {["AL", "MC", "JV"][i - 1]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-charcoal">
                          {["Alex L.", "Marie C.", "J\u00e9r\u00f4me V."][i - 1]}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[4, 5, 4][i - 1] > 0 &&
                            Array.from({ length: [4, 5, 4][i - 1] }).map((_, j) => (
                              <Star
                                key={j}
                                className="h-3 w-3 text-amber fill-amber"
                              />
                            ))}
                        </div>
                        <span className="text-xs text-stone">
                          il y a {["2 semaines", "1 mois", "3 semaines"][i - 1]}
                        </span>
                      </div>
                      <p className="text-sm text-stone mt-1 leading-relaxed">
                        {[
                          "Superbe \u00e9tape ! Accueil chaleureux et emplacement parfait pour notre van.",
                          "Un coin de paradis pour vanlifers. Les services sont impeccables et le cadre magnifique.",
                          "Tr\u00e8s bon rapport qualit\u00e9-prix. Id\u00e9al pour une halte reposante en voyage.",
                        ][i - 1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-6 flex items-center gap-2 text-sm font-medium text-sage hover:text-sage-dark transition-colors">
                <MessageCircle className="h-4 w-4" />
                Voir tous les {lieu.avisCount} avis
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing card */}
            <div className="bg-white rounded-3xl p-6 border border-border/30 shadow-sm sticky top-24">
              <h3 className="text-sm font-bold text-charcoal mb-4">
                Tarifs
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 px-4 bg-sage/10 rounded-xl border border-sage/20">
                  <div>
                    <span className="text-sm font-semibold text-sage">
                      Réduction membre
                    </span>
                    <span className="text-[10px] text-sage block font-medium">
                      Jusqu&apos;à -{lieu.discountPercent}% avec ton abonnement
                    </span>
                  </div>
                  <span className="text-2xl font-black text-sage">
                    -{lieu.discountPercent}%
                  </span>
                </div>
              </div>

              <Link href="/devenir-membre">
                <Button variant="primary" className="w-full mt-4">
                  Devenir membre
                </Button>
              </Link>
            </div>

            {/* Info card */}
            <div className="bg-white rounded-3xl p-6 border border-border/30 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-charcoal">
                Coordonn\u00e9es
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-sage mt-0.5 shrink-0" />
                  <div>
                    <p className="text-charcoal font-medium">
                      {lieu.ville}
                    </p>
                    <p className="text-stone text-xs">
                      {lieu.region}, {lieu.pays}
                    </p>
                  </div>
                </div>

                {lieu.telephone && (
                  <a
                    href={`tel:${lieu.telephone}`}
                    className="flex items-center gap-3 text-stone hover:text-sage transition-colors"
                  >
                    <Phone className="h-4 w-4 text-sage shrink-0" />
                    <span>{lieu.telephone}</span>
                  </a>
                )}

                {lieu.email && (
                  <a
                    href={`mailto:${lieu.email}`}
                    className="flex items-center gap-3 text-stone hover:text-sage transition-colors"
                  >
                    <Mail className="h-4 w-4 text-sage shrink-0" />
                    <span className="truncate">{lieu.email}</span>
                  </a>
                )}

                {lieu.siteWeb && (
                  <a
                    href={lieu.siteWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-stone hover:text-sage transition-colors"
                  >
                    <Globe className="h-4 w-4 text-sage shrink-0" />
                    <span className="truncate">Site web</span>
                  </a>
                )}
              </div>

              {/* GPS buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${lieu.coordonnees.lat},${lieu.coordonnees.lng}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary-dark" className="w-full" size="sm"><Navigation className="h-4 w-4" /> Google Maps</Button>
                </a>
                <a href={`https://waze.com/ul?ll=${lieu.coordonnees.lat}%2C${lieu.coordonnees.lng}&navigate=yes`} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary-dark" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50" size="sm"><Navigation className="h-4 w-4" /> Waze</Button>
                </a>
              </div>
            </div>

            {/* Nearby lieux */}
            {nearbyLieux.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-border/30 shadow-sm">
                <h3 className="text-sm font-bold text-charcoal mb-4">
                  \u00c0 proximit\u00e9
                </h3>
                <div className="space-y-3">
                  {nearbyLieux.map((nearby) => (
                    <Link
                      key={nearby.id}
                      href={`/map/${nearby.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cream transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-sage/10 flex items-center justify-center shrink-0">
                        <MapPin className="h-4 w-4 text-sage" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-charcoal group-hover:text-sage transition-colors truncate">
                          {nearby.nom}
                        </p>
                        <p className="text-xs text-stone truncate">
                          {getTypeLabel(nearby.type)}
                        </p>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star className="h-3 w-3 text-amber fill-amber" />
                        <span className="text-xs font-medium text-charcoal">
                          {nearby.note.toFixed(1)}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    camping: "Camping",
    parking: "Parking / Aire",
    etape_nature: "\u00c9tape Nature",
    hebergement_insolite: "H\u00e9bergement Insolite",
  };
  return labels[type] || type;
}

function renderStarsArray(note: number): boolean[] {
  const out: boolean[] = [];
  for (let i = 1; i <= 5; i++) {
    out.push(i <= Math.round(note));
  }
  return out;
}

function formatLabel(label: string): string {
  const labels: Record<string, string> = {
    "label-vanlife": "Label Vanlife",
    "green-key": "Green Key",
    "accueil-velo": "Accueil V\u00e9lo",
  };
  return labels[label] || label.replace(/-/g, " ");
}
