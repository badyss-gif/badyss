/**
 * Single source of truth for internal route paths, matching the sitemap
 * decisions in docs/BADYSS-SITE-BLUEPRINT.md (§2, Option A — legacy
 * WooCommerce URL patterns preserved for SEO continuity).
 */
export const routes = {
  home: "/",
  shop: "/shop",
  product: (slug: string) => `/product/${slug}`,
  // Single-product "Acheter maintenant" checkout — deliberately a distinct
  // path from `checkout` ("/commande", the cart-based flow) rather than a
  // query-param branch on it, since the two have genuinely different data
  // sources (one product + quantity vs. the whole cart).
  buyNow: (slug: string) => `/acheter/${slug}`,
  // Slugs verified 2026-08-08 against the live WooCommerce category list
  // (GET /wc/v3/products/categories) — this store currently has exactly
  // these 3 top-level categories, no subcategories.
  categories: {
    grandesTailles: "/product-category/grandes-tailles",
    tShirt: "/product-category/t-shirts",
    ensembles: "/product-category/ensembles",
  },
  about: "/a-propos",
  contact: "/contact",
  serviceClient: "/service-client",
  faq: "/faq",
  sizeGuide: "/guide-des-tailles",
  shipping: "/livraison",
  returns: "/retours",
  privacyPolicy: "/politique-de-confidentialite",
  terms: "/conditions-generales",
  legalNotice: "/mentions-legales",
  cookies: "/cookies",
  cart: "/panier",
  checkout: "/commande",
  wishlist: "/favoris",
} as const;
