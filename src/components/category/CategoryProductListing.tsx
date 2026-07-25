"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuickView } from "@/components/commerce/QuickView";
import { Reveal } from "@/components/motion/Reveal";
import { sortProducts, type ProductSortKey } from "@/features/products/sort";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

// Sort + grid for a single, already-scoped category — no category filter
// (the page itself is the filter). Shares the sort vocabulary/URL-sync
// pattern with `ShopExperience` but stays a separate, simpler component
// since this context never needs a category selector.
export function CategoryProductListing({
  products,
  basePath,
  initialSort,
}: {
  products: Product[];
  basePath: string;
  initialSort: ProductSortKey;
}) {
  const router = useRouter();
  const t = useTranslations("shop");
  const sortLabels: Record<ProductSortKey, string> = {
    newest: t("sortNewest"),
    "price-asc": t("sortPriceAsc"),
    "price-desc": t("sortPriceDesc"),
    "name-asc": t("sortNameAsc"),
    "name-desc": t("sortNameDesc"),
  };
  const [sort, setSort] = useState(initialSort);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);

  function selectSort(nextSort: ProductSortKey) {
    setSort(nextSort);
    router.replace(nextSort === "newest" ? basePath : `${basePath}?sort=${nextSort}`, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <p className="text-sm text-muted-foreground">{t("productCount", { count: sorted.length })}</p>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sortLabels) as ProductSortKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => selectSort(key)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs uppercase tracking-wide transition-colors",
                sort === key
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {sortLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
          <p className="font-display text-xl font-extrabold">{t("noProductsFound")}</p>
          <p className="max-w-xs text-sm text-muted-foreground">{t("noProductsInCategory")}</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
          {sorted.map((product, index) => (
            <Reveal key={product.id} delay={Math.min(index, 8) * 0.04}>
              <ProductCard product={product} priority={index < 4} onQuickView={setQuickViewProduct} />
            </Reveal>
          ))}
        </div>
      )}

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
