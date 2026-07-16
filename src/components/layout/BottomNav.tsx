"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Route, User, CircleUser } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Places", href: "/explorer", icon: Compass },
  { label: "Trips", href: "/road-trips", icon: Route },
  { label: "Pass", href: "/compte", icon: User },
  { label: "Friendly", href: "/le-label", icon: CircleUser },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-white/90 backdrop-blur-xl lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {TABS.map((tab) => {
          const isActive =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors duration-200",
                "min-w-[64px]",
                isActive
                  ? "text-sage"
                  : "text-stone hover:text-charcoal"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-tight">
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
