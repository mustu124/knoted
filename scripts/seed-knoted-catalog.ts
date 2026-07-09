import fs from "fs";
import path from "path";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { fallbackProducts } from "../lib/product-data";

loadEnvConfig(process.cwd());

const PUBLIC_DIR = path.join(process.cwd(), "public");

async function main() {
  const requiredEnv = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
  const missing = requiredEnv.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required env vars: ${missing.join(", ")}`);
  }

  const bucket = process.env.SUPABASE_STORAGE_BUCKET || "knoted-co";
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  console.log(`Ensuring public bucket "${bucket}" exists...`);
  const { data: buckets, error: listBucketsError } = await supabase.storage.listBuckets();
  if (listBucketsError) throw listBucketsError;

  if (!buckets?.some((existing) => existing.name === bucket)) {
    const { error: createBucketError } = await supabase.storage.createBucket(bucket, { public: true });
    if (createBucketError) throw createBucketError;
    console.log(`Created bucket "${bucket}".`);
  } else {
    console.log(`Bucket "${bucket}" already exists.`);
  }

  let imported = 0;

  for (const product of fallbackProducts) {
    const localImagePath = product.images[0]?.url;
    if (!localImagePath?.startsWith("/products/")) {
      console.log(`Skipping ${product.name} (no local image path).`);
      continue;
    }

    const absoluteImagePath = path.join(PUBLIC_DIR, localImagePath);
    if (!fs.existsSync(absoluteImagePath)) {
      console.warn(`Missing file for ${product.name}: ${absoluteImagePath}`);
      continue;
    }

    const ext = path.extname(absoluteImagePath).toLowerCase();
    const contentType = ext === ".png" ? "image/png" : "image/jpeg";
    const storagePath = `products/${product.slug}${ext}`;
    const buffer = fs.readFileSync(absoluteImagePath);

    const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, buffer, {
      contentType,
      upsert: true
    });
    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

    const productPayload = {
      name: product.name,
      slug: product.slug,
      category: product.category,
      subcategory: product.subcategory ?? "",
      description: product.description,
      price: product.price,
      original_price: product.originalPrice ?? null,
      images: [{ url: publicUrlData.publicUrl, publicId: storagePath, alt: product.name }],
      dimensions: product.dimensions ?? "",
      care_instructions: product.careInstructions ?? "",
      shipping_info: product.shippingInfo ?? "",
      is_featured: product.isFeatured,
      featured: product.featured ?? product.isFeatured,
      in_stock: product.inStock,
      stock_count: product.stockCount,
      inventory: product.stockCount,
      active: true,
      tags: product.tags,
      rating: { average: product.rating.average, count: product.rating.count },
      variants: product.variants ?? []
    };

    console.log(`Uploading ${imported + 1}/${fallbackProducts.length}: ${product.name}`);
    const { error: productError } = await supabase.from("products").upsert(productPayload, { onConflict: "slug" });
    if (productError) throw productError;

    imported += 1;
  }

  console.log(`Done. Seeded ${imported} products into Supabase (bucket "${bucket}").`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
