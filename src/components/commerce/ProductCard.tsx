"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  /** Omit to hide the quick-view trigger — related-product rails etc. can stay simple. */
  onQuickView?: (product: Product) => void;
}

// Product card philosophy (PROPOSED): the image is the hero — no border, no
// shadow, no card "box." Name/price sit directly below with minimal
// chrome. Color/size info is shown only when the product's own attributes
// actually contain it — nothing here is invented per-product; a generic
// name-match heuristic just decides which attribute (if any) gets a label.
// Availability is shown whenever stock isn't simply "in-stock" — a real
// commerce-usability requirement, not decorative.
// Secondary-image-on-hover only activates when a product genuinely has more
// than one real image — never fabricated (current mock products have zero
// images, so this path is architecturally ready but dormant until real
// multi-image WooCommerce data exists).
export function ProductCard({ product, priority, onQuickView }: ProductCardProps) {
  const t = useTranslations("product");
  const stockLabel: Partial<Record<Product["stock"]["status"], string>> = {
    "out-of-stock": t("outOfStock"),
    backorder: t("backorder"),
  };
  const colorAttribute = product.attributes.find((attribute) =>
    /couleur|color/i.test(attribute.name)
  );
  const secondaryImage = product.images.length > 1 ? product.images[1] : null;
  const availability = stockLabel[product.stock.status];

  return (
    <Link href={routes.product(product.slug)} className="group block">
      <div className="relative overflow-hidden">
        <ProductImage
          image={product.images[0] ?? null}
          priority={priority}
          className={`transition-transform duration-300 group-hover:scale-[1.04] ${
            availability ? "opacity-60" : ""
          }`}
        />
        {secondaryImage ? (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <ProductImage image={secondaryImage} className="absolute inset-0 h-full w-full" />
          </div>
        ) : null}
        {availability ? (
          <span className="absolute left-3 top-3 rounded-full bg-surface px-3 py-1 text-xs font-medium text-foreground">
            {availability}
          </span>
        ) : null}

        <div className="absolute right-3 top-3 opacity-100 transition-opacity duration-200 sm:opacity-0 sm:group-hover:opacity-100">
          <WishlistButton productId={product.id} productName={product.name} size="sm" />
        </div>

        {onQuickView ? (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-200 sm:group-hover:translate-y-0 sm:group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onQuickView(product);
              }}
              className="w-full rounded-full bg-surface/95 py-2.5 text-xs font-medium uppercase tracking-wide text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-surface"
            >
              {t("quickView")}
            </button>
          </div>
        ) : null}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm text-foreground">{product.name}</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className={product.price.onSale ? "text-error" : "text-foreground"}>
            {formatPrice(product.price.amount, product.price.currency)}
          </span>
          {product.price.onSale && product.price.regularAmount ? (
            <span className="text-muted-foreground line-through">
              {formatPrice(product.price.regularAmount, product.price.currency)}
            </span>
          ) : null}
        </div>
        {colorAttribute ? (
          <p className="text-xs text-muted-foreground">{colorAttribute.options.join(" · ")}</p>
        ) : null}
      </div>
    </Link>
  );
}
