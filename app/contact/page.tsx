"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const policies = {
  refundPolicy: "No returns or exchanges unless the wrong item is received",
  shippingPolicy: "Free shipping on orders above ₹499 · Dispatch in 2-5 working days"
};

export default function ContactPage() {
  const { whatsappNumber, storeEmail, storeAddress } = useSiteSettings();
  const email = storeEmail || "hello@knotedco.com";
  const address = storeAddress || "India";

  return (
    <main className="min-h-screen bg-brand-cream pb-20 pt-24">
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-7xl px-5 py-12 sm:px-8"
      >
        <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.2em] text-brand-olive">
          Contact
        </motion.p>
        <motion.h1 variants={fadeInUp} className="mt-4 max-w-3xl font-heading text-5xl font-bold leading-tight text-brand-ink sm:text-6xl">
          Let us help you choose the right handmade piece.
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-5 max-w-2xl text-lg leading-8 text-stone-700">
          Ask about sizes, custom colours, bulk gifting, or styling ideas. We usually reply within one working day.
        </motion.p>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto grid max-w-7xl gap-6 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <motion.div variants={fadeInUp} className="rounded-2xl bg-brand-ink p-6 text-white shadow-soft">
          <h2 className="font-heading text-3xl font-bold text-white">Reach Us</h2>
          <div className="mt-6 grid gap-4 text-sm font-bold">
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer" className="rounded-xl bg-white/10 p-4">
              WhatsApp: +{whatsappNumber}
            </a>
            <a href={`mailto:${email}`} className="rounded-xl bg-white/10 p-4">
              Email: {email}
            </a>
            <p className="rounded-xl bg-white/10 p-4">Address: {address}</p>
          </div>
        </motion.div>

        <motion.form variants={fadeInUp} className="grid gap-4 rounded-2xl bg-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              Name
              <input className="field-input" placeholder="Your name" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-brand-ink">
              Phone
              <input className="field-input" placeholder="Your phone number" />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-brand-ink">
            Message
            <textarea className="field-input min-h-36 resize-none" placeholder="Tell us what you are looking for" />
          </label>
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Knoted Co., I would like to enquire about your handmade products.")}`}
            target="_blank"
            className="inline-flex justify-center rounded-full bg-brand-red px-6 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
          >
            Continue on WhatsApp
          </Link>
        </motion.form>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        className="mx-auto mt-8 grid max-w-7xl gap-4 px-5 sm:px-8 md:grid-cols-2"
      >
        <motion.article variants={fadeInUp} className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-olive">Returns</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink">Refund cancellation policy</h2>
          <p className="mt-3 leading-7 text-stone-700">{policies.refundPolicy}.</p>
        </motion.article>
        <motion.article variants={fadeInUp} className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-olive">Shipping</p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brand-ink">Delivery availability</h2>
          <p className="mt-3 leading-7 text-stone-700">{policies.shippingPolicy}.</p>
        </motion.article>
      </motion.section>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-6 max-w-7xl px-5 text-center sm:px-8"
      >
        <Link href="/policies" className="font-bold text-brand-olive underline underline-offset-4">
          Read our full order, shipping & returns policies →
        </Link>
      </motion.div>
    </main>
  );
}
