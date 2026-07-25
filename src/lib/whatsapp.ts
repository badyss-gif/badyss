import { publicEnv } from "@/config/env";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/config";

// Only the globally-visible floating WhatsApp button/bubble are locale-aware
// (they're part of the translated site chrome). The Contact/Service client
// pages call this with no locale and get the French default, matching those
// pages' own content, which stays French-only this phase.
const SUPPORT_MESSAGES: Record<Locale, string> = {
  fr: "Bonjour BADYSS, j'aimerais avoir plus d'informations sur vos produits.",
  en: "Hello BADYSS, I'd like more information about your products.",
  ar: "مرحباً BADYSS، أود الحصول على مزيد من المعلومات حول منتجاتكم.",
};

/**
 * The one BADYSS support WhatsApp link, pre-filled with a real opening
 * message — used everywhere a customer starts a support chat (floating
 * button, Contact page, Service client page). Returns null when no real
 * number is configured (never a fabricated link — see config/env.ts).
 * Distinct from SocialShare's WhatsApp share intent, which has no BADYSS
 * number and no pre-filled support message (it's for sharing a product to
 * whichever contact the shopper picks, not for contacting BADYSS).
 */
export function getWhatsAppSupportUrl(locale: Locale = "fr"): string | null {
  if (!publicEnv.whatsappNumber) return null;
  // wa.me takes digits only, no spaces/dashes/plus — publicEnv.whatsappNumber
  // is already stored that way (see .env.local), so no stripping needed here.
  return `https://wa.me/${publicEnv.whatsappNumber}?text=${encodeURIComponent(SUPPORT_MESSAGES[locale])}`;
}

export interface WhatsAppOrderDetails {
  reference: string;
  productName: string;
  attributes?: Record<string, string>;
  quantity: number;
  totalPrice: number;
  currency: string;
  customerName: string;
  phone: string;
  address: string;
  city: string;
}

/**
 * The "Buy Now" order-handoff link — see BuyNowCheckout.tsx. No real order
 * backend exists (same standing limitation as CheckoutClient's cart-based
 * checkout), so this is the actual, working mechanism that gets a submitted
 * order in front of a real person: a `wa.me` deep link pre-filled with every
 * detail the customer just entered, rendered as a genuine `<a>` the
 * customer clicks themselves (never auto-opened — a scripted `window.open`
 * after any async delay is unreliably popup-blocked; a real anchor click
 * never is). Returns null when no real number is configured, same
 * null-safety contract as `getWhatsAppSupportUrl` — the caller falls back to
 * the plain phone number, never a fabricated link.
 */
export function getWhatsAppOrderUrl(order: WhatsAppOrderDetails): string | null {
  if (!publicEnv.whatsappNumber) return null;

  const attributesLine =
    order.attributes && Object.keys(order.attributes).length > 0
      ? ` (${Object.entries(order.attributes)
          .map(([name, value]) => `${name}: ${value}`)
          .join(", ")})`
      : "";

  const message = [
    `Nouvelle commande BADYSS — Réf. ${order.reference}`,
    "",
    `Produit : ${order.productName}${attributesLine}`,
    `Quantité : ${order.quantity}`,
    `Total : ${formatPrice(order.totalPrice, order.currency)}`,
    "",
    `Client : ${order.customerName}`,
    `Téléphone : ${order.phone}`,
    `Adresse : ${order.address}, ${order.city}`,
  ].join("\n");

  return `https://wa.me/${publicEnv.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
