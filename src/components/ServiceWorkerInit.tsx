"use client";

import { useEffect } from "react";
import { register, unregister } from "@/lib/utils/serviceWorker";

export default function ServiceWorkerInit() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      register();
    } else {
      // En développement, on désenregistre pour éviter les caches parasites
      unregister();
    }
  }, []);

  return null;
}