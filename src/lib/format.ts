/**
 * Formats a WooCommerce price string/number as MAD currency.
 * Locale/currency are technical defaults for a Morocco-based store —
 * NOT_VERIFIED against final brand/locale decisions (Phase 1).
 */
export function formatPrice(
  amount: number | string,
  currency = "MAD",
  locale = "fr-MA"
): string | null {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return null;
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
}
