import type { ProductImage } from "./product";

export interface CartItem {
  productId: number;
  variationId?: number;
  slug: string;
  name: string;
  image: ProductImage | null;
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
