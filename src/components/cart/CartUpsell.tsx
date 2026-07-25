"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductImage } from "@/components/commerce/ProductImage";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import type { Product } from "@/types/product";

interface CartUpsellProps {
  products: Product[];
  excludeProductIds: number[];
  limit?: number;
}

// Links to the product page rather than a one-click "quick add" — most
// products require a real size/color choice (see AddToCartPanel), and
// silently picking one for the shopper would misrepresent what they
// actually ordered. This still surfaces real cross-sell products, just
// without a fabricated instant-add shortcut.
export function CartUpsell({ products, excludeProductIds, limit = 3 }: CartUpsellProps) {
  const t = useTranslations("product");
  const suggestions = products.filter((product) => !excludeProductIds.includes(product.id)).slice(0, limit);

  if (suggestions.length === 0) return null;

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("youMayAlsoLike")}</p>
      <div className="mt-3 flex gap-3 overflow-x-auto scrollbar-hidden">
        {suggestions.map((product) => (
          <Link
            key={product.id}
            href={routes.product(product.slug)}
            className="group w-28 shrink-0"
          >
            <ProductImage
              image={product.images[0] ?? null}
              className="transition-transform duration-300 group-hover:scale-[1.04]"
            />
            <p className="mt-2 line-clamp-2 text-xs text-foreground">{product.name}</p>
            <p className="text-xs text-muted-foreground">{formatPrice(product.price.amount, product.price.currency)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
