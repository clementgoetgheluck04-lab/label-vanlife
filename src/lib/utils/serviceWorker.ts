/**
 * Service Worker utilities for Label Vanlife PWA
 */

/**
 * Register the service worker
 */
export function register(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker not supported in this browser");
    return Promise.resolve(false);
  }

  return navigator.serviceWorker
    .register("/sw.js", { scope: "/" })
    .then((registration) => {
      console.log("Service Worker registered:", registration.scope);

      registration.addEventListener("updatefound", () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.addEventListener("statechange", () => {
            if (
              installingWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              console.log("New version available — refresh to update");
            }
          });
        }
      });

      return true;
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
      return false;
    });
}

/**
 * Unregister all service workers
 */
export async function unregister(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    const result = await registration.unregister();
    if (!result) {
      console.warn("Failed to unregister SW:", registration.scope);
      return false;
    }
  }
  console.log("Service Worker(s) unregistered successfully");
  return true;
}

/**
 * Ask for notification permission
 */
export async function askPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    console.warn("Notification API not supported");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    console.warn("Notification permission denied by user");
    return "denied";
  }

  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted");
  } else {
    console.warn("Notification permission denied");
  }
  return permission;
}

/**
 * Send push subscription to server
 * @param subscription - Push subscription object to send
 * @param endpoint - Server endpoint URL (optional, defaults to '/api/push/subscribe')
 */
export async function sendSubscriptionToServer(
  subscription: PushSubscription,
  endpoint: string = "/api/push/subscribe"
): Promise<boolean> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription }),
    });

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    console.log("Push subscription sent to server successfully");
    return true;
  } catch (error) {
    console.error("Failed to send push subscription to server:", error);
    return false;
  }
}