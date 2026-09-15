"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MarkNotificationsRead({ enabled }: { enabled: boolean }) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    void fetch("/api/member/notifications/read", {
      method: "POST",
      credentials: "same-origin",
      signal: controller.signal,
    }).then((response) => {
      if (response.ok) router.refresh();
    }).catch(() => undefined);

    return () => controller.abort();
  }, [enabled, router]);

  return null;
}
