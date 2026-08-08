// Real, per-product/per-variation quantity offers from the BADYSS
// WooCommerce Offers plugin's `badyss_offer` REST field (see
// src/lib/woocommerce/transform.ts for how the wire shape maps to
// `BadyssOffer`). Replaces the previous hardcoded `lib/pricing.ts`, which
// applied the same -10%/-20% discount to every product regardless of what
// was actually configured in WooCommerce.
//
// Deliberately framework-agnostic (no `useTranslations()` here) — callers
// already have their own translator in scope and format the final string
// themselves, the same way they already did with the old pricing module.
import type { BadyssOffer, BadyssOfferTier } from "@/types/product";

/**
 * The tier (if any) that applies at this exact quantity. `null` whenever
 * BADYSS pricing must NOT apply — offer disabled/absent, or this specific
 * quantity has no enabled tier (including any quantity above
 * `offer.maxQuantity`) — callers must fall back to normal per-unit pricing.
 */
export function getBadyssTier(offer: BadyssOffer | undefined, quantity: number): BadyssOfferTier | null {
  if (!offer?.enabled) return null;
  return offer.tiers.find((tier) => tier.quantity === quantity) ?? null;
}

/**
 * The real per-unit price WooCommerce will charge for this quantity —
 * already computed by the backend (`unit_price`, or `price` for the
 * quantity-1 shape) — or `basePrice` unchanged when no tier applies.
 */
export function getEffectiveUnitPrice(basePrice: number, offer: BadyssOffer | undefined, quantity: number): number {
  const tier = getBadyssTier(offer, quantity);
  if (!tier) return basePrice;
  if (typeof tier.unit_price === "number") return tier.unit_price;
  if (typeof tier.price === "number") return tier.price; // quantity-1 shape, or any fixed-mode tier without unit_price.
  return basePrice;
}

export interface BadyssSavings {
  /** Percentage mode: the configured discount, e.g. 20 for "-20%". */
  percent?: number;
  /** Fixed mode: the absolute amount saved vs. the original total. */
  amount?: number;
}

/**
 * How much this quantity's tier saves, in whichever shape actually applies
 * — a caller renders `percent` as "-20%" text, `amount` as a formatted
 * currency saving, or shows nothing when this returns `null`.
 */
export function getBadyssSavings(offer: BadyssOffer | undefined, quantity: number): BadyssSavings | null {
  const tier = getBadyssTier(offer, quantity);
  if (!tier) return null;

  if (typeof tier.discount === "number" && tier.discount > 0) {
    return { percent: tier.discount };
  }

  if (typeof tier.original_price === "number" && typeof tier.final_price === "number") {
    const amount = tier.original_price - tier.final_price;
    if (amount > 0) return { amount };
  }

  return null;
}

/**
 * Whether the ">5 articles" WhatsApp call-to-action should show for this
 * offer at this quantity — true once the shopper has typed/selected more
 * than the highest tier this product supports, as long as the offer (and
 * therefore its WhatsApp contact) is actually active for this product.
 */
export function shouldShowMoreThanMaxCta(offer: BadyssOffer | undefined, quantity: number): boolean {
  if (!offer?.moreThanMax.enabled) return false;
  return quantity > offer.maxQuantity;
}
