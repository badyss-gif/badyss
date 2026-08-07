// Single entry point for all backend data access. Application code (Server
// Components, route handlers, server actions) should import from here —
// never reach into lib/wordpress or lib/woocommerce directly, and never
// call fetch() against WordPress/WooCommerce from a component.
//
// Functions here return domain types (src/types/product.ts), not raw
// WooCommerce wire-format types — the mapping happens in
// lib/woocommerce/transform.ts, so UI code never depends on WooCommerce's
// specific field names.
//
// No live WooCommerce credentials exist yet (see config/server-env.ts). Every
// function below checks `isWooCommerceConfigured()` and transparently falls
// back to the labeled mock catalog (src/lib/mock-data/products.ts) when it
// isn't — so Shop/category/product pages work today and start returning real
// data the moment real credentials are added to `.env.local`, with zero
// changes needed in the pages themselves.

import * as wooProducts from "@/lib/woocommerce/products";
import * as wooCategories from "@/lib/woocommerce/categories";
import * as wooOrders from "@/lib/woocommerce/orders";
import {
  mapWooCommerceCategory,
  mapWooCommerceOrder,
  mapWooCommerceProduct,
  mapWooCommerceVariation,
} from "@/lib/woocommerce/transform";
import { isWooCommerceConfigured } from "@/config/server-env";
import {
  mockProducts,
  getMockProductsByCategorySlug,
  getMockProductBySlug,
  searchMockProducts,
  mockCategories,
  getMockCategoryBySlug,
  getMockRelatedProducts,
} from "@/lib/mock-data/products";
import type { CreateOrderInput, Order } from "@/types/order";
import type { Product, ProductCategory } from "@/types/product";
import type { WooCommerceAddress, WooCommerceCreateOrderPayload } from "@/types/woocommerce";

export { wordPressFetch } from "@/lib/wordpress/client";

export async function getProducts(params?: {
  category?: string;
  perPage?: number;
  page?: number;
  featured?: boolean;
}): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return mockProducts;
  const raw = await wooProducts.getProducts(params);
  return raw.map(mapWooCommerceProduct);
}

/**
 * Attaches real WooCommerce variation data (price/stock per size or color
 * combo) to a variable product — a second API call, so callers only pay for
 * it on single-product views (product page, Buy Now), never on list pages.
 */
async function withVariants(product: Product, rawId: number, variationIds: number[]): Promise<Product> {
  if (variationIds.length === 0) return product;
  const rawVariations = await wooProducts.getProductVariations(rawId);
  return {
    ...product,
    variants: rawVariations.map((variation) => mapWooCommerceVariation(variation, product.price, product.stock)),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isWooCommerceConfigured()) return getMockProductBySlug(slug);
  const raw = await wooProducts.getProductBySlug(slug);
  if (!raw) return null;
  const product = mapWooCommerceProduct(raw);
  return withVariants(product, raw.id, raw.variations);
}

export async function searchProducts(query: string, params?: { perPage?: number }): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return searchMockProducts(query);
  const raw = await wooProducts.searchProducts(query, params);
  return raw.map(mapWooCommerceProduct);
}

export async function getCategories(): Promise<ProductCategory[]> {
  if (!isWooCommerceConfigured()) return mockCategories;
  const raw = await wooCategories.getCategories();
  return raw.map(mapWooCommerceCategory);
}

export async function getCategoryBySlug(slug: string): Promise<ProductCategory | null> {
  if (!isWooCommerceConfigured()) return getMockCategoryBySlug(slug);
  const raw = await wooCategories.getCategoryBySlug(slug);
  return raw ? mapWooCommerceCategory(raw) : null;
}

/**
 * All products in a category, including its nested subcategories (e.g.
 * "Grandes tailles" also surfaces "Chaussures"/"Pantalon" products) — the
 * mock path already resolves this; the real path resolves the category's id
 * from its slug first, since the WooCommerce REST API's `category` product
 * filter takes an id, not a slug.
 */
export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return getMockProductsByCategorySlug(slug);
  const category = await getCategoryBySlug(slug);
  if (!category) return [];
  return getProducts({ category: String(category.id) });
}

/** Other products sharing at least one category with `product`. */
export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return getMockRelatedProducts(product, limit);
  const results = await Promise.all(product.categories.map((category) => getProducts({ category: String(category.id) })));
  const seen = new Map<number, Product>();
  for (const list of results) {
    for (const candidate of list) {
      if (candidate.id !== product.id) seen.set(candidate.id, candidate);
    }
  }
  return Array.from(seen.values()).slice(0, limit);
}

/**
 * Homepage "featured" rail — prefers products explicitly marked `featured`
 * in WooCommerce; if the merchant hasn't flagged any yet, falls back to the
 * most recent products so the section is never empty on a small catalog.
 */
export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return mockProducts.slice(0, limit);
  const featured = await getProducts({ featured: true, perPage: limit });
  if (featured.length > 0) return featured;
  return getProducts({ perPage: limit });
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim().replace(/\s+/g, " ");
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) return { firstName: trimmed, lastName: "" };
  return { firstName: trimmed.slice(0, spaceIndex), lastName: trimmed.slice(spaceIndex + 1) };
}

/**
 * Creates a real WooCommerce order — appears immediately in WordPress →
 * WooCommerce → Orders. Cash-on-delivery is the only payment method wired
 * up (matches how BADYSS actually takes orders today, see BuyNowCheckout's
 * WhatsApp handoff); there is no mock fallback here on purpose — a "fake"
 * successful order would mislead a paying customer, so this throws if no
 * live WooCommerce connection exists rather than pretending to succeed.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  if (!isWooCommerceConfigured()) {
    throw new Error("Order creation requires a live WooCommerce connection.");
  }
  const { firstName, lastName } = splitName(input.customer.fullName);
  const address: WooCommerceAddress = {
    first_name: firstName,
    last_name: lastName || firstName,
    address_1: input.customer.address,
    city: input.customer.city,
    country: "MA",
    phone: input.customer.phone,
    email: input.customer.email || undefined,
  };

  const payload: WooCommerceCreateOrderPayload = {
    payment_method: "cod",
    payment_method_title: "Paiement à la livraison",
    set_paid: false,
    status: "processing",
    billing: address,
    shipping: address,
    line_items: input.items.map((item) => {
      // Explicit total — the customer's already-discounted unit price times
      // quantity — rather than letting WooCommerce fall back to the
      // variation's own current price. Necessary both to honor the
      // quantity discount (never applied server-side) and because some
      // variations in this catalog have no price set at all, which
      // WooCommerce would otherwise silently total as 0.00.
      const lineTotal = (item.unitPrice * item.quantity).toFixed(2);
      return {
        product_id: item.productId,
        variation_id: item.variationId,
        quantity: item.quantity,
        subtotal: lineTotal,
        total: lineTotal,
      };
    }),
    customer_note: input.note,
  };

  const raw = await wooOrders.createOrder(payload);
  return mapWooCommerceOrder(raw);
}
