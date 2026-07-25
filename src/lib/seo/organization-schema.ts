import { siteConfig } from "@/config/site";

/**
 * Organization JSON-LD, built only from verified siteConfig fields.
 * Unverified fields (social links, description) are omitted rather than
 * filled with placeholders — an absent field is honest, a fake one is not.
 */
export function getOrganizationJsonLd() {
  const sameAs = Object.values(siteConfig.social).filter((url): url is string => Boolean(url));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}
