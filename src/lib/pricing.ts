/**
 * Quantity-discount policy — hardcoded for now (client-confirmed rates: -10%
 * at 2, -20% at 3+), since no WooCommerce/ACF field currently carries this
 * per-product. `getQuantityDiscountPercent`/`getDiscountedUnitPrice` are the
 * only functions call sites use, so swapping this array for a per-product
 * value fetched from WordPress later won't ripple through components.
 */
export interface QuantityDiscountTier {
  quantity: number;
  discountPercent: number;
}

export const QUANTITY_DISCOUNT_TIERS: QuantityDiscountTier[] = [
  { quantity: 1, discountPercent: 0 },
  { quantity: 2, discountPercent: 10 },
  { quantity: 3, discountPercent: 20 },
];

// Quantities past the last defined tier keep that tier's rate (e.g. qty 5
// still gets the qty-3 rate) rather than dropping back to full price.
export function getQuantityDiscountPercent(quantity: number): number {
  const applicable = [...QUANTITY_DISCOUNT_TIERS]
    .reverse()
    .find((tier) => quantity >= tier.quantity);
  return applicable?.discountPercent ?? 0;
}

export function getDiscountedUnitPrice(basePrice: number, quantity: number): number {
  const percent = getQuantityDiscountPercent(quantity);
  return basePrice * (1 - percent / 100);
}
