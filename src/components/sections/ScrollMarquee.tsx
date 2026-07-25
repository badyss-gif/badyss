"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";

// The section immediately after the Hero — and the one that now carries the
// curtain-reveal (negative top margin + rounded top corners sliding up over
// the still-pinned Hero, see HeroSection's comment for the mechanic). Two
// oversized rows of type drift horizontally in opposite directions as the
// user scrolls *through* the section (not a time-based loop like the
// top-bar ticker) — a scroll-driven transition, not a generic announcement
// strip. Inert (no transform) under prefers-reduced-motion.
export function ScrollMarquee() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });

  const rowOneX = useTransform(scrollYProgress, [0, 1], ["6%", "-10%"]);
  const rowTwoX = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const t = useTranslations("home.scrollMarquee");

  return (
    <section
      ref={sectionRef}
      className="relative z-10 -mt-[30vh] overflow-hidden rounded-t-[2rem] bg-background py-20 shadow-[0_-40px_80px_-40px_rgba(0,0,0,0.35)] sm:rounded-t-[3rem] sm:py-28"
    >
      <div className="flex flex-col gap-2 sm:gap-4">
        <motion.p
          style={shouldReduceMotion ? undefined : { x: rowOneX }}
          className="whitespace-nowrap font-display text-display-lg font-extrabold uppercase leading-none tracking-tight text-foreground sm:text-display-xl lg:text-display-2xl"
        >
          {t("line1")}
        </motion.p>
        <motion.p
          style={shouldReduceMotion ? undefined : { x: rowTwoX }}
          className="whitespace-nowrap font-display text-display-lg font-extrabold uppercase leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_var(--color-foreground)] sm:text-display-xl lg:text-display-2xl"
        >
          <span className="text-accent [-webkit-text-stroke:0]">BADYSS</span> {t("line2Suffix")}
        </motion.p>
      </div>
    </section>
  );
}
