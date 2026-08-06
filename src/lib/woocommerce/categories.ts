import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceCategory } from "@/types/woocommerce";

// NOT_VERIFIED: standard WooCommerce REST API v3 contract; unconfirmed
// against the real BADYSS store's actual category tree/customizations.

// Tagged "categories" — WooCommerce has no dedicated category webhook topic,
// so the webhook route also revalidates this tag on every product event
// (a product's category assignment, or a category's `hide_empty` product
// count, can change as a side effect of a product create/update/delete).
const CATEGORIES_TAG = "categories";

export async function getCategories(): Promise<WooCommerceCategory[]> {
  return wooCommerceFetch<WooCommerceCategory[]>("/products/categories", {
    searchParams: { per_page: 100, hide_empty: true },
    tags: [CATEGORIES_TAG],
  });
}

export async function getCategoryBySlug(slug: string): Promise<WooCommerceCategory | null> {
  const categories = await wooCommerceFetch<WooCommerceCategory[]>("/products/categories", {
    searchParams: { slug },
    tags: [CATEGORIES_TAG],
  });
  return categories[0] ?? null;
}
