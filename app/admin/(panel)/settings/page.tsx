"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AdminSection } from "@/components/admin/AdminCards";
import { adminFetch } from "@/lib/admin-client";

type SiteSettings = {
  whatsappNumber?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  storeEmail?: string;
  storeAddress?: string;
  footerCopyright?: string;
};

export default function AdminSiteSettingsPage() {
  const [form, setForm] = useState<SiteSettings>({
    whatsappNumber: "",
    socialLinks: { instagram: "", facebook: "" },
    storeEmail: "",
    storeAddress: "",
    footerCopyright: ""
  });
  const [baseSettings, setBaseSettings] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const storageKey = "knoted-co-site-settings-draft-v2";

  useEffect(() => {
    adminFetch<{ settings: Record<string, unknown> & SiteSettings }>("/api/settings")
      .then((res) => {
        const settings = res.data.settings;
        setBaseSettings(settings);
        setForm({
          whatsappNumber: settings.whatsappNumber ?? "",
          socialLinks: {
            instagram: settings.socialLinks?.instagram ?? "",
            facebook: settings.socialLinks?.facebook ?? ""
          },
          storeEmail: settings.storeEmail ?? "",
          storeAddress: settings.storeAddress ?? "",
          footerCopyright: settings.footerCopyright ?? ""
        });

        const draft = window.localStorage.getItem(storageKey);
        if (draft) {
          setForm(JSON.parse(draft) as SiteSettings);
          toast("Unsaved site settings draft restored.");
        }
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setIsLoading(false));
  }, []);

  const draft = useMemo(() => form, [form]);

  useEffect(() => {
    if (!isLoading) window.localStorage.setItem(storageKey, JSON.stringify(draft));
  }, [draft, isLoading]);

  const update = (key: keyof SiteSettings, value: unknown) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateSocial = (key: "instagram" | "facebook", value: string) => {
    setForm((current) => ({
      ...current,
      socialLinks: {
        ...current.socialLinks,
        [key]: value
      }
    }));
  };

  const save = async () => {
    setIsSaving(true);
    try {
      const saved = await adminFetch<{ settings: Record<string, unknown> & SiteSettings }>("/api/settings", {
        method: "PUT",
        body: JSON.stringify({ ...baseSettings, ...form })
      });
      setBaseSettings(saved.data.settings);
      window.localStorage.removeItem(storageKey);
      toast.success("Site settings saved");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-olive">Configuration</p>
          <h1 className="font-heading text-4xl font-bold text-brand-ink">Site Settings</h1>
        </div>
        <button disabled={isSaving || isLoading} onClick={save} className="rounded-full bg-brand-red px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-60">
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <AdminSection title="Contact and Social">
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-2xl bg-brand-cream" />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              WhatsApp number
              <input value={form.whatsappNumber ?? ""} onChange={(event) => update("whatsappNumber", event.target.value)} className="field-input" placeholder="919999999999" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              Store email
              <input type="email" value={form.storeEmail ?? ""} onChange={(event) => update("storeEmail", event.target.value)} className="field-input" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              Instagram URL
              <input value={form.socialLinks?.instagram ?? ""} onChange={(event) => updateSocial("instagram", event.target.value)} className="field-input" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              Facebook URL
              <input value={form.socialLinks?.facebook ?? ""} onChange={(event) => updateSocial("facebook", event.target.value)} className="field-input" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-brand-ink md:col-span-2">
              Store address
              <textarea value={form.storeAddress ?? ""} onChange={(event) => update("storeAddress", event.target.value)} className="field-input min-h-28" />
            </label>
          </div>
        )}
      </AdminSection>

      <AdminSection title="Footer">
        <label className="grid gap-2 text-sm font-bold text-brand-ink">
          Footer copyright text
          <input value={form.footerCopyright ?? ""} onChange={(event) => update("footerCopyright", event.target.value)} className="field-input" placeholder="(c) 2025 Knoted Co." />
        </label>
      </AdminSection>
    </div>
  );
}
