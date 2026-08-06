import type { Product, ProductVariant } from "@/types/product";

/**
 * Resolves the WooCommerce variation matching a shopper's selected attribute
 * options (e.g. { Tailles: "4XL" }). Prefers an exact match; falls back to a
 * variation with no attributes set at all, which is WooCommerce's own
 * "matches any option" wildcard convention — real data on this store has at
 * least one such variation (see lib/woocommerce/transform.ts's comment).
 */
export function findVariantForSelection(
  product: Product,
  selected: Record<string, string>
): ProductVariant | undefined {
  const variants = product.variants;
  if (!variants || variants.length === 0) return undefined;

  const exact = variants.find((variant) => {
    const keys = Object.keys(variant.attributes);
    if (keys.length === 0) return false;
    return keys.every((key) => selected[key] === variant.attributes[key]);
  });
  if (exact) return exact;

  return variants.find((variant) => Object.keys(variant.attributes).length === 0);
}
