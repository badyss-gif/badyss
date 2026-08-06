// Domain-level product types used by UI/feature code. These are decoupled
// from the raw WooCommerce REST wire format (see types/woocommerce.ts) —
// src/lib/woocommerce/transform.ts maps one into the other, so components
// never need to know about WooCommerce-specific field names.

export interface ProductImage {
  url: string;
  alt: string;
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  parentId: number | null;
}

export interface ProductAttribute {
  name: string;
  options: string[];
  usedForVariations: boolean;
}

export interface ProductPrice {
  amount: number;
  currency: string;
  onSale: boolean;
  regularAmount?: number;
}

export type StockStatus = "in-stock" | "out-of-stock" | "backorder";

export interface ProductStock {
  status: StockStatus;
  /** Only meaningful when `manageStock` is true — WooCommerce tracks a numeric quantity for this product/variation. */
  quantity?: number | null;
  manageStock?: boolean;
}

export interface ProductVariant {
  id: number;
  sku: string;
  /** Empty object = WooCommerce's "matches any option" wildcard variation. */
  attributes: Record<string, string>;
  price: ProductPrice;
  stock: ProductStock;
  image: ProductImage | null;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  sku: string;
  price: ProductPrice;
  stock: ProductStock;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  type: "simple" | "variable" | "grouped" | "external";
  featured: boolean;
  variants?: ProductVariant[];
}
