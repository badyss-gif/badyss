import { describe, expect, it } from "vitest";
import { filterProductsByCategorySlug, sortProducts } from "./sort";
import type { Product } from "@/types/product";

function makeProduct(overrides: Partial<Product>): Product {
  return {
    id: 1,
    slug: "product",
    name: "Product",
    description: "",
    shortDescription: "",
    price: { amount: 100, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: [],
    attributes: [],
    ...overrides,
  };
}

const products = [
  makeProduct({ id: 1, name: "Banana", price: { amount: 300, currency: "MAD", onSale: false } }),
  makeProduct({ id: 2, name: "Apple", price: { amount: 100, currency: "MAD", onSale: false } }),
  makeProduct({ id: 3, name: "Cherry", price: { amount: 200, currency: "MAD", onSale: false } }),
];

describe("sortProducts", () => {
  it("sorts by price ascending", () => {
    expect(sortProducts(products, "price-asc").map((p) => p.id)).toEqual([2, 3, 1]);
  });

  it("sorts by price descending", () => {
    expect(sortProducts(products, "price-desc").map((p) => p.id)).toEqual([1, 3, 2]);
  });

  it("sorts by name ascending", () => {
    expect(sortProducts(products, "name-asc").map((p) => p.name)).toEqual(["Apple", "Banana", "Cherry"]);
  });

  it("does not mutate the original array", () => {
    const copy = [...products];
    sortProducts(products, "price-asc");
    expect(products).toEqual(copy);
  });
});

describe("filterProductsByCategorySlug", () => {
  it("keeps only products in the given category", () => {
    const withCategory = [
      makeProduct({ id: 1, categories: [{ id: 1, name: "Shoes", slug: "shoes", parentId: null }] }),
      makeProduct({ id: 2, categories: [{ id: 2, name: "Pants", slug: "pants", parentId: null }] }),
    ];
    expect(filterProductsByCategorySlug(withCategory, "shoes").map((p) => p.id)).toEqual([1]);
  });
});
