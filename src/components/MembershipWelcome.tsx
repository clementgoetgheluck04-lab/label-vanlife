import Image from "next/image";
import Link from "next/link";
import { Check, MapPinned, ShieldCheck } from "lucide-react";

export function MembershipJourneyNav({ active }: { active: "join" | "login" }) {
  return (
    <nav aria-label="Choisir son parcours membre" className="mx-auto flex w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-1.5 shadow-sm">
      <Link href="/devenir-membre" className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${active === "join" ? "bg-[#c39960] text-white" : "text-neutral-500 hover:text-neutral-900"}`}>Je deviens membre</Link>
      <Link href="/member-login" className={`flex-1 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${active === "login" ? "bg-[#c39960] text-white" : "text-neutral-500 hover:text-neutral-900"}`}>J'ai déjà un compte</Link>
    </nav>
  );
}

export function MembershipCardPreview({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[2rem] bg-neutral-900 text-white shadow-2xl shadow-neutral-900/20 ${compact ? "p-6" : "p-7 sm:p-9"}`}>
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-[#c39960]/25 blur-3xl" />
      <div className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#dfc59f]">Label Vanlife</p>
            <h2 className={`${compact ? "mt-2 text-2xl" : "mt-3 text-3xl"} font-bold`}>Carte membre 2026</h2>
          </div>
          <Image src="/brand/logo-combi.svg" alt="Combi Label Vanlife" width={150} height={75} className="h-auto w-28 object-contain" />
        </div>
        <div className={`${compact ? "mt-6" : "mt-10"} grid gap-3 text-sm text-white/80 sm:grid-cols-2`}>
          <p className="flex items-center gap-2"><MapPinned className="h-4 w-4 text-[#dfc59f]" /> Map interactive privée</p>
          <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#dfc59f]" /> Avantages sécurisés</p>
          <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#dfc59f]" /> Lieux vérifiés</p>
          <p className="flex items-center gap-2"><Check className="h-4 w-4 text-[#dfc59f]" /> PWA en développement</p>
        </div>
        <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-5">
          <div><p className="text-xs text-white/50">Tarif annuel</p><p className="mt-1 text-lg font-bold"><span className="mr-2 text-white/40 line-through">39 €</span>29 € cette année</p></div>
          <div className="h-8 w-12 rounded-md bg-gradient-to-br from-[#e5c99f] to-[#9d7442]" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
