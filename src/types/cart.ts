import type { ProductImage } from "./product";

export interface CartItem {
  productId: number;
  variationId?: number;
  slug: string;
  name: string;
  image: ProductImage | null;
  // Full per-unit price before any quantity discount — kept alongside
  // `unitPrice` so the reducer can recompute the discount whenever the
  // quantity changes in the cart (see `getDiscountedUnitPrice`).
  basePrice: number;
  unitPrice: number;
  quantity: number;
  attributes?: Record<string, string>;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
}
