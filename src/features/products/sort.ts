import type { Product } from "@/types/product";

// "newest" has no real backing field yet — the domain `Product` type has no
// `dateCreated` (WooCommerce's REST product schema does, but it isn't
// mapped through yet — NOT_VERIFIED whether it's needed beyond this use).
// Rather than fabricate a date, "newest" is a deliberate passthrough: catalog
// order is already the intended curation order, so "no re-sort" is the
// honest behavior until real chronological data exists.
export type ProductSortKey = "newest" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

export function sortProducts(products: Product[], sortKey: ProductSortKey): Product[] {
  const sorted = [...products];

  switch (sortKey) {
    case "newest":
      return sorted;
    case "price-asc":
      return sorted.sort((a, b) => a.price.amount - b.price.amount);
    case "price-desc":
      return sorted.sort((a, b) => b.price.amount - a.price.amount);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
  }
}

export function filterProductsByCategorySlug(products: Product[], categorySlug: string): Product[] {
  return products.filter((product) => product.categories.some((category) => category.slug === categorySlug));
}
