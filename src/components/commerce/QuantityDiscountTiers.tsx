"use client";

import { useTranslations } from "next-intl";
import { QUANTITY_DISCOUNT_TIERS, getDiscountedUnitPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface QuantityDiscountTiersProps {
  unitPrice: number;
  currency: string;
  selectedQuantity: number;
  onSelect: (quantity: number) => void;
}

// Clicking a card sets the panel's quantity directly — the cards ARE the
// quantity picker's fast path, not a separate promo banner next to it.
export function QuantityDiscountTiers({
  unitPrice,
  currency,
  selectedQuantity,
  onSelect,
}: QuantityDiscountTiersProps) {
  const t = useTranslations("product");

  return (
    <div>
      <p className="text-sm font-medium text-foreground">{t("quantityDiscountHeading")}</p>
      <div className="mt-2 grid grid-cols-3 gap-2.5">
        {QUANTITY_DISCOUNT_TIERS.map((tier) => {
          const discountedUnit = getDiscountedUnitPrice(unitPrice, tier.quantity);
          const total = discountedUnit * tier.quantity;
          const fullTotal = unitPrice * tier.quantity;
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
              {tier.discountPercent > 0 ? (
                <span
                  className={cn(
                    "absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide",
                    isActive ? "bg-background text-foreground" : "bg-accent text-accent-foreground"
                  )}
                >
                  -{tier.discountPercent}%
                </span>
              ) : null}
              <span className="text-xs font-medium uppercase tracking-wide opacity-80">
                {t("quantityDiscountQty", { n: tier.quantity })}
              </span>
              <span className="font-display text-sm font-extrabold">{formatPrice(total, currency)}</span>
              {tier.discountPercent > 0 ? (
                <span className={cn("text-[11px] line-through", isActive ? "text-background/60" : "text-muted-foreground")}>
                  {formatPrice(fullTotal, currency)}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
