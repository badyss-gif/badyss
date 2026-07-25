"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { routes } from "@/config/routes";

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 20.2s-7.4-4.6-9.8-9.1C.8 8 2 4.8 5.1 4c2-.5 4 .3 5.4 2 .4.5.8 1 1.5 1s1.1-.5 1.5-1c1.4-1.7 3.4-2.5 5.4-2 3.1.8 4.3 4 2.9 7.1-2.4 4.5-9.8 9.1-9.8 9.1z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistHeaderButton() {
  const { ids } = useWishlist();
  const t = useTranslations("common");

  return (
    <Link
      href={routes.wishlist}
      aria-label={`${t("wishlist")} (${ids.length})`}
      className="relative flex h-10 w-10 items-center justify-center"
    >
      <HeartIcon className="h-5 w-5" />
      {ids.length > 0 ? (
        <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
          {ids.length}
        </span>
      ) : null}
    </Link>
  );
}
