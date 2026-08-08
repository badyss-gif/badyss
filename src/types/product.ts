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

/**
 * One quantity tier from the BADYSS WooCommerce Offers plugin's
 * `badyss_offer` REST field. Shape depends on quantity/mode:
 *  - quantity 1: only `price` (the effective per-unit price, no discount).
 *  - quantity 2-5, percentage mode: `discount`, `original_price`,
 *    `final_price`, `unit_price`.
 *  - quantity 2-5, fixed mode: `price` (the configured total),
 *    `original_price`, `unit_price` — no `discount`.
 *  - On a variable *parent* product (not a specific variation), tiers are a
 *    template only: `discount` (percentage mode) or `price` (fixed mode,
 *    since a fixed total doesn't depend on any variation's price) — no
 *    computed original/final/unit price, since there's no single price at
 *    that level yet.
 */
export interface BadyssOfferTier {
  quantity: number;
  discount?: number;
  price?: number;
  original_price?: number;
  final_price?: number;
  unit_price?: number;
}

export interface BadyssOfferMoreThanMax {
  enabled: boolean;
  whatsapp: string;
  url: string;
}

/**
 * Always present on every `Product`/`ProductVariant` (mirroring the plugin's
 * own REST field, which always returns a full shape even when there's no
 * offer) — check `.enabled` rather than the field's own presence.
 */
export interface BadyssOffer {
  enabled: boolean;
  type: "percentage" | "fixed" | null;
  tiers: BadyssOfferTier[];
  maxQuantity: number;
  /** Whether this came from the product/variation's own config, or (for a
   *  variation with no override) was inherited from its parent. */
  source: "product" | "parent" | "variation";
  moreThanMax: BadyssOfferMoreThanMax;
}

export interface ProductVariant {
  id: number;
  sku: string;
  /** Empty object = WooCommerce's "matches any option" wildcard variation. */
  attributes: Record<string, string>;
  price: ProductPrice;
  stock: ProductStock;
  image: ProductImage | null;
  badyssOffer: BadyssOffer;
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
  badyssOffer: BadyssOffer;
}
