"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Portal } from "@/components/motion/Portal";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { ProductImage } from "./ProductImage";
import { QuantityStepper } from "./QuantityStepper";
import { WishlistButton } from "./WishlistButton";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/features/cart/CartContext";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface QuickViewProps {
  product: Product | null;
  onClose: () => void;
}

// A lightweight AddToCartPanel, not a duplicate of the full product page —
// same attribute-selection/add-to-cart logic, condensed into a modal so
// shoppers can buy without leaving the grid. Closing resets nothing else on
// the page (cart state lives in CartContext, unaffected by this modal's
// lifecycle).
export function QuickView({ product, onClose }: QuickViewProps) {
  const { addItem } = useCart();
  const t = useTranslations("product");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const open = product !== null;
  const stockLabel: Partial<Record<Product["stock"]["status"], string>> = {
    "out-of-stock": t("outOfStock"),
    backorder: t("backorder"),
  };

  useScrollLock(open);

  function handleClose() {
    setSelected({});
    setQuantity(1);
    setJustAdded(false);
    onClose();
  }

  if (!product) return null;

  const variationAttributes = product.attributes.filter((attribute) => attribute.usedForVariations);
  const missingAttribute = variationAttributes.find((attribute) => !selected[attribute.name]);
  const isOutOfStock = product.stock.status === "out-of-stock";
  const availability = stockLabel[product.stock.status];

  function handleAddToCart() {
    if (!product || missingAttribute || isOutOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? null,
      unitPrice: product.price.amount,
      quantity,
      attributes: Object.keys(selected).length > 0 ? selected : undefined,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  }

  const ctaLabel = isOutOfStock ? t("outOfStock") : justAdded ? t("addedShort") : t("addToCart");

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[75] flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label={t("quickViewAria", { productName: product.name })}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative grid max-h-[90vh] w-full max-w-3xl grid-cols-1 overflow-y-auto rounded-t-3xl bg-surface sm:grid-cols-2 sm:overflow-hidden sm:rounded-3xl"
            >
              <button
                type="button"
                onClick={handleClose}
                aria-label={t("closeQuickView")}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 text-foreground shadow-sm backdrop-blur-sm"
              >
                <span aria-hidden className="text-xl leading-none">
                  ×
                </span>
              </button>

              <div className="relative">
                <ProductImage image={product.images[0] ?? null} priority className="h-full w-full" />
              </div>

              <div className="flex flex-col gap-5 p-6 sm:overflow-y-auto sm:p-8">
                <div>
                  {product.categories[0] ? (
                    <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                      {product.categories[0].name}
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-display text-xl font-extrabold leading-[1.1] tracking-tight">
                    {product.name}
                  </h2>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={product.price.onSale ? "text-error" : "text-foreground"}>
                      {formatPrice(product.price.amount, product.price.currency)}
                    </span>
                    {product.price.onSale && product.price.regularAmount ? (
                      <span className="text-muted-foreground line-through">
                        {formatPrice(product.price.regularAmount, product.price.currency)}
                      </span>
                    ) : null}
                  </div>
                  {availability ? (
                    <span className="mt-3 inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      {availability}
                    </span>
                  ) : null}
                </div>

                {variationAttributes.map((attribute) => (
                  <div key={attribute.name}>
                    <p className="text-sm font-medium text-foreground">{attribute.name}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {attribute.options.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setSelected((current) => ({ ...current, [attribute.name]: option }))}
                          className={cn(
                            "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                            selected[attribute.name] === option
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-foreground hover:border-foreground"
                          )}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center gap-3">
                  <QuantityStepper quantity={quantity} onChange={setQuantity} size="sm" />
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || Boolean(missingAttribute)}
                    className="flex-1 justify-center"
                  >
                    {ctaLabel}
                  </Button>
                  <WishlistButton productId={product.id} productName={product.name} size="sm" />
                </div>
                {missingAttribute ? (
                  <p className="-mt-2 text-xs text-error">{t("selectOption", { attribute: missingAttribute.name })}</p>
                ) : null}

                <Link
                  href={routes.product(product.slug)}
                  onClick={handleClose}
                  className="mt-auto text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  {t("viewFullProduct")}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
