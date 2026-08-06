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
}

export interface CreateOrderInput {
  customer: OrderCustomerInfo;
  items: OrderLineItemInput[];
  note?: string;
}
