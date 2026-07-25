import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceProduct } from "@/types/woocommerce";

/**
 * NOT_VERIFIED: endpoint parameters follow the standard WooCommerce REST API
 * v3 contract. Behavior against the real BADYSS store (custom attributes,
 * taxonomies like "Grandes tailles", plugin-added fields) must be confirmed
 * once backend access is available.
 */

export async function getProducts(params?: {
  category?: string;
  perPage?: number;
  page?: number;
}): Promise<WooCommerceProduct[]> {
  return wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: {
      category: params?.category,
      per_page: params?.perPage ?? 24,
      page: params?.page ?? 1,
      status: "publish",
    },
  });
}

export async function getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
  const products = await wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: { slug },
  });
  return products[0] ?? null;
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
