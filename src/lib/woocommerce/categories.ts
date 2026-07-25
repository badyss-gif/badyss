import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceCategory } from "@/types/woocommerce";

// NOT_VERIFIED: standard WooCommerce REST API v3 contract; unconfirmed
// against the real BADYSS store's actual category tree/customizations.

export async function getCategories(): Promise<WooCommerceCategory[]> {
  return wooCommerceFetch<WooCommerceCategory[]>("/products/categories", {
    searchParams: { per_page: 100, hide_empty: true },
  });
}

export async function getCategoryBySlug(slug: string): Promise<WooCommerceCategory | null> {
  const categories = await wooCommerceFetch<WooCommerceCategory[]>("/products/categories", {
    searchParams: { slug },
  });
  return categories[0] ?? null;
}
