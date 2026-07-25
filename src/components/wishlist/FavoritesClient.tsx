"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/commerce/ProductCard";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { useWishlist } from "@/features/wishlist/WishlistContext";
import { routes } from "@/config/routes";
import type { Product } from "@/types/product";

// Wishlist state is just product IDs (see WishlistContext) — this page
// re-derives display data from the same product catalog every other page
// uses, so there's only ever one source of truth for product data.
export function FavoritesClient({ products }: { products: Product[] }) {
  const { ids } = useWishlist();
  const t = useTranslations("wishlist");
  const tCart = useTranslations("cart");
  const favorites = useMemo(() => products.filter((product) => ids.includes(product.id)), [products, ids]);

  if (favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="font-display text-2xl font-extrabold">{t("empty")}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{t("emptyDesc")}</p>
        <LinkButton href={routes.shop}>{tCart("viewShop")}</LinkButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
      {favorites.map((product, index) => (
        <Reveal key={product.id} delay={Math.min(index, 8) * 0.04}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
