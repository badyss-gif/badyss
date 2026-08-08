import { describe, expect, it } from "vitest";
import { cartReducer, initialCart } from "./cart-reducer";
import type { BadyssOffer } from "@/types/product";
import type { CartItem } from "@/types/cart";

const badyssOffer: BadyssOffer = {
  enabled: true,
  type: "percentage",
  tiers: [
    { quantity: 1, price: 100 },
    { quantity: 2, discount: 10, original_price: 200, final_price: 180, unit_price: 90 },
    { quantity: 3, discount: 20, original_price: 300, final_price: 240, unit_price: 80 },
  ],
  maxQuantity: 5,
  source: "product",
  moreThanMax: { enabled: false, whatsapp: "", url: "" },
};

const item: CartItem = {
  productId: 1,
  slug: "test-product",
  name: "Test Product",
  image: null,
  basePrice: 100,
  unitPrice: 100,
  quantity: 1,
  badyssOffer,
};

describe("cartReducer", () => {
  it("adds a new item and computes totals", () => {
    const state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    expect(state.items).toHaveLength(1);
    expect(state.itemCount).toBe(1);
    expect(state.subtotal).toBe(100);
  });

  it("merges quantity when the same product/variation is added again", () => {
    // 1 + 2 = 3, which crosses into the qty-3 quantity-discount tier
    // (-20%): unitPrice recomputes off `basePrice`, not the pre-merge
    // `unitPrice`, so this also guards against compounding the discount.
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    state = cartReducer(state, { type: "ADD_ITEM", item: { ...item, quantity: 2 } });
    expect(state.items).toHaveLength(1);
    expect(state.itemCount).toBe(3);
    expect(state.items[0].unitPrice).toBe(80);
    expect(state.subtotal).toBe(240);
  });

  it("recomputes the quantity discount when quantity changes in the cart", () => {
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    state = cartReducer(state, { type: "UPDATE_QUANTITY", productId: 1, quantity: 2 });
    expect(state.items[0].unitPrice).toBe(90);
    expect(state.subtotal).toBe(180);

    state = cartReducer(state, { type: "UPDATE_QUANTITY", productId: 1, quantity: 1 });
    expect(state.items[0].unitPrice).toBe(100);
    expect(state.subtotal).toBe(100);
  });

  it("treats different variationIds as separate line items", () => {
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item: { ...item, variationId: 10 } });
    state = cartReducer(state, { type: "ADD_ITEM", item: { ...item, variationId: 20 } });
    expect(state.items).toHaveLength(2);
  });

  it("updates quantity and removes the item when quantity reaches zero", () => {
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    state = cartReducer(state, { type: "UPDATE_QUANTITY", productId: 1, quantity: 0 });
    expect(state.items).toHaveLength(0);
    expect(state.subtotal).toBe(0);
  });

  it("removes an item", () => {
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    state = cartReducer(state, { type: "REMOVE_ITEM", productId: 1 });
    expect(state.items).toHaveLength(0);
  });

  it("clears the cart while preserving currency", () => {
    let state = cartReducer(initialCart, { type: "ADD_ITEM", item });
    state = cartReducer(state, { type: "CLEAR" });
    expect(state).toEqual(initialCart);
  });
});
