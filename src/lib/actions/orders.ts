"use server";

import { createOrder } from "@/lib/api";
import { isValidMoroccanPhone } from "@/lib/validation";
import type { CreateOrderInput, OrderLineItemInput } from "@/types/order";

export interface SubmitOrderInput {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
  items: OrderLineItemInput[];
  note?: string;
}

export type SubmitOrderResult =
  | { ok: true; orderNumber: string; total: string; currency: string }
  | { ok: false; error: string };

/**
 * The one server-side entry point client components use to place a real
 * WooCommerce order — never call `@/lib/api`'s `createOrder` (which needs
 * `server-only`/WooCommerce credentials) directly from a "use client"
 * component. Re-validates everything server-side (client-side validation in
 * BuyNowCheckout/CheckoutClient is a UX nicety, not a security boundary).
 */
export async function submitOrder(input: SubmitOrderInput): Promise<SubmitOrderResult> {
  if (input.fullName.trim().length < 2) {
    return { ok: false, error: "invalid_name" };
  }
  if (!isValidMoroccanPhone(input.phone)) {
    return { ok: false, error: "invalid_phone" };
  }
  if (input.address.trim().length < 5) {
    return { ok: false, error: "invalid_address" };
  }
  if (input.city.trim().length < 2) {
    return { ok: false, error: "invalid_city" };
  }
  if (input.items.length === 0) {
    return { ok: false, error: "empty_cart" };
  }

  const payload: CreateOrderInput = {
    customer: {
      fullName: input.fullName.trim(),
      phone: input.phone.trim(),
      address: input.address.trim(),
      city: input.city.trim(),
      email: input.email?.trim() || undefined,
    },
    items: input.items,
    note: input.note,
  };

  try {
    const order = await createOrder(payload);
    return { ok: true, orderNumber: order.number, total: order.total, currency: order.currency };
  } catch (error) {
    console.error("[submitOrder] WooCommerce order creation failed:", error);
    return { ok: false, error: "server_error" };
  }
}
