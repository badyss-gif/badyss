import type {
  WooCommerceCategory,
  WooCommerceCategoryRef,
  WooCommerceImage,
  WooCommerceProduct,
  WooCommerceStockStatus,
} from "@/types/woocommerce";
import type { Product, ProductCategory, ProductImage, StockStatus } from "@/types/product";

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

export function mapWooCommerceProduct(raw: WooCommerceProduct): Product {
  const regularAmount = parseFloat(raw.regular_price || raw.price);
  const amount = parseFloat(raw.price);

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    shortDescription: raw.short_description,
    price: {
      amount,
      currency: "MAD",
      onSale: raw.on_sale,
      regularAmount: raw.on_sale ? regularAmount : undefined,
    },
    stock: { status: mapStockStatus(raw.stock_status) },
    images: raw.images.map(mapImage),
    categories: raw.categories.map(mapCategoryRef),
    attributes: raw.attributes.map((attribute) => ({
      name: attribute.name,
      options: attribute.options,
      usedForVariations: attribute.variation,
    })),
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
