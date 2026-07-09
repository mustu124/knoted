"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useSiteSettings } from "@/hooks/useSiteSettings";

type PolicySection = {
  icon: string;
  title: string;
  points: string[];
};

const sections: PolicySection[] = [
  {
    icon: "💬",
    title: "How to Order",
    points: ["DM us directly, or check our WhatsApp catalog (link in bio) to place an order."]
  },
  {
    icon: "💳",
    title: "Payment",
    points: [
      "No cash on delivery.",
      "We accept all online payments — UPI, Google Pay, Paytm, and more.",
      "Your order is processed only after full payment is received."
    ]
  },
  {
    icon: "📦",
    title: "Shipping",
    points: [
      "Shipping charges vary by location — free shipping on orders above ₹499.",
      "Dispatch time: 2-5 working days.",
      "Delivery: approx. 1 week, may vary by location.",
      "Tracking details are shared via DM or WhatsApp."
    ]
  },
  {
    icon: "↩️",
    title: "Returns & Exchanges",
    points: [
      "No returns or exchanges unless you receive the wrong item.",
      "If you do receive the wrong item, you must share an unboxing video — uncut and unedited — within 24 hours of delivery."
    ]
  },
  {
    icon: "🔍",
    title: "Damage & Liability",
    points: [
      "Every order is carefully checked before packing.",
      "Once handed over, deliveries are handled by India Post — we're not liable for damage that happens in transit."
    ]
  },
  {
    icon: "⏱️",
    title: "Cancellations",
    points: [
      "Orders can only be cancelled within 2 hours of placing them.",
      "No cancellations once an order is confirmed or dispatched."
    ]
  },
  {
    icon: "🔒",
    title: "Privacy",
    points: ["All personal information is kept confidential and used only for delivering your order."]
  }
];

export default function PoliciesPage() {
  const { whatsappNumber } = useSiteSettings();

  return (
    <main className="min-h-screen bg-brand-cream pb-24 pt-24">
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-5 py-10 text-center sm:px-8"
      >
        <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.2em] text-brand-olive">
          Good to Know
        </motion.p>
        <motion.h1 variants={fadeInUp} className="mt-3 font-heading text-5xl font-bold leading-tight text-brand-ink sm:text-6xl">
          Order & Shipping Policies
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-4 text-lg leading-8 text-stone-700">
          Everything you need to know before placing an order with Knoted Co.
        </motion.p>
      </motion.section>

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="mx-auto grid max-w-3xl gap-4 px-5 sm:px-8"
      >
        {sections.map((section) => (
          <motion.article
            key={section.title}
            variants={fadeInUp}
            className="rounded-2xl border border-brand-ink/10 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-sand text-xl">
                {section.icon}
              </span>
              <h2 className="font-heading text-2xl font-bold text-brand-ink">{section.title}</h2>
            </div>
            <ul className="mt-4 grid gap-2 pl-1">
              {section.points.map((point) => (
                <li key={point} className="flex gap-3 leading-7 text-stone-700">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </motion.article>
        ))}
      </motion.section>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-10 max-w-2xl px-6 text-center"
      >
        <p className="font-script text-3xl text-brand-red">Any questions? DM us anytime. ♡</p>
        <p className="mt-3 leading-7 text-stone-700">Thank you for supporting our small business.</p>
        <Link
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          className="mt-8 inline-flex rounded-full bg-brand-red px-7 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Message Us on WhatsApp
        </Link>
      </motion.div>
    </main>
  );
}
