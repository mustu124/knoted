"use client";

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useTransform
} from "framer-motion";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { fadeInScale, fadeInUp, staggerContainer } from "@/lib/animations";
import { getDisplayMediaUrl } from "@/lib/media";

type Product = {
  _id: string;
  name: string;
  category: string;
  price: number;
  images: Array<{
    url: string;
    alt: string;
  }>;
};

type PublicSettings = {
  heroSlides?: Array<{
    image: string;
    title?: string;
    headline?: string;
    name?: string;
    _id?: string;
    id?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
  mobileHeroSlides?: Array<{
    image: string;
    title?: string;
    headline?: string;
    name?: string;
    _id?: string;
    id?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
  }>;
  announcementText?: string;
  videoUrl?: string;
  whatsappNumber?: string;
  footerCopyright?: string;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
  };
  categories?: Array<{
    name: string;
    icon?: string;
    visible?: boolean;
  }>;
};

type HeroSlide = {
  image: string;
  headline: string;
  subtitle?: string;
  cta: string;
  href: string;
};

const heroSlides: HeroSlide[] = [
  {
    image: "/logo.png",
    headline: "Handmade with lots of love",
    subtitle: "Scrunchies, bows, and hair accessories made one small batch at a time.",
    cta: "Shop Now",
    href: "/shop"
  }
];

const blockedHeroImageIds = ["wd0gqn7ea0extspvcimh"];
const fallbackHeroHeadline = "Handmade with lots of love";

const categories = [
  ["Embroidered Hair Clip", "📎"],
  ["Embroidered Head Band", "🎀"],
  ["Plain Georgette Scrunchy", "⭕"],
  ["Cotton Scrunchy", "🧵"],
  ["Pigtail Bow", "🎀"],
  ["Net Bow", "🕸️"],
  ["Mini Bow", "✨"],
  ["Embroidered Bow", "🌸"],
  ["Embroidered Scrunchy", "🌷"],
  ["Satin Scrunchy", "🎗️"]
] as const;

const testimonials = [
  {
    quote:
      "The scrunchies are so soft and the colours are even prettier in person. You can tell every piece is made with care.",
    name: "Aarohi Mehta",
    city: "Pune"
  },
  {
    quote:
      "Ordered the pigtail bows for my daughter and they've held up so well. Packaging felt like a little gift itself.",
    name: "Nisha Rao",
    city: "Bengaluru"
  },
  {
    quote:
      "The embroidered bow is stunning — such fine detail for the price. Already planning my next order.",
    name: "Mira Kapoor",
    city: "Jaipur"
  }
];

const sectionReveal = { hidden: staggerContainer.hidden, show: staggerContainer.visible };
const itemReveal = { hidden: fadeInUp.hidden, show: fadeInUp.visible };
const scaleReveal = { hidden: fadeInScale.hidden, show: fadeInScale.visible };

function optimizedMediaUrl(src: string, width = 1200) {
  if (src.includes("images.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", "80");
    url.searchParams.set("auto", "format");
    return url.toString();
  }

  return getDisplayMediaUrl(src);
}

