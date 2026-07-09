"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CATEGORY_SLUGS, PRODUCT_CATEGORIES } from "@/lib/product-data";

const collectionIcons: Record<string, string> = {
  "Embroidered Hair Clip": "📎",
  "Embroidered Head Band": "🎀",
  "Plain Georgette Scrunchy": "⭕",
  "Cotton Scrunchy": "🧵",
  "Pigtail Bow": "🎀",
  "Net Bow": "🕸️",
  "Mini Bow": "✨",
  "Embroidered Bow": "🌸",
  "Embroidered Scrunchy": "🌷",
  "Satin Scrunchy": "🎗️"
};

export default function CollectionsIndexPage() {
  return (
    <main className="min-h-screen bg-brand-cream pb-20 pt-24">
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-5 py-10 sm:px-8"
      >
        <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.2em] text-brand-olive">
          Shop by Collection
        </motion.p>
        <motion.h1 variants={fadeInUp} className="mt-3 font-heading text-5xl font-bold leading-tight text-brand-ink sm:text-6xl">
          Our Collections
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-4 max-w-2xl text-lg leading-8 text-stone-700">
          Every piece is handmade in small batches. Explore each collection below.
        </motion.p>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        className="mx-auto grid max-w-7xl gap-4 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3"
      >
        {PRODUCT_CATEGORIES.map((category) => (
          <motion.div key={category} variants={fadeInUp}>
            <Link
              href={`/collections/${CATEGORY_SLUGS[category]}`}
              className="flex min-h-[112px] items-center gap-4 rounded-2xl border border-brand-ink/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand-red/40 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-red"
            >
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand-sand text-2xl">
                {collectionIcons[category] ?? "🎀"}
              </span>
              <span className="font-heading text-xl font-bold leading-tight text-brand-ink">{category}</span>
            </Link>
          </motion.div>
        ))}
      </motion.section>
    </main>
  );
}
