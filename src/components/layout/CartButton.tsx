"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/cart/CartContext";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { Portal } from "@/components/motion/Portal";
import { ProductImage } from "@/components/commerce/ProductImage";
import { QuantityStepper } from "@/components/commerce/QuantityStepper";
import { LinkButton } from "@/components/ui/LinkButton";
import { ShippingProgressBar } from "@/components/cart/ShippingProgressBar";
import { CartUpsell } from "@/components/cart/CartUpsell";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

function itemKey(productId: number, variationId?: number) {
  return `${productId}:${variationId ?? ""}`;
}

/**
 * Real cart drawer backed by `CartContext` — quantity/remove act immediately
 * on shared state, so `/panier` and this drawer never disagree.
 */
export function CartButton({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false);
  const { cart, removeItem, updateQuantity } = useCart();
  const t = useTranslations("common");
  const tCart = useTranslations("cart");
  const tCheckout = useTranslations("checkout");

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${t("cart")} (${cart.itemCount})`}
        className="relative flex h-10 w-10 items-center justify-center"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
          <path
            d="M6 8h12l-1 12a1 1 0 01-1 1H8a1 1 0 01-1-1L6 8z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {cart.itemCount > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] text-accent-foreground">
            {cart.itemCount}
          </span>
        ) : null}
      </button>

      <Portal>
        <div
          className={cn(
            "fixed inset-0 z-[75] flex justify-end bg-black/30 backdrop-blur-sm transition-opacity duration-200",
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
          role="dialog"
          aria-modal="true"
          aria-label={t("cart")}
          aria-hidden={!open}
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "flex h-full w-full max-w-sm flex-col bg-surface transition-transform duration-300 ease-out",
              open ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="flex items-center justify-between border-b border-border p-6">
              <h2 className="font-display text-lg font-extrabold">
                {t("cart")} {cart.itemCount > 0 ? `(${cart.itemCount})` : ""}
              </h2>
              <button type="button" onClick={() => setOpen(false)} aria-label={tCart("closeDrawer")}>
                <span aria-hidden className="text-2xl leading-none">
                  ×
                </span>
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-sm text-muted-foreground">{tCart("empty")}</p>
                <LinkButton href={routes.shop} variant="secondary" onClick={() => setOpen(false)}>
                  {tCart("viewShop")}
                </LinkButton>
              </div>
            ) : (
              <>
                <div className="border-b border-border p-6">
                  <ShippingProgressBar subtotal={cart.subtotal} currency={cart.currency} />
                </div>

                <ul className="flex-1 overflow-y-auto p-6">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => (
                      <motion.li
                        key={itemKey(item.productId, item.variationId)}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 overflow-hidden py-4 first:pt-0"
                      >
                        <ProductImage image={item.image} className="w-20 shrink-0" />
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm text-foreground">{item.name}</p>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId, item.variationId)}
                              aria-label={tCart("removeItemAria", { name: item.name })}
                              className="shrink-0 text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                            >
                              {tCart("remove")}
                            </button>
                          </div>
                          {item.attributes ? (
                            <p className="text-xs text-muted-foreground">{Object.values(item.attributes).join(" · ")}</p>
                          ) : null}
                          <div className="mt-1 flex items-center justify-between">
                            <QuantityStepper
                              size="sm"
                              quantity={item.quantity}
                              onChange={(quantity) => updateQuantity(item.productId, quantity, item.variationId)}
                            />
                            <span className="text-sm text-foreground">
                              {formatPrice(item.unitPrice * item.quantity, cart.currency)}
                            </span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-border p-6">
                  <CartUpsell
                    products={products}
                    excludeProductIds={cart.items.map((item) => item.productId)}
                  />
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{tCheckout("subtotal")}</span>
                    <span className="font-medium text-foreground">
                      {formatPrice(cart.subtotal, cart.currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{tCart("shippingCalculatedAtCheckout")}</p>
                  <LinkButton href={routes.checkout} onClick={() => setOpen(false)} className="mt-4 w-full justify-center">
                    {tCart("checkoutCta")}
                  </LinkButton>
                  <Link
                    href={routes.cart}
                    onClick={() => setOpen(false)}
                    className="mt-3 block text-center text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {tCart("viewFullCart")}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </Portal>
    </>
  );
}
