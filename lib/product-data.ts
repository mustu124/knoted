export const PRODUCT_CATEGORIES = [
  "Embroidered Hair Clip",
  "Embroidered Head Band",
  "Plain Georgette Scrunchy",
  "Cotton Scrunchy",
  "Pigtail Bow",
  "Net Bow",
  "Mini Bow",
  "Embroidered Bow",
  "Embroidered Scrunchy",
  "Satin Scrunchy"
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const CATEGORY_SLUGS: Record<ProductCategory, string> = {
  "Embroidered Hair Clip": "embroidered-hair-clip",
  "Embroidered Head Band": "embroidered-head-band",
  "Plain Georgette Scrunchy": "plain-georgette-scrunchy",
  "Cotton Scrunchy": "cotton-scrunchy",
  "Pigtail Bow": "pigtail-bow",
  "Net Bow": "net-bow",
  "Mini Bow": "mini-bow",
  "Embroidered Bow": "embroidered-bow",
  "Embroidered Scrunchy": "embroidered-scrunchy",
  "Satin Scrunchy": "satin-scrunchy"
};

export function categoryFromSlug(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((category) => CATEGORY_SLUGS[category] === slug);
}

export const PRODUCT_SIZES = ["Small", "Medium", "Large"] as const;
export type ProductSize = (typeof PRODUCT_SIZES)[number];
export type SizePriceEntry = { size: ProductSize; price: number };

export type StoreProduct = {
  _id: string;
  name: string;
  slug: string;
  category: ProductCategory;
  subcategory?: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: Array<{
    url: string;
    publicId?: string;
    alt?: string;
  }>;
  videoUrl?: string;
  dimensions?: string;
  careInstructions?: string;
  shippingInfo?: string;
  isFeatured: boolean;
  featured?: boolean;
  inStock: boolean;
  stockCount: number;
  tags: string[];
  rating: {
    average: number;
    count: number;
  };
  createdAt: string;
  variants?: string[];
  sizePricing?: SizePriceEntry[];
  popularScore?: number;
};

export function slugifyProductName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getStableRatingSeed(value: string) {
  return Array.from(value).reduce((hash, char) => {
    return (hash * 31 + char.charCodeAt(0)) % 9973;
  }, 17);
}

export function getDisplayRating(product: Pick<StoreProduct, "slug" | "name" | "_id">) {
  const seed = getStableRatingSeed(product.slug || product.name || product._id);
  return Number((4.5 + (seed % 6) / 10).toFixed(1));
}

const careInstructions = "Store flat or hang to keep shape. Avoid pulling fabric tightly. Keep away from moisture.";
const shippingInfo = "Made to order with love — ships in 2-4 business days across India.";

function product(partial: {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  variants?: string[];
  sizePricing?: SizePriceEntry[];
  featured?: boolean;
  createdAt: string;
  stockCount?: number;
}): StoreProduct {
  const slug = slugifyProductName(partial.name);
  return {
    _id: partial.id,
    name: partial.name,
    slug,
    category: partial.category,
    description: partial.description,
    price: partial.price,
    originalPrice: partial.originalPrice,
    images: [{ url: partial.image, publicId: partial.id, alt: partial.name }],
    dimensions: undefined,
    careInstructions,
    shippingInfo,
    isFeatured: Boolean(partial.featured),
    featured: Boolean(partial.featured),
    inStock: true,
    stockCount: partial.stockCount ?? 15,
    tags: [partial.category.toLowerCase().replace(/\s+/g, "-"), "handmade", "knoted-co"],
    rating: { average: 4.8, count: 12 },
    createdAt: partial.createdAt,
    variants: partial.variants,
    sizePricing: partial.sizePricing,
    popularScore: 70
  };
}

export const fallbackProducts: StoreProduct[] = [
  // Plain Georgette Scrunchy — ₹80, single colour, Small/Medium/Large
  product({
    id: "georgette-soft-sand",
    name: "Georgette Scrunchie (Soft Sand)",
    category: "Plain Georgette Scrunchy",
    description: "A soft sand georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-soft-sand.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    featured: true,
    createdAt: "2026-06-20T10:00:00.000Z"
  }),
  product({
    id: "georgette-mint-whisper",
    name: "Georgette Scrunchie (Mint Whisper)",
    category: "Plain Georgette Scrunchy",
    description: "A dreamy sage-mint georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-mint-whisper.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    featured: true,
    createdAt: "2026-06-20T10:01:00.000Z"
  }),
  product({
    id: "georgette-blush-berry",
    name: "Georgette Scrunchie (Blush Berry)",
    category: "Plain Georgette Scrunchy",
    description: "A rich berry-mauve georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-blush-berry.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:02:00.000Z"
  }),
  product({
    id: "georgette-royal-plum",
    name: "Georgette Scrunchie (Royal Plum)",
    category: "Plain Georgette Scrunchy",
    description: "A deep plum georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-royal-plum.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:03:00.000Z"
  }),
  product({
    id: "georgette-scarlet",
    name: "Georgette Scrunchie (Scarlet)",
    category: "Plain Georgette Scrunchy",
    description: "A bold scarlet georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-scarlet.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    featured: true,
    createdAt: "2026-06-20T10:04:00.000Z"
  }),
  product({
    id: "georgette-powder-blue",
    name: "Georgette Scrunchie (Powder Blue)",
    category: "Plain Georgette Scrunchy",
    description: "A soft powder blue georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-powder-blue.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:05:00.000Z"
  }),
  product({
    id: "georgette-shadow",
    name: "Georgette Scrunchie (Shadow)",
    category: "Plain Georgette Scrunchy",
    description: "A warm taupe-grey georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-shadow.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:06:00.000Z"
  }),
  product({
    id: "georgette-blush",
    name: "Georgette Scrunchie (Blush)",
    category: "Plain Georgette Scrunchy",
    description: "A tender blush-pink georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-blush.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:07:00.000Z"
  }),
  product({
    id: "georgette-midnight-blue",
    name: "Georgette Scrunchie (Midnight Blue)",
    category: "Plain Georgette Scrunchy",
    description: "A deep midnight blue georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-midnight-blue.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:08:00.000Z"
  }),
  product({
    id: "georgette-snow",
    name: "Georgette Scrunchie (Snow)",
    category: "Plain Georgette Scrunchy",
    description: "A clean ivory-white georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-snow.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:09:00.000Z"
  }),
  product({
    id: "georgette-lemon-chiffon",
    name: "Georgette Scrunchie (Lemon Chiffon)",
    category: "Plain Georgette Scrunchy",
    description: "A soft buttery yellow georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-lemon-chiffon.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:10:00.000Z"
  }),
  product({
    id: "georgette-chocolate",
    name: "Georgette Scrunchie (Chocolate)",
    category: "Plain Georgette Scrunchy",
    description: "A rich chocolate-brown georgette scrunchie with a full, ruffled finish. Available in Small, Medium, and Large.",
    price: 80,
    image: "/products/georgette-chocolate.jpg",
    sizePricing: [
      { size: "Small", price: 80 },
      { size: "Medium", price: 80 },
      { size: "Large", price: 80 }
    ],
    createdAt: "2026-06-20T10:11:00.000Z"
  }),

  // Multi-colour georgette scrunchies — ₹155, two sizes (fabric is georgette, filed under this collection; see note to Anshika)
  product({
    id: "georgette-multi-ocean",
    name: "Multi Colour Georgette Scrunchie (Ocean)",
    category: "Plain Georgette Scrunchy",
    description: "A patchwork georgette scrunchie in navy, white, grey, and seafoam tones. Available in two sizes.",
    price: 155,
    image: "/products/georgette-multi-ocean.jpg",
    sizePricing: [
      { size: "Small", price: 155 },
      { size: "Large", price: 155 }
    ],
    createdAt: "2026-06-20T10:12:00.000Z"
  }),
  product({
    id: "georgette-multi-coffee",
    name: "Multi Colour Georgette Scrunchie (Coffee)",
    category: "Plain Georgette Scrunchy",
    description: "A patchwork georgette scrunchie in chocolate, tan, and cream tones. Available in two sizes.",
    price: 155,
    image: "/products/georgette-multi-coffee.jpg",
    sizePricing: [
      { size: "Small", price: 155 },
      { size: "Large", price: 155 }
    ],
    createdAt: "2026-06-20T10:13:00.000Z"
  }),
  product({
    id: "georgette-multi-pastel-bloom",
    name: "Multi Colour Georgette Scrunchie (Pastel Bloom)",
    category: "Plain Georgette Scrunchy",
    description: "A patchwork georgette scrunchie in soft pastel mint, pink, yellow, and white. Available in two sizes.",
    price: 155,
    image: "/products/georgette-multi-pastel-bloom.jpg",
    sizePricing: [
      { size: "Small", price: 155 },
      { size: "Large", price: 155 }
    ],
    featured: true,
    createdAt: "2026-06-20T10:14:00.000Z"
  }),

  // Satin Scrunchy — ₹155, two sizes
  product({
    id: "satin-fluffy-candy-floss",
    name: "Multi Colour Satin Scrunchie (Fluffy Candy Floss)",
    category: "Satin Scrunchy",
    description: "A fluffy, candy-floss-soft satin scrunchie in a pastel patchwork of pink, mint, grey, and cream. Available in two sizes.",
    price: 155,
    image: "/products/satin-fluffy-candy-floss.jpg",
    sizePricing: [
      { size: "Small", price: 155 },
      { size: "Large", price: 155 }
    ],
    featured: true,
    createdAt: "2026-06-21T10:00:00.000Z"
  }),

  // Cotton Scrunchy
  product({
    id: "cotton-red-dual",
    name: "Red Dual Cotton Scrunchie",
    category: "Cotton Scrunchy",
    description: "A two-tone cotton scrunchie pairing red with a cherry print accent.",
    price: 110,
    originalPrice: 129,
    image: "/products/cotton-red-dual.jpg",
    createdAt: "2026-06-21T10:01:00.000Z"
  }),
  product({
    id: "cotton-blue-dual",
    name: "Blue Dual Cotton Scrunchie",
    category: "Cotton Scrunchy",
    description: "A two-tone cotton scrunchie pairing teal with a soft floral print accent.",
    price: 110,
    originalPrice: 129,
    image: "/products/cotton-blue-dual.jpg",
    createdAt: "2026-06-21T10:02:00.000Z"
  }),
  product({
    id: "cotton-pink-dual",
    name: "Pink Dual Cotton Scrunchie",
    category: "Cotton Scrunchy",
    description: "A two-tone cotton scrunchie pairing blush pink with a coordinating floral print.",
    price: 110,
    originalPrice: 129,
    image: "/products/cotton-pink-dual.jpg",
    createdAt: "2026-06-21T10:03:00.000Z"
  }),
  product({
    id: "cotton-pink-check",
    name: "Pink Check Cotton Scrunchie",
    category: "Cotton Scrunchy",
    description: "A classic pink gingham cotton scrunchie for everyday wear.",
    price: 95,
    originalPrice: 110,
    image: "/products/cotton-pink-check.jpg",
    featured: true,
    createdAt: "2026-06-21T10:04:00.000Z"
  }),
  product({
    id: "cotton-blue-check",
    name: "Blue Check Cotton Scrunchie",
    category: "Cotton Scrunchy",
    description: "A classic blue gingham cotton scrunchie for everyday wear.",
    price: 95,
    originalPrice: 110,
    image: "/products/cotton-blue-check.jpg",
    createdAt: "2026-06-21T10:05:00.000Z"
  }),
  product({
    id: "cotton-skinny-combo-set-of-3",
    name: "Cotton Skinny Combo Set of 3",
    category: "Cotton Scrunchy",
    description:
      "A set of 3 skinny cotton scrunchies in a coordinated colour combo — great for everyday mixing and matching. Also sold as a single scrunchie for ₹50.",
    price: 129,
    originalPrice: 149,
    image: "/products/cotton-combo-set-a.jpg",
    variants: ["Combo Set A", "Combo Set B", "Combo Set C"],
    featured: true,
    createdAt: "2026-06-21T10:06:00.000Z"
  }),

  // Pigtail Bow — ₹199 (₹299 plain, ₹349 gingham)
  product({
    id: "pigtail-bow-teal-sage",
    name: "Pigtail Cotton Hair Bow (Teal Sage)",
    category: "Pigtail Bow",
    description: "A plain cotton pigtail bow in a soft teal-sage shade.",
    price: 199,
    originalPrice: 299,
    image: "/products/pigtail-bow-teal-sage.jpg",
    featured: true,
    createdAt: "2026-06-22T10:00:00.000Z"
  }),
  product({
    id: "pigtail-bow-maroon",
    name: "Pigtail Cotton Hair Bow (Maroon Red)",
    category: "Pigtail Bow",
    description: "A plain cotton pigtail bow in a rich maroon-red shade.",
    price: 199,
    originalPrice: 299,
    image: "/products/pigtail-bow-maroon.jpg",
    createdAt: "2026-06-22T10:01:00.000Z"
  }),
  product({
    id: "pigtail-bow-cream",
    name: "Pigtail Cotton Hair Bow (Cream)",
    category: "Pigtail Bow",
    description: "A plain cotton pigtail bow in a soft cream shade.",
    price: 199,
    originalPrice: 299,
    image: "/products/pigtail-bow-cream.jpg",
    createdAt: "2026-06-22T10:02:00.000Z"
  }),
  product({
    id: "pigtail-bow-blush-pink",
    name: "Pigtail Cotton Hair Bow (Blush Pink Floral)",
    category: "Pigtail Bow",
    description: "A plain cotton pigtail bow in a delicate blush pink floral print.",
    price: 199,
    originalPrice: 299,
    image: "/products/pigtail-bow-blush-floral-blue.jpg",
    createdAt: "2026-06-22T10:03:00.000Z"
  }),
  product({
    id: "pigtail-bow-blue-gingham",
    name: "Pigtail Cotton Hair Bow (Blue Gingham)",
    category: "Pigtail Bow",
    description: "A cotton pigtail bow in a crisp blue gingham print.",
    price: 199,
    originalPrice: 349,
    image: "/products/pigtail-bow-blue-gingham.jpg",
    featured: true,
    createdAt: "2026-06-22T10:04:00.000Z"
  }),
  product({
    id: "pigtail-bow-pink-gingham",
    name: "Pigtail Cotton Hair Bow (Pink Gingham)",
    category: "Pigtail Bow",
    description: "A cotton pigtail bow in a sweet pink gingham print.",
    price: 199,
    originalPrice: 349,
    image: "/products/pigtail-bow-pink-gingham.jpg",
    createdAt: "2026-06-22T10:05:00.000Z"
  }),

  // Net Bow — ₹79
  product({
    id: "net-bow",
    name: "Net Hair Bow",
    category: "Net Bow",
    description: "A soft tulle net hair bow — light, sheer, and delicate. Available in White, Pink, Mauve, and Grey.",
    price: 79,
    originalPrice: 110,
    image: "/products/net-bow-multi.jpg",
    variants: ["White", "Pink", "Mauve", "Grey"],
    featured: true,
    createdAt: "2026-06-22T10:06:00.000Z"
  }),

  // Mini Bow — ₹50
  product({
    id: "mini-bow-blush-floral",
    name: "Mini Cotton Bow (Blush Floral)",
    category: "Mini Bow",
    description: "A petite cotton bow in a delicate blush floral print, perfect for everyday wear.",
    price: 50,
    originalPrice: 75,
    image: "/products/mini-bow-blush-floral-pink.jpg",
    createdAt: "2026-06-22T10:07:00.000Z"
  }),
  product({
    id: "mini-bow-cherry-print",
    name: "Mini Cotton Bow (Cherry Print)",
    category: "Mini Bow",
    description: "A petite cotton bow in a playful cherry print, perfect for everyday wear.",
    price: 50,
    originalPrice: 75,
    image: "/products/mini-bow-cherry-print.jpg",
    createdAt: "2026-06-22T10:08:00.000Z"
  }),
  product({
    id: "mini-bow-cream-floral",
    name: "Mini Cotton Bow (Cream Floral)",
    category: "Mini Bow",
    description: "A petite cotton bow in a soft cream floral print, perfect for everyday wear.",
    price: 50,
    originalPrice: 75,
    image: "/products/mini-bow-cream-floral.jpg",
    createdAt: "2026-06-22T10:09:00.000Z"
  }),

  // Embroidered Bow — ₹249
  product({
    id: "embroidered-bow-cream",
    name: "Embroidered Bow (Cream Floral)",
    category: "Embroidered Bow",
    description: "A cream cotton bow finished with hand-embroidered pink roses — a signature Knoted Co. detail piece.",
    price: 249,
    originalPrice: 349,
    image: "/products/embroidered-bow-cream.jpg",
    featured: true,
    createdAt: "2026-06-23T10:00:00.000Z"
  })
];

export function normalizeProduct(product: Record<string, unknown>): StoreProduct {
  const name = String(product.name ?? "Untitled Product");
  const slug = String(product.slug ?? slugifyProductName(name));
  const isFeatured = Boolean(product.isFeatured ?? product.featured);
  const _id = String(product._id ?? product.id ?? slug);
  const ratingAverage = getDisplayRating({ _id, name, slug });

  return {
    _id,
    name,
    slug,
    category: (product.category as ProductCategory) ?? "Plain Georgette Scrunchy",
    subcategory: product.subcategory ? String(product.subcategory) : undefined,
    description: String(product.description ?? ""),
    price: Number(product.price ?? 0),
    originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
    images: Array.isArray(product.images) ? (product.images as StoreProduct["images"]) : [],
    videoUrl: product.videoUrl ? String(product.videoUrl) : undefined,
    dimensions: product.dimensions ? String(product.dimensions) : undefined,
    careInstructions: product.careInstructions ? String(product.careInstructions) : undefined,
    shippingInfo: product.shippingInfo ? String(product.shippingInfo) : undefined,
    isFeatured,
    featured: isFeatured,
    inStock: product.inStock === undefined ? true : Boolean(product.inStock),
    stockCount: Number(product.stockCount ?? product.inventory ?? 0),
    tags: Array.isArray(product.tags) ? (product.tags as string[]) : [],
    rating: { average: ratingAverage, count: 0 },
    createdAt: product.createdAt ? String(product.createdAt) : new Date().toISOString(),
    variants: Array.isArray(product.variants) ? (product.variants as string[]) : undefined,
    sizePricing: Array.isArray(product.sizePricing)
      ? (product.sizePricing as SizePriceEntry[]).filter(
          (entry) => entry && PRODUCT_SIZES.includes(entry.size) && Number.isFinite(Number(entry.price))
        )
      : undefined,
    popularScore: Number(product.popularScore ?? 0)
  };
}

export function filterFallbackProducts({
  category,
  exclude,
  featured,
  query
}: {
  category?: string | null;
  exclude?: string | null;
  featured?: boolean;
  query?: string | null;
}) {
  const normalizedQuery = query?.toLowerCase().trim();

  return fallbackProducts.filter((product) => {
    if (featured && !product.isFeatured) return false;
    if (category && product.category !== category) return false;
    if (exclude && (product._id === exclude || product.slug === exclude)) return false;

    if (normalizedQuery) {
      const haystack = [product.name, product.category, product.description, product.tags.join(" ")]
        .join(" ")
        .toLowerCase();

      if (!haystack.includes(normalizedQuery)) return false;
    }

    return true;
  }).map((product) => normalizeProduct(product as unknown as Record<string, unknown>));
}
