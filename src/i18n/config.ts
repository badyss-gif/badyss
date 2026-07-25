// Single source of truth for supported locales. French stays the default —
// the live catalog/legal content only genuinely exists in French today (see
// PROJECT_STATUS.md); English/Arabic cover the translated site chrome
// (header, nav, footer, hero, WhatsApp) while deeper page content is a
// documented, deliberate scope limit for this phase, not an oversight.
export const locales = ["fr", "en", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const rtlLocales: readonly Locale[] = ["ar"];

export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export const localeLabels: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

// Cookie-based locale (no `/[locale]` URL routing) — the whole existing
// route tree (23 routes, mock catalog, checkout flow) stays untouched.
export const LOCALE_COOKIE = "badyss_locale";
