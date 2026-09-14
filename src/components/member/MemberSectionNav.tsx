"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  Award,
  Bell,
  BookOpen,
  Heart,
  Map,
  Route,
  Stamp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const MEMBER_SECTIONS = [
  { href: "/member/map", label: "MAP", icon: Map },
  { href: "/member/lieux", label: "Favoris", icon: Heart },
  { href: "/member/roadtrips", label: "Road Trips", icon: Route },
  { href: "/member/passeport", label: "Passeport", icon: Stamp },
  { href: "/member/badges", label: "Badges", icon: Award },
  { href: "/member/journal", label: "Journal", icon: BookOpen },
  { href: "/member/notifications", label: "Alertes", icon: Bell },
] as const;

export default function MemberSectionNav() {
  const pathname = usePathname();

  if (pathname === "/member") return null;

  return (
    <div className="border-b border-neutral-200 bg-white">
      <nav
        aria-label="Navigation de l’espace membre"
        className="mx-auto max-w-6xl px-4 py-3"
      >
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link
            href="/member"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Retour à mon espace
          </Link>

          <span className="mx-1 h-7 w-px shrink-0 bg-neutral-200" aria-hidden="true" />

          {MEMBER_SECTIONS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                  active
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-900",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
