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
  categories: {
    grandesTailles: "/product-category/grandes-tailles",
    tShirt: "/product-category/t-shirt",
    ensembles: "/product-category/ensembles-grande-taille",
    // Nested under Grandes Tailles, per the real WooCommerce category tree
    // (docs/BADYSS-SITE-BLUEPRINT.md §2).
    grandesTaillesChaussures: "/product-category/grandes-tailles/chaussures",
    grandesTaillesPantalon: "/product-category/grandes-tailles/pantalon",
    grandesTaillesPantalonsGrandeTaille: "/product-category/grandes-tailles/pantalons-grande-taille",
    grandesTaillesTshirtGrandeTaille: "/product-category/grandes-tailles/tshirt-grande-taille",
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
