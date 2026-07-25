import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    // AVIF first (smallest, best quality-per-byte on supporting browsers),
    // WebP fallback — Next.js already generates per-request, per-device
    // sized variants from the /public source masters, so the larger master
    // assets (see docs/PENDING-BUSINESS-INFO.md §4 / image upscale pass)
    // never ship to the browser at their full source resolution.
    formats: ["image/avif", "image/webp"],
  },
};

// Cookie-based locale (src/i18n/request.ts), no `/[locale]` URL routing —
// the plugin just wires that request-config module into the build.
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
