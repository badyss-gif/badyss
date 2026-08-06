import type { Product, ProductCategory } from "@/types/product";

/**
 * MOCK DATA — clearly labeled below, not real BADYSS catalog data. Powers
 * the Shop/category/product pages until real WooCommerce credentials exist
 * (see `src/lib/api/index.ts`, which prefers the real API and falls back to
 * this module automatically). Every product name is suffixed
 * "(produit d'exemple)" so it's unmistakable, and every product has
 * `images: []` — deliberately never a real or campaign photo attached, since
 * `ProductImage`'s empty-state placeholder is the honest way to show "photo
 * pending" (see that component's own comment). Categories/slugs match the
 * real, verified WooCommerce taxonomy from docs/BADYSS-SITE-BLUEPRINT.md §2.
 */
export const mockCategories: ProductCategory[] = [
  { id: 1, name: "Grandes tailles", slug: "grandes-tailles", parentId: null },
  { id: 2, name: "T-shirt", slug: "t-shirt", parentId: null },
  { id: 3, name: "Ensembles grande taille", slug: "ensembles-grande-taille", parentId: null },
  { id: 4, name: "Chaussures", slug: "chaussures", parentId: 1 },
  { id: 5, name: "Pantalon", slug: "pantalon", parentId: 1 },
  { id: 6, name: "Pantalons grande taille", slug: "pantalons-grande-taille", parentId: 1 },
  { id: 7, name: "T-shirt grande taille", slug: "tshirt-grande-taille", parentId: 1 },
];

function categoriesFor(...slugs: string[]): ProductCategory[] {
  return slugs.map((slug) => {
    const category = mockCategories.find((candidate) => candidate.slug === slug);
    if (!category) throw new Error(`Unknown mock category slug: ${slug}`);
    return category;
  });
}

const rawMockProducts: Array<Omit<Product, "sku" | "type" | "featured">> = [
  {
    id: 1,
    slug: "ensemble-sport-exemple",
    name: "Ensemble Sport (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 249, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("ensembles-grande-taille"),
    attributes: [{ name: "Taille", options: ["S", "M", "L", "XL"], usedForVariations: true }],
  },
  {
    id: 2,
    slug: "t-shirt-essential-exemple",
    name: "T-Shirt Essential (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 149, currency: "MAD", onSale: true, regularAmount: 199 },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("t-shirt"),
    attributes: [{ name: "Couleur", options: ["Noir", "Blanc"], usedForVariations: true }],
  },
  {
    id: 3,
    slug: "pantalon-cargo-exemple",
    name: "Pantalon Cargo (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 279, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("pantalon"),
    attributes: [{ name: "Taille", options: ["38", "40", "42", "44"], usedForVariations: true }],
  },
  {
    id: 4,
    slug: "sneakers-urbain-exemple",
    name: "Sneakers Urbain (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 349, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("chaussures"),
    attributes: [{ name: "Taille", options: ["40", "41", "42", "43"], usedForVariations: true }],
  },
  {
    id: 5,
    slug: "t-shirt-oversize-grande-taille-exemple",
    name: "T-Shirt Oversize Grande Taille (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 169, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("tshirt-grande-taille", "grandes-tailles"),
    attributes: [
      { name: "Taille", options: ["XL", "XXL", "3XL", "4XL"], usedForVariations: true },
      { name: "Couleur", options: ["Anthracite", "Sable"], usedForVariations: true },
    ],
  },
  {
    id: 6,
    slug: "pantalon-cargo-grande-taille-exemple",
    name: "Pantalon Cargo Grande Taille (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 299, currency: "MAD", onSale: true, regularAmount: 349 },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("pantalons-grande-taille", "grandes-tailles"),
    attributes: [{ name: "Taille", options: ["XL", "XXL", "3XL"], usedForVariations: true }],
  },
  {
    id: 7,
    slug: "ensemble-streetwear-grande-taille-exemple",
    name: "Ensemble Streetwear Grande Taille (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 389, currency: "MAD", onSale: false },
    stock: { status: "backorder" },
    images: [],
    categories: categoriesFor("ensembles-grande-taille", "grandes-tailles"),
    attributes: [{ name: "Taille", options: ["XL", "XXL", "3XL", "4XL"], usedForVariations: true }],
  },
  {
    id: 8,
    slug: "t-shirt-col-rond-exemple",
    name: "T-Shirt Col Rond (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 129, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("t-shirt"),
    attributes: [{ name: "Couleur", options: ["Noir", "Blanc", "Kaki"], usedForVariations: true }],
  },
  {
    id: 9,
    slug: "t-shirt-raye-exemple",
    name: "T-Shirt Rayé (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 139, currency: "MAD", onSale: true, regularAmount: 179 },
    stock: { status: "out-of-stock" },
    images: [],
    categories: categoriesFor("t-shirt"),
    attributes: [{ name: "Taille", options: ["S", "M", "L"], usedForVariations: true }],
  },
  {
    id: 10,
    slug: "ensemble-jogging-premium-exemple",
    name: "Ensemble Jogging Premium (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 419, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("ensembles-grande-taille"),
    attributes: [{ name: "Taille", options: ["M", "L", "XL"], usedForVariations: true }],
  },
  {
    id: 11,
    slug: "pantalon-chino-exemple",
    name: "Pantalon Chino (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 259, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("pantalon"),
    attributes: [{ name: "Taille", options: ["38", "40", "42"], usedForVariations: true }],
  },
  {
    id: 12,
    slug: "sneakers-basses-cuir-exemple",
    name: "Sneakers Basses Cuir (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 449, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("chaussures"),
    attributes: [{ name: "Taille", options: ["41", "42", "43", "44"], usedForVariations: true }],
  },
  {
    id: 13,
    slug: "veste-legere-grande-taille-exemple",
    name: "Veste Légère Grande Taille (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 379, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("grandes-tailles"),
    attributes: [{ name: "Taille", options: ["XL", "XXL", "3XL"], usedForVariations: true }],
  },
  {
    id: 14,
    slug: "short-cargo-exemple",
    name: "Short Cargo (produit d'exemple)",
    description: "",
    shortDescription: "",
    price: { amount: 189, currency: "MAD", onSale: false },
    stock: { status: "in-stock" },
    images: [],
    categories: categoriesFor("pantalon"),
    attributes: [{ name: "Taille", options: ["38", "40", "42"], usedForVariations: true }],
  },
];

