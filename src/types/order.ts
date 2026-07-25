// Based on the official WooCommerce REST API v3 Order schema:
// https://woocommerce.github.io/woocommerce-rest-api-docs/#orders
// NOT_VERIFIED against the actual BADYSS backend yet.

export interface OrderLineItem {
  productId: number;
  name: string;
  quantity: number;
  total: string;
}

export interface Order {
  id: number;
  status: string;
  currency: string;
  total: string;
  dateCreated: string;
  lineItems: OrderLineItem[];
}
