// Shapes based on the official WooCommerce REST API v3 schema:
// https://woocommerce.github.io/woocommerce-rest-api-docs/
// NOT_VERIFIED against the actual BADYSS backend yet — fields may need
// adjustment once the live store's plugins/customizations are inspected
// (custom attributes, ACF fields, etc.).

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

export type WooCommerceProductType = "simple" | "variable" | "grouped" | "external";
export type WooCommerceStockStatus = "instock" | "outofstock" | "onbackorder";

export interface WooCommerceProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: WooCommerceProductType;
  status: "draft" | "pending" | "private" | "publish";
  description: string;
  short_description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  stock_status: WooCommerceStockStatus;
  categories: WooCommerceCategoryRef[];
  images: WooCommerceImage[];
  attributes: WooCommerceAttribute[];
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
