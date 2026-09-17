import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Leaf,
  MapPinned,
  ShoppingBasket,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const title = "La philosophie vanlife : un état d’esprit, pas un véhicule";
const description = "Van, fourgon, tente de toit, caravane ou camping-car : découvrez la philosophie vanlife qui réunit les voyageurs autour du respect, de la nature, des rencontres et du local.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/philosophie-vanlife" },
  keywords: [
    "philosophie vanlife",
    "esprit vanlife",
    "vanlife responsable",
    "communauté vanlife",
    "voyage itinérant responsable",
    "van rétro",
    "van moderne",
    "tente de toit",
    "camping-car",
  ],
  openGraph: {
    title,
    description,
    type: "article",
    url: "/philosophie-vanlife",
    images: [{
      url: "/images/hero-label-vanlife.webp",
      width: 1536,
      height: 1024,
      alt: "Voyageurs réunis par la philosophie vanlife au bord d’un lac",
    }],
  },
};

const vehicles = ["Van rétro", "Fourgon aménagé", "Tente de toit", "Caravane", "Camping-car"];

const values = [
  {
    icon: HeartHandshake,
    title: "Respecter les personnes",
    text: "Dire bonjour, demander avant de s’installer, préserver le calme et comprendre que chaque lieu a ses propres règles.",
  },
  {
    icon: Leaf,
    title: "Respecter la nature",
    text: "Ne rien laisser derrière soi, économiser l’eau, gérer ses déchets et protéger les espaces fragiles.",
  },
  {
    icon: ShoppingBasket,
    title: "Consommer local",
    text: "Faire vivre les producteurs, artisans, marchés et hébergements qui donnent une identité réelle au territoire.",
  },
  {
    icon: UsersRound,
    title: "Privilégier la rencontre",
    text: "Voyager pour découvrir des habitants et des histoires, pas seulement pour collectionner des points sur une carte.",
  },
  {
    icon: MapPinned,
    title: "Rester libre et responsable",
    text: "Choisir sa route sans imposer sa présence, éviter les lieux saturés et préférer les accueils où l’on est réellement attendu.",
  },
  {
    icon: Sparkles,
    title: "Voyager avec simplicité",
    text: "Posséder moins, prendre le temps et retrouver l’essentiel : un paysage, une rencontre et un réveil qui a du sens.",
  },
];

export default function PhilosophieVanlifePage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative flex min-h-[78vh] items-center overflow-hidden pt-20 text-white">
        <Image
          src="/images/hero-label-vanlife.webp"
          alt="Un véhicule de voyage dans la nature au coucher du soleil"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950/90 via-emerald-950/72 to-neutral-950/55" />
        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-20 text-center sm:py-28">
          <span className="inline-flex rounded-full border border-white/20 bg-black/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#dfc59f] backdrop-blur-sm">
            La philosophie vanlife
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-6xl lg:text-7xl">
            La vanlife n’est pas un véhicule.<br />
            <span className="text-[#dfc59f]">C’est une manière de voyager.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-white/80 sm:text-xl">
            Un Combi d’époque, un fourgon récent, une tente de toit, une caravane ou un camping-car peuvent emprunter la même route. Ce qui fait un vanlifer, ce n’est pas sa carrosserie : c’est l’humain, son comportement et les valeurs qu’il emmène avec lui.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {vehicles.map((vehicle) => (
              <span key={vehicle} className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur-sm">
                {vehicle}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f1e8] py-16 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">La communauté avant la carrosserie</p>
            <h2 className="mt-4 text-3xl font-bold text-neutral-950 sm:text-5xl">Une même philosophie, mille façons de prendre la route.</h2>
            <p className="mt-6 text-lg leading-8 text-neutral-600">
              Certains restaurent un Combi avec patience. D’autres choisissent le confort d’un véhicule moderne, la légèreté d’une tente de toit ou la vie familiale en caravane. Aucun véhicule ne donne, à lui seul, l’esprit vanlife. Celui-ci se reconnaît dans la façon d’arriver, de séjourner, de rencontrer et de repartir.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} className="rounded-3xl border border-white bg-white p-6 shadow-sm sm:p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-neutral-950">{value.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-neutral-600">{value.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-2">
          <article className="rounded-3xl bg-neutral-950 p-7 text-white sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfc59f]">L’esprit rétro</p>
            <h2 className="mt-4 text-3xl font-bold">Réparer, transmettre, ralentir.</h2>
            <p className="mt-5 leading-7 text-white/70">
              Les Combi VW et les véhicules anciens racontent une histoire faite de mécanique, de débrouille et de routes secondaires. Cette culture rappelle que voyager peut être simple, patient et profondément humain.
            </p>
          </article>
          <article className="rounded-3xl border border-emerald-100 bg-emerald-50 p-7 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">L’esprit moderne</p>
            <h2 className="mt-4 text-3xl font-bold text-neutral-950">Imaginer, s’adapter, voyager autrement.</h2>
            <p className="mt-5 leading-7 text-neutral-600">
              Les aménagements récents, les équipements plus autonomes et les nouvelles façons de travailler sur la route ouvrent la vanlife à d’autres profils. La technologie a sa place lorsqu’elle sert la liberté sans faire oublier le territoire traversé.
            </p>
          </article>
        </div>
        <div className="mx-auto mt-8 max-w-4xl px-6 text-center">
          <p className="text-xl font-bold leading-8 text-neutral-900 sm:text-2xl">
            Rétro ou moderne, minimaliste ou confortable : nous appartenons à la même communauté dès lors que nous voyageons avec respect.
          </p>
        </div>
      </section>

      <section className="bg-emerald-950 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#dfc59f]">Avant, pendant et après l’étape</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">La philosophie se prouve dans les gestes.</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              ["01", "Avant d’arriver", "Je vérifie que je suis bienvenu, je respecte les accès et je contacte l’hôte quand cela est demandé."],
              ["02", "Pendant mon séjour", "Je reste discret, je respecte les autres, je consomme local et j’utilise les équipements de manière responsable."],
              ["03", "Au moment de repartir", "Je ne laisse aucune trace, je remercie l’hôte et je partage le lieu sans encourager sa surfréquentation."],
            ].map(([number, heading, text]) => (
              <article key={number} className="rounded-3xl border border-white/10 bg-white/[0.06] p-6">
                <span className="text-sm font-black text-[#dfc59f]">{number}</span>
                <h3 className="mt-4 text-xl font-bold">{heading}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Label Vanlife</p>
          <h2 className="mt-4 text-3xl font-bold text-neutral-950 sm:text-5xl">Des humains qui voyagent, des lieux qui les accueillent vraiment.</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
            Le Label relie les voyageurs qui partagent cette philosophie à des hôtes qui ont choisi de les recevoir. C’est ainsi que la liberté reste possible, désirable et durable.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/explorer">
              <Button variant="primary" size="lg">Découvrir les lieux <ArrowRight className="h-4 w-4" /></Button>
            </Link>
            <Link href="/devenir-membre">
              <Button variant="cta" size="lg">Rejoindre la communauté <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
