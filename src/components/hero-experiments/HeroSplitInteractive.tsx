"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/LinkButton";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";

const IMAGE_ALT = "Homme en tenue urbaine BADYSS marchant entre des volumes de béton.";

type Side = "image" | "text" | null;

// HERO 04 — Split / Interactive. A confident two-column composition:
// campaign visual on one side, minimal editorial typography on the other.
// The two sides genuinely react to each other on hover (not just a local
// hover effect) — hovering the text column pulls focus by receding the
// image slightly and widening the dividing line; hovering the image pulls
// focus back onto it. Mobile deliberately does NOT stack the two columns —
// that reads as an afterthought — instead the image becomes a full-bleed
// cover with a solid dark statement panel beneath it, a distinct "cover +
// page" composition suited to a single narrow column.
export function HeroSplitInteractive() {
  const [hovered, setHovered] = useState<Side>(null);
  const shouldReduceMotion = useSafeReducedMotion();

  return (
    <div className="relative w-full overflow-hidden bg-foreground">
      {/* Desktop: interactive split */}
      <div className="relative hidden h-screen min-h-[640px] lg:flex">
        <div
          onMouseEnter={() => setHovered("image")}
          onMouseLeave={() => setHovered(null)}
          className="relative h-full w-1/2 overflow-hidden"
        >
          <motion.div
            className="absolute inset-0"
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: hovered === "image" ? 1.06 : hovered === "text" ? 0.97 : 1 }
            }
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Image src="/images/editorial/campaign.png" alt={IMAGE_ALT} fill sizes="50vw" priority className="object-cover" />
          </motion.div>
          <div
            className={cn(
              "absolute inset-0 bg-black/20 transition-opacity duration-500",
              hovered === "text" ? "opacity-40" : "opacity-0"
            )}
          />
        </div>

        <div
          onMouseEnter={() => setHovered("text")}
          onMouseLeave={() => setHovered(null)}
          className="relative flex h-full w-1/2 flex-col justify-center bg-background px-10 xl:px-16"
        >
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            BADYSS — Nouvelle collection
          </p>
          <motion.h1
            animate={shouldReduceMotion ? undefined : { x: hovered === "text" ? 8 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-4 font-display text-display-xl font-extrabold leading-[0.95] tracking-tight text-foreground xl:text-display-2xl"
          >
            Le style
            <br />
            n&apos;a pas
            <br />
            de taille.
          </motion.h1>
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
            Hero 04 — Split éditorial
          </p>
        </div>

        {/* Dividing line — widens toward whichever side is hovered */}
        <motion.div
          aria-hidden
          className="absolute inset-y-0 left-1/2 z-10 w-px -translate-x-1/2 bg-white/30"
          animate={shouldReduceMotion ? undefined : { scaleX: hovered ? 3 : 1 }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Mobile/tablet: cover + statement panel, not stacked columns */}
      <div className="lg:hidden">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image src="/images/editorial/campaign.png" alt={IMAGE_ALT} fill sizes="100vw" priority className="object-cover" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-8 text-white sm:px-6">
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">BADYSS</p>
          </div>
        </div>
        <div className="bg-foreground px-4 py-12 text-inverse-foreground sm:px-6">
          <p className="text-xs uppercase tracking-[0.3em] text-inverse-foreground/60">
            Nouvelle collection
          </p>
          <h1 className="mt-4 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight sm:text-display-xl">
            Le style
            <br />
            n&apos;a pas
            <br />
            de taille.
          </h1>
          <p className="mt-5 max-w-sm text-inverse-foreground/70">
            Des silhouettes pensées pour bouger librement.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <LinkButton href={routes.shop} className="bg-white text-foreground hover:bg-white/90 hover:text-foreground">
              Découvrir la collection
            </LinkButton>
            <Link
              href={routes.categories.grandesTailles}
              className="inline-flex h-11 items-center justify-center rounded-full border border-white/30 px-5 text-sm font-medium transition-colors hover:bg-white/10"
            >
              Grandes tailles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
