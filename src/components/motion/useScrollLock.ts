"use client";

import { useEffect } from "react";
import { getLenis } from "./SmoothScroll";

// Locks page scroll while `active` is true (modals, drawers, the full-screen
// nav overlay). Two layers, both required:
//
// 1. `lenis.stop()` — Lenis intercepts wheel/touch input and drives scroll
//    programmatically via its own rAF loop, entirely independent of CSS.
//    Confirmed via testing: with only `overflow: hidden` set, wheel input
//    still advanced `window.scrollY` behind an open modal, because Lenis
//    never saw a reason to stop. `lenis.stop()` is Lenis's own supported API
//    for exactly this.
// 2. `overflow: hidden` on `<html>` *and* `<body>` — the fallback for when
//    Lenis isn't running at all (prefers-reduced-motion skips it entirely,
//    see SmoothScroll), so native scroll still gets locked. Set on both
//    elements because this site's root scroller is `<html>` in standards
//    mode, not `<body>` — locking `body` alone (the previous, broken
//    pattern, duplicated across four components) does nothing.
export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const lenis = getLenis();
    lenis?.stop();

    const html = document.documentElement;
    const { body } = document;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [active]);
}
