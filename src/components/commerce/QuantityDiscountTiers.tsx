"use client";

import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { BadyssOffer } from "@/types/product";

interface QuantityDiscountTiersProps {
  offer: BadyssOffer | undefined;
  currency: string;
  selectedQuantity: number;
  onSelect: (quantity: number) => void;
}

// Clicking a card sets the panel's quantity directly — the cards ARE the
// quantity picker's fast path, not a separate promo banner next to it.
//
// Renders real, per-product/per-variation tiers from the BADYSS
// WooCommerce Offers plugin — never a generic discount. A variable
// product's *parent* template (percentage mode, before a variation is
// selected) has discount percentages but no computed price yet, so those
// tiers are filtered out here rather than shown with a misleading amount;
// once a size is picked, `offer` is the variation's own fully-computed one.
export function QuantityDiscountTiers({ offer, currency, selectedQuantity, onSelect }: QuantityDiscountTiersProps) {
  const t = useTranslations("product");

  if (!offer?.enabled) return null;

  const displayableTiers = offer.tiers.filter(
    (tier) => typeof tier.final_price === "number" || typeof tier.price === "number"
  );
  if (displayableTiers.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-medium text-foreground">{t("quantityDiscountHeading")}</p>
      <div className="mt-2 grid grid-cols-3 gap-2.5">
        {displayableTiers.map((tier) => {
          const total = tier.final_price ?? tier.price ?? 0;
          const hasOriginal = typeof tier.original_price === "number" && tier.original_price > total;
          const isActive = selectedQuantity === tier.quantity;

          return (
            <button
              key={tier.quantity}
              type="button"
              onClick={() => onSelect(tier.quantity)}
              aria-pressed={isActive}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-2xl border p-3.5 text-center transition-all duration-200",
                isActive
                  ? "border-foreground bg-foreground text-background shadow-md"
                  : "border-border hover:border-foreground/40"
              )}
            >
              {typeof tier.discount === "number" && tier.discount > 0 ? (
                <span
                  className={cn(
                    "absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
                    isActive ? "bg-background text-foreground" : "bg-accent text-accent-foreground"
                  )}
                >
                  -{tier.discount}%
                </span>
              ) : null}
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {t("quantityDiscountQty", { n: tier.quantity })}
              </span>
              <span className="font-display text-sm font-extrabold">{formatPrice(total, currency)}</span>
              {hasOriginal ? (
                <span className={cn("text-[11px] line-through", isActive ? "text-background/60" : "text-muted-foreground")}>
                  {formatPrice(tier.original_price as number, currency)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
