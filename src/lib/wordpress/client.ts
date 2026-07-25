import "server-only";
import { requireWordPressUrl } from "@/config/server-env";

const WP_API_BASE = "/wp-json/wp/v2";

/**
 * Low-level WordPress REST API request, for content that isn't WooCommerce
 * commerce data (pages, posts/journal, etc). Public endpoints only — no
 * credentials required for read access on a standard WP install.
 */
export async function wordPressFetch<T>(
  endpoint: string,
  searchParams?: Record<string, string | number | boolean | undefined>,
  revalidate: number | false = 3600
): Promise<T> {
  const baseUrl = requireWordPressUrl();
  const url = new URL(`${WP_API_BASE}${endpoint}`, baseUrl);

  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url.toString(), { next: { revalidate } });

  if (!response.ok) {
    throw new Error(
      `WordPress API request failed: ${response.status} ${response.statusText} (${endpoint})`
    );
  }

  return response.json() as Promise<T>;
}
