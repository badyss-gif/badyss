import "server-only";
import { z } from "zod";

// Secrets only. This module is guarded by `server-only` so any accidental
// import from a Client Component fails the build instead of leaking
// credentials into the browser bundle.

const serverEnvSchema = z.object({
  WORDPRESS_URL: z.string().url().optional(),
  WOOCOMMERCE_CONSUMER_KEY: z.string().min(1).optional(),
  WOOCOMMERCE_CONSUMER_SECRET: z.string().min(1).optional(),
  WOOCOMMERCE_WEBHOOK_SECRET: z.string().min(1).optional(),
});

const parsed = serverEnvSchema.safeParse({
  WORDPRESS_URL: process.env.WORDPRESS_URL,
  WOOCOMMERCE_CONSUMER_KEY: process.env.WOOCOMMERCE_CONSUMER_KEY,
  WOOCOMMERCE_CONSUMER_SECRET: process.env.WOOCOMMERCE_CONSUMER_SECRET,
  WOOCOMMERCE_WEBHOOK_SECRET: process.env.WOOCOMMERCE_WEBHOOK_SECRET,
});

const serverEnv = parsed.success
  ? parsed.data
  : {
      WORDPRESS_URL: undefined,
      WOOCOMMERCE_CONSUMER_KEY: undefined,
      WOOCOMMERCE_CONSUMER_SECRET: undefined,
      WOOCOMMERCE_WEBHOOK_SECRET: undefined,
    };

// These throw only when actually called (not at import/build time), so the
// app builds and runs before the backend is connected. Once WORDPRESS_URL
// and WooCommerce keys are set in .env.local, these start returning real values.

export function requireWordPressUrl(): string {
  if (!serverEnv.WORDPRESS_URL) {
    throw new Error(
      "WORDPRESS_URL is not set. Add it to .env.local before calling WordPress/WooCommerce APIs."
    );
  }
  return serverEnv.WORDPRESS_URL;
}

export function requireWooCommerceCredentials(): {
  consumerKey: string;
  consumerSecret: string;
} {
  if (!serverEnv.WOOCOMMERCE_CONSUMER_KEY || !serverEnv.WOOCOMMERCE_CONSUMER_SECRET) {
    throw new Error(
      "WooCommerce API credentials are not set. Add WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET to .env.local."
    );
  }
  return {
    consumerKey: serverEnv.WOOCOMMERCE_CONSUMER_KEY,
    consumerSecret: serverEnv.WOOCOMMERCE_CONSUMER_SECRET,
  };
}

// Non-throwing check — lets `src/lib/api` decide, per call, whether to hit
// the real WooCommerce API or fall back to the labeled mock catalog, rather
// than crashing the Shop/category/product pages outright while no backend
// is connected yet.
export function isWooCommerceConfigured(): boolean {
  return Boolean(
    serverEnv.WORDPRESS_URL && serverEnv.WOOCOMMERCE_CONSUMER_KEY && serverEnv.WOOCOMMERCE_CONSUMER_SECRET
  );
}

// Used by the `/api/webhooks/woocommerce` route handler to verify the
// `X-WC-Webhook-Signature` header WooCommerce sends on every delivery — the
// same secret must be entered when creating the webhook in WooCommerce
// (Settings → Advanced → Webhooks). Non-throwing: the route handler decides
// what to do when it's missing (reject the request) rather than crashing
// the whole app at import time.
export function getWooCommerceWebhookSecret(): string | undefined {
  return serverEnv.WOOCOMMERCE_WEBHOOK_SECRET;
}
