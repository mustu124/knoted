"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductCard, ProductSkeleton, QuickViewModal } from "@/components/ProductCard";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { categoryFromSlug, type StoreProduct } from "@/lib/product-data";

type ProductsResponse = {
  data?: { products: StoreProduct[] };
  products?: StoreProduct[];
};

export default function CollectionDetailPage() {
  const params = useParams<{ slug: string }>();
  const category = categoryFromSlug(params.slug);
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<StoreProduct | null>(null);

  useEffect(() => {
    if (!category) return;
    let isMounted = true;
    setIsLoading(true);

    fetch(`/api/products?category=${encodeURIComponent(category)}&limit=48`)
      .then((response) => response.json())
      .then((data: ProductsResponse) => {
        if (isMounted) setProducts(data.data?.products ?? data.products ?? []);
      })
      .catch(() => {
        if (isMounted) setProducts([]);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [category]);

  if (!category) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 pb-20 pt-24 sm:px-6 md:px-8">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl"
      >
        <Link href="/collections" className="text-sm font-bold text-brand-olive underline underline-offset-4">
          ← All Collections
        </Link>
        <h1 className="mt-3 font-heading text-4xl font-bold leading-tight text-brand-ink sm:text-5xl">{category}</h1>
      </motion.header>

      <section className="mx-auto mt-8 max-w-7xl">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="rounded-2xl bg-white p-10 text-center shadow-sm"
          >
            <motion.p variants={fadeInUp} className="font-heading text-3xl font-bold text-brand-ink">
              New pieces coming soon
            </motion.p>
            <motion.p variants={fadeInUp} className="mt-2 text-stone-600">
              This collection is being handmade with love — check back soon or message us on WhatsApp.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link
                href="/shop"
                className="mt-6 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
              >
                Browse All Products
              </Link>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 xl:grid-cols-4"
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} onMoreLikeThis={() => undefined} />
            ))}
          </motion.div>
        )}
      </section>

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </main>
  );
}
