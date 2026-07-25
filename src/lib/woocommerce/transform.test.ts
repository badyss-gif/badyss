import { describe, expect, it } from "vitest";
import { mapWooCommerceCategory, mapWooCommerceProduct } from "./transform";
import type { WooCommerceCategory, WooCommerceProduct } from "@/types/woocommerce";

// Generic hand-crafted fixtures for testing the mapping logic only —
// not real BADYSS catalog data.
const rawProduct: WooCommerceProduct = {
  id: 1,
  name: "Test Product",
  slug: "test-product",
  permalink: "https://example.test/product/test-product/",
  type: "simple",
  status: "publish",
  description: "Full description",
  short_description: "Short description",
  price: "199.00",
  regular_price: "249.00",
  sale_price: "199.00",
  on_sale: true,
  stock_status: "instock",
  categories: [{ id: 10, name: "Category A", slug: "category-a" }],
  images: [{ id: 100, src: "https://example.test/image.jpg", name: "image", alt: "Alt text" }],
  attributes: [
    { id: 1, name: "Size", position: 0, visible: true, variation: true, options: ["S", "M", "L"] },
  ],
};

describe("mapWooCommerceProduct", () => {
  it("maps price, sale state, and regular amount correctly", () => {
    const product = mapWooCommerceProduct(rawProduct);
    expect(product.price).toEqual({
      amount: 199,
      currency: "MAD",
      onSale: true,
      regularAmount: 249,
    });
  });

  it("omits regularAmount when not on sale", () => {
    const product = mapWooCommerceProduct({ ...rawProduct, on_sale: false });
    expect(product.price.regularAmount).toBeUndefined();
  });

  it("maps stock status to domain values", () => {
    expect(mapWooCommerceProduct({ ...rawProduct, stock_status: "outofstock" }).stock.status).toBe(
      "out-of-stock"
    );
    expect(mapWooCommerceProduct({ ...rawProduct, stock_status: "onbackorder" }).stock.status).toBe(
      "backorder"
    );
  });

  it("maps images and categories", () => {
    const product = mapWooCommerceProduct(rawProduct);
    expect(product.images).toEqual([{ url: "https://example.test/image.jpg", alt: "Alt text" }]);
    expect(product.categories).toEqual([
      { id: 10, name: "Category A", slug: "category-a", parentId: null },
    ]);
  });

  it("maps attributes with usedForVariations flag", () => {
    const product = mapWooCommerceProduct(rawProduct);
    expect(product.attributes).toEqual([
      { name: "Size", options: ["S", "M", "L"], usedForVariations: true },
    ]);
  });
});

describe("mapWooCommerceCategory", () => {
  const rawCategory: WooCommerceCategory = {
    id: 5,
    name: "Category A",
    slug: "category-a",
    parent: 0,
    description: "",
    image: null,
    count: 3,
  };

  it("maps a top-level category with parentId null", () => {
    expect(mapWooCommerceCategory(rawCategory)).toEqual({
      id: 5,
      name: "Category A",
      slug: "category-a",
      parentId: null,
    });
  });

  it("maps a nested category with its parent id", () => {
    expect(mapWooCommerceCategory({ ...rawCategory, parent: 2 }).parentId).toBe(2);
  });
});
