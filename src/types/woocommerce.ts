// Shapes based on the official WooCommerce REST API v3 schema:
// https://woocommerce.github.io/woocommerce-rest-api-docs/
// VERIFIED against the live BADYSS backend (admin-badyss.com) 2026-08-06 —
// confirmed via GET /wc/v3/products and /wc/v3/products/{id}/variations.
// Note the real store's data is genuinely messy in places (e.g. a variable
// product's own `regular_price` is often blank — the real price lives on
// each variation instead, and even variations can have some fields blank
// if the merchant hasn't filled them in yet). Every consumer of these types
// (see lib/woocommerce/transform.ts) must treat blank-string prices as
// "not set", not as zero.

export interface WooCommerceImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface WooCommerceCategoryRef {
  id: number;
  name: string;
  slug: string;
}

export interface WooCommerceAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

/** A variation's own attribute selection — `option` is a single value, unlike the parent product's `options` array. An empty `attributes` array on a variation is WooCommerce's "matches any option" wildcard. */
export interface WooCommerceVariationAttribute {
  id: number;
  name: string;
  slug: string;
  option: string;
}

export type WooCommerceProductType = "simple" | "variable" | "grouped" | "external";
export type WooCommerceStockStatus = "instock" | "outofstock" | "onbackorder";

export interface WooCommerceVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: WooCommerceStockStatus;
  stock_quantity: number | null;
  manage_stock: boolean;
  attributes: WooCommerceVariationAttribute[];
  image: WooCommerceImage | null;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: WooCommerceProductType;
  status: "draft" | "pending" | "private" | "publish";
  featured: boolean;
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: WooCommerceStockStatus;
  stock_quantity: number | null;
  manage_stock: boolean;
  categories: WooCommerceCategoryRef[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
  variations: number[];
}

export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: WooCommerceImage | null;
  count: number;
}

// Based on https://woocommerce.github.io/woocommerce-rest-api-docs/#orders
export interface WooCommerceAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface WooCommerceOrderLineItemInput {
  product_id: number;
  variation_id?: number;
  quantity: number;
}

export interface WooCommerceCreateOrderPayload {
  payment_method: string;
  payment_method_title: string;
  set_paid: boolean;
  status?: string;
  billing: WooCommerceAddress;
  shipping: WooCommerceAddress;
  line_items: WooCommerceOrderLineItemInput[];
  customer_note?: string;
}

export interface WooCommerceOrderLineItem {
  product_id: number;
  variation_id: number;
  name: string;
  quantity: number;
  total: string;
}

export interface WooCommerceOrder {
  id: number;
  number: string;
  status: string;
  currency: string;
  total: string;
  date_created: string;
  line_items: WooCommerceOrderLineItem[];
}
