"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

// `document.body` doesn't exist during SSR, so mounting has to be detected
// client-side. `useSyncExternalStore` (rather than the common
// `useEffect(() => setMounted(true), [])` pattern) avoids a synchronous
// setState-in-effect: it renders `false` for the server and the client's
// first hydration pass (matching, no mismatch), then corrects to `true`
// immediately after via React's own post-hydration re-render — the same
// mechanism already used by useSafeReducedMotion.
function subscribe() {
  return () => {};
}
function getSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}
function useMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Renders `children` directly into `document.body`, escaping whatever
// stacking context the call site happens to be nested in.
//
// This matters here specifically: `Header` is `position: fixed` with its
// own `z-index`, which makes it establish a stacking context — every
// descendant's z-index (however high) is then compared *inside* that
// context first, and only Header's own z-index competes with its siblings
// (like `TopBar`). A full-screen overlay nested inside Header (NavOverlay,
// SearchButton, CartButton) can declare `z-[80]` and still lose to
// TopBar's `z-[70]`, because it's trapped one level down. Confirmed via
// testing: `elementFromPoint` at the overlay's own top edge resolved to a
// TopBar link, not the overlay, despite the overlay's higher z-index.
// Portaling to `document.body` sidesteps the whole problem — it's now a
// true sibling of Header/TopBar, where z-index comparisons work as expected.
export function Portal({ children }: { children: ReactNode }) {
  const mounted = useMounted();
  if (!mounted) return null;
  return createPortal(children, document.body);
}
