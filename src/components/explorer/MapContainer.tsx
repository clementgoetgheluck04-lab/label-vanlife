"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Lieu } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface MemberCampingPoint {
  id: string;
  name: string;
  network: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  website?: string | null;
  description?: string | null;
  contactName?: string | null;
  phone?: string | null;
  phones?: string[];
  emails?: string[];
  images?: string[];
  details?: string[];
  activities?: string[];
  capacity?: string | null;
  openingHours?: string | null;
  memberOffer?: string | null;
  source: string;
  gpsSource?: string;
  gpsVerifiedAt?: string;
  googleMapsUrl?: string;
}

interface MapContainerProps {
  lieux: Lieu[];
  memberOnlyPlaces?: MemberCampingPoint[];
  className?: string;
  children?: ReactNode;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeExternalWebsite(value: string | null | undefined): string | null {
  const website = value?.trim();
  if (!website) return null;
  const normalized = /^https?:\/\//i.test(website) ? website : `https://${website}`;
  try {
    const url = new URL(normalized);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function navigationLinks(lat: number, lng: number) {
  const destination = encodeURIComponent(`${lat},${lng}`);
  return {
    maps: `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`,
    waze: `https://waze.com/ul?ll=${destination}&navigate=yes`,
  };
}

export default function MapContainer({
  lieux,
  memberOnlyPlaces = [],
  className,
  children,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    let isMounted = true;

    async function initMap() {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster");
      if (!isMounted || !mapRef.current) return;

      const map = L.map(mapRef.current, {
        center: [46.5, 2.5],
        zoom: 6,
        zoomControl: false,
        fadeAnimation: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
      });
      L.control.zoom({ position: "bottomright" }).addTo(map);
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
        minZoom: 3,
      }).addTo(map);
      mapInstanceRef.current = map;
      setMapReady(true);
    }

    void initMap();
    return () => {
      isMounted = false;
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    if (!mapReady) return;
    const map = mapInstanceRef.current;
    if (!map) return;
    const currentMap = map;
    let cancelled = false;

    async function updateMarkers() {
      const L = (await import("leaflet")).default;
      await import("leaflet.markercluster");
      if (cancelled || !mapInstanceRef.current) return;

      if (markersRef.current) currentMap.removeLayer(markersRef.current);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const labelledCluster = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 48,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        iconCreateFunction: (group: any) =>
          L.divIcon({
            html: `<div class="cluster-icon"><span>${group.getChildCount()}</span></div>`,
            className: "marker-cluster-custom",
            iconSize: L.point(44, 44),
          }),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const networkCluster = (L as any).markerClusterGroup({
        chunkedLoading: true,
        maxClusterRadius: 42,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        iconCreateFunction: (group: any) =>
          L.divIcon({
            html: `<div class="cluster-icon cluster-icon-network"><span>${group.getChildCount()}</span></div>`,
            className: "marker-cluster-custom",
            iconSize: L.point(36, 36),
          }),
      });

      const labelledIcon = L.divIcon({
        html: '<span class="map-pin map-pin-labelled"><span></span></span>',
        className: "map-pin-wrapper",
        iconSize: L.point(28, 38),
        iconAnchor: L.point(14, 36),
        popupAnchor: L.point(0, -34),
      });
      const networkIcon = L.divIcon({
        html: '<span class="map-pin map-pin-network"><span></span></span>',
        className: "map-pin-wrapper",
        iconSize: L.point(24, 34),
        iconAnchor: L.point(12, 32),
        popupAnchor: L.point(0, -30),
      });

      lieux.forEach((lieu) => {
        const marker = L.marker([lieu.coordonnees.lat, lieu.coordonnees.lng], { icon: labelledIcon });
        const navigation = navigationLinks(lieu.coordonnees.lat, lieu.coordonnees.lng);
        marker.bindPopup(`
          <div class="map-popup">
            <span class="popup-status popup-status-labelled">Lieu labellisé</span>
            <h3>${escapeHtml(lieu.nom)}</h3>
            <p>${escapeHtml(lieu.ville)}, ${escapeHtml(lieu.region)}</p>
            <p class="popup-benefit">${lieu.discountPercent > 0 ? `Avantage membre : <strong>-${lieu.discountPercent}%</strong>` : escapeHtml(lieu.priceHighlight || "Accueil Label Vanlife")}</p>
            <a class="popup-cta" href="/lieux/${encodeURIComponent(lieu.id)}">Voir la fiche complète</a>
            <div class="popup-navigation">
              <a href="${escapeHtml(navigation.maps)}" target="_blank" rel="noreferrer" aria-label="Ouvrir l'itinéraire dans Google Maps">Google Maps</a>
              <a href="${escapeHtml(navigation.waze)}" target="_blank" rel="noreferrer" aria-label="Ouvrir l'itinéraire dans Waze">Waze</a>
            </div>
          </div>`);
        labelledCluster.addLayer(marker);
      });

      memberOnlyPlaces.forEach((place) => {
        const marker = L.marker([place.lat, place.lng], { icon: networkIcon });
        const navigation = navigationLinks(place.lat, place.lng);
        const websiteUrl = normalizeExternalWebsite(place.website);
        const website = websiteUrl
          ? `<a class="popup-link" href="${escapeHtml(websiteUrl)}" target="_blank" rel="noreferrer nofollow">Réserver ou visiter le site</a>`
          : '<p class="popup-no-website">Site internet non renseigné</p>';
        marker.bindPopup(`
          <div class="map-popup">
            <span class="popup-status popup-status-network">Lieu repéré · non labellisé</span>
            <h3>${escapeHtml(place.name)}</h3>
            <p>${escapeHtml(place.address || `${place.postalCode} ${place.city}`)}</p>
            <p class="popup-warning">Adresse utile non labellisée Label Vanlife. Vérifiez les conditions avant votre venue.</p>
            <a class="popup-cta popup-cta-network" href="/lieux-reperes/${encodeURIComponent(place.id)}">Voir la fiche complète</a>
            ${website}
            <div class="popup-navigation">
              <a href="${escapeHtml(navigation.maps)}" target="_blank" rel="noreferrer" aria-label="Ouvrir l'itinéraire dans Google Maps">Google Maps</a>
              <a href="${escapeHtml(navigation.waze)}" target="_blank" rel="noreferrer" aria-label="Ouvrir l'itinéraire dans Waze">Waze</a>
            </div>
          </div>`);
        networkCluster.addLayer(marker);
      });

      const layers = L.layerGroup([labelledCluster, networkCluster]);
      currentMap.addLayer(layers);
      markersRef.current = layers;
    }

    void updateMarkers();
    return () => {
      cancelled = true;
    };
  }, [lieux, mapReady, memberOnlyPlaces]);

  return (
    <div className={cn("relative h-full min-h-[400px] w-full", className)}>
      <div ref={mapRef} className="absolute inset-0 z-0 overflow-hidden rounded-2xl" />
      <style jsx global>{`
        .map-pin-wrapper, .marker-cluster-custom { background: none !important; border: 0 !important; }
        .map-pin { display: block; position: relative; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); box-shadow: 0 3px 9px rgba(0,0,0,.28); border: 2px solid #fff; }
        .map-pin > span { position: absolute; width: 8px; height: 8px; background: #fff; border-radius: 999px; top: 8px; left: 8px; }
        .map-pin-labelled { width: 28px; height: 28px; background: #2f855a; }
        .map-pin-network { width: 22px; height: 22px; background: #94a3b8; opacity: .58; box-shadow: 0 2px 6px rgba(0,0,0,.16); }
        .map-pin-network > span { width: 7px; height: 7px; top: 7px; left: 7px; }
        .cluster-icon { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: #2f855a; border: 3px solid rgba(255,255,255,.9); color: #fff; font-size: 13px; font-weight: 800; box-shadow: 0 3px 12px rgba(0,0,0,.24); }
        .cluster-icon-network { width: 36px; height: 36px; background: #94a3b8; border-width: 2px; font-size: 11px; opacity: .7; box-shadow: 0 2px 8px rgba(0,0,0,.14); }
        .leaflet-popup-content { margin: 0 !important; min-width: 230px; }
        .leaflet-popup-content-wrapper { border-radius: 14px !important; overflow: hidden; }
        .map-popup { padding: 14px; }
        .map-popup h3 { margin: 7px 0 2px; color: #171717; font-size: 15px; line-height: 1.3; font-weight: 750; }
        .map-popup p { margin: 3px 0; color: #666; font-size: 12px; line-height: 1.45; }
        .popup-status { display: inline-flex; border-radius: 999px; padding: 3px 8px; font-size: 9px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }
        .popup-status-labelled { background: #dcfce7; color: #166534; }
        .popup-status-network { background: #f5eadc; color: #795a31; }
        .map-popup .popup-benefit { margin-top: 9px; color: #166534; }
        .map-popup .popup-warning { margin-top: 8px; font-size: 10px; color: #737373; }
        .map-popup .popup-no-website { margin-top: 9px; font-size: 10px; font-style: italic; color: #a3a3a3; }
        .popup-cta, .popup-link { display: block; width: 100%; margin-top: 10px; padding: 8px 12px; border: 0; border-radius: 8px; background: #2f855a; color: #fff !important; text-align: center; font-size: 12px; font-weight: 700; cursor: pointer; text-decoration: none; box-sizing: border-box; }
        .popup-cta-network { background: #475569; }
        .popup-link { background: #c39960; }
        .popup-navigation { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-top: 8px; }
        .popup-navigation a { display: flex; min-height: 36px; align-items: center; justify-content: center; border-radius: 8px; background: #f5f5f5; color: #262626 !important; font-size: 11px; font-weight: 750; text-align: center; text-decoration: none; }
        .popup-navigation a:first-child { background: #e8f3ec; color: #166534 !important; }
        .popup-navigation a:last-child { background: #eaf1ff; color: #1d4ed8 !important; }
        .leaflet-control-zoom { border: none !important; border-radius: 12px !important; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,.12) !important; }
      `}</style>
      {children}
    </div>
  );
}
