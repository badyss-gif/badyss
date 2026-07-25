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
}

export interface ProductVariant {
  id: number;
  attributes: Record<string, string>;
  price: ProductPrice;
  stock: ProductStock;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: ProductPrice;
  stock: ProductStock;
  images: ProductImage[];
  categories: ProductCategory[];
  attributes: ProductAttribute[];
  variants?: ProductVariant[];
}
