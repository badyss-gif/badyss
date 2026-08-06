import "server-only";
import { wooCommerceFetch } from "./client";
import type { WooCommerceCreateOrderPayload, WooCommerceOrder } from "@/types/woocommerce";

// VERIFIED against the live BADYSS backend 2026-08-06 — standard WooCommerce
// REST API v3 Orders contract (POST /wc/v3/orders creates a real order that
// appears immediately in WordPress → WooCommerce → Orders).

export async function createOrder(payload: WooCommerceCreateOrderPayload): Promise<WooCommerceOrder> {
  return wooCommerceFetch<WooCommerceOrder>("/orders", {
    method: "POST",
    body: payload,
  });
}
