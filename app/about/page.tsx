"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

function HeartDivider() {
  return (
    <div className="heart-divider text-brand-red">
      <svg width="18" height="16" viewBox="0 0 18 16" fill="none" aria-hidden="true">
        <path
          d="M9 15S1 9.7 1 5.2C1 2.3 3.1 1 5 1c1.7 0 3 1 4 2.4C10 2 11.3 1 13 1c1.9 0 4 1.3 4 4.2C17 9.7 9 15 9 15Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      </svg>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-cream pb-24 pt-24">
      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl px-5 py-10 text-center sm:px-8"
      >
        <motion.p variants={fadeInUp} className="text-sm font-black uppercase tracking-[0.2em] text-brand-olive">
          Meet the Founder
        </motion.p>
        <motion.h1 variants={fadeInUp} className="mt-3 font-script text-5xl leading-tight text-brand-red sm:text-6xl">
          Hi, I&apos;m Anshika. 🤍
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-2 font-heading text-2xl font-bold text-brand-ink sm:text-3xl">
          Welcome to Knoted Co.
        </motion.p>
      </motion.section>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="paper-card mx-auto mb-10 aspect-[4/5] w-full max-w-sm overflow-hidden bg-white shadow-soft sm:max-w-md"
      >
        <Image
          src="/founder/founder-1.jpg"
          alt="Anshika, founder of Knoted Co."
          width={800}
          height={1000}
          priority
          className="h-full w-full object-cover"
        />
      </motion.div>

      <StorySection>
        <Paragraph>
          If you&apos;re here, chances are you love little things that make a big difference—and honestly, so do I.
        </Paragraph>
        <Paragraph>
          Knoted Co. wasn&apos;t born from a business plan or a big investment. It started with a simple idea, a
          love for creating, and the belief that even the smallest accessories can make someone feel a little more
          confident, a little happier, and a little more like themselves.
        </Paragraph>
        <Paragraph>
          What began as a creative hobby slowly turned into something much bigger—a community of wonderful people
          who chose to support a dream they didn&apos;t have to believe in, but did anyway.
        </Paragraph>
        <Paragraph>
          Every scrunchie, every order, every message, and every review has helped shape this journey into what it
          is today.
        </Paragraph>
      </StorySection>

      <SectionHeading>The Story Behind Knoted Co.</SectionHeading>

      <StorySection>
        <Paragraph>
          Like every small business, this journey has been filled with excitement, uncertainty, and countless late
          nights.
        </Paragraph>
        <Paragraph>
          There have been moments when I questioned myself, worried if anyone would love what I created, and
          wondered if I was doing enough. Some days the orders poured in, while on others I found myself
          overthinking every decision.
        </Paragraph>
        <Paragraph>But through every high and every low, one thing remained constant—my love for creating.</Paragraph>
        <Paragraph>
          Knowing that something I designed becomes a small part of someone&apos;s everyday life is what keeps me
          going. That&apos;s a feeling I&apos;ll never take for granted.
        </Paragraph>
      </StorySection>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="paper-card mx-auto my-10 aspect-[4/5] w-full max-w-sm overflow-hidden bg-white shadow-soft sm:max-w-md"
      >
        <Image
          src="/founder/founder-2.jpg"
          alt="Anshika, founder of Knoted Co., in a quiet moment"
          width={800}
          height={1000}
          className="h-full w-full object-cover"
        />
      </motion.div>

      <SectionHeading>More Than Just Accessories</SectionHeading>

      <StorySection>
        <Paragraph>For me, Knoted Co. has never been just about selling products.</Paragraph>
        <Paragraph>It&apos;s about creating pieces that people genuinely enjoy wearing.</Paragraph>
        <Paragraph>
          It&apos;s about paying attention to every detail—from selecting fabrics and colors to carefully packing
          each order with love.
        </Paragraph>
        <Paragraph>
          It&apos;s about making every customer feel valued, not just as a buyer, but as someone who believed in a
          dream.
        </Paragraph>
        <Paragraph>
          Because behind every package is a real person who does a little happy dance with every new order.
        </Paragraph>
      </StorySection>

      <SectionHeading>To Everyone Who Has Supported This Journey</SectionHeading>

      <StorySection>
        <Paragraph>
          Whether you&apos;ve placed an order, shared my page with a friend, liked a post, left a kind review, or
          simply visited this website...
        </Paragraph>
        <Paragraph className="font-heading text-xl font-bold text-brand-ink">Thank you.</Paragraph>
        <Paragraph>Your support means far more than a transaction.</Paragraph>
        <Paragraph>
          It gives a small business the confidence to keep creating, learning, improving, and dreaming bigger.
        </Paragraph>
        <Paragraph>
          Knoted Co. exists because people like you chose to support handmade creativity over mass production, and
          I&apos;ll always be grateful for that.
        </Paragraph>
      </StorySection>

      <SectionHeading>Looking Ahead</SectionHeading>

      <StorySection>
        <Paragraph>This is only the beginning.</Paragraph>
        <Paragraph>
          I hope Knoted Co. continues to grow into a brand that feels warm, personal, and inspiring—a place where
          every product is made with intention and every customer feels appreciated.
        </Paragraph>
        <Paragraph>Thank you for being here and for becoming a part of this journey.</Paragraph>
        <Paragraph>I can&apos;t wait to create many more beautiful things for you.</Paragraph>
      </StorySection>

      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        className="mx-auto mt-4 max-w-lg px-6 text-center"
      >
        <HeartDivider />
        <p className="mt-6 font-script text-3xl text-brand-red">With lots of love,</p>
        <p className="mt-1 font-script text-4xl text-brand-red">Anshika</p>
        <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-brand-olive">
          Founder, Knoted Co. ♡
        </p>

        <Link
          href="/shop"
          className="mt-10 inline-flex rounded-full bg-brand-red px-7 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          Shop Handmade Pieces
        </Link>
      </motion.div>
    </main>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      className="mx-auto max-w-2xl px-6 pb-2 pt-6 text-center font-script text-4xl text-brand-red sm:text-5xl"
    >
      {children}
    </motion.h2>
  );
}

function StorySection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mx-auto grid max-w-2xl gap-4 px-6 py-4 sm:px-8"
    >
      {children}
    </motion.div>
  );
}

function Paragraph({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.p variants={fadeInUp} className={`font-body text-base leading-7 text-stone-700 sm:text-lg sm:leading-8 ${className}`}>
      {children}
    </motion.p>
  );
}
