import { CreditCard, Download, MapPinned } from "lucide-react";
import { cn } from "@/lib/utils";

type MemberDigitalAccessProps = {
  className?: string;
  compact?: boolean;
};

const FEATURES = [
  {
    icon: MapPinned,
    title: "La map interactive en ligne",
    description: "Retrouvez les lieux labellisés, leurs photos, services, plans et avantages depuis votre téléphone ou votre ordinateur.",
  },
  {
    icon: CreditCard,
    title: "Votre carte membre numérique",
    description: "Votre carte membre reste accessible à tout moment dans votre espace personnel sécurisé sur internet.",
  },
  {
    icon: Download,
    title: "Une application PWA à installer",
    description: "L’application est actuellement en développement. Lorsqu’elle sera disponible, les membres connectés pourront l’installer directement depuis leur espace membre.",
    status: "En développement",
  },
] as const;

export function MemberDigitalAccess({ className, compact = false }: MemberDigitalAccessProps) {
  return (
    <section className={cn("rounded-3xl border border-emerald-100 bg-emerald-50/50 p-6 sm:p-8", className)}>
      <div className={cn("mb-6", !compact && "text-center")}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Votre expérience membre</p>
        <h2 className="mt-2 text-2xl font-bold text-neutral-900 sm:text-3xl">Votre voyage vous suit partout</h2>
        <p className={cn("mt-2 text-sm leading-6 text-neutral-600", !compact && "mx-auto max-w-2xl")}>
          La carte membre et la map interactive sont accessibles sur internet. Une application installable viendra ensuite compléter cette expérience.
        </p>
      </div>

      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "md:grid-cols-3")}>
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <article key={feature.title} className="rounded-2xl border border-white bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Icon className="h-5 w-5" /></div>
                {"status" in feature && <span className="rounded-full bg-[#c39960]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#8b683e]">{feature.status}</span>}
              </div>
              <h3 className="mt-4 font-bold text-neutral-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-600">{feature.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
