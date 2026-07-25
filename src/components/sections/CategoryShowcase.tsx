"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { Reveal } from "@/components/motion/Reveal";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

interface Category {
  index: string;
  label: string;
  tagline: string;
  href: string;
  image: string;
  alt: string;
}

// Only the three categories verified in docs/BADYSS-SITE-BLUEPRINT.md §3 —
// same real routes/images as before, new interaction model around them.
const categoryDefs = [
  {
    index: "01",
    labelKey: "grandesTailles" as const,
    taglineKey: "grandesTaillesTagline" as const,
    href: routes.categories.grandesTailles,
    image: "/images/categories/grandes-tailles.png",
    altKey: "styleGrandeTaille" as const,
  },
  {
    index: "02",
    labelKey: "tShirts" as const,
    taglineKey: "tShirtsTagline" as const,
    href: routes.categories.tShirt,
    image: "/images/categories/t-shirts.png",
    altKey: "tshirtPremiumUrbain" as const,
  },
  {
    index: "03",
    labelKey: "ensembles" as const,
    taglineKey: "ensemblesTagline" as const,
    href: routes.categories.ensembles,
    image: "/images/categories/ensembles.png",
    altKey: "ensembleCoordonne" as const,
  },
];

function CategoryFrame({
  category,
  index,
  total,
  scrollYProgress,
  discoverLabel,
}: {
  category: Category;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
  discoverLabel: string;
}) {
  const segment = 1 / total;
  const start = index * segment;
  const end = (index + 1) * segment;
  const margin = segment * 0.22;
  const isFirst = index === 0;
  const isLast = index === total - 1;

  const p0 = isFirst ? 0 : start - margin;
  const p1 = isFirst ? 0 : start + margin;
  const p2 = isLast ? 1 : end - margin;
  const p3 = isLast ? 1 : end + margin;

  const opacity = useTransform(scrollYProgress, [p0, p1, p2, p3], [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]);
  const scale = useTransform(scrollYProgress, [p0, p1, p2, p3], [isFirst ? 1 : 1.06, 1, 1, isLast ? 1 : 0.96]);
  const labelY = useTransform(scrollYProgress, [p0, p1, p2, p3], [isFirst ? 0 : 28, 0, 0, isLast ? 0 : -28]);
  const pointerEvents = useTransform(scrollYProgress, (value) =>
    Math.min(total - 1, Math.floor(value * total)) === index ? "auto" : "none"
  );

  return (
    <motion.div className="absolute inset-0" style={{ opacity, scale, pointerEvents }}>
      <Link href={category.href} className="group relative block h-full w-full">
        <Image
          src={category.image}
          alt={category.alt}
          fill
          sizes="100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <motion.div
          style={{ y: labelY }}
          className="absolute inset-x-8 bottom-16 flex items-end justify-between lg:inset-x-12"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-white/60">{category.index}</span>
            <h3 className="mt-2 font-display text-display-md font-extrabold tracking-tight text-white lg:text-display-lg">
              {category.label}
            </h3>
            <p className="mt-2 text-sm text-white/75">{category.tagline}</p>
          </div>
          <span className="hidden shrink-0 items-center gap-2 text-sm font-medium text-white lg:flex">
            {discoverLabel}
            <span className="h-px w-8 bg-white/80 transition-all duration-300 group-hover:w-14" />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}

function ProgressRail({ categories, scrollYProgress }: { categories: Category[]; scrollYProgress: MotionValue<number> }) {
  const dotTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div className="absolute bottom-16 right-8 z-20 hidden flex-col items-end gap-3 lg:right-12 xl:flex">
      {categories.map((category) => (
        <span key={category.href} className="text-[10px] uppercase tracking-[0.25em] text-white/50">
          {category.index}
        </span>
      ))}
      <div className="relative mt-1 h-20 w-px bg-white/25">
        <motion.div
          style={{ top: dotTop }}
          className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </div>
    </div>
  );
}

function PinnedCategoryJourney({ categories, eyebrow, discoverLabel }: { categories: Category[]; eyebrow: string; discoverLabel: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  return (
    <div ref={wrapperRef} className="relative" style={{ height: `${categories.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-foreground">
        <div className="absolute inset-x-0 top-0 z-20 px-8 pt-24 lg:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-white/60">{eyebrow}</p>
        </div>
        {categories.map((category, index) => (
          <CategoryFrame
            key={category.href}
            category={category}
            index={index}
            total={categories.length}
            scrollYProgress={scrollYProgress}
            discoverLabel={discoverLabel}
          />
        ))}
        <ProgressRail categories={categories} scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

// Fallback used on mobile (where a pinned scroll-crossfade doesn't translate
// to a single narrow column) and under prefers-reduced-motion (where the
// scroll-linked opacity/scale/pointer-events choreography above is skipped
// outright, not just slowed). A tall, full-bleed, one-at-a-time stack —
// still a real editorial composition, not three equal cards in a grid.
function StackedCategoryJourney({ categories }: { categories: Category[] }) {
  return (
    <div>
      {categories.map((category) => (
        <Reveal key={category.href}>
          <Link href={category.href} className="group relative block h-[85vh] w-full overflow-hidden">
            <Image
              src={category.image}
              alt={category.alt}
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-6 bottom-10">
              <span className="text-xs uppercase tracking-[0.3em] text-white/60">{category.index}</span>
              <h3 className="mt-2 font-display text-display-md font-extrabold tracking-tight text-white">
                {category.label}
              </h3>
              <p className="mt-2 text-sm text-white/75">{category.tagline}</p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function CategoryShowcase() {
  const shouldReduceMotion = useSafeReducedMotion();
  const tNav = useTranslations("nav");
  const tHome = useTranslations("home.categoryShowcase");
  const tAlt = useTranslations("imageAlt");

  const categories: Category[] = categoryDefs.map((def) => ({
    index: def.index,
    label: tNav(def.labelKey),
    tagline: tHome(def.taglineKey),
    href: def.href,
    image: def.image,
    alt: tAlt(def.altKey),
  }));
  const discoverLabel = tHome("discover");

  if (shouldReduceMotion) {
    return (
      <section className="relative bg-background">
        <StackedCategoryJourney categories={categories} />
      </section>
    );
  }

  return (
    <section className="relative bg-background">
      <div className="md:hidden">
        <StackedCategoryJourney categories={categories} />
      </div>
      <div className="hidden md:block">
        <PinnedCategoryJourney categories={categories} eyebrow={tHome("eyebrow")} discoverLabel={discoverLabel} />
      </div>
    </section>
  );
}