function getYouTubeEmbedUrl(src?: string) {
  const fallback = "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0";
  if (!src?.trim()) return fallback;

  try {
    const url = new URL(src.trim());
    const host = url.hostname.replace(/^www\./, "");
    let videoId = "";

    if (host === "youtu.be") {
      videoId = url.pathname.split("/").filter(Boolean)[0] ?? "";
    } else if (host.endsWith("youtube.com")) {
      if (url.pathname.startsWith("/embed/")) return src.trim();
      if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/").filter(Boolean)[1] ?? "";
      } else {
        videoId = url.searchParams.get("v") ?? "";
      }
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0` : src.trim();
  } catch {
    return src.trim();
  }
}

function looksLikeDatabaseId(value?: string) {
  if (!value) return true;
  const normalized = value.trim();
  const compact = normalized.replace(/[\s-]/g, "");

  return (
    /^[a-f\d]{24}$/i.test(compact) ||
    /^[a-f\d]{32}$/i.test(compact) ||
    /^[a-f\d]{8}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{4}-[a-f\d]{12}$/i.test(normalized)
  );
}

function getHeroSlideHeadline(slide: NonNullable<PublicSettings["heroSlides"]>[number]) {
  const candidates = [slide.title, slide.headline, slide.name].filter(Boolean) as string[];
  return candidates.find((candidate) => !looksLikeDatabaseId(candidate)) ?? fallbackHeroHeadline;
}

function isConfiguredHeroSlide(slide: NonNullable<PublicSettings["heroSlides"]>[number]) {
  const image = (slide.image ?? "").trim();
  const title = getHeroSlideHeadline(slide).trim();

  return Boolean(
    image &&
      image !== "/logo.png" &&
      !image.includes("images.unsplash.com/photo-1618220179428-22790b461013") &&
      title &&
      !/^Homepage slide \d+$/i.test(title)
  );
}

export default function HomePage() {
  const [settings, setSettings] = useState<PublicSettings | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/settings", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: { settings?: PublicSettings } }) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("Knoted Co. settings response", payload);
        }
        if (isMounted) setSettings(payload.data?.settings ?? null);
      })
      .catch(() => {
        if (isMounted) setSettings(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobileViewport(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const liveHeroSlides = useMemo<HeroSlide[]>(() => {
    const configuredMobileSlides = settings?.mobileHeroSlides?.filter(isConfiguredHeroSlide);
    const sourceSlides = isMobileViewport && configuredMobileSlides?.length
      ? configuredMobileSlides
      : settings?.heroSlides;
    const slides = sourceSlides
      ?.filter(
        (slide) =>
          slide.image &&
          !blockedHeroImageIds.some((blockedId) => slide.image.includes(blockedId))
      )
      .map((slide) => ({
        image: slide.image,
        headline: getHeroSlideHeadline(slide),
        subtitle: slide.subtitle,
        cta: slide.ctaText || "Shop Now",
        href: slide.ctaLink || "/shop"
      }));

    return slides?.length ? slides : heroSlides;
  }, [isMobileViewport, settings]);

  const liveCategories = useMemo(() => {
    const nextCategories = settings?.categories
      ?.filter((category) => category.visible !== false)
      .map((category) => [category.name, category.icon || "Craft"] as const);

    return nextCategories?.length ? nextCategories : categories;
  }, [settings]);

  return (
    <main className="overflow-hidden bg-brand-cream text-stone-900">
      <HeroSlider slides={liveHeroSlides} />
      <AnnouncementTicker text={settings?.announcementText} />
      <CategoriesSection categories={liveCategories} />
      <FeaturedProducts />
      <VideoSection videoUrl={settings?.videoUrl} />
      <TestimonialsSlider />
      <InstagramStrip instagramUrl={settings?.socialLinks?.instagram} />
      <Footer settings={settings} />
    </main>
  );
}

function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  const goToSlide = (index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  };

  return (
    <motion.section className="relative min-h-[100svh] overflow-hidden bg-brand-cream">
      <motion.div
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-5 pb-16 pt-24 text-center sm:px-8 md:px-12"
        variants={sectionReveal}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={itemReveal} className="relative h-40 w-40 sm:h-52 sm:w-52">
          <Image src="/logo.png" alt="Knoted Co." fill sizes="208px" priority className="object-contain" />
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={slides[activeIndex].headline}
            className="mt-4 max-w-2xl"
            variants={sectionReveal}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -18, transition: { duration: 0.35 } }}
          >
            <motion.h1
              variants={itemReveal}
              className="font-heading text-[30px] font-bold leading-[1.18] text-brand-ink sm:text-[44px] sm:leading-[1.15] xl:text-[56px]"
            >
              {slides[activeIndex].headline}
            </motion.h1>
            {slides[activeIndex].subtitle && (
              <motion.p
                variants={itemReveal}
                className="mx-auto mt-4 max-w-md text-base font-bold leading-8 text-brand-ink/75 sm:mt-5 sm:text-lg sm:font-normal sm:leading-9"
              >
                {slides[activeIndex].subtitle}
              </motion.p>
            )}
            <motion.a
              variants={itemReveal}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              href={slides[activeIndex].href}
              className="mt-7 inline-flex rounded-full bg-brand-red px-7 py-2.5 text-[13px] font-black uppercase tracking-[0.1em] text-white shadow-[0_18px_45px_rgba(0,0,0,0.18)] sm:mt-8"
            >
              {slides[activeIndex].cta}
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {slides.length > 1 && (
        <>
          <motion.button
            type="button"
            aria-label="Previous slide"
            onClick={() => goToSlide(activeIndex - 1)}
            className="absolute left-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-3xl leading-none text-brand-ink md:flex"
            whileHover={{ scale: 1.08 }}
          >
            ‹
          </motion.button>
          <motion.button
            type="button"
            aria-label="Next slide"
            onClick={() => goToSlide(activeIndex + 1)}
            className="absolute right-5 top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-brand-ink/15 bg-white text-3xl leading-none text-brand-ink md:flex"
            whileHover={{ scale: 1.08 }}
          >
            ›
          </motion.button>

          <motion.div
            className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-8 sm:gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.headline}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goToSlide(index)}
                className="relative h-2 w-8 overflow-hidden rounded-full bg-brand-ink/12 sm:w-10"
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-brand-gold"
                  initial={false}
                  animate={{ width: index === activeIndex ? "100%" : "0%" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                />
              </button>
            ))}
          </motion.div>
        </>
      )}
    </motion.section>
  );
}

function AnnouncementTicker({ text }: { text?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  const tickerX = useMotionValue(0);
  const x = useTransform(tickerX, (value) => `${value}%`);
  const tickerText =
    text || "Handmade with love · Small batches · New drops every week";

  useAnimationFrame((_, delta) => {
    if (isHovered) return;

    const next = tickerX.get() - delta * 0.004;
    tickerX.set(next <= -50 ? 0 : next);
  });

  return (
    <motion.section
      className="overflow-hidden bg-brand-ink py-3 text-brand-cream"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.4 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="flex w-max gap-10 whitespace-nowrap text-sm font-black uppercase tracking-[0.16em]"
        style={{ x }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index}>{tickerText}</span>
        ))}
      </motion.div>
    </motion.section>
  );
}

function CategoriesSection({ categories }: { categories: readonly (readonly [string, string])[] }) {
  const [categoryImages, setCategoryImages] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;

    fetch("/api/products?limit=50&sort=newest", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: { products?: Product[] } }) => {
        const products = payload.data?.products ?? [];
        const nextImages = products.reduce<Record<string, string>>((images, product) => {
          const imageUrl = product.images?.[0]?.url;
          if (product.category && imageUrl && !images[product.category]) {
            images[product.category] = imageUrl;
          }
          return images;
        }, {});

        if (isMounted) setCategoryImages(nextImages);
      })
      .catch(() => {
        if (isMounted) setCategoryImages({});
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      className="px-4 py-14 sm:px-6 sm:py-[4.5rem] md:px-10 md:py-20"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={itemReveal} className="mx-auto max-w-7xl text-center">
        <h2 className="font-heading text-[clamp(2rem,10vw,3rem)] font-bold leading-tight text-brand-ink md:text-5xl">Shop by Category</h2>
        <motion.svg
          width="260"
          height="24"
          viewBox="0 0 260 24"
          fill="none"
          className="mx-auto mt-3 w-48 sm:w-[260px]"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.path
            d="M4 15C45 4 82 22 126 12C168 3 203 18 256 8"
            stroke="#3F5233"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>

      <motion.div
        className="mx-auto mt-10 grid max-w-[23rem] grid-cols-3 justify-items-center gap-x-4 gap-y-8 sm:mt-12 sm:max-w-7xl sm:grid-cols-5 sm:gap-x-7 sm:gap-y-9 lg:gap-x-9 xl:max-w-[96rem] xl:grid-cols-10 xl:gap-x-11 xl:gap-y-10"
        variants={sectionReveal}
      >
        {categories.map(([name, icon], index) => (
          <CategoryCircle key={name} name={name} icon={icon} imageUrl={categoryImages[name]} index={index} />
        ))}
      </motion.div>
    </motion.section>
  );
}

function CategoryCircle({
  name,
  icon,
  imageUrl,
  index
}: {
  name: string;
  icon: string;
  imageUrl?: string;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImageUrl = imageUrl ? getDisplayMediaUrl(imageUrl) : "";

  return (
    <motion.a
      href={`/shop?category=${encodeURIComponent(name)}`}
      variants={{
        hidden: { opacity: 0, scale: 0.8 },
        show: {
          opacity: 1,
          scale: 1,
          transition: { delay: index * 0.1, duration: 0.55, ease: "easeOut" }
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.06
      }}
      whileTap={{ scale: 0.97 }}
      className="group flex w-[clamp(96px,28vw,112px)] flex-col items-center gap-3 text-center sm:w-[128px] xl:w-[138px]"
    >
      <span className="relative flex h-[clamp(92px,27vw,104px)] w-[clamp(92px,27vw,104px)] items-center justify-center rounded-full bg-white shadow-soft transition-shadow duration-200 group-hover:shadow-[0_18px_45px_rgba(196,113,74,0.34)] sm:h-[112px] sm:w-[112px] xl:h-[124px] xl:w-[124px]">
        <motion.span
          className="absolute inset-[-3px] rounded-full border-2 border-dashed border-brand-red sm:inset-[-6px]"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{
            duration: 1.2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear"
          }}
        />
        <span className="absolute inset-0 overflow-hidden rounded-full bg-brand-sand">
          {displayImageUrl ? (
            <motion.img
              src={displayImageUrl}
              alt={`${name} category`}
              loading="lazy"
              animate={{ scale: isHovered ? 1.09 : 1 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-white text-3xl">{icon}</span>
          )}
          <span className="absolute inset-0 bg-gradient-to-t from-brand-ink/12 via-transparent to-white/8" />
        </span>
      </span>
      <span className="min-h-[2.4rem] max-w-full text-[10px] font-black uppercase leading-[1.12] tracking-[0.04em] text-brand-ink sm:text-[11px] xl:text-xs">
        {name}
      </span>
    </motion.a>
  );
}

function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem, items } = useCart();

  useEffect(() => {
    let isMounted = true;

    async function loadBestsellers() {
      setIsLoading(true);
      const featuredResponse = await fetch("/api/products?featured=true", { cache: "no-store" });
      const featuredData = (await featuredResponse.json()) as { data?: { products: Product[] }; products?: Product[] };
      let nextProducts = featuredData.data?.products ?? featuredData.products ?? [];

      if (!nextProducts.length) {
        const fallbackResponse = await fetch("/api/products?limit=8&sort=newest", { cache: "no-store" });
        const fallbackData = (await fallbackResponse.json()) as { data?: { products: Product[] }; products?: Product[] };
        nextProducts = fallbackData.data?.products ?? fallbackData.products ?? [];
      }

      if (isMounted) {
        setProducts(nextProducts);
        setIsLoading(false);
      }
    }

    loadBestsellers()
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setIsLoading(false);
        }
      })

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      className="bg-white px-4 py-16 md:px-10 md:py-20"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.16 }}
    >
      <motion.div variants={itemReveal} className="mx-auto max-w-7xl text-center">
        <LeafOrnament />
        <h2 className="mt-4 font-heading text-[clamp(2.2rem,12vw,3.2rem)] font-bold leading-none text-brand-ink md:text-5xl">Our Bestsellers</h2>
      </motion.div>

      <motion.div
        className="mx-auto mt-10 grid max-w-7xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4 md:gap-6 xl:grid-cols-4"
        variants={sectionReveal}
      >
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="overflow-hidden rounded-2xl bg-brand-cream shadow-soft">
              <div className="aspect-[4/5] animate-pulse bg-brand-sand" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-3/4 animate-pulse rounded-full bg-brand-sand" />
                <div className="h-7 w-1/2 animate-pulse rounded-full bg-brand-sand" />
                <div className="h-10 animate-pulse rounded-full bg-brand-sand" />
              </div>
            </div>
          ))}

        {!isLoading && products.slice(0, 8).map((product) => {
          const cartQuantity = items
            .filter((item) => item.product._id === product._id)
            .reduce((total, item) => total + item.quantity, 0);

          return (
            <motion.article
              key={product._id}
              variants={itemReveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.12 }}
              whileHover={{ y: -6 }}
              className="flex h-full flex-col overflow-hidden rounded-2xl bg-brand-cream shadow-soft"
            >
            <div className="aspect-[4/5] overflow-hidden bg-brand-sand">
              <motion.div className="relative h-full w-full" whileHover={{ scale: 1.07 }} transition={{ duration: 0.5, ease: "easeOut" }}>
                <Image
                  src={getDisplayMediaUrl(product.images?.[0]?.url)}
                  alt={product.images?.[0]?.alt ?? product.name}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  className="object-cover"
                />
              </motion.div>
            </div>
            <div className="flex flex-1 flex-col space-y-2.5 p-3 sm:space-y-3 sm:p-4 md:p-5">
              <h3 className="min-h-[2.6rem] font-heading text-[1rem] font-bold leading-tight text-brand-ink sm:text-lg md:text-xl">
                {product.name}
              </h3>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <span className="inline-flex min-h-8 max-w-full items-center rounded-full bg-brand-sand px-2.5 py-1 text-[8px] font-black uppercase leading-tight tracking-[0.08em] text-brand-olive sm:min-h-0 sm:px-3 sm:text-[11px] sm:tracking-[0.12em]">
                  {product.category}
                </span>
                <span className="font-black text-brand-ink sm:text-base">{"\u20B9"}{product.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-1">
                <motion.button
                  type="button"
                  onClick={() =>
                    addItem({
                      productId: product._id,
                      name: product.name,
                      price: product.price,
                      imageUrl: getDisplayMediaUrl(product.images?.[0]?.url)
                    })
                  }
                  whileHover={{ scale: 1.03, backgroundColor: "#3F5233" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 rounded-full bg-brand-ink px-3 py-2.5 text-[10px] font-black uppercase leading-tight tracking-[0.1em] text-white sm:px-4 sm:text-xs sm:tracking-[0.12em]"
                >
                  <span className="sm:hidden">Add</span>
                  <span className="hidden sm:inline">Add to Cart</span>
                </motion.button>
                <motion.button
                  type="button"
                  aria-label={`Add ${product.name} to wishlist`}
                  whileHover={{ scale: 1.12, color: "#3F5233" }}
                  whileTap={{ scale: 0.9 }}
                  className="h-10 w-10 shrink-0 rounded-full border border-brand-ink/15 bg-white text-lg text-brand-ink"
                >
                  ♥
                </motion.button>
              </div>
              {cartQuantity > 0 && (
                <p className="text-center text-[10px] font-black uppercase tracking-[0.12em] text-brand-olive">
                  In cart: {cartQuantity}
                </p>
              )}
            </div>
          </motion.article>
          );
        })}
      </motion.div>

      {!isLoading && !products.length && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl bg-brand-cream p-8 text-center shadow-soft">
          <h3 className="font-heading text-2xl font-bold text-brand-ink">Products are being prepared</h3>
          <p className="mt-2 text-sm font-bold text-stone-600">Please check the shop while bestsellers are selected.</p>
        </div>
      )}

      <motion.div variants={itemReveal} className="mt-12 text-center">
        <motion.a
          href="/shop"
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex rounded-full border border-brand-ink bg-brand-ink px-7 py-3 text-sm font-black uppercase tracking-[0.14em] text-white"
        >
          View All Products
        </motion.a>
      </motion.div>
    </motion.section>
  );
}

function VideoSection({ videoUrl }: { videoUrl?: string }) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const points = [
    "Pick a shade that matches your outfit",
    "Mix textures — georgette, cotton, satin",
    "Size up for everyday wear, down for delicate styles",
    "Layer bows and scrunchies for a fuller look"
  ];
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden px-6 py-20 md:px-10"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
    >
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,151,58,0.18),transparent_28%),linear-gradient(120deg,#F8F3E9,#EDE4D3)]"
      />
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(45deg,#2B2620_1px,transparent_1px),linear-gradient(-45deg,#3F5233_1px,transparent_1px)] [background-size:26px_26px]" />

      <motion.div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr]" variants={sectionReveal}>
        <motion.div variants={itemReveal} className="relative aspect-video overflow-hidden rounded-2xl bg-brand-ink shadow-soft">
          <iframe
            className="h-full w-full"
            src={embedUrl}
            title="Behind the scenes at Knoted Co."
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <motion.div
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/16"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: isInView ? 1 : 0, scale: isInView ? 1 : 1.04 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-red text-3xl text-white shadow-[0_18px_45px_rgba(63, 82, 51,0.35)]"
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              ▶
            </motion.span>
          </motion.div>
        </motion.div>

        <motion.div variants={sectionReveal} className="flex flex-col justify-center">
          <motion.p variants={itemReveal} className="text-sm font-black uppercase tracking-[0.2em] text-brand-olive">
            Styling Guide
          </motion.p>
          <motion.h2 variants={itemReveal} className="mt-3 font-heading text-4xl font-bold text-brand-ink md:text-5xl">
            How to Style Your Knoted Co. Pieces
          </motion.h2>
          <motion.div variants={sectionReveal} className="mt-8 grid gap-4">
            {points.map((point) => (
              <motion.div
                key={point}
                variants={itemReveal}
                whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.72)" }}
                className="flex items-center gap-4 rounded-2xl bg-white/46 p-4 shadow-sm backdrop-blur"
              >
                <motion.span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-olive text-white"
              whileHover={{ rotate: 12, scale: 1.08 }}
            >
                  ☘
                </motion.span>
                <span className="font-bold text-brand-ink">{point}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

function TestimonialsSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, []);

  const testimonial = testimonials[active];

  return (
    <motion.section
      className="bg-brand-ink px-6 py-20 text-brand-cream md:px-10"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div variants={sectionReveal} className="mx-auto max-w-4xl text-center">
        <motion.h2 variants={itemReveal} className="font-heading text-4xl font-bold text-white md:text-5xl">
          Kind Words from Creative Homes
        </motion.h2>
        <div className="relative mt-10 min-h-[240px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="rounded-2xl border border-white/12 bg-white/8 p-8 backdrop-blur"
            >
              <motion.div
                className="flex justify-center gap-1 text-brand-gold"
                initial="hidden"
                animate="show"
                variants={sectionReveal}
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <motion.span key={index} variants={itemReveal}>
                    ★
                  </motion.span>
                ))}
              </motion.div>
              <p className="mt-5 font-heading text-2xl leading-9 text-white">“{testimonial.quote}”</p>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.16em] text-brand-sand">
                {testimonial.name}, {testimonial.city}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.section>
  );
}

function InstagramStrip({ instagramUrl }: { instagramUrl?: string }) {
  const [productImages, setProductImages] = useState<Array<{ url: string; alt: string }>>([]);
  const feedLink = instagramUrl || "#";

  useEffect(() => {
    let isMounted = true;

    fetch("/api/products?limit=6&sort=newest", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload: { data?: { products?: Product[] } }) => {
        const products = payload.data?.products ?? [];
        const nextImages = products
          .map((product) => ({
            url: product.images?.[0]?.url,
            alt: product.name
          }))
          .filter((image): image is { url: string; alt: string } => Boolean(image.url))
          .slice(0, 6);

        if (isMounted) setProductImages(nextImages);
      })
      .catch(() => {
        if (isMounted) setProductImages([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const feedImages = productImages.slice(0, 6);

  return (
    <motion.section
      className="bg-white py-16"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.div variants={itemReveal} className="mb-8 text-center">
        <h2 className="font-heading text-4xl font-bold text-brand-ink">Follow us @knotedco._</h2>
      </motion.div>
      <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6" variants={sectionReveal}>
        {(feedImages.length ? feedImages : Array.from({ length: 6 }, (_, index) => ({ url: "", alt: `Knoted Co. product ${index + 1}` }))).map((image, index) => (
          <motion.a
            key={`${image.url || "placeholder"}-${index}`}
            href={feedLink}
            onClick={(event) => {
              if (feedLink === "#") event.preventDefault();
            }}
            aria-label={instagramUrl ? "Open Knoted Co. Instagram" : "Instagram link coming soon"}
            variants={itemReveal}
            whileHover={{ scale: 0.97 }}
            className="group relative aspect-square overflow-hidden bg-brand-sand"
          >
            {image.url ? (
              <motion.div className="relative h-full w-full" whileHover={{ scale: 1.08 }} transition={{ duration: 0.45 }}>
                <Image
                  src={optimizedMediaUrl(image.url, 720)}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                  loading="lazy"
                  quality={78}
                  className="object-cover"
                />
              </motion.div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-brand-cream">
                <Image src="/logo.png" alt={image.alt} width={96} height={96} className="opacity-70" />
              </div>
            )}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-brand-ink/70 text-center text-sm font-black uppercase tracking-[0.12em] text-white opacity-0"
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <span className="text-3xl">◎</span>
            </motion.div>
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
}

function Footer({ settings }: { settings: PublicSettings | null }) {
  const links = ["Home", "Shop", "About", "Contact"];
  const whatsappNumber = settings?.whatsappNumber || "910000000000";
  const contactDetails = {
    address: "India",
    email: "hello@knotedco.com",
    phone: `+${whatsappNumber}`
  };

  return (
    <motion.footer
      className="bg-brand-cream px-6 py-12 md:px-10"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      <motion.div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4" variants={sectionReveal}>
        <motion.div variants={itemReveal}>
          <motion.div className="relative h-16 w-16 overflow-hidden rounded-xl" whileHover={{ rotate: -4, scale: 1.04 }}>
            <Image src="/logo.png" alt="Knoted Co. logo" fill sizes="64px" quality={95} className="object-contain" />
          </motion.div>
          <h2 className="mt-4 font-heading text-3xl font-bold text-brand-ink">Knoted Co.</h2>
          <p className="mt-2 font-bold text-brand-olive">Cultivating Creative Spaces</p>
        </motion.div>

        <motion.nav variants={sectionReveal} className="grid gap-3">
          {links.map((link) => (
            <motion.a
              key={link}
              variants={itemReveal}
              whileHover={{ x: 6, color: "#3F5233" }}
              href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
              className="font-bold text-brand-ink"
            >
              {link}
            </motion.a>
          ))}
        </motion.nav>

        <motion.div variants={sectionReveal} className="md:col-span-2">
          <motion.div variants={itemReveal} className="flex gap-3">
            {[
              ["Instagram", settings?.socialLinks?.instagram || "https://www.instagram.com/", "◎"],
              ["Facebook", settings?.socialLinks?.facebook || "https://www.facebook.com/", "f"],
              ["WhatsApp", `https://wa.me/${whatsappNumber}`, "☎"]
            ].map(([label, href, icon]) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ y: -4, scale: 1.06, backgroundColor: "#3F5233", color: "#ffffff" }}
                whileTap={{ scale: 0.95 }}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg font-black text-brand-ink shadow-sm"
              >
                {icon}
              </motion.a>
            ))}
          </motion.div>
          <motion.p variants={itemReveal} className="mt-6 font-bold text-brand-ink">
            Made with love in India
          </motion.p>
          <motion.div variants={itemReveal} className="mt-4 grid gap-1 text-sm font-bold leading-6 text-stone-600">
            <a href={`mailto:${contactDetails.email}`} className="hover:text-brand-red">
              {contactDetails.email}
            </a>
            <a href="tel:+91704474478" className="hover:text-brand-red">
              {contactDetails.phone}
            </a>
            <p>{contactDetails.address}</p>
            <p>Returns: 15 days of return acceptable</p>
            <p>Shipping: All over India shipping is available</p>
          </motion.div>
          <motion.p variants={itemReveal} className="mt-2 text-sm text-stone-600">
            {settings?.footerCopyright || "\u00A9 2025 Knoted Co."}
          </motion.p>
        </motion.div>
      </motion.div>
    </motion.footer>
  );
}

function LeafOrnament() {
  return (
    <motion.svg
      width="86"
      height="32"
      viewBox="0 0 86 32"
      fill="none"
      className="mx-auto"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      variants={sectionReveal}
    >
      <motion.path variants={itemReveal} d="M8 22C25 8 53 8 78 22" stroke="#7C8A5C" strokeWidth="3" strokeLinecap="round" />
      <motion.path variants={itemReveal} d="M28 15C25 7 17 6 13 12C18 18 25 18 28 15Z" fill="#7C8A5C" />
      <motion.path variants={itemReveal} d="M45 12C43 4 35 3 31 9C35 16 43 16 45 12Z" fill="#3F5233" />
      <motion.path variants={itemReveal} d="M61 15C64 7 72 6 76 12C71 18 64 18 61 15Z" fill="#C9973A" />
    </motion.svg>
  );
}
