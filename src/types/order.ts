// Based on the official WooCommerce REST API v3 Order schema:
// https://woocommerce.github.io/woocommerce-rest-api-docs/#orders

export interface OrderLineItem {
  productId: number;
  variationId?: number;
  name: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: number;
  /** Human-facing order reference (WooCommerce order number, usually === id but can differ with sequential-order-number plugins). */
  number: string;
  status: string;
  currency: string;
  total: string;
  dateCreated: string;
  lineItems: OrderLineItem[];
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  email?: string;
}

export interface OrderLineItemInput {
  productId: number;
  variationId?: number;
  quantity: number;
  /**
   * Per-unit price the customer actually saw and agreed to — already
   * includes any quantity discount (see `getDiscountedUnitPrice` in
   * lib/pricing.ts). Required so `createOrder` can send an explicit line
   * item total to WooCommerce instead of letting it fall back to the
   * variation's own (undiscounted, and on this catalog sometimes unset)
   * price — see the "0.00 MAD order" incident this fixed.
   */
  unitPrice: number;
}

export interface CreateOrderInput {
  customer: OrderCustomerInfo;
  items: OrderLineItemInput[];
  note?: string;
}
