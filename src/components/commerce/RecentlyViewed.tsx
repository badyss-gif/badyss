"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ProductCard } from "./ProductCard";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { useRecentlyViewedIds } from "@/features/products/useRecentlyViewed";
import type { Product } from "@/types/product";

interface RecentlyViewedProps {
  allProducts: Product[];
  currentProductId: number;
}

// Renders nothing until there's real browsing history to show — never
// backfilled with arbitrary products to avoid an empty section, since that
// would misrepresent what the shopper actually looked at.
export function RecentlyViewed({ allProducts, currentProductId }: RecentlyViewedProps) {
  const viewedIds = useRecentlyViewedIds();
  const t = useTranslations("product");

  const products = useMemo(() => {
    const byId = new Map(allProducts.map((product) => [product.id, product]));
    return viewedIds
      .filter((id) => id !== currentProductId)
      .map((id) => byId.get(id))
      .filter((product): product is Product => Boolean(product))
      .slice(0, 4);
  }, [allProducts, viewedIds, currentProductId]);

  if (products.length === 0) return null;

  return (
    <Section spacing="editorial" className="border-t border-border">
      <Reveal>
        <h2 className="font-display text-display-sm font-extrabold tracking-tight">{t("recentlyViewed")}</h2>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
        {products.map((product, index) => (
          <Reveal key={product.id} delay={index * 0.05}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
