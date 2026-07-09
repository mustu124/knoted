"use client";

import { useEffect, useState } from "react";

export type SiteSettings = {
  whatsappNumber: string;
  storeEmail: string;
  storeAddress: string;
};

const FALLBACK: SiteSettings = {
  whatsappNumber: process.env.NEXT_PUBLIC_OWNER_WHATSAPP || "910000000000",
  storeEmail: "",
  storeAddress: ""
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(FALLBACK);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: { settings?: Partial<SiteSettings> } }) => {
        const fetched = payload.data?.settings;
        if (!isMounted || !fetched) return;

        setSettings({
          whatsappNumber: fetched.whatsappNumber || FALLBACK.whatsappNumber,
          storeEmail: fetched.storeEmail || "",
          storeAddress: fetched.storeAddress || ""
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  return settings;
}
