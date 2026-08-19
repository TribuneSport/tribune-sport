"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      return;
    }

    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/api") ||
      pathname.startsWith("/_next")
    ) {
      return;
    }

    const key = `tribune-foot-visit:${pathname}`;

    /*
     * Évite de compter plusieurs fois
     * le même affichage pendant quelques secondes.
     */
    const lastVisit = sessionStorage.getItem(key);

    const now = Date.now();

    if (
      lastVisit &&
      now - Number(lastVisit) < 30_000
    ) {
      return;
    }

    sessionStorage.setItem(
      key,
      String(now)
    );

    fetch("/api/visits", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: pathname,
      }),
      keepalive: true,
    }).catch(() => {
      /*
       * Une erreur de compteur ne doit jamais
       * empêcher l'utilisateur de lire le site.
       */
    });
  }, [pathname]);

  return null;
}