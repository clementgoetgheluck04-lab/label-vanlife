// Label Vanlife V2 — Service Worker
// Cache les pages clés pour le mode hors-ligne : carte, espace membre
const CACHE_NAME = "label-vanlife-v2";

const PRECACHE_URLS = [
  "/",
  "/brand/favicon.png",
  "/manifest.json",
  "/icons/icon-192.svg",
  "/icons/icon-512.svg",
  "/explorer",
  "/compte",
];

// Install — pré-cache des assets statiques et pages clés
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate — nettoyage des anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch — stratégies adaptatives
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ne pas intercepter les requêtes non-GET ou cross-origin
  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Stratégie Cache-First pour les assets statiques
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font" ||
    request.destination === "image" ||
    url.pathname.match(/\.(css|js|woff2?|ttf|otf|svg|png|jpg|jpeg|gif|webp|ico)$/i)
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Stratégie Network-First pour les pages HTML et navigation
  if (
    request.destination === "document" ||
    request.mode === "navigate"
  ) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Pour tout le reste : Network-First
  event.respondWith(networkFirst(request));
});

// Cache-First : sert depuis le cache, met à jour en arrière-plan
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) {
    // Mise à jour asynchrone du cache
    fetch(request)
      .then((response) => {
        if (response.ok) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, response);
          });
        }
      })
      .catch(() => {
        // Échec réseau ignoré — on a déjà la réponse en cache
      });
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return caches.match("/");
  }
}

// Network-First : tente le réseau, fallback cache
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    // Fallback ultime : page d'accueil en cache
    return caches.match("/");
  }
}
// Push notifications
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    event.waitUntil(
      self.registration.showNotification(data.title || "Label Vanlife", {
        body: data.body || "",
        icon: data.icon || "/icons/icon-192.svg",
        badge: "/icons/icon-192.svg",
        data: { url: data.url || "/" },
        vibrate: [200, 100, 200],
      })
    );
  } catch {
    event.waitUntil(self.registration.showNotification(event.data.text()));
  }
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(url));
});
