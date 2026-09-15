"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAnalyticsEventName } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/browser";
import { ANALYTICS_CONSENT_EVENT } from "@/lib/privacy/consent";

export default function AnalyticsProvider() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  const trackPage = useCallback((path: string) => {
    if (path === "/") trackEvent("landing_view");
    else if (path === "/explorer" || path === "/member/map") trackEvent("map_open");
    else if (path.startsWith("/trip/")) {
      const tripId = path.split("/").filter(Boolean)[1];
      trackEvent("public_trip_view", { entityType: "road_trip", entityId: tripId });
    }
    else if (path.startsWith("/lieux/") || path.startsWith("/lieux-reperes/")) {
      const parts = path.split("/").filter(Boolean);
      trackEvent("place_view", { entityType: parts[0], entityId: parts[1] });
    } else trackEvent("page_view");
  }, []);

  useEffect(() => {
    if (!pathname || previousPath.current === pathname) return;
    previousPath.current = pathname;
    trackPage(pathname);
  }, [pathname, trackPage]);

  useEffect(() => {
    const onConsent = (event: Event) => {
      if (!(event instanceof CustomEvent) || event.detail !== "accepted" || !pathname) return;
      previousPath.current = null;
      trackPage(pathname);
      previousPath.current = pathname;
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent);
  }, [pathname, trackPage]);

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
