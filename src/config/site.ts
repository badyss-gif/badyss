import { publicEnv } from "./env";

/**
 * Central site configuration. Update values here as they become verified —
 * never invent values for fields marked null/PLACEHOLDER below.
 */
export const siteConfig = {
  name: "BADYSS", // VERIFIED — the client's own brand name
  description: null as string | null, // PLACEHOLDER — no verified brand copy yet (pending Phase 1)
  url: publicEnv.siteUrl,
  defaultLocale: "fr", // PROPOSED — matches observed site language, not yet explicitly confirmed
  currency: "MAD", // PROPOSED — matches business context (Morocco), not yet explicitly confirmed
  country: "MA", // PROPOSED
  contact: {
    // VERIFIED — provided directly by the client (2026-08-01). Primary
    // number used for every single-number "tel:" mention across the site;
    // also the main WhatsApp support line (see config/env.ts).
    phone: "0707003517",
    // VERIFIED — the client's three customer-service lines, provided
    // directly (2026-08-01). Shown together on the Contact and Service
    // client pages; `phone` above (the first entry) is what single-number
    // mentions elsewhere on the site use.
    serviceNumbers: ["0707003517", "0681060555", "0627999736"],
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61584535598750", // VERIFIED — provided directly
    instagram: "https://www.instagram.com/badyss_store?igsh=djQwamFydGE1MDZy&utm_source=qr", // VERIFIED — provided directly (2026-08-08)
    youtube: null as string | null, // NOT_VERIFIED
  },
  // VERIFIED — a real physical store, confirmed via its Google Maps listing
  // (provided directly, 5.0/10 reviews at time of writing). This supersedes
  // the earlier "100% online, no confirmed physical location" assumption
  // documented elsewhere in this project — that was NOT_FOUND at the time,
  // not a claim that the store doesn't exist. Opening hours are
  // deliberately NOT hardcoded here: the Maps listing only confirms a
  // closing time (~23:30) for the day it was checked, not a verified
  // day-by-day schedule — inventing one would risk being wrong. Link out to
  // the live Maps listing instead, which always shows current hours.
  store: {
    name: "BADYSS store",
    address: "Av. Okba Ibnou Nafii, Larache",
    city: "Larache",
    country: "Maroc",
    mapsUrl: "https://maps.app.goo.gl/idsdQ6J6UiJFe5Z68",
  },
  shipping: {
    // PLACEHOLDER — no verified free-shipping threshold exists yet. Never
    // invent one: ShippingProgressBar renders nothing until this is set to
    // a real, business-confirmed MAD amount.
    freeShippingThreshold: null as number | null,
  },
} as const;
