"use client";

import { createContext, useContext, useEffect, useReducer, useRef, type ReactNode } from "react";
import { cartReducer, initialCart } from "./cart-reducer";
import type { Cart, CartItem } from "@/types/cart";

const STORAGE_KEY = "badyss-cart";

interface CartContextValue {
  cart: Cart;
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, quantity: number, variationId?: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Shared cart state for the whole site (Header's drawer, `/panier`, product
 * pages) — one `useReducer` around the already-tested `cartReducer`, backed
 * by `localStorage` so it survives a reload.
 *
 * Deliberately does NOT read `localStorage` during the initial render (that
 * would disagree with the server-rendered empty cart on the client's first
 * hydration pass and hydration-mismatch — the same class of bug already
 * found and fixed for `useSafeReducedMotion` elsewhere in this project).
 * Instead: render `initialCart` for mount, then restore the persisted cart
 * in an effect — a normal post-hydration update. A ref skips the *write*
 * effect's very first run so mounting doesn't briefly clobber
 * `localStorage` with the empty cart before hydration completes.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, dispatch] = useReducer(cartReducer, initialCart);
  const isFirstWrite = useRef(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as Cart;
      if (Array.isArray(parsed.items)) {
        for (const item of parsed.items) {
          dispatch({ type: "ADD_ITEM", item });
        }
      }
    } catch {
      // Corrupted storage — ignore, start from an empty cart.
    }
  }, []);

  useEffect(() => {
    if (isFirstWrite.current) {
      isFirstWrite.current = false;
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const value: CartContextValue = {
    cart,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (productId, variationId) => dispatch({ type: "REMOVE_ITEM", productId, variationId }),
    updateQuantity: (productId, quantity, variationId) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity, variationId }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
