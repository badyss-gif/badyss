"use client";

import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";

const STORAGE_KEY = "badyss-wishlist";

type WishlistState = number[];
type WishlistAction = { type: "TOGGLE"; productId: number } | { type: "RESTORE"; ids: number[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "TOGGLE":
      return state.includes(action.productId)
        ? state.filter((id) => id !== action.productId)
        : [...state, action.productId];
    case "RESTORE":
      return action.ids;
  }
}

interface WishlistContextValue {
  ids: number[];
  has: (productId: number) => boolean;
  toggle: (productId: number) => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Product IDs only (not full product snapshots) — the wishlist page
 * re-derives display data from the same `getProducts()` catalog every other
 * page already uses, so there's only ever one source of truth for product
 * data. Same hydration-safe pattern as CartContext: render empty on mount,
 * restore from localStorage in an effect, skip the first persist-write so
 * mounting doesn't clobber storage before restore runs.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, dispatch] = useReducer(wishlistReducer, []);
  const isFirstWrite = useRef(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) dispatch({ type: "RESTORE", ids: parsed });
    } catch {
      // Corrupted storage — ignore, start empty.
    }
  }, []);

  useEffect(() => {
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const value: WishlistContextValue = {
    ids,
    has: (productId) => ids.includes(productId),
    toggle: (productId) => dispatch({ type: "TOGGLE", productId }),
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
}
