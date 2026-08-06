"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/cart/CartContext";
import { ProductImage } from "@/components/commerce/ProductImage";
import { QuantityStepper } from "@/components/commerce/QuantityStepper";
import { LinkButton } from "@/components/ui/LinkButton";
import { ShippingProgressBar } from "./ShippingProgressBar";
import { CartUpsell } from "./CartUpsell";
import { formatPrice } from "@/lib/format";
import { getQuantityDiscountPercent } from "@/lib/pricing";
import { routes } from "@/config/routes";
import type { Product } from "@/types/product";

function itemKey(productId: number, variationId?: number) {
  return `${productId}:${variationId ?? ""}`;
}

export function CartPageClient({ products }: { products: Product[] }) {
  const { cart, removeItem, updateQuantity } = useCart();
  const t = useTranslations("cart");

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16 text-muted-foreground" aria-hidden>
          <path d="M6 8h12l-1 12a1 1 0 01-1 1H8a1 1 0 01-1-1L6 8z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M9 8V6a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.2" />
        </svg>
        <p className="font-display text-2xl font-extrabold">{t("empty")}</p>
        <p className="max-w-xs text-sm text-muted-foreground">{t("emptyDesc")}</p>
        <LinkButton href={routes.shop}>{t("viewShop")}</LinkButton>
      </div>
    );
  }

  return (
    <div className="grid gap-12 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px]">
      <ul className="flex flex-col divide-y divide-border">
        <AnimatePresence initial={false}>
          {cart.items.map((item) => (
            <motion.li
              key={itemKey(item.productId, item.variationId)}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ duration: 0.25 }}
              className="flex gap-5 overflow-hidden py-6 first:pt-0"
            >
              <ProductImage image={item.image} className="w-24 shrink-0 sm:w-32" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Link href={routes.product(item.slug)} className="text-foreground hover:underline">
                      {item.name}
                    </Link>
                    {item.attributes ? (
                      <p className="mt-1 text-sm text-muted-foreground">{Object.values(item.attributes).join(" · ")}</p>
                    ) : null}
                    {getQuantityDiscountPercent(item.quantity) > 0 ? (
                      <span className="mt-1 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold tracking-wide text-accent-foreground">
                        -{getQuantityDiscountPercent(item.quantity)}%
                      </span>
                    ) : null}
                  </div>
                  <span className="whitespace-nowrap text-foreground">
                    {formatPrice(item.unitPrice * item.quantity, cart.currency)}
                  </span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <QuantityStepper
                    quantity={item.quantity}
                    onChange={(quantity) => updateQuantity(item.productId, quantity, item.variationId)}
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variationId)}
                    className="text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <aside className="flex h-max flex-col gap-6 border border-border p-6 md:sticky md:top-32">
        <ShippingProgressBar subtotal={cart.subtotal} currency={cart.currency} />

        <div>
          <h2 className="font-display text-lg font-extrabold">{t("summary")}</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("subtotalWithCount", { count: cart.itemCount })}</span>
            <span className="font-medium text-foreground">{formatPrice(cart.subtotal, cart.currency)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t("shippingCalculatedAtCheckout")}</p>
          <LinkButton href={routes.checkout} size="lg" className="mt-6 w-full justify-center">
            {t("checkoutCta")}
          </LinkButton>
          <Link
            href={routes.shop}
            className="mt-4 block text-center text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t("continueShopping")}
          </Link>
        </div>

        <CartUpsell products={products} excludeProductIds={cart.items.map((item) => item.productId)} />
      </aside>
    </div>
  );
}
