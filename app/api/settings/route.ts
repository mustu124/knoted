import { fail, ok } from "@/lib/api";
import { assertAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { normalizeSupabaseSettings, settingsPayloadToSupabase } from "@/lib/supabase-mappers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SETTINGS_SINGLETON_ID = "00000000-0000-0000-0000-000000000001";
const noStoreHeaders = {
  "Cache-Control": "no-store, max-age=0"
};

const defaultSettings = {
  heroSlides: [
    {
      image: "/logo.png",
      title: "Handmade with lots of love",
      subtitle: "Scrunchies, bows, and hair accessories made one small batch at a time.",
      ctaText: "Shop Now",
      ctaLink: "/shop"
    }
  ],
  mobileHeroSlides: [
    {
      image: "/logo.png",
      title: "Handmade with lots of love",
      subtitle: "Scrunchies, bows, and hair accessories made one small batch at a time.",
      ctaText: "Shop Now",
      ctaLink: "/shop"
    }
  ],
  videoUrl: "https://youtu.be/f4EtzBdNvrQ?si=xjspTdg_i6b9rmnA",
  announcementText: "Handmade with love · Small batches · New drops every week",
  whatsappNumber: process.env.NEXT_PUBLIC_OWNER_WHATSAPP ?? "910000000000",
  socialLinks: {
    instagram: "https://www.instagram.com/knotedco._/",
    facebook: ""
  },
  aboutText:
    "Knoted Co. is a small handmade hair accessories brand started by Anshika — scrunchies and bows made with lots of love, one small batch at a time.",
  metaTitle: "Knoted Co. | Handmade Hair Accessories",
  metaDescription: "Shop handmade scrunchies, bows, and hair accessories from Knoted Co. — made with lots of love.",
  storeEmail: "",
  storeAddress: "",
  footerCopyright: "© 2026 Knoted Co.",
  categories: [
    {
      name: "Embroidered Hair Clip",
      icon: "Clip",
      description: "Hand-embroidered floral hair clips.",
      subcategories: [],
      visible: true
    },
    {
      name: "Embroidered Head Band",
      icon: "Band",
      description: "Hand-embroidered fabric headbands.",
      subcategories: [],
      visible: true
    },
    {
      name: "Plain Georgette Scrunchy",
      icon: "Scrunchy",
      description: "Solid-colour georgette scrunchies in Small, Medium, and Large.",
      subcategories: [],
      visible: true
    },
    {
      name: "Cotton Scrunchy",
      icon: "Scrunchy",
      description: "Everyday cotton scrunchies, checks, duals, and combo sets.",
      subcategories: [],
      visible: true
    },
    {
      name: "Pigtail Bow",
      icon: "Bow",
      description: "Cotton pigtail bows in plain and gingham prints.",
      subcategories: [],
      visible: true
    },
    {
      name: "Net Bow",
      icon: "Bow",
      description: "Soft tulle net hair bows.",
      subcategories: [],
      visible: true
    },
    {
      name: "Mini Bow",
      icon: "Bow",
      description: "Petite cotton bows for everyday wear.",
      subcategories: [],
      visible: true
    },
    {
      name: "Embroidered Bow",
      icon: "Bow",
      description: "Hand-embroidered floral hair bows.",
      subcategories: [],
      visible: true
    },
    {
      name: "Embroidered Scrunchy",
      icon: "Scrunchy",
      description: "Hand-embroidered detail scrunchies.",
      subcategories: [],
      visible: true
    },
    {
      name: "Satin Scrunchy",
      icon: "Scrunchy",
      description: "Multi-colour satin scrunchies in two sizes.",
      subcategories: [],
      visible: true
    }
  ]
};

function withDefaultCategorySubcategories(settings: typeof defaultSettings) {
  const defaultCategoryMap = new Map(defaultSettings.categories.map((category) => [category.name, category]));

  return {
    ...settings,
    categories: (settings.categories?.length ? settings.categories : defaultSettings.categories).map((category) => {
      const fallback = defaultCategoryMap.get(category.name);
      return {
        ...category,
        icon: category.icon || fallback?.icon || "",
        description: category.description || fallback?.description || "",
        subcategories: category.subcategories?.length ? category.subcategories : fallback?.subcategories ?? [],
        visible: category.visible ?? true
      };
    })
  };
}

async function getSettingsRow() {
  const supabase = getSupabaseAdmin();
  const singleton = await supabase
    .from("settings")
    .select("*")
    .eq("id", SETTINGS_SINGLETON_ID)
    .maybeSingle();

  if (singleton.error) throw singleton.error;
  if (singleton.data) return singleton.data;

  const latest = await supabase
    .from("settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest.error) throw latest.error;
  return latest.data;
}

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return ok(
        { settings: withDefaultCategorySubcategories(defaultSettings), fallback: true },
        "Settings loaded.",
        { headers: noStoreHeaders }
      );
    }

    const settings = await getSettingsRow();
    const normalizedSettings = normalizeSupabaseSettings(settings, defaultSettings);
    return ok(
      { settings: withDefaultCategorySubcategories(normalizedSettings as typeof defaultSettings), fallback: !settings },
      "Settings loaded.",
      { headers: noStoreHeaders }
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to load settings.");
  }
}

export async function PUT(request: Request) {
  const unauthorized = await assertAdmin();
  if (unauthorized) return unauthorized;

  try {
    const payload = await request.json();
    const supabase = getSupabaseAdmin();
    const existing = await getSettingsRow();
    const normalizedExisting = normalizeSupabaseSettings(existing, defaultSettings);
    const settingsPayload = {
      id: SETTINGS_SINGLETON_ID,
      ...settingsPayloadToSupabase({
        ...normalizedExisting,
        ...payload
      })
    };

    const { data: settings, error } = await supabase
      .from("settings")
      .upsert(settingsPayload, { onConflict: "id" })
      .select("*")
      .single();

    if (error) throw error;
    return ok(
      { settings: normalizeSupabaseSettings(settings, defaultSettings) },
      "Settings updated.",
      { headers: noStoreHeaders }
    );
  } catch (error) {
    return fail(error instanceof Error ? error.message : "Failed to update settings.");
  }
}
