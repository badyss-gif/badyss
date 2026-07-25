"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useSafeReducedMotion } from "./useSafeReducedMotion";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Motion philosophy (PROPOSED): CSS transitions handle micro-interactions
 * (hover/focus/active — see Button, ProductCard). Framer Motion is reserved
 * for scroll-triggered editorial reveals like this one, used sparingly for
 * storytelling sections, never for routine UI state. Respects
 * prefers-reduced-motion by rendering with no animation at all.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const shouldReduceMotion = useSafeReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
