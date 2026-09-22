import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Check, FileCheck2, RefreshCcw, SearchCheck, ShieldCheck } from "lucide-react";
import { LABELLISATION_CRITERIA } from "@/config/labellisation-criteria";
import {
  LABEL_ELIGIBILITY_REQUIREMENTS,
  LABEL_STANDARD_EFFECTIVE_DATE,
  LABEL_STANDARD_VERSION,
  LABEL_VERIFICATION_LEVELS,
} from "@/config/label-standard";
import { LABEL_VALIDITY_TEXT } from "@/config/commercial";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = {
  title: "Référentiel Label Vanlife 2027 | Critères et méthode de contrôle",
  description: "Consultez les critères, les conditions d’éligibilité, la méthode de vérification et le cycle de suivi du Label Vanlife 2027.",
  alternates: { canonical: "/referentiel-label-vanlife" },
  openGraph: {
    title: "Référentiel Label Vanlife 2027",
    description: "Une méthode publique pour comprendre ce qui est déclaré, contrôlé et confirmé sur le terrain.",
    url: "/referentiel-label-vanlife",
    type: "website",
  },
};

const categoryOrder = [
  "Accueil chaleureux",
  "Respect de l'environnement",
  "Qualité & confort",
  "Sécurité & tranquillité",
  "Esprit communautaire",
] as const;

export default function LabelStandardPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] pb-24 pt-28 text-neutral-950">
      <section className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-[2rem] bg-[#0b251d] px-6 py-12 text-white shadow-2xl sm:px-10 sm:py-16 lg:px-16">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#dfc59f]">Référentiel public · version {LABEL_STANDARD_VERSION}</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">Ce que le Label Vanlife vérifie vraiment.</h1>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/75 sm:text-lg">
              Un label crédible doit être compréhensible et contrôlable. Cette page publie les conditions d’éligibilité, les 22 indicateurs étudiés, la méthode de décision et le suivi appliqués à l’édition 2027.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm font-bold">
              <a href="#conditions" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-[#0b251d]">Voir les conditions <ArrowRight className="h-4 w-4" /></a>
              <Link href="/labellisation/candidature" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-white hover:bg-white/10">Déposer une candidature</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-6xl gap-4 px-6 md:grid-cols-3">
        {[
          { icon: FileCheck2, title: "22 indicateurs renseignés", text: "Ils décrivent concrètement l’accueil. Ils ne sont pas transformés en note marketing opaque." },
          { icon: SearchCheck, title: "Décision sur dossier", text: "Le paiement ne vaut jamais acceptation. Les pièces et engagements sont étudiés avant attribution." },
          { icon: RefreshCcw, title: "Suivi et renouvellement", text: "Une information inexacte ou un manquement peut entraîner une correction, une suspension ou un retrait." },
        ].map((item) => {
          const Icon = item.icon;
          return <article key={item.title} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm"><Icon className="h-6 w-6 text-emerald-700" /><h2 className="mt-4 text-lg font-black">{item.title}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{item.text}</p></article>;
        })}
      </section>

      <section id="conditions" className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Conditions d’éligibilité</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Six contrôles indispensables avant attribution.</h2><p className="mt-4 leading-7 text-neutral-600">Ces conditions sont cumulatives. Un lieu peut proposer de nombreux services et rester non conforme si un engagement essentiel n’est pas vérifiable.</p></div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {LABEL_ELIGIBILITY_REQUIREMENTS.map((item, index) => <article key={item.id} className="flex gap-4 rounded-2xl border border-neutral-200 bg-white p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-black text-emerald-800">{index + 1}</span><div><h3 className="font-black">{item.title}</h3><p className="mt-1 text-sm leading-6 text-neutral-600">{item.description}</p></div></article>)}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Les 22 indicateurs</p><h2 className="mt-3 text-3xl font-black sm:text-4xl">Un profil d’accueil, pas un concours d’équipements.</h2><p className="mt-4 leading-7 text-neutral-600">Une ferme, un petit camping et un domaine n’ont pas les mêmes installations. Les indicateurs servent à comprendre l’expérience proposée et à repérer les incohérences ; piscine ou animation ne sont pas des passages obligés.</p></div>
          <div className="mt-10 space-y-10">
            {categoryOrder.map((category) => {
              const criteria = LABELLISATION_CRITERIA.filter((criterion) => criterion.category === category);
              return <section key={category}><div className="flex items-center gap-3"><BadgeCheck className="h-5 w-5 text-emerald-700" /><h3 className="text-xl font-black">{category}</h3><span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-bold text-neutral-500">{criteria.length} indicateurs</span></div><div className="mt-4 grid gap-3 md:grid-cols-2">{criteria.map((criterion) => <article key={criterion.id} className="rounded-2xl border border-neutral-200 bg-[#faf9f6] p-5"><h4 className="font-bold"><span aria-hidden="true" className="mr-2">{criterion.emoji}</span>{criterion.title}</h4><p className="mt-2 text-sm leading-6 text-neutral-600">{criterion.description}</p></article>)}</div></section>;
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Traçabilité</p><h2 className="mt-3 text-3xl font-black">Dire d’où vient chaque information.</h2><p className="mt-4 leading-7 text-neutral-600">À mesure que les retours terrain sont collectés, Label Vanlife distingue une déclaration du lieu d’une information contrôlée ou confirmée par une visite documentée.</p></div>
          <div className="space-y-3">{LABEL_VERIFICATION_LEVELS.map((level, index) => <article key={level.title} className="rounded-2xl border border-neutral-200 bg-white p-5"><div className="flex items-start gap-3"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e8ddcb] text-xs font-black text-[#6d4e2f]">{index + 1}</span><div><h3 className="font-black">{level.title}</h3><p className="mt-1 text-sm leading-6 text-neutral-600">{level.description}</p></div></div></article>)}</div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-[2rem] border border-emerald-900/10 bg-emerald-950 px-6 py-10 text-white sm:px-10">
          <div className="grid gap-8 lg:grid-cols-2">
            <div><ShieldCheck className="h-8 w-8 text-[#dfc59f]" /><h2 className="mt-4 text-2xl font-black">Indépendance de la décision</h2><ul className="mt-5 space-y-3 text-sm leading-6 text-white/75">{["Le paiement finance l’étude et ne garantit pas l’attribution.", "Un refus pour non-conformité déclenche le remboursement prévu par l’offre.", "Toute décision est datée, rattachée à la version du référentiel et justifiée en interne.", "Aucun volume de visiteurs ou de réservations n’est garanti au lieu labellisé."].map((text) => <li key={text} className="flex gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-[#dfc59f]" />{text}</li>)}</ul></div>
            <div className="rounded-2xl bg-white/10 p-6"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#dfc59f]">Portée du label</p><p className="mt-3 text-sm leading-6 text-white/80">Label Vanlife est un label privé indépendant. Il ne remplace ni une autorisation administrative, ni un classement touristique, ni une certification publique ou réglementaire. Il atteste qu’un lieu a satisfait au référentiel Label Vanlife applicable à la date de sa décision.</p><p className="mt-4 text-xs text-white/60">Version {LABEL_STANDARD_VERSION} · applicable depuis le {LABEL_STANDARD_EFFECTIVE_DATE}<br />{LABEL_VALIDITY_TEXT}</p><a href={`mailto:${CONTACT_EMAIL}?subject=Signalement%20référentiel%20Label%20Vanlife`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-black text-emerald-950">Signaler une information <ArrowRight className="h-4 w-4" /></a></div>
          </div>
        </div>
      </section>
    </main>
  );
}
