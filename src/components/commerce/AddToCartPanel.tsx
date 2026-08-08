"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Ruler } from "lucide-react";
import { useCart } from "@/features/cart/CartContext";
import { findVariantForSelection } from "@/features/products/variants";
import { QuantityStepper } from "./QuantityStepper";
import { QuantityDiscountTiers } from "./QuantityDiscountTiers";
import { WishlistButton } from "./WishlistButton";
import { SocialShare } from "./SocialShare";
import { SizeGuideDrawer } from "./SizeGuideDrawer";
import { Button } from "@/components/ui/Button";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { formatPrice } from "@/lib/format";
import { getEffectiveUnitPrice, getBadyssSavings, shouldShowMoreThanMaxCta } from "@/lib/badyss-offer";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { publicEnv } from "@/config/env";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartPanelProps {
  product: Product;
}

// Title, price, real attribute selectors (only ever from `product.attributes`
// — never invented per product), quantity, and add-to-cart, plus a mobile
// sticky bar mirroring the same state so the primary action stays reachable
// without scrolling back up.
export function AddToCartPanel({ product }: AddToCartPanelProps) {
  const { addItem } = useCart();
  const router = useRouter();
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [buyNowPending, setBuyNowPending] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const stockLabel: Partial<Record<Product["stock"]["status"], string>> = {
    "out-of-stock": t("outOfStock"),
    backorder: t("backorder"),
  };

  const purchaseInfoItems = [
    {
      question: t("shippingInfoQuestion"),
      answer: (
        <>
          {t("shippingInfoAnswer")}{" "}
          <Link href={routes.shipping} className="text-foreground underline underline-offset-2">
            {tCommon("learnMore")}
          </Link>
          .
        </>
      ),
    },
    {
      question: t("returnsInfoQuestion"),
      answer: (
        <>
          {t("returnsInfoAnswer")}{" "}
          <Link href={routes.returns} className="text-foreground underline underline-offset-2">
            {tCommon("learnMore")}
          </Link>
          .
        </>
      ),
    },
    {
      question: t("sizeGuideInfoQuestion"),
      answer: (
        <>
          {t("sizeGuideInfoAnswer")}{" "}
          <Link href={routes.sizeGuide} className="text-foreground underline underline-offset-2">
            {tCommon("learnMore")}
          </Link>
          .
        </>
      ),
    },
  ];

  const variationAttributes = product.attributes.filter((attribute) => attribute.usedForVariations);
  const sizeAttribute = variationAttributes.find((attribute) => attribute.name === "Taille" || attribute.name === "Tailles");
  const missingAttribute = variationAttributes.find((attribute) => !selected[attribute.name]);
  // Real per-variation price/stock (e.g. this size specifically) once one is
  // fully selected — falls back to the parent product's own price/stock
  // otherwise (simple products, or before a variation is fully chosen).
  const resolvedVariant = findVariantForSelection(product, selected);
  const effectivePrice = resolvedVariant?.price ?? product.price;
  const effectiveStock = resolvedVariant?.stock ?? product.stock;
  // Same fallback pattern as price/stock: a fully-selected variation's own
  // offer (its own override, or inherited from this same parent) once
  // chosen; the parent's own (template-only, for a variable product) offer
  // before that. See QuantityDiscountTiers for how the "no computed price
  // yet" template case is handled.
  const effectiveOffer = resolvedVariant?.badyssOffer ?? product.badyssOffer;
  const isOutOfStock = effectiveStock.status === "out-of-stock";
  const availability = stockLabel[effectiveStock.status];
  const isDisabled = isOutOfStock || Boolean(missingAttribute);

  function handleAddToCart() {
    if (isDisabled) return;
    addItem({
      productId: product.id,
      variationId: resolvedVariant?.id,
      slug: product.slug,
      name: product.name,
      image: resolvedVariant?.image ?? product.images[0] ?? null,
      basePrice: effectivePrice.amount,
      unitPrice: getEffectiveUnitPrice(effectivePrice.amount, effectiveOffer, quantity),
      quantity,
      attributes: Object.keys(selected).length > 0 ? selected : undefined,
      badyssOffer: effectiveOffer,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  // Skips the cart entirely — see BuyNowCheckout for why the selection
  // travels as a query string rather than through CartContext (this flow
  // has no cart dependency at all, by design).
  function handleBuyNow() {
    if (isDisabled) return;
    setBuyNowPending(true);
    const params = new URLSearchParams({ qty: String(quantity) });
    if (Object.keys(selected).length > 0) params.set("attrs", JSON.stringify(selected));
    router.push(`${routes.buyNow(product.slug)}?${params.toString()}`);
  }

  const ctaLabel = isOutOfStock ? t("outOfStock") : justAdded ? t("addedToCart") : t("addToCart");
  const ctaLabelCompact = isOutOfStock ? t("outOfStockShort") : justAdded ? t("addedShort") : t("cartShort");

  return (
    <div className="flex flex-col gap-6 pb-24 md:pb-0">
      <div>
        {product.categories[0] ? (
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{product.categories[0].name}</p>
        ) : null}
        <h1 className="mt-2 font-display text-display-sm font-extrabold leading-[1.05] tracking-tight sm:text-display-md">
          {product.name}
        </h1>
        <div className="mt-3 flex items-center gap-3 text-lg">
          <span className={effectivePrice.onSale ? "text-error" : "text-foreground"}>
            {formatPrice(effectivePrice.amount, effectivePrice.currency)}
          </span>
          {effectivePrice.onSale && effectivePrice.regularAmount ? (
            <span className="text-muted-foreground line-through">
              {formatPrice(effectivePrice.regularAmount, effectivePrice.currency)}
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
                  "rounded-full border px-4 py-2 text-sm transition-colors",
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

      {/* Standalone trigger, not nested inside the attribute loop above —
          shown on every product regardless of whether this particular one
          has a "Taille" variation attribute (several mock products only
          vary by "Couleur"), so the size guide stays reachable everywhere. */}
      <button
        type="button"
        onClick={() => setSizeGuideOpen(true)}
        aria-label={t("sizeGuideAria")}
        className="-mt-2 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        <Ruler className="h-3.5 w-3.5" aria-hidden />
        {t("sizeGuideCta")}
      </button>

      {effectiveOffer.enabled ? (
        <QuantityDiscountTiers
          offer={effectiveOffer}
          currency={effectivePrice.currency}
          selectedQuantity={quantity}
          onSelect={setQuantity}
        />
      ) : null}

      <div className="flex items-center gap-3">
        <QuantityStepper quantity={quantity} onChange={setQuantity} />
        <WishlistButton productId={product.id} productName={product.name} />
      </div>
      {missingAttribute ? (
        <p className="text-xs text-error">{t("selectOption", { attribute: missingAttribute.name })}</p>
      ) : null}
      {quantity > 1
        ? (() => {
            const savings = getBadyssSavings(effectiveOffer, quantity);
            return (
              <p className="-mt-2 text-xs text-muted-foreground">
                {t("quantityDiscountTotal", {
                  total: formatPrice(getEffectiveUnitPrice(effectivePrice.amount, effectiveOffer, quantity) * quantity, effectivePrice.currency) ?? "",
                })}
                {savings?.percent ? ` · ${t("quantityDiscountSave", { percent: savings.percent })}` : ""}
                {savings?.amount
                  ? ` · ${t("quantityDiscountSaveAmount", { amount: formatPrice(savings.amount, effectivePrice.currency) ?? "" })}`
                  : ""}
              </p>
            );
          })()
        : null}
      {shouldShowMoreThanMaxCta(effectiveOffer, quantity) ? (
        <p className="-mt-2 text-xs text-muted-foreground">
          {t("moreThanMaxCta")}{" "}
          <a
            href={effectiveOffer.moreThanMax.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2"
          >
            {t("moreThanMaxLink")}
          </a>
        </p>
      ) : null}

      {/* Buy Now is the prominent (dark/primary) action — the fastest path
          to a sale — with Add to Cart as its secondary companion, not the
          other way round. Always side-by-side (never stacked, even at
          375px) with a substantial 56px mobile height — `md:` (≥768px)
          classes below restore the original 48px desktop treatment
          unchanged, since `size="lg"` alone only ever gave 48px on every
          screen size, which read as too thin on mobile. */}
      <div className="flex flex-row gap-2 md:gap-3">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleAddToCart}
          disabled={isDisabled}
          className="h-14 flex-1 justify-center px-3 text-sm md:h-12 md:px-6 md:text-base"
        >
          {ctaLabel}
        </Button>
        <Button
          size="lg"
          onClick={handleBuyNow}
          loading={buyNowPending}
          disabled={isDisabled}
          className="h-14 flex-1 justify-center px-3 text-sm md:h-12 md:px-6 md:text-base"
        >
          {t("buyNow")}
        </Button>
      </div>

      <SocialShare
        productName={product.name}
        url={`${publicEnv.siteUrl}${routes.product(product.slug)}`}
      />

      <div className="border-t border-border pt-2">
        <FaqAccordion items={purchaseInfoItems} />
      </div>

      <p className="text-xs text-muted-foreground">
        {t("needHelp")}{" "}
        <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
          {siteConfig.contact.phone}
        </a>
        .
      </p>

      {/* Mobile sticky purchase bar — mirrors the same state above. Compact
          labels here (not the full desktop copy): price + two buttons is
          already a tight fit at 375px, and "Panier"/"Acheter" read just as
          clearly at this size. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-border bg-surface p-4 md:hidden">
        <span className="shrink-0 text-base font-medium text-foreground">
          {formatPrice(effectivePrice.amount, effectivePrice.currency)}
        </span>
        <Button variant="secondary" size="lg" onClick={handleAddToCart} disabled={isDisabled} className="flex-1 justify-center px-3">
          {ctaLabelCompact}
        </Button>
        <Button size="lg" onClick={handleBuyNow} loading={buyNowPending} disabled={isDisabled} className="flex-1 justify-center px-3">
          {t("buyShort")}
        </Button>
      </div>

      <SizeGuideDrawer
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        sizes={sizeAttribute?.options ?? []}
      />
    </div>
  );
}
