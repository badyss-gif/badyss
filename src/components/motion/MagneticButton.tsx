"use client";

import type { ReactNode, PointerEvent as ReactPointerEvent } from "react";
import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** How far the content can be pulled toward the cursor, in pixels. */
  strength?: number;
}

/**
 * Desktop-only "magnetic" hover: content nudges gently toward the cursor
 * within a small radius, springs back on leave. Gated to `pointer: fine`
 * devices only — touch devices don't have hover/cursor, so mobile just
 * renders the children with no wrapper behavior at all (real touch
 * equivalent, not a broken imitation of a mouse effect).
 * Respects prefers-reduced-motion by skipping the effect entirely.
 */
export function MagneticButton({ children, className, strength = 12 }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useSafeReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relativeX = event.clientX - (rect.left + rect.width / 2);
    const relativeY = event.clientY - (rect.top + rect.height / 2);
    x.set((relativeX / rect.width) * strength);
    y.set((relativeY / rect.height) * strength);
  }

  function handlePointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
