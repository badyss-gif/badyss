import type { MetadataRoute } from "next";
import { publicEnv } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // "/cart" and "/checkout" (the original placeholders here) never
      // matched a real route — the actual paths are "/panier" and
      // "/commande" (config/routes.ts). "/account" is kept as a
      // forward-looking entry: no accounts feature exists yet
      // (guest-checkout-first per docs/BADYSS-SITE-BLUEPRINT.md §2), so it
      // doesn't match anything today but costs nothing to reserve.
      disallow: ["/panier", "/commande", "/acheter", "/account", "/api", "/design-system", "/hero-experiments"],
    },
    sitemap: `${publicEnv.siteUrl}/sitemap.xml`,
  };
}
