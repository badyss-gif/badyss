"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";

const IMAGE_ALT = "Ensemble coordonné BADYSS porté en contexte urbain.";

// HERO 02 — Typographic / Art-Direction. Typography is the subject, not a
// caption on top of a photo: a huge, low-opacity watermark word sits behind
// everything (same device already used in `BrandStatement`'s "01", reused
// here deliberately for a consistent visual language), the real legible
// headline sits over it on the left, and the campaign image is a distinct
// masked panel on the right whose left edge fades via a CSS mask rather than
// a hard seam — letting the giant background type bleed through at the
// boundary instead of a flat crop line.
//
// Desktop-only: the image panel drifts a few pixels opposite the cursor
// (`pointer: fine` gated, springs back on leave — same spring technique as
// `MagneticButton`). Scroll drives the headline and the image panel at
// different rates (a two-layer parallax, not one image scaling alone).
// Mobile is a completely different, stacked composition — no watermark
// overlap, no mask trick — an image-then-text editorial layout instead.
export function HeroTypographic() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end start"] });
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.6 });

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
    const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
    x.set(relativeX * -18);
    y.set(relativeY * -18);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <div ref={wrapperRef} className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Desktop composition: watermark + split image panel */}
      <div className="relative hidden h-screen min-h-[640px] lg:block">
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 -z-10 -translate-y-1/2 select-none whitespace-nowrap font-display text-[16vw] font-extrabold leading-none text-muted"
        >
          BADYSS
        </span>

        <div
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className="absolute inset-y-0 right-0 w-[52%] overflow-hidden"
          style={{ WebkitMaskImage: "linear-gradient(to right, transparent, black 14%)", maskImage: "linear-gradient(to right, transparent, black 14%)" }}
        >
          <motion.div className="absolute inset-[-4%]" style={shouldReduceMotion ? undefined : { y: imageY }}>
            <motion.div
              className="absolute inset-0"
              style={shouldReduceMotion ? undefined : { x: springX, y: springY }}
            >
              <Image src="/images/categories/ensembles.png" alt={IMAGE_ALT} fill sizes="55vw" priority className="object-cover" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          style={shouldReduceMotion ? undefined : { y: headlineY }}
          className="relative z-10 flex h-full max-w-xl flex-col justify-center px-8 xl:px-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            BADYSS — Nouvelle collection
          </p>
          <h1 className="mt-4 font-display text-display-2xl font-extrabold leading-[0.95] tracking-tight text-foreground">
            Le style
            <br />
            n&apos;a pas
            <br />
            de taille.
          </h1>
          <p className="mt-6 max-w-xs text-muted-foreground">
            Des silhouettes pensées pour bouger librement.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <LinkButton href={routes.shop}>Découvrir la collection</LinkButton>
            <Link
              href={routes.categories.grandesTailles}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Grandes tailles
            </Link>
          </div>
          <p className="mt-10 text-xs uppercase tracking-[0.3em] text-muted-foreground/70">
            Hero 02 — Typographique
          </p>
        </motion.div>
      </div>

      {/* Mobile/tablet composition: a distinct stacked editorial layout, not
          the desktop split shrunk down. */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src="/images/categories/ensembles.png" alt={IMAGE_ALT} fill sizes="100vw" priority className="object-cover" />
        </div>
        <div className="px-4 py-10 sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            BADYSS — Nouvelle collection
          </p>
          <h1 className="mt-4 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight text-foreground sm:text-display-xl">
            Le style
            <br />
            n&apos;a pas
            <br />
            de taille.
          </h1>
          <p className="mt-5 max-w-sm text-muted-foreground">
            Des silhouettes pensées pour bouger librement.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <LinkButton href={routes.shop}>Découvrir la collection</LinkButton>
            <Link
              href={routes.categories.grandesTailles}
              className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Grandes tailles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
