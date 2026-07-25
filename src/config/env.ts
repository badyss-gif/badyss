// Public, browser-safe configuration only. Never put secrets here — see server-env.ts.

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // No real BADYSS WhatsApp business number exists anywhere in this project
  // (checked: not in config/site.ts, not in any doc, not in .env.example).
  // Deliberately left unset rather than guessed — see WhatsAppButton, which
  // renders nothing at all when this is empty rather than linking to a
  // fabricated number.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};
