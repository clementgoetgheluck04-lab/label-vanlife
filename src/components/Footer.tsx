"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Mail } from "lucide-react";
import { BRAND_ASSETS } from "@/config/brand-assets";

const NAVIGATION = [
  { label: "Accueil", href: "/" },
  { label: "Le Label", href: "/le-label" },
  { label: "Labellisation", href: "/labellisation" },
  { label: "Lieux Label Vanlife", href: "/explorer" },
  { label: "Connexion", href: "/member-login" },
] as const;

const OFFERS = [
  { label: "Carte membre — 29€ au lieu de 39€", href: "/devenir-membre" },
  { label: "Labelliser mon lieu — offre 2026 à 110€", href: "/labellisation/candidature" },
] as const;

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M13.5 22v-9h3l.5-3.5h-3.5V7.25c0-1.02.28-1.71 1.75-1.71H17V2.4c-.3-.04-1.35-.13-2.57-.13-2.55 0-4.3 1.56-4.3 4.42V9.5H7.25V13h2.88v9h3.37Z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const subscribe = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      if (!response.ok) throw new Error("newsletter");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-12 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_0.8fr_0.9fr_1.2fr]">
          <div>
            <Link href="/" aria-label="Accueil Label Vanlife" className="inline-block">
              <Image
                src={BRAND_ASSETS.logoDark}
                alt="Label Vanlife"
                width={936}
                height={532}
                className="h-auto w-64 object-contain object-left"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">
              Le réseau de lieux vérifiés qui accueille les vanlifers responsables partout en France.
              26 établissements labellisés et des avantages de 10 à 20% pour les membres.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="https://www.facebook.com/labelvanlife" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition-colors hover:border-white/30 hover:text-white">
                <FacebookMark className="h-4 w-4" /> Page Facebook
              </a>
              <a href="mailto:contact@labelvanlife.com" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition-colors hover:border-white/30 hover:text-white">
                <Mail className="h-4 w-4" /> Nous contacter
              </a>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Navigation</h2>
            <ul className="mt-5 space-y-3">{NAVIGATION.map((item) => <li key={item.href}><Link href={item.href} className="text-sm text-white/65 transition-colors hover:text-white">{item.label}</Link></li>)}</ul>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Rejoindre</h2>
            <ul className="mt-5 space-y-3">{OFFERS.map((item) => <li key={item.href}><Link href={item.href} className="group inline-flex items-start gap-2 text-sm text-white/65 transition-colors hover:text-white">{item.label}<ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" /></Link></li>)}</ul>
            <p className="mt-6 text-xs leading-relaxed text-white/40">Carte membre valable 12 mois, sans renouvellement automatique. Labellisation annuelle, sans commission sur les réservations.</p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Newsletter</h2>
            <p className="mt-5 text-sm leading-relaxed text-white/60">Nouveaux lieux, actualités du réseau et conseils vanlife. Sans spam.</p>
            <form onSubmit={subscribe} className="mt-4 flex gap-2">
              <label className="sr-only" htmlFor="footer-email">Votre email</label>
              <input id="footer-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="votre@email.com" className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-[#c39960]" />
              <button type="submit" disabled={status === "loading"} className="rounded-xl bg-[#c39960] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d0ad7d] disabled:opacity-60" aria-label="S'inscrire à la newsletter">{status === "success" ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}</button>
            </form>
            {status === "success" && <p className="mt-2 text-xs text-emerald-300">Inscription confirmée.</p>}
            {status === "error" && <p className="mt-2 text-xs text-red-300">Impossible de vous inscrire pour le moment.</p>}
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Label Vanlife. Tous droits réservés.</p>
          <div className="flex flex-wrap gap-4"><Link href="/mentions-legales" className="hover:text-white/70">Mentions légales</Link><Link href="/politique-confidentialite" className="hover:text-white/70">Confidentialité</Link></div>
        </div>
      </div>
    </footer>
  );
}
