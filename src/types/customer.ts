// Based on the official WooCommerce/WordPress customer schema. Kept minimal —
// only fields we know WooCommerce actually provides.
export interface Customer {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}
