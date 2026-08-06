import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceProduct, WooCommerceVariation } from "@/types/woocommerce";

// VERIFIED against the live BADYSS backend 2026-08-06 — standard WooCommerce
// REST API v3 contract, confirmed via GET /wc/v3/products and
// /wc/v3/products/{id}/variations against the real store.

export async function getProducts(params?: {
  category?: string;
  perPage?: number;
  page?: number;
  featured?: boolean;
}): Promise<WooCommerceProduct[]> {
  return wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: {
      category: params?.category,
      per_page: params?.perPage ?? 24,
      page: params?.page ?? 1,
      status: "publish",
      featured: params?.featured,
    },
  });
}

export async function getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
  const products = await wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: { slug },
  });
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<WooCommerceProduct | null> {
  return wooCommerceFetch<WooCommerceProduct>(`/products/${id}`).catch(() => null);
}

export async function searchProducts(
  query: string,
  params?: { perPage?: number }
): Promise<WooCommerceProduct[]> {
  return wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: {
      search: query,
      per_page: params?.perPage ?? 24,
      status: "publish",
    },
  });
}

/** All variations of a variable product — a separate WooCommerce endpoint, not embedded in the product payload (only variation IDs are). */
export async function getProductVariations(productId: number): Promise<WooCommerceVariation[]> {
  return wooCommerceFetch<WooCommerceVariation[]>(`/products/${productId}/variations`, {
    searchParams: { per_page: 100 },
  });
}
