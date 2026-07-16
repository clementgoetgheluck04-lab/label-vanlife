"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RouteScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const reset = () => {
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo({ top: 0, left: 0 });
      root.style.scrollBehavior = previousBehavior;
    };

    reset();
    const frame = requestAnimationFrame(() => requestAnimationFrame(reset));
    const timer = window.setTimeout(reset, 100);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
