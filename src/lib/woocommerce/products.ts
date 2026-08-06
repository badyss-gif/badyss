import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceProduct, WooCommerceVariation } from "@/types/woocommerce";

// VERIFIED against the live BADYSS backend 2026-08-06 — standard WooCommerce
// REST API v3 contract, confirmed via GET /wc/v3/products and
// /wc/v3/products/{id}/variations against the real store.

// Tagged "products" so the WooCommerce webhook route handler
// (`/api/webhooks/woocommerce`) can invalidate every product-derived page in
// one `revalidateTag("products")` call whenever a product is created,
// updated, or deleted in WooCommerce — see that route for the webhook side.
const PRODUCTS_TAG = "products";

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
    tags: [PRODUCTS_TAG],
  });
}

export async function getProductBySlug(slug: string): Promise<WooCommerceProduct | null> {
  const products = await wooCommerceFetch<WooCommerceProduct[]>("/products", {
    searchParams: { slug },
    tags: [PRODUCTS_TAG],
  });
  return products[0] ?? null;
}

export async function getProductById(id: number): Promise<WooCommerceProduct | null> {
  return wooCommerceFetch<WooCommerceProduct>(`/products/${id}`, { tags: [PRODUCTS_TAG] }).catch(() => null);
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
    tags: [PRODUCTS_TAG],
  });
}

/** All variations of a variable product — a separate WooCommerce endpoint, not embedded in the product payload (only variation IDs are). */
export async function getProductVariations(productId: number): Promise<WooCommerceVariation[]> {
  return wooCommerceFetch<WooCommerceVariation[]>(`/products/${productId}/variations`, {
    searchParams: { per_page: 100 },
    tags: [PRODUCTS_TAG],
  });
}
