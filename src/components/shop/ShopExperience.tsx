"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuickView } from "@/components/commerce/QuickView";
import { Reveal } from "@/components/motion/Reveal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CollectionBanner } from "./CollectionBanner";
import { filterProductsByCategorySlug, sortProducts, type ProductSortKey } from "@/features/products/sort";
import { FIXED_STACK_HEIGHT } from "@/config/layout";
import { cn } from "@/lib/utils";
import { routes } from "@/config/routes";
import type { Product, ProductCategory } from "@/types/product";

interface ShopExperienceProps {
  products: Product[];
  /** Top-level categories only — real, verified taxonomy, no invented ones. */
  categories: ProductCategory[];
  initialCategorySlug: string | null;
  initialSort: ProductSortKey;
}

const PAGE_SIZE = 8;

// The Shop's whole filter/sort/search experience: client-side over the
// already-fetched catalog (small enough today — docs/BADYSS-SITE-BLUEPRINT.md
// §6 — that a server round-trip per filter click would only add latency). URL
// stays in sync via shallow `router.replace` so the current view is always
// bookmarkable/shareable, without a full navigation on every click.
export function ShopExperience({ products, categories, initialCategorySlug, initialSort }: ShopExperienceProps) {
  const router = useRouter();
  const t = useTranslations("shop");
  const sortLabels: Record<ProductSortKey, string> = {
    newest: t("sortNewest"),
    "price-asc": t("sortPriceAsc"),
    "price-desc": t("sortPriceDesc"),
    "name-asc": t("sortNameAsc"),
    "name-desc": t("sortNameDesc"),
  };
  const [categorySlug, setCategorySlug] = useState(initialCategorySlug);
  const [sort, setSort] = useState<ProductSortKey>(initialSort);
  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const activeLabel = categorySlug
    ? (categories.find((category) => category.slug === categorySlug)?.name ?? t("heroEyebrow"))
    : t("viewAll");

  const filtered = useMemo(() => {
    let list = categorySlug ? filterProductsByCategorySlug(products, categorySlug) : products;
    if (inStockOnly) list = list.filter((product) => product.stock.status !== "out-of-stock");
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) list = list.filter((product) => product.name.toLowerCase().includes(normalizedQuery));
    return sortProducts(list, sort);
  }, [products, categorySlug, inStockOnly, query, sort]);

  // Any filter/sort/search change resets pagination back to the first page —
  // otherwise a shopper could land on an empty "page 3" of a much smaller
  // filtered result. Adjusted directly during render (React's documented
  // pattern for "state changed, reset other state" — see
  // https://react.dev/learn/you-might-not-need-an-effect), not in a
  // useEffect, which would trigger an extra cascading render.
  const filterKey = `${categorySlug ?? ""}|${inStockOnly}|${query}|${sort}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function syncUrl(nextCategory: string | null, nextSort: ProductSortKey) {
    const params = new URLSearchParams();
    if (nextCategory) params.set("categorie", nextCategory);
    if (nextSort !== "newest") params.set("sort", nextSort);
    const search = params.toString();
    router.replace(search ? `${routes.shop}?${search}` : routes.shop, { scroll: false });
  }

  function selectCategory(slug: string | null) {
    setCategorySlug(slug);
    syncUrl(slug, sort);
  }

  function selectSort(nextSort: ProductSortKey) {
    setSort(nextSort);
    syncUrl(categorySlug, nextSort);
  }

  return (
    <div>
      {/* Sticky category navigation — the primary way to move between
          collections without leaving the grid. */}
      <div
        style={{ top: FIXED_STACK_HEIGHT }}
        className="sticky z-30 -mx-4 border-b border-border bg-background/95 px-4 backdrop-blur-md sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hidden">
          <button
            type="button"
            onClick={() => selectCategory(null)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
              categorySlug === null
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {t("viewAll")}
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => selectCategory(category.slug)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                categorySlug === category.slug
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <CollectionBanner categorySlug={categorySlug} label={activeLabel} />
      </div>

      {/* Toolbar: search, sort, availability, result count. */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(event) => setInStockOnly(event.target.checked)}
              className="h-4 w-4 shrink-0 rounded border-border accent-foreground"
            />
            {t("inStockOnly")}
          </label>
          <select
            value={sort}
            onChange={(event) => selectSort(event.target.value as ProductSortKey)}
            aria-label={t("sortAria")}
            className="h-11 shrink-0 rounded-none border border-border bg-surface px-3 text-sm text-foreground"
          >
            {(Object.keys(sortLabels) as ProductSortKey[]).map((key) => (
              <option key={key} value={key}>
                {sortLabels[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{t("productCount", { count: filtered.length })}</p>

      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="font-display text-xl font-extrabold">{t("noProductsFound")}</p>
            <p className="max-w-xs text-sm text-muted-foreground">{t("noProductsFoundDesc")}</p>
            <button
              type="button"
              onClick={() => {
                selectCategory(null);
                setQuery("");
                setInStockOnly(false);
              }}
              className="text-sm font-medium underline-offset-4 hover:underline"
            >
              {t("resetFilters")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence initial={false}>
                {visible.map((product, index) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Reveal delay={Math.min(index, 8) * 0.03}>
                      <ProductCard product={product} priority={index < 4} onQuickView={setQuickViewProduct} />
                    </Reveal>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {hasMore ? (
              <div className="mt-14 flex justify-center">
                <Button variant="secondary" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
                  {t("loadMore")}
                </Button>
              </div>
            ) : null}
          </>
        )}
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </div>
  );
}
