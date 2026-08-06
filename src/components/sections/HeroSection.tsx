"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { FIXED_STACK_HEIGHT } from "@/config/layout";
import { routes } from "@/config/routes";

const HERO_ALT = "Homme en tenue urbaine contemporaine BADYSS, marchant dans une rue moderne au Maroc.";

// Cinematic multi-stop gradient (inline style, not a Tailwind 3-stop
// from/via/to utility — this needs finer control than 3 stops allow):
// near-clear at the very top so the architecture/sky stays bright, a soft
// mid-image darken so the model reads warm and visible, a gradual pull
// starting well above where the text block begins (text spans roughly the
// bottom 35-40% of the section) so it reads as a graduated fade rather than
// a hard curtain, strongest at the very bottom behind the CTA row. Six
// stops (not three) specifically to avoid the harder edge a coarser
// gradient produced at wide/short viewports (checked at 1920×1080) where
// the photo's own darker foreground shadow compounded with the overlay.
const HERO_GRADIENT =
  "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.62) 15%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0.24) 45%, rgba(0,0,0,0.1) 65%, rgba(0,0,0,0.03) 100%)";

// Reveal is staggered (eyebrow → headline → support → CTAs), each a fast,
// restrained mask-style motion (translateY + opacity, ~0.5s) rather than a
// slow flourish. Fully skipped under prefers-reduced-motion via the parent
// component's variants prop (see below).
const contentVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const itemVariants = {
  hidden: { y: 22, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const } },
};

// FINAL — Hero 01 "Cinématique éditorial", redesigned after visual review.
// Previous version had two real bugs baked into its layout, not just style
// nits: (1) the corner metadata row used `pt-8` (32px) while the real fixed
// TopBar+Header stack occupies the top 100px (`FIXED_STACK_HEIGHT`) — the
// eyebrow text was rendering *behind/under* the header, reading as "nav
// mixed into the hero"; (2) the headline scaled up to `text-display-3xl`
// (8rem) across three forced line breaks, which at that size fills most of
// the viewport instead of behaving like a composed editorial element.
//
// Fixed by: consolidating all copy into one bottom-anchored block (no more
// separate top text row competing with the header — the only thing left up
// there is a single small frame-number tag, explicitly cleared below
// `FIXED_STACK_HEIGHT`), a single flowing headline (no manual line breaks)
// at a controlled scale, generous edge margins, and a fast staggered reveal
// for eyebrow/headline/support/CTAs.
export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const t = useTranslations("hero");
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  // ScrollMarquee's curtain (`-mt-[30vh]` against this 140vh/100vh sticky
  // pin) starts scrolling into view at scrollYProgress ≈ 0.071 — well before
  // the pin itself releases at ≈0.286 — because a sticky element's static
  // document footprint (what the next sibling positions against) is
  // unaffected by the pin holding it visually in place. The hero's own
  // bottom-anchored text sits right where that curtain enters from, so it
  // must be fully faded out before 0.071 or the still-legible text collides
  // with the rising curtain text. Fading it out here, well ahead of that
  // deadline, keeps the transition reading as "hero recedes, then curtain
  // rises" instead of the two overlapping.
  const textOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <div ref={wrapperRef} className="relative h-[140vh]">
      <section className="sticky top-0 h-screen min-h-[640px] w-full overflow-hidden bg-foreground">
        <motion.div
          className="absolute inset-0"
          initial={shouldReduceMotion ? undefined : { clipPath: "inset(0 0 100% 0)" }}
          animate={shouldReduceMotion ? undefined : { clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div className="absolute inset-0" style={shouldReduceMotion ? undefined : { scale: imageScale }}>
            <Image src="/images/hero/mobile.png" alt={HERO_ALT} fill priority sizes="100vw" className="object-cover md:hidden" />
            <Image
              src="/images/hero/desktop.png"
              alt={HERO_ALT}
              fill
              priority
              sizes="100vw"
              className="hidden object-cover md:block"
            />
          </motion.div>
        </motion.div>

        <div aria-hidden className="absolute inset-0" style={{ background: HERO_GRADIENT }} />

        {/* Single decorative frame label — cleared well below the real fixed
            TopBar+Header stack so it never competes with the nav. */}
        <div
          style={{ paddingTop: FIXED_STACK_HEIGHT + 24 }}
          className="absolute inset-x-0 top-0 z-10 flex justify-end px-6 text-white/50 sm:px-10 lg:px-16"
        >
          <p className="text-xs uppercase tracking-[0.3em]">{t("frameLabel")}</p>
        </div>

        {/* Two nested motion.divs, not one doing both jobs — a single
            element mixing variant-driven `animate="visible"` with a
            style-prop motion value for the *same kind* of channel (opacity)
            is unreliable: the `y` transform channel kept updating every
            frame, but `opacity` silently stuck at 1 and never reflected the
            scroll-linked fade (confirmed via direct MotionValue
            subscription vs. rendered DOM style — the JS value reached 0
            correctly, the paint never did). Splitting the scroll-fade
            (outer, no variants) from the entrance stagger (inner, no style
            motion values) removes the conflict entirely. */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: textY, opacity: textOpacity }}
          className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 sm:px-10 sm:pb-20 lg:px-16 lg:pb-24"
        >
          <motion.div
            initial={shouldReduceMotion ? undefined : "hidden"}
            animate={shouldReduceMotion ? undefined : "visible"}
            variants={shouldReduceMotion ? undefined : contentVariants}
          >
            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="text-xs uppercase tracking-[0.3em] text-white/70"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.h1
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-4 max-w-lg font-display font-extrabold leading-[1.08] tracking-tight text-white text-display-md sm:text-display-lg lg:max-w-xl lg:text-display-xl"
            >
              {t("headline")}
            </motion.h1>

            <motion.p
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-5 max-w-xs text-sm text-white/80 sm:max-w-sm sm:text-base"
            >
              {t("subtext")}
            </motion.p>

            <motion.div
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4"
            >
              <MagneticButton>
                <LinkButton href={routes.shop} className="bg-white text-foreground hover:bg-white/90">
                  {t("ctaPrimary")}
                </LinkButton>
              </MagneticButton>
              <Link
                href={routes.categories.grandesTailles}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-white"
              >
                <span className="border-b border-white/40 pb-0.5 transition-colors group-hover:border-white">
                  {t("ctaSecondary")}
                </span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          style={shouldReduceMotion ? undefined : { opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-6 hidden justify-center sm:flex"
        >
          <div className="flex flex-col items-center gap-2 text-white/60">
            <span className="text-[10px] uppercase tracking-[0.3em]">{t("scroll")}</span>
            <span className="h-8 w-px bg-white/40" />
          </div>
        </motion.div>
      </section>
    </div>
  );
}
