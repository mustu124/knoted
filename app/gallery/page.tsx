"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { getDisplayMediaUrl } from "@/lib/media";
import { PRODUCT_CATEGORIES, type StoreProduct } from "@/lib/product-data";

const filters = ["All", ...PRODUCT_CATEGORIES];

type MediaTile = {
  _id: string;
  url: string;
  caption: string;
  category: string;
  productSlug: string;
};

type ProductsResponse = {
  data?: { products: StoreProduct[] };
  products?: StoreProduct[];
};

function optimizedMediaUrl(src: string, width = 800) {
  return getDisplayMediaUrl(src);
}

function productsToTiles(products: StoreProduct[]): MediaTile[] {
  return products.flatMap((product) =>
    product.images.map((image, index) => ({
      _id: `${product._id}-${index}`,
      url: image.url,
      caption: product.name,
      category: product.category,
      productSlug: product.slug
    }))
  );
}

export default function GalleryPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState<MediaTile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const loadItems = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams({ limit: "100" });
    if (activeFilter !== "All") params.set("category", activeFilter);

    const response = await fetch(`/api/products?${params.toString()}`);
    const data = (await response.json()) as ProductsResponse;
    const products = data.data?.products ?? data.products ?? [];

    setItems(productsToTiles(products));
    setIsLoading(false);
  }, [activeFilter]);

  useEffect(() => {
    loadItems().catch(() => {
      setItems([]);
      setIsLoading(false);
    });
  }, [loadItems]);

  const openLightbox = (item: MediaTile) => {
    setLightboxIndex(items.findIndex((candidate) => candidate._id === item._id));
  };

  return (
    <main className="min-h-screen bg-brand-cream pb-20">
      <section className="relative flex min-h-[420px] items-center overflow-hidden bg-brand-ink px-6 pt-24 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(43,38,32,0.9),rgba(63,82,51,0.58)),url('https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85')] bg-cover bg-center" />
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-7xl"
        >
          <p className="text-sm font-black uppercase tracking-[0.22em] text-brand-sand">Knoted Co. Gallery</p>
          <h1 className="mt-4 font-heading text-5xl font-bold md:text-7xl">Shop the Look</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
            Every piece in one photo wall — tap any photo to shop it.
          </p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-20 z-20 -mx-4 overflow-x-auto border-y border-brand-ink/10 bg-brand-cream/90 px-4 py-4 backdrop-blur md:-mx-8 md:px-8"
        >
          <div className="flex min-w-max gap-2">
            {filters.map((filter) => (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className={`rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.12em] transition focus:outline-none focus:ring-2 focus:ring-brand-red ${
                  activeFilter === filter ? "bg-brand-red text-white" : "bg-white text-brand-ink shadow-sm"
                }`}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {isLoading ? (
          <GalleryLoader />
        ) : items.length === 0 ? (
          <div className="mt-10 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="font-heading text-2xl font-bold text-brand-ink">No photos in this collection yet</p>
          </div>
        ) : (
          <motion.div layout className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-5">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <GalleryTile key={item._id} item={item} onClick={() => openLightbox(item)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      <Lightbox items={items} activeIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
    </main>
  );
}

function GalleryTile({ item, onClick }: { item: MediaTile; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.96 }}
      transition={{ duration: 0.38, ease: "easeOut" }}
      onClick={onClick}
      className="group relative mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-brand-sand text-left shadow-[0_16px_40px_rgba(43,38,32,0.12)] focus:outline-none focus:ring-2 focus:ring-brand-red"
    >
      <Image
        src={optimizedMediaUrl(item.url, 720)}
        alt={item.caption}
        width={640}
        height={700}
        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
        loading="lazy"
        quality={78}
        className="h-auto w-full object-cover transition duration-700 group-hover:scale-[1.04]"
      />
      <motion.div
        className="absolute inset-0 flex items-end bg-gradient-to-t from-black/76 via-black/20 to-transparent p-4 opacity-0 group-hover:opacity-100"
        transition={{ duration: 0.25 }}
      >
        <motion.div initial={{ y: 18 }} whileHover={{ y: 0 }} className="translate-y-4 transition duration-300 group-hover:translate-y-0">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-sand">{item.category}</p>
          <p className="mt-1 font-heading text-lg font-bold leading-tight text-white">{item.caption}</p>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}

function Lightbox({
  items,
  activeIndex,
  onClose,
  onNavigate
}: {
  items: MediaTile[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = activeIndex === null ? null : items[activeIndex];

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onNavigate((activeIndex - 1 + items.length) % items.length);
      if (event.key === "ArrowRight") onNavigate((activeIndex + 1) % items.length);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {item && activeIndex !== null && (
        <motion.div
          className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 p-4 text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close gallery lightbox"
            className="absolute right-5 top-5 rounded-full border border-white/20 px-4 py-2 font-black"
          >
            X
          </button>
          <button
            type="button"
            aria-label="Previous gallery item"
            onClick={() => onNavigate((activeIndex - 1 + items.length) % items.length)}
            className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next gallery item"
            onClick={() => onNavigate((activeIndex + 1) % items.length)}
            className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-3xl"
          >
            ›
          </button>
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex max-h-[90vh] max-w-6xl flex-col items-center"
          >
            <Image
              src={optimizedMediaUrl(item.url, 1600)}
              alt={item.caption}
              width={1400}
              height={1600}
              sizes="92vw"
              quality={84}
              className="max-h-[74vh] max-w-[92vw] rounded-2xl object-contain"
            />
            <p className="mt-4 max-w-3xl text-center font-heading text-2xl font-bold">{item.caption}</p>
            <Link
              href={`/shop/${item.productSlug}`}
              className="mt-4 inline-flex rounded-full bg-brand-red px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
            >
              Shop This
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function GalleryLoader() {
  return (
    <div className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-5">
      {Array.from({ length: 20 }).map((_, index) => (
        <div
          key={index}
          className="mb-4 break-inside-avoid rounded-2xl bg-brand-sand"
          style={{ height: `${index % 3 === 0 ? 280 : index % 3 === 1 ? 360 : 220}px` }}
        >
          <div className="h-full w-full animate-pulse rounded-2xl bg-brand-ink/10" />
        </div>
      ))}
    </div>
  );
}
