// Public, browser-safe configuration only. Never put secrets here — see server-env.ts.

export const publicEnv = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  // VERIFIED — the client's main WhatsApp support number, provided directly
  // (2026-08-01): NEXT_PUBLIC_WHATSAPP_NUMBER=212707003517 in .env.local.
  // WhatsAppButton still renders nothing if this var is ever unset.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
};
