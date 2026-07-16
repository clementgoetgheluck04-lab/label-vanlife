import Link from "next/link";
import { Award, Compass, Globe2, MapPin, Route, Smartphone, Sparkles, TentTree, ArrowUpRight } from "lucide-react";
import { ECOSYSTEM_PRODUCTS, type EcosystemProduct } from "@/config/ecosystem";

const ICONS = { globe: Globe2, compass: Compass, pin: MapPin, route: Route, award: Award, tent: TentTree, phone: Smartphone, sparkles: Sparkles } satisfies Record<EcosystemProduct["icon"], typeof Globe2>;
const STATUS = { available: "Disponible", beta: "En développement", planned: "À venir" } as const;

export function EcosystemGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`grid sm:grid-cols-2 ${compact ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-4`}>
      {ECOSYSTEM_PRODUCTS.map((product) => {
        const Icon = ICONS[product.icon];
        const content = (
          <article className="h-full rounded-2xl border border-neutral-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><Icon className="h-5 w-5" aria-hidden="true" /></div>
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{STATUS[product.status]}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-neutral-900">{product.name}</h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-600">{product.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-neutral-500">{product.description}</p>
            {product.href && <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-neutral-700">Découvrir <ArrowUpRight className="h-4 w-4" /></span>}
          </article>
        );
        return product.href ? <Link key={product.name} href={product.href}>{content}</Link> : <div key={product.name}>{content}</div>;
      })}
    </div>
  );
}
