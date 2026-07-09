"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminSection, StatCard } from "@/components/admin/AdminCards";
import { adminFetch } from "@/lib/admin-client";
import type { StoreProduct } from "@/lib/product-data";
import { PRODUCT_CATEGORIES } from "@/lib/product-data";

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [productTotal, setProductTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminFetch<{ products: StoreProduct[]; total: number }>("/api/products?limit=100")
      .then((res) => {
        setProducts(res.data.products);
        setProductTotal(res.data.total);
      })
      .catch(() => undefined)
      .finally(() => setIsLoading(false));
  }, []);

  const populatedCollections = new Set(products.map((product) => product.category)).size;

  return (
    <div className="grid gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-olive">Admin</p>
          <h1 className="font-heading text-4xl font-bold text-brand-ink">Dashboard</h1>
        </div>
        <Link href="/admin/products/new" className="rounded-full bg-brand-red px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white">
          Quick Add Product
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total Products" value={isLoading ? "..." : productTotal || products.length} />
        <StatCard label="Collections Stocked" value={isLoading ? "..." : `${populatedCollections} / ${PRODUCT_CATEGORIES.length}`} />
        <StatCard label="Featured Products" value={isLoading ? "..." : products.filter((product) => product.isFeatured).length} />
      </div>

      <AdminSection title="Recent Products" description="Last products added to the catalogue">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => (
            <Link
              key={product._id}
              href={`/admin/products/${product.slug}/edit`}
              className="block rounded-2xl border border-brand-ink/10 bg-white p-4 shadow-sm"
            >
              <p className="font-black text-brand-ink">{product.name}</p>
              <p className="mt-1 text-sm text-stone-600">{product.category}</p>
              <p className="mt-2 font-black text-brand-red">₹{product.price.toLocaleString("en-IN")}</p>
            </Link>
          ))}
          {!isLoading && !products.length && <p className="py-8 text-center text-stone-500">No products yet.</p>}
        </div>
      </AdminSection>
    </div>
  );
}
