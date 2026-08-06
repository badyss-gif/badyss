"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

// Deliberately NOT a 50/50 side-by-side layout — Grandes Tailles gets a
// distinct, full-viewport, full-bleed treatment (text over image, like a
// scaled-down hero) so it carries stronger visual hierarchy than the
// standard editorial campaign, matching its real strategic importance as a
// verified core category.
//
// Built without `CreativeVisual` (unlike the rest of the site) specifically
// so the scroll-linked scale transform can be applied to the image layer
// only — an earlier version scaled the whole image+text box together via
// CreativeVisual's `children` slot, which at the scale extremes pushed the
// bottom-left text partway off-screen (caught via real incremental-scroll
// screenshots, the same class of bug this project has hit before). Text
// here is a sibling layer, never scaled, matching HeroSection's pattern.
// Copy states only the verified fact that grandes-tailles spans multiple
// real subcategories — no invented fit philosophy or sourcing claims
// (docs/BADYSS-SITE-BLUEPRINT.md §6).
export function LargeSizeCollection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const t = useTranslations("home.largeSizeCollection");
  const subCategories = [t("subCategoryTshirts"), t("subCategoryPantalons"), t("subCategoryEnsembles")];

  return (
    <Section spacing="tight" withContainer={false}>
      <div ref={sectionRef} className="relative min-h-[90vh] overflow-hidden bg-foreground md:min-h-screen">
        <motion.div
          className="absolute inset-0"
          style={shouldReduceMotion ? undefined : { scale: imageScale }}
        >
          <Image
            src="/images/campaigns/grandes-tailles.png"
            alt={t("imageAlt")}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-12">
          <div className="max-w-lg">
            <Reveal>
              <p className="text-xs uppercase tracking-widest text-white/70">{t("eyebrow")}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-3 font-display text-display-lg font-extrabold tracking-tight text-white md:text-display-2xl">
                {t("headingLine1")}
                <br />
                {t("headingLine2")}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <div className="mt-5 flex flex-wrap gap-2">
                {subCategories.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/30 px-3 py-1 text-xs uppercase tracking-wide text-white/85"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <p className="mt-5 max-w-md text-white/85">{t("body")}</p>
            </Reveal>
            <Reveal delay={0.32}>
              <LinkButton
                href={routes.categories.grandesTailles}
                className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                {t("cta")}
              </LinkButton>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  );
}
