"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface CursorFollowBadgeProps {
  label: string;
}

/**
 * Desktop-only: a small badge that follows the cursor within its parent
 * tile, appearing on hover. Gated to mouse pointers and `md:` and up —
 * touch devices get no equivalent here because tapping the tile already
 * navigates directly; there's nothing this badge would add on touch.
 * Purely decorative (aria-hidden) — the tile itself remains a real link
 * with its own accessible name.
 */
export function CursorFollowBadge({ label }: CursorFollowBadgeProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-20 hidden md:block"
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        setPosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      }}
      onPointerLeave={() => setPosition(null)}
    >
      {position ? (
        <motion.div
          className="pointer-events-none absolute flex h-16 w-16 items-center justify-center rounded-full bg-white text-xs font-medium tracking-wide text-foreground"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1, x: position.x - 32, y: position.y - 32 }}
          exit={{ opacity: 0, scale: 0.7 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
        >
          {label}
        </motion.div>
      ) : null}
    </div>
  );
}
