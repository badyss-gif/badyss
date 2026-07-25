"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

// Module-scoped, not React state: this is a single global controller, and
// exposing it via a plain getter is simpler than threading a context through
// every component that needs to pause scroll (see useScrollLock). `null`
// whenever Lenis isn't running (reduced motion, or before/after mount) —
// callers must handle that.
let lenisInstance: Lenis | null = null;

export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Site-wide smooth scroll. Renders nothing itself — mounted once in the root
 * layout, purely a side-effecting scroll controller.
 *
 * Lenis intercepts wheel/touch input and eases native `window.scroll`, so
 * every existing Framer Motion `useScroll()` call (Header, Hero, category
 * journey, etc.) keeps working unmodified — they read the same native scroll
 * position, just arriving at it smoothly instead of instantly.
 *
 * Fully skipped under prefers-reduced-motion: native scroll behavior is
 * simply left alone rather than eased.
 */
export function SmoothScroll() {
  const shouldReduceMotion = useSafeReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });
    lenisInstance = lenis;

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [shouldReduceMotion]);

  return null;
}
