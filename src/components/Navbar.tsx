"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LogIn, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { BRAND_ASSETS } from "@/config/brand-assets";

const NAV_ITEMS = [
  { label: "Accueil", href: "/" },
  { label: "Le Label", href: "/le-label" },
  { label: "Labellisation", href: "/labellisation" },
  { label: "Lieux Label Vanlife", href: "/explorer" },
] as const;

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateHeader = () => {
      const currentY = Math.max(0, window.scrollY);
      setScrolled(currentY > 16);
      if (currentY < 40) setVisible(true);
      else if (currentY > lastScrollY.current + 6) setVisible(false);
      else if (currentY < lastScrollY.current - 6) setVisible(true);
      lastScrollY.current = currentY;
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    return () => window.removeEventListener("scroll", updateHeader);
  }, []);

  const overlaysHero = pathname === "/" && !scrolled && !open;
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 will-change-transform",
        visible || open ? "translate-y-0" : "-translate-y-full",
        overlaysHero
          ? "bg-transparent border-b border-transparent"
          : "bg-white/95 backdrop-blur-xl border-b border-neutral-200/60 shadow-sm"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex h-14 w-[190px] shrink-0 items-center gap-1.5 sm:w-[210px]"
            aria-label="Label Vanlife — Accueil"
          >
            <span className="relative h-[50px] w-[108px] shrink-0 overflow-hidden">
              <Image
                src={overlaysHero ? "/brand/header-wordmark-dark-bg.png" : "/brand/header-wordmark-light-bg.png"}
                alt="Label Vanlife"
                width={1748}
                height={1240}
                priority
                className="absolute left-0 top-1/2 h-[88px] w-[124px] max-w-none -translate-y-1/2 object-contain"
              />
            </span>
            <Image src={BRAND_ASSETS.favicon} alt="" width={500} height={500} priority className="h-12 w-16 shrink-0 object-contain sm:h-14 sm:w-[4.6rem]" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                  overlaysHero
                    ? isActive(item.href)
                      ? "text-white bg-white/15"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                    : isActive(item.href)
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
                )}
              >
                {item.label}
              </Link>
            ))}

            <Link href="/member-login" className="ml-2">
              <Button variant="primary" size="sm" className="gap-1.5 uppercase">
                <LogIn className="h-4 w-4" /> Connexion
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen((value) => !value)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              overlaysHero ? "text-white hover:bg-white/10" : "text-neutral-500 hover:bg-neutral-50"
            )}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-neutral-200 bg-white">
          <div className="px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "text-emerald-600 bg-emerald-50"
                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3">
              <Link href="/member-login" onClick={() => setOpen(false)}>
                <Button variant="primary" className="w-full gap-2 uppercase">
                  <LogIn className="h-4 w-4" /> Connexion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
