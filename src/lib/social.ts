import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/config/site";
import { publicEnv } from "@/config/env";

export interface SocialLink {
  label: string;
  href: string;
  Icon: (props: { className?: string }) => React.JSX.Element;
}

/**
 * Real, verified links only (siteConfig.social) — WhatsApp only when a real
 * number is actually configured (config/env.ts), never a guess. Centralized
 * here (rather than duplicated across Footer/NavOverlay/Contact/About/
 * Community) so the `as const` literal types on `siteConfig` don't fight
 * each call site's own type-predicate filter — this function's return type
 * annotation is the one place that widens them back to plain `string`.
 */
export function getSocialLinks(options?: { includeWhatsApp?: boolean }): SocialLink[] {
  const links: (SocialLink | null)[] = [
    siteConfig.social.instagram
      ? { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon }
      : null,
    siteConfig.social.facebook
      ? { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon }
      : null,
    options?.includeWhatsApp && publicEnv.whatsappNumber
      ? { label: "WhatsApp", href: `https://wa.me/${publicEnv.whatsappNumber}`, Icon: WhatsAppIcon }
      : null,
  ];
  return links.filter((link): link is SocialLink => link !== null);
}
