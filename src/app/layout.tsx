import type { Metadata } from "next";
import { Archivo, Inter, Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { publicEnv } from "@/config/env";
import { siteConfig } from "@/config/site";
import { isRtl } from "@/i18n/config";
import { getOrganizationJsonLd } from "@/lib/seo/organization-schema";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { WhatsAppSupportBubble } from "@/components/layout/WhatsAppSupportBubble";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CartProvider } from "@/features/cart/CartContext";
import { WishlistProvider } from "@/features/wishlist/WishlistContext";
import { getProducts } from "@/lib/api";
import "./globals.css";

// Typography direction (Phase 1, PROPOSED): Archivo for bold editorial
// display headlines (urban, confident, condensed-adjacent grotesk), Inter
// for body/UI (highly legible at small sizes — nav, prices, product names).
// Both via next/font/google: self-hosted, zero layout-shift, correctly
// licensed. latin-ext included for French diacritics (é, è, à, ç…).
const displayFont = Archivo({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
});

// Latin-only fonts above render Arabic as tofu/fallback-system-font — this
// covers both body and display usage when Arabic is selected (see the
// `html[lang="ar"]` override in globals.css, which repoints --font-body/
// --font-display at this instead of touching every component).
const arabicFont = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700", "800"],
});

// Description/OG image intentionally omitted: no verified brand copy or
// creative visuals exist yet (pending Phase 1 creative direction / Phase 6
// AI visuals). Do not fill these with placeholder marketing text.
// Canonical URLs: metadataBase below anchors relative canonical/OG URLs;
// individual routes can override via their own `alternates.canonical`.
export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.siteUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  openGraph: {
    siteName: siteConfig.name,
    locale: "fr_MA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = getOrganizationJsonLd();
  // Fetched once here (not per-page) so the header search overlay has a
  // searchable index on every route. Cheap today (in-memory mock array);
  // once real WooCommerce credentials exist, `getProducts()` is already
  // ISR-cached (see lib/woocommerce/client.ts), so this stays inexpensive.
  const products = await getProducts();
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      dir={isRtl(locale) ? "rtl" : "ltr"}
      className={`${displayFont.variable} ${bodyFont.variable} ${arabicFont.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <SmoothScroll />
        <script
          type="application/ld+json"
          // Safe: organizationJsonLd is built entirely from static, internal
          // siteConfig values — no user input flows into this JSON.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <WishlistProvider>
              <TopBar />
              <Header products={products} />
              <main className="flex-1">{children}</main>
              <Footer />
              <WelcomePopup />
              <WhatsAppButton />
              <WhatsAppSupportBubble />
            </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
