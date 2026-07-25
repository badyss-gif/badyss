"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { ProductImage } from "@/components/commerce/ProductImage";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { Portal } from "@/components/motion/Portal";
import { useRecentSearches } from "@/features/search/useRecentSearches";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

const DEBOUNCE_MS = 180;
const SELECTION_SIZE = 4;

// Same three top-level categories Header's own nav surfaces — not a
// separate, potentially-diverging list. Labels resolved via translations at
// render time (see `quickCategories` usage below).
const quickCategoryDefs = [
  { labelKey: "grandesTailles" as const, href: routes.categories.grandesTailles },
  { labelKey: "tShirts" as const, href: routes.categories.tShirt },
  { labelKey: "ensembles" as const, href: routes.categories.ensembles },
];

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const } },
};

interface SearchButtonProps {
  products: Product[];
}

/**
 * Real, client-side search over the already-fetched catalog (see the root
 * layout, which fetches `getProducts()` once and passes it down) — instant
 * today at this catalog size, and the same data source `getProducts()`
 * already uses once real WooCommerce data replaces the mock catalog. A
 * short debounce avoids re-filtering on every keystroke and doubles as an
 * honest "searching…" micro-state, since the filtering itself is otherwise
 * imperceptibly fast.
 *
 * "Sélection" (shown when the search is empty) is a curated slice of the
 * real catalog, deliberately not labeled "Tendances"/"Populaire" — no real
 * view/purchase analytics exist yet to back a genuine trending signal, and
 * labeling it that way would imply data that doesn't exist.
 */
export function SearchButton({ products }: SearchButtonProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const recentSearches = useRecentSearches();
  const t = useTranslations("common");
  const tSearch = useTranslations("search");
  const tNav = useTranslations("nav");
  const tShop = useTranslations("shop");
  const quickCategories = [
    ...quickCategoryDefs.map((def) => ({ label: tNav(def.labelKey), href: def.href })),
    { label: tShop("viewAll"), href: routes.shop },
  ];

  useScrollLock(open);

  // Single close path — resets the query alongside `open` in one state
  // update, rather than reacting to `open` becoming false in a separate
  // effect (avoids a setState-in-effect cascade for what's really one
  // user-driven event).
  function close() {
    setOpen(false);
    setQuery("");
    setDebouncedQuery("");
  }

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [query]);

  const results = useMemo(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    if (!normalized) return [];
    return products.filter((product) => product.name.toLowerCase().includes(normalized)).slice(0, 8);
  }, [products, debouncedQuery]);

  const selection = useMemo(() => products.slice(0, SELECTION_SIZE), [products]);

  const isSearching = query.trim() !== debouncedQuery.trim();
  const hasQuery = debouncedQuery.trim().length > 0;

  function runSearch(value: string) {
    setQuery(value);
    inputRef.current?.focus();
  }

  function recordAndNavigate() {
    if (debouncedQuery.trim()) recentSearches.add(debouncedQuery);
    close();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("search")}
        className="flex h-10 w-10 items-center justify-center"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
          <path d="M20 20L16.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      <Portal>
        <div
          className={cn(
            "fixed inset-0 z-[75] overflow-y-auto bg-background transition-all duration-300 ease-out",
            open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[0.98] opacity-0"
          )}
          role="dialog"
          aria-modal="true"
          aria-label={tSearch("dialogAriaLabel")}
          aria-hidden={!open}
        >
          <div className="flex h-16 items-center justify-end px-4">
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 items-center justify-center"
            >
              <span className="sr-only">{tSearch("closeSearch")}</span>
              <span aria-hidden className="text-2xl leading-none">
                ×
              </span>
            </button>
          </div>
          <div className="px-4 pb-16 pt-8 sm:px-8">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                if (debouncedQuery.trim()) recentSearches.add(debouncedQuery);
              }}
              className="mx-auto max-w-xl"
            >
              <Input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={tSearch("placeholder")}
                tabIndex={open ? 0 : -1}
              />
            </form>

            <div className="mx-auto mt-8 max-w-2xl">
              <AnimatePresence mode="wait">
                {!hasQuery ? (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-10"
                  >
                    {recentSearches.queries.length > 0 ? (
                      <div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            {tSearch("recentSearches")}
                          </p>
                          <button
                            type="button"
                            onClick={() => recentSearches.clear()}
                            className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                          >
                            {tSearch("clear")}
                          </button>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {recentSearches.queries.map((entry) => (
                            <button
                              key={entry}
                              type="button"
                              onClick={() => runSearch(entry)}
                              className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-foreground"
                            >
                              {entry}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">{tSearch("categories")}</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {quickCategories.map((category) => (
                          <Link
                            key={category.href}
                            href={category.href}
                            onClick={close}
                            className="rounded-full border border-border px-4 py-1.5 text-sm text-foreground transition-colors hover:border-foreground"
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {selection.length > 0 ? (
                      <div>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{tSearch("selection")}</p>
                        <ul className="mt-3 flex flex-col divide-y divide-border">
                          {selection.map((product) => (
                            <li key={product.id}>
                              <Link
                                href={routes.product(product.slug)}
                                onClick={close}
                                className="group flex items-center gap-4 py-4"
                              >
                                <ProductImage image={product.images[0] ?? null} className="w-16 shrink-0" />
                                <span className="flex-1">
                                  <span className="block text-sm text-foreground group-hover:underline">
                                    {product.name}
                                  </span>
                                  <span className="mt-1 block text-sm text-muted-foreground">
                                    {formatPrice(product.price.amount, product.price.currency)}
                                  </span>
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </motion.div>
                ) : isSearching ? (
                  <motion.p
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    {tSearch("searching")}
                  </motion.p>
                ) : results.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-muted-foreground"
                  >
                    {tSearch("noResultsPrefix")} {debouncedQuery}
                    {tSearch("noResultsSuffix")}
                  </motion.p>
                ) : (
                  <motion.ul
                    key="results"
                    initial="hidden"
                    animate="visible"
                    variants={listVariants}
                    className="flex flex-col divide-y divide-border"
                  >
                    {results.map((product) => (
                      <motion.li key={product.id} variants={itemVariants}>
                        <Link
                          href={routes.product(product.slug)}
                          onClick={recordAndNavigate}
                          className="group flex items-center gap-4 py-4"
                        >
                          <ProductImage image={product.images[0] ?? null} className="w-16 shrink-0" />
                          <span className="flex-1">
                            <span className="block text-sm text-foreground group-hover:underline">
                              {product.name}
                            </span>
                            <span className="mt-1 block text-sm text-muted-foreground">
                              {formatPrice(product.price.amount, product.price.currency)}
                            </span>
                          </span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </Portal>
    </>
  );
}
