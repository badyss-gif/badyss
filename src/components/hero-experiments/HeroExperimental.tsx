"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

const BASE_ALT = "Homme en grande taille BADYSS devant une architecture contemporaine marocaine.";
const INSET_ALT = "T-shirt premium BADYSS porté en contexte urbain.";

function FloatingLabel({ className, children }: { className: string; children: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-20 select-none rounded-full border border-white/25 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-sm ${className}`}
    >
      {children}
    </span>
  );
}

// HERO 05 — Experimental / Award-level. The most elaborate of the five, but
// still restrained by the same rule as the rest of this project's motion
// system: every effect earns its place. Three layers: a full-bleed base
// image, a smaller framed inset image (a second real category photo,
// offering genuine layered/collage composition rather than one photo
// stretched), and oversized three-line typography bleeding toward the
// edges, each line drifting at its own scroll-linked speed. A handful of
// rotated micro-labels (frame number, season, origin) borrow fashion-
// lookbook conventions rather than inventing business claims. On desktop
// only, the whole composition tilts a few degrees toward the cursor
// (spring-eased, `pointer: fine` gated) for a subtle 3D "digital campaign"
// feel — never more than a few degrees, never on touch devices.
export function HeroExperimental() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });

  const insetY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const line1X = useTransform(scrollYProgress, [0, 1], [0, -26]);
  const line2X = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const line3X = useTransform(scrollYProgress, [0, 1], [0, -14]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 100, damping: 18 });
  const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 18 });

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(relativeX * 4);
    rotateX.set(relativeY * -4);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: 1400 }}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-foreground"
    >
      <motion.div
        style={shouldReduceMotion ? undefined : { rotateX: springRotateX, rotateY: springRotateY }}
        className="relative h-full w-full"
      >
        <motion.div className="absolute inset-0" style={shouldReduceMotion ? undefined : { opacity: bgOpacity }}>
          <Image
            src="/images/categories/grandes-tailles.png"
            alt={BASE_ALT}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />

        {/* Layered inset image — a genuine second photo, not a duplicate crop */}
        <motion.div
          style={shouldReduceMotion ? undefined : { y: insetY }}
          className="absolute bottom-28 right-5 z-10 hidden aspect-[3/4] w-36 overflow-hidden border-2 border-white/80 shadow-2xl sm:block sm:w-44 sm:bottom-32 lg:w-56 lg:right-10"
        >
          <Image src="/images/categories/t-shirts.png" alt={INSET_ALT} fill sizes="220px" className="object-cover" />
        </motion.div>

        <FloatingLabel className="left-4 top-24 -rotate-6 sm:left-6 lg:left-8">N°05</FloatingLabel>
        <FloatingLabel className="right-6 top-32 rotate-3 sm:right-10 lg:right-16">SS26</FloatingLabel>
        <FloatingLabel className="hidden left-10 top-1/2 rotate-2 lg:block">Maroc</FloatingLabel>

        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-white/70">
            BADYSS — Nouvelle collection
          </p>
          <h1 className="font-display font-extrabold uppercase leading-[0.92] tracking-tight text-white text-display-lg sm:text-display-xl lg:text-display-2xl xl:text-display-3xl">
            <motion.span style={shouldReduceMotion ? undefined : { x: line1X }} className="block">
              Le style
            </motion.span>
            <motion.span style={shouldReduceMotion ? undefined : { x: line2X }} className="block">
              n&apos;a pas
            </motion.span>
            <motion.span style={shouldReduceMotion ? undefined : { x: line3X }} className="block">
              de taille.
            </motion.span>
          </h1>
          <p className="mt-5 max-w-sm text-white/85 sm:text-lg">
            Des silhouettes pensées pour bouger librement.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href={routes.shop} className="bg-accent text-accent-foreground hover:bg-accent/90">
              Découvrir la collection
            </LinkButton>
            <Link
              href={routes.categories.grandesTailles}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/40 px-5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Grandes tailles
            </Link>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.3em] text-white/40">Hero 05 — Expérimental</p>
        </div>
      </motion.div>
    </div>
  );
}
