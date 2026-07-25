"use client";

import { useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { FIXED_STACK_HEIGHT } from "@/config/layout";
import { cn } from "@/lib/utils";
import { heroConcepts } from "./concepts";

const SELECTOR_HEIGHT = 56;

// A sticky comparison bar, not part of the final site chrome — internal-only
// tool for judging the 5 Hero directions against each other. Jumps use
// Lenis's own `scrollTo` API rather than a native anchor jump/`scrollIntoView`:
// Lenis drives scroll independently of native browser scroll, and a
// programmatic scroll that bypasses its API gets fought/overridden on the
// next animation frame (the same class of bug found and fixed elsewhere in
// this project, see useScrollLock's comment). Falls back to
// `scrollIntoView` only when Lenis isn't running (prefers-reduced-motion).
export function HeroConceptSelector() {
  const [active, setActive] = useState(heroConcepts[0].id);
  const shouldReduceMotion = useSafeReducedMotion();
  const ratiosRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const sections = heroConcepts
      .map((concept) => document.getElementById(concept.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratiosRef.current[entry.target.id] = entry.intersectionRatio;
        });
        let bestId = active;
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(ratiosRef.current)) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActive(bestId);
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function jumpTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = getLenis();
    if (lenis) {
      // Pass an absolute document-Y number rather than a selector + offset —
      // testing showed `lenis.scrollTo("#id", { offset })` landing at the
      // wrong section entirely (offset resolution against a live selector
      // didn't behave as documented). Computing the target ourselves via
      // `getBoundingClientRect()` removes that ambiguity.
      const targetY = el.getBoundingClientRect().top + window.scrollY - (FIXED_STACK_HEIGHT + SELECTOR_HEIGHT);
      lenis.scrollTo(targetY);
      return;
    }
    el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth" });
  }

  return (
    <div
      style={{ top: FIXED_STACK_HEIGHT, height: SELECTOR_HEIGHT }}
      className="sticky z-30 flex items-center gap-2 overflow-x-auto border-b border-border bg-surface/95 px-4 backdrop-blur sm:px-6 lg:px-8"
    >
      {heroConcepts.map((concept) => (
        <button
          key={concept.id}
          type="button"
          onClick={() => jumpTo(concept.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-widest transition-colors",
            active === concept.id
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          <span className="opacity-60">{concept.index}</span>
          {concept.name}
        </button>
      ))}
    </div>
  );
}
