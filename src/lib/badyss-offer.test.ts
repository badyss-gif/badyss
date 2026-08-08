import { describe, expect, it } from "vitest";
import { getBadyssTier, getEffectiveUnitPrice, getBadyssSavings, shouldShowMoreThanMaxCta } from "./badyss-offer";
import type { BadyssOffer } from "@/types/product";

// BADYSS only ever offers quantity 2 and quantity 3 — there is no quantity
// 1 tier (buying 1 is always the normal price) and no quantity 4/5 tier.
const percentageOffer: BadyssOffer = {
  enabled: true,
  type: "percentage",
  maxQuantity: 3,
  source: "product",
  tiers: [
    { quantity: 2, discount: 10, original_price: 340, final_price: 306, unit_price: 153 },
    { quantity: 3, discount: 20, original_price: 510, final_price: 408, unit_price: 136 },
  ],
  moreThanMax: { enabled: true, whatsapp: "212707003517", url: "https://wa.me/212707003517?text=x" },
};

const fixedOffer: BadyssOffer = {
  enabled: true,
  type: "fixed",
  maxQuantity: 3,
  source: "parent",
  tiers: [
    { quantity: 2, price: 330, original_price: 380, final_price: 330, unit_price: 165 },
    { quantity: 3, price: 440, original_price: 570, final_price: 440, unit_price: 146.666667 },
  ],
  moreThanMax: { enabled: true, whatsapp: "212707003517", url: "https://wa.me/212707003517?text=x" },
};

const disabledOffer: BadyssOffer = {
  enabled: false,
  type: null,
  maxQuantity: 3,
  source: "product",
  tiers: [],
  moreThanMax: { enabled: false, whatsapp: "", url: "" },
};

describe("getBadyssTier", () => {
  it("returns the matching tier for an enabled offer", () => {
    expect(getBadyssTier(percentageOffer, 2)?.discount).toBe(10);
  });

  it("returns null for a disabled offer regardless of quantity", () => {
    expect(getBadyssTier(disabledOffer, 2)).toBeNull();
  });

  it("returns null for quantity 1 (no BADYSS tier exists for a single unit)", () => {
    expect(getBadyssTier(percentageOffer, 1)).toBeNull();
  });

  it("returns null for a quantity with no configured tier (above max)", () => {
    expect(getBadyssTier(percentageOffer, 4)).toBeNull();
  });

  it("returns null when offer is undefined", () => {
    expect(getBadyssTier(undefined, 2)).toBeNull();
  });
});

describe("getEffectiveUnitPrice", () => {
  it("quantity 1: no BADYSS tier, falls back to basePrice unchanged (normal WooCommerce price)", () => {
    expect(getEffectiveUnitPrice(170, percentageOffer, 1)).toBe(170);
  });

  it("percentage mode: qty2 uses the backend-computed unit_price (153)", () => {
    expect(getEffectiveUnitPrice(170, percentageOffer, 2)).toBe(153);
  });

  it("percentage mode: qty3 uses the backend-computed unit_price (136)", () => {
    expect(getEffectiveUnitPrice(170, percentageOffer, 3)).toBe(136);
  });

  it("fixed mode: qty3 uses the backend-computed unit_price (146.666667), not the base price", () => {
    expect(getEffectiveUnitPrice(230, fixedOffer, 3)).toBeCloseTo(146.666667, 5);
  });

  it("falls back to basePrice when no tier applies (qty above max)", () => {
    expect(getEffectiveUnitPrice(170, percentageOffer, 4)).toBe(170);
  });

  it("falls back to basePrice when the offer is disabled", () => {
    expect(getEffectiveUnitPrice(170, disabledOffer, 2)).toBe(170);
  });
});

describe("getBadyssSavings", () => {
  it("percentage mode returns the configured discount percent", () => {
    expect(getBadyssSavings(percentageOffer, 3)).toEqual({ percent: 20 });
  });

  it("fixed mode returns the absolute amount saved (380 - 330 = 50)", () => {
    expect(getBadyssSavings(fixedOffer, 2)).toEqual({ amount: 50 });
  });

  it("returns null for quantity 1 (no BADYSS tier exists for a single unit)", () => {
    expect(getBadyssSavings(percentageOffer, 1)).toBeNull();
  });

  it("returns null when no tier applies (above max)", () => {
    expect(getBadyssSavings(percentageOffer, 4)).toBeNull();
  });
});

describe("shouldShowMoreThanMaxCta", () => {
  it("is true once quantity exceeds maxQuantity (3) on an active offer", () => {
    expect(shouldShowMoreThanMaxCta(percentageOffer, 4)).toBe(true);
  });

  it("is false at or below maxQuantity", () => {
    expect(shouldShowMoreThanMaxCta(percentageOffer, 3)).toBe(false);
  });

  it("is false when more_than_max itself is disabled (e.g. no offer configured at all)", () => {
    expect(shouldShowMoreThanMaxCta(disabledOffer, 4)).toBe(false);
  });
});
