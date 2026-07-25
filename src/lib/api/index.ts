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
import { mapWooCommerceCategory, mapWooCommerceProduct } from "@/lib/woocommerce/transform";
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
import type { Product, ProductCategory } from "@/types/product";

export { wordPressFetch } from "@/lib/wordpress/client";

export async function getProducts(params?: {
  category?: string;
  perPage?: number;
  page?: number;
}): Promise<Product[]> {
  if (!isWooCommerceConfigured()) return mockProducts;
  const raw = await wooProducts.getProducts(params);
  return raw.map(mapWooCommerceProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isWooCommerceConfigured()) return getMockProductBySlug(slug);
  const raw = await wooProducts.getProductBySlug(slug);
  return raw ? mapWooCommerceProduct(raw) : null;
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
