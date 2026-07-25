"use client";

import { useTranslations } from "next-intl";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { cn } from "@/lib/utils";

function HeartIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className} aria-hidden>
      <path
        d="M12 20.2s-7.4-4.6-9.8-9.1C.8 8 2 4.8 5.1 4c2-.5 4 .3 5.4 2 .4.5.8 1 1.5 1s1.1-.5 1.5-1c1.4-1.7 3.4-2.5 5.4-2 3.1.8 4.3 4 2.9 7.1-2.4 4.5-9.8 9.1-9.8 9.1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface WishlistButtonProps {
  productId: number;
  productName: string;
  className?: string;
  size?: "sm" | "md";
}

// Standalone toggle, usable on a card overlay or inside the purchase panel —
// state lives in WishlistContext (localStorage), same architecture as the cart.
export function WishlistButton({ productId, productName, className, size = "md" }: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const t = useTranslations("product");
  const active = has(productId);
  const dimensions = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? t("removeFromWishlist", { name: productName }) : t("addToWishlist", { name: productName })}
      className={cn(
        "flex items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur-sm transition-transform duration-200 hover:scale-110",
        dimensions,
        className
      )}
    >
      <HeartIcon filled={active} className={cn(iconSize, active && "text-error")} />
    </button>
  );
}
