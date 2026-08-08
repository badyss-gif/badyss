import type {
  WooCommerceBadyssOffer,
  WooCommerceCategory,
  WooCommerceCategoryRef,
  WooCommerceImage,
  WooCommerceOrder,
  WooCommerceProduct,
  WooCommerceStockStatus,
  WooCommerceVariation,
} from "@/types/woocommerce";
import type { BadyssOffer, Product, ProductCategory, ProductImage, ProductPrice, ProductStock, ProductVariant, StockStatus } from "@/types/product";
import type { Order } from "@/types/order";

/**
 * Used whenever a product/variation genuinely has no BADYSS offer (or the
 * response predates the plugin) — kept as one shared constant so every
 * consumer checks `.enabled` against the same shape rather than juggling
 * `undefined`. Also reused directly by src/lib/mock-data/products.ts.
 */
export const DISABLED_BADYSS_OFFER: BadyssOffer = {
  enabled: false,
  type: null,
  tiers: [],
  maxQuantity: 3,
  source: "product",
  moreThanMax: { enabled: false, whatsapp: "", url: "" },
};

function mapBadyssOffer(raw: WooCommerceBadyssOffer | undefined): BadyssOffer {
  if (!raw) return DISABLED_BADYSS_OFFER;
  return {
    enabled: raw.enabled,
    type: raw.type,
    tiers: raw.tiers.map((tier) => ({ ...tier })),
    maxQuantity: raw.max_quantity,
    source: raw.source,
    moreThanMax: { ...raw.more_than_max },
  };
}

function mapStockStatus(status: WooCommerceStockStatus): StockStatus {
  switch (status) {
    case "instock":
      return "in-stock";
    case "outofstock":
      return "out-of-stock";
    case "onbackorder":
      return "backorder";
  }
}

function mapImage(image: WooCommerceImage): ProductImage {
  return { url: image.src, alt: image.alt || image.name };
}

function mapCategoryRef(category: WooCommerceCategoryRef): ProductCategory {
  return { id: category.id, name: category.name, slug: category.slug, parentId: null };
}

/**
 * WooCommerce ships blank strings (not omitted fields) for unset prices —
 * true for variable-product parents (the real price lives on variations)
 * and for individual variations the merchant hasn't priced yet. Treat "" as
 * "not set", never as 0 — a $0 product would incorrectly look free/on-sale.
 */
function parsePrice(value: string): number | null {
  if (value === "") return null;
  const parsed = parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function mapPrice(raw: {
  price: string;
  regular_price: string;
  on_sale: boolean;
}): ProductPrice {
  const amount = parsePrice(raw.price) ?? 0;
  const regularAmount = parsePrice(raw.regular_price);
  const onSale = raw.on_sale && regularAmount !== null && regularAmount > amount;
  return {
    amount,
    currency: "MAD",
    onSale,
    regularAmount: onSale ? (regularAmount ?? undefined) : undefined,
  };
}

function mapStock(raw: {
  stock_status: WooCommerceStockStatus;
  stock_quantity: number | null;
  manage_stock: boolean;
}): ProductStock {
  return {
    status: mapStockStatus(raw.stock_status),
    quantity: raw.stock_quantity,
    manageStock: raw.manage_stock,
  };
}

export function mapWooCommerceProduct(raw: WooCommerceProduct): Product {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    shortDescription: raw.short_description,
    sku: raw.sku,
    price: mapPrice(raw),
    stock: mapStock(raw),
    images: raw.images.map(mapImage),
    categories: raw.categories.map(mapCategoryRef),
    attributes: raw.attributes.map((attribute) => ({
      name: attribute.name,
      options: attribute.options,
      usedForVariations: attribute.variation,
    })),
    type: raw.type,
    featured: raw.featured,
    badyssOffer: mapBadyssOffer(raw.badyss_offer),
  };
}

/**
 * `parentPrice`/`parentStock` are the already-mapped parent product — used
 * as a fallback whenever a variation itself has a blank price (common on
 * this store; see `parsePrice`) or doesn't manage its own stock.
 */
export function mapWooCommerceVariation(
  raw: WooCommerceVariation,
  parentPrice: ProductPrice,
  parentStock: ProductStock
): ProductVariant {
  const ownAmount = parsePrice(raw.price);
  const price: ProductPrice = ownAmount === null ? parentPrice : mapPrice(raw);
  const stock: ProductStock = raw.manage_stock ? mapStock(raw) : { ...parentStock, status: mapStockStatus(raw.stock_status) };

  return {
    id: raw.id,
    sku: raw.sku,
    attributes: Object.fromEntries(raw.attributes.map((attribute) => [attribute.name, attribute.option])),
    price,
    stock,
    image: raw.image ? mapImage(raw.image) : null,
    badyssOffer: mapBadyssOffer(raw.badyss_offer),
  };
}

export function mapWooCommerceCategory(raw: WooCommerceCategory): ProductCategory {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    parentId: raw.parent || null,
  };
}

export function mapWooCommerceOrder(raw: WooCommerceOrder): Order {
  return {
    id: raw.id,
    number: raw.number,
    status: raw.status,
    currency: raw.currency,
    total: raw.total,
    dateCreated: raw.date_created,
    lineItems: raw.line_items.map((item) => ({
      productId: item.product_id,
      variationId: item.variation_id || undefined,
      name: item.name,
      quantity: item.quantity,
      total: item.total,
    })),
  };
}
