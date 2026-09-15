"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsEventName } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/browser";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (pathname === "/") trackEvent("landing_view");
    else if (pathname === "/explorer" || pathname === "/member/map") trackEvent("map_open");
    else if (pathname.startsWith("/trip/")) {
      const tripId = pathname.split("/").filter(Boolean)[1];
      trackEvent("public_trip_view", { entityType: "road_trip", entityId: tripId });
    }
    else if (pathname.startsWith("/lieux/") || pathname.startsWith("/lieux-reperes/")) {
      const parts = pathname.split("/").filter(Boolean);
      trackEvent("place_view", { entityType: parts[0], entityId: parts[1] });
    } else trackEvent("page_view");
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const clicked = event.target instanceof Element ? event.target : null;
      const target = clicked
        ? clicked.closest<HTMLElement>("[data-analytics-event]")
        : null;
      const eventName = target?.dataset.analyticsEvent;
      if (target && isAnalyticsEventName(eventName)) {
        trackEvent(eventName, {
          entityType: target.dataset.analyticsEntityType,
          entityId: target.dataset.analyticsEntityId,
        });
        return;
      }

      const link = clicked?.closest<HTMLAnchorElement>("a[href]");
      if (link && /(?:google\.com\/maps|waze\.com\/ul)/i.test(link.href)) {
        trackEvent("route_start", { properties: { provider: link.href.includes("waze.com") ? "waze" : "google_maps" } });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
