"use client";

import { useRecordProductView } from "@/features/products/useRecentlyViewed";

/** Renders nothing — just records this product as viewed on mount, from within the (server) product page. */
export function RecordProductView({ productId }: { productId: number }) {
  useRecordProductView(productId);
  return null;
}
