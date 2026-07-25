import type { Cart, CartItem } from "@/types/cart";

export type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; productId: number; variationId?: number }
  | { type: "UPDATE_QUANTITY"; productId: number; variationId?: number; quantity: number }
  | { type: "CLEAR" };

export const initialCart: Cart = { items: [], itemCount: 0, subtotal: 0, currency: "MAD" };

function itemKey(item: Pick<CartItem, "productId" | "variationId">): string {
  return `${item.productId}:${item.variationId ?? ""}`;
}

function withTotals(items: CartItem[], currency: string): Cart {
  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    currency,
  };
}

export function cartReducer(state: Cart, action: CartAction): Cart {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((item) => itemKey(item) === itemKey(action.item));
      const items = existing
        ? state.items.map((item) =>
            itemKey(item) === itemKey(action.item)
              ? { ...item, quantity: item.quantity + action.item.quantity }
              : item
          )
        : [...state.items, action.item];
      return withTotals(items, state.currency);
    }

    case "REMOVE_ITEM": {
      const items = state.items.filter((item) => itemKey(item) !== itemKey(action));
      return withTotals(items, state.currency);
    }

    case "UPDATE_QUANTITY": {
      const items = state.items
        .map((item) => (itemKey(item) === itemKey(action) ? { ...item, quantity: action.quantity } : item))
        .filter((item) => item.quantity > 0);
      return withTotals(items, state.currency);
    }

    case "CLEAR":
      return { ...initialCart, currency: state.currency };
  }
}
