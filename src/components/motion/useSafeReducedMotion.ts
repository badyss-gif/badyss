"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const query = window.matchMedia(QUERY);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

// Framer Motion's own `useReducedMotion()` reads `matchMedia` synchronously
// during render, including the client's very first (hydration) render pass.
// The server has no `window` and defaults to `false`, so a visitor who
// actually has OS-level reduced-motion enabled gets a client render that
// disagrees with the server HTML — and every component here that branches
// its JSX *shape* on that value (not just a style prop) then hydration-
// mismatches on every page load for exactly the users this feature exists
// for. Confirmed via testing this site with `reducedMotion: "reduce"` in a
// real browser: full tree regeneration, a visible flash, wasted work.
//
// `useSyncExternalStore` is the built-in fix for this exact class of
// problem: React hydrates with `getServerSnapshot()` (`false`) for the first
// pass, matching the server HTML, then re-checks the real value immediately
// after and re-renders if it differs — a normal post-hydration update, not a
// mismatch.
export function useSafeReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
