"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

const IMAGE_ALT = "Homme portant une veste BADYSS grande taille devant une architecture contemporaine marocaine.";

// HERO 03 — Immersive / Parallax. The image reads as environment, not
// backdrop: it moves at a slower rate than the text as the user scrolls
// through the hero's own height (two independent `useTransform` ranges off
// the same `scrollYProgress`, not one shared value), plus a slow continuous
// scale. A floating context pill and a vertical progress rail (the same
// "thin line + moving dot" device already used by `CategoryShowcase`'s
// `ProgressRail`, reused here for visual consistency across the site) give
// it a sense of place inside a larger journey rather than feeling like an
// isolated banner.
export function HeroImmersiveParallax() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });

  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "14%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const railProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={wrapperRef} className="relative h-screen min-h-[640px] w-full overflow-hidden bg-foreground">
      <motion.div className="absolute inset-[-8%]" style={shouldReduceMotion ? undefined : { y: imageY, scale: imageScale }}>
        <Image src="/images/campaigns/grandes-tailles.png" alt={IMAGE_ALT} fill priority sizes="100vw" className="object-cover" />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

      {/* Floating context indicator */}
      <div className="absolute left-4 top-24 z-10 sm:left-6 lg:left-8">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/20 px-4 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Collection — Grandes tailles
        </span>
      </div>

      {/* Vertical scroll-progress rail */}
      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-10 lg:flex">
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Début</span>
        <div className="relative h-28 w-px bg-white/25">
          <motion.div
            style={{ top: railProgress }}
            className="absolute left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          />
        </div>
        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">Fin</span>
      </div>

      <motion.div
        style={shouldReduceMotion ? undefined : { y: textY, opacity: textOpacity }}
        className="absolute inset-x-0 bottom-0 z-10 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
      >
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">BADYSS — Nouvelle collection</p>
        <h1 className="mt-4 font-display font-extrabold tracking-tight text-white text-display-lg sm:text-display-xl lg:text-display-2xl">
          Le style
          <br />
          n&apos;a pas
          <br />
          de taille.
        </h1>
        <p className="mt-5 max-w-sm text-white/85 sm:text-lg">
          Des silhouettes pensées pour bouger librement.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LinkButton href={routes.shop} className="bg-white text-foreground hover:bg-white/90 hover:text-foreground">
            Découvrir la collection
          </LinkButton>
          <Link
            href={routes.categories.grandesTailles}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Grandes tailles
          </Link>
        </div>
        <p className="mt-8 text-xs uppercase tracking-[0.3em] text-white/40">Hero 03 — Parallaxe immersif</p>
      </motion.div>
    </div>
  );
}
