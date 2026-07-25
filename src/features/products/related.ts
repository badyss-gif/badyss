import type { Product } from "@/types/product";

/**
 * "Complete the look" — real products only, picked from categories the
 * current product does NOT belong to (so it reads as an outfit-building
 * suggestion, not a repeat of "Vous aimerez aussi"'s same-category rail).
 * Falls back to any other product if the catalog is too small/narrow to
 * fill the limit with genuine cross-category matches.
 */
export function getCompleteTheLookProducts(product: Product, allProducts: Product[], limit = 3): Product[] {
  const ownCategoryIds = new Set(product.categories.map((category) => category.id));

  const crossCategory = allProducts.filter(
    (candidate) =>
      candidate.id !== product.id && candidate.categories.every((category) => !ownCategoryIds.has(category.id))
  );

  if (crossCategory.length >= limit) return crossCategory.slice(0, limit);

  const seen = new Set(crossCategory.map((item) => item.id));
  const fallback = allProducts.filter((candidate) => candidate.id !== product.id && !seen.has(candidate.id));

  return [...crossCategory, ...fallback].slice(0, limit);
}
