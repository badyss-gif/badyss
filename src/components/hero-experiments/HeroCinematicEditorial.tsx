"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

const HERO_ALT = "Homme en tenue urbaine contemporaine BADYSS, marchant dans une rue moderne au Maroc.";

// HERO 01 — Cinematic Editorial. The most "produced" of the five: a
// full-screen campaign moment, the existing approved hero photography, and
// a deliberate mask-reveal entrance (clip-path wiping open on load) rather
// than a fade — the image should feel like it's being unveiled, not just
// appearing. Copy is deliberately minimal (one headline, one short line, two
// CTAs) — the brand should read in 2–4 seconds, not be explained in a
// paragraph.
export function HeroCinematicEditorial() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.16]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <div ref={wrapperRef} className="relative h-screen min-h-[640px] w-full overflow-hidden bg-foreground">
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/25" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-8 text-white sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">BADYSS — Nouvelle collection</p>
        <p className="hidden text-xs uppercase tracking-[0.3em] text-white/50 sm:block">Hero 01 — Cinématique éditorial</p>
      </div>

      <motion.div
        className="absolute inset-x-0 bottom-0 z-10 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24"
        style={shouldReduceMotion ? undefined : { y: textY, opacity: textOpacity }}
      >
        <h1 className="font-display font-extrabold tracking-tight text-white text-display-lg sm:text-display-xl lg:text-display-2xl xl:text-display-3xl">
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
          <MagneticButton>
            <LinkButton href={routes.shop} className="bg-white text-foreground hover:bg-white/90">
              Découvrir la collection
            </LinkButton>
          </MagneticButton>
          <Link
            href={routes.categories.grandesTailles}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Grandes tailles
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