export const mockProducts: Product[] = rawMockProducts.map((product) => ({
  ...product,
  sku: "",
  type: "simple",
  featured: false,
}));

/** Kept for existing homepage sections that ask for a small curated slice. */
export const mockFeaturedProducts: Product[] = mockProducts.slice(0, 4);

function descendantCategoryIds(categoryId: number): Set<number> {
  const ids = new Set([categoryId]);
  let addedMore = true;
  while (addedMore) {
    addedMore = false;
    for (const category of mockCategories) {
      if (category.parentId !== null && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        addedMore = true;
      }
    }
  }
  return ids;
}

/** A category page shows its own products plus every nested subcategory's — e.g. "Grandes tailles" also surfaces "Chaussures"/"Pantalon" products. */
export function getMockProductsByCategorySlug(slug: string): Product[] {
  const category = mockCategories.find((candidate) => candidate.slug === slug);
  if (!category) return [];
  const ids = descendantCategoryIds(category.id);
  return mockProducts.filter((product) => product.categories.some((productCategory) => ids.has(productCategory.id)));
}

export function getMockProductBySlug(slug: string): Product | null {
  return mockProducts.find((product) => product.slug === slug) ?? null;
}

export function searchMockProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return mockProducts.filter((product) => product.name.toLowerCase().includes(normalized));
}

export function getMockCategoryBySlug(slug: string): ProductCategory | null {
  return mockCategories.find((category) => category.slug === slug) ?? null;
}

export function getMockRelatedProducts(product: Product, limit = 4): Product[] {
  const categoryIds = new Set(product.categories.map((category) => category.id));
  return mockProducts
    .filter(
      (candidate) =>
        candidate.id !== product.id && candidate.categories.some((category) => categoryIds.has(category.id))
    )
    .slice(0, limit);
}
