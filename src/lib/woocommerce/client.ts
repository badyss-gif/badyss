import "server-only";
import { requireWordPressUrl, requireWooCommerceCredentials } from "@/config/server-env";

const WC_API_BASE = "/wp-json/wc/v3";

interface WooCommerceRequestOptions {
  searchParams?: Record<string, string | number | boolean | undefined>;
  /** Next.js ISR revalidation window in seconds, or `false` to opt out of caching. */
  revalidate?: number | false;
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
}

/**
 * Low-level WooCommerce REST API request. Uses HTTP Basic Auth (recommended
 * by WooCommerce for server-to-server calls over HTTPS) rather than query-string
 * keys, so credentials never end up in logs or cached URLs.
 */
export async function wooCommerceFetch<T>(
  endpoint: string,
  options: WooCommerceRequestOptions = {}
): Promise<T> {
  const baseUrl = requireWordPressUrl();
  const { consumerKey, consumerSecret } = requireWooCommerceCredentials();

  const url = new URL(`${WC_API_BASE}${endpoint}`, baseUrl);
  if (options.searchParams) {
    for (const [key, value] of Object.entries(options.searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")}`;
  const method = options.method ?? "GET";
  // Mutations must never be cached/ISR'd — only GET requests opt into `next.revalidate`.
  const cacheOptions = method === "GET" ? { next: { revalidate: options.revalidate ?? 3600 } } : { cache: "no-store" as const };

  const response = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: authHeader,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    ...cacheOptions,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `WooCommerce API request failed: ${response.status} ${response.statusText} (${endpoint})${detail ? ` — ${detail}` : ""}`
    );
  }

  return response.json() as Promise<T>;
}
