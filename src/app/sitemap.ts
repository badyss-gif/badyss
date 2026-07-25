import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env";
import { getProducts } from "@/lib/api";
import { routes } from "@/config/routes";

// Static marketing/content routes, all real and built. Cart/checkout are
// deliberately excluded (also disallowed in robots.ts — transactional pages,
// no SEO value). Product URLs are appended dynamically below from whatever
// the catalog currently returns (mock today, real WooCommerce once
// connected) so this never drifts from what actually exists.
const staticRoutes: string[] = [
  routes.home,
  routes.shop,
  routes.categories.grandesTailles,
  routes.categories.tShirt,
  routes.categories.ensembles,
  routes.about,
  routes.contact,
  routes.serviceClient,
  routes.faq,
  routes.sizeGuide,
  routes.shipping,
  routes.returns,
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();

  return [
    ...staticRoutes.map((url) => ({
      url: `${publicEnv.siteUrl}${url}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: url === routes.home ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${publicEnv.siteUrl}${routes.product(product.slug)}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
