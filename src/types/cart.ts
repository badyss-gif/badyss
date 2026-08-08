import type { BadyssOffer, ProductImage } from "./product";

export interface CartItem {
  productId: number;
  variationId?: number;
  slug: string;
  name: string;
  image: ProductImage | null;
  // Full per-unit price before any BADYSS quantity offer — kept alongside
  // `unitPrice` so the reducer can recompute the effective price whenever
  // the quantity changes in the cart (see `getEffectiveUnitPrice`).
  basePrice: number;
  unitPrice: number;
  quantity: number;
  attributes?: Record<string, string>;
  /**
   * The resolved offer for whichever product/variation this line is (its
   * own, or inherited from a parent) — carried on the cart item itself so
   * the reducer can recompute pricing on a quantity change without a live
   * product fetch. Optional only because a cart item persisted to
   * localStorage before this field existed won't have it yet; the reducer
   * treats a missing value as "no offer" rather than assuming one.
   */
  badyssOffer?: BadyssOffer;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
}
