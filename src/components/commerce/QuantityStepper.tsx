"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
}

// Shared between the cart drawer, `/panier`, and the product page — a
// single source for this exact interaction rather than three near-duplicate
// implementations.
export function QuantityStepper({
  quantity,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  className,
}: QuantityStepperProps) {
  const t = useTranslations("product");
  const buttonSize = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9";

  return (
    <div className={cn("inline-flex items-center border border-border", className)}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        aria-label={t("decreaseQuantity")}
        className={cn(
          "flex items-center justify-center text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30",
          buttonSize
        )}
      >
        −
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        aria-label={t("increaseQuantity")}
        className={cn(
          "flex items-center justify-center text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-30",
          buttonSize
        )}
      >
        +
      </button>
    </div>
  );
}
