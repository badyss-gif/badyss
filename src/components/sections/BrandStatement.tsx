"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";

function MaskedLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const shouldReduceMotion = useSafeReducedMotion();

  if (shouldReduceMotion) {
    return <div>{children}</div>;
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: "110%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// The brand-manifesto pause: pure typography, no image, no product, no CTA
// grid — a deliberate breathing moment between ScrollMarquee and the
// commerce-facing sections below.
//
// One line (the middle one) drifts a few pixels horizontally as the user
// scrolls through the section — the "words move at slightly different
// speeds" effect — while each line's entrance uses a mask reveal (an
// overflow-hidden wrapper + translateY), not a fade, for a sharper, more
// editorial reveal. Fully inert under prefers-reduced-motion.
export function BrandStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const drift = useTransform(scrollYProgress, [0, 1], [-32, 32]);
  const t = useTranslations("home.brandStatement");

  return (
    <section ref={sectionRef} className="relative bg-background pb-24 pt-16 sm:pb-32 sm:pt-20">

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 select-none font-display text-[14rem] font-extrabold leading-none text-muted opacity-60 sm:text-[20rem]"
        >
          01
        </span>

        <p className="mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>

        <h2 className="font-display font-extrabold leading-[0.95] tracking-tight text-display-lg sm:text-display-xl lg:text-display-2xl">
          <MaskedLine>{t("line1")}</MaskedLine>
          <MaskedLine delay={0.08}>
            <motion.span
              className="inline-block"
              style={shouldReduceMotion ? undefined : { x: drift }}
            >
              {t("line2")}
            </motion.span>
          </MaskedLine>
          <MaskedLine delay={0.16}>{t("line3")}</MaskedLine>
        </h2>

        <MaskedLine delay={0.3}>
          <p className="mx-auto mt-8 max-w-lg text-muted-foreground">{t("body")}</p>
        </MaskedLine>
      </div>
    </section>
  );
}
