"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { getWhatsAppSupportUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/config";

// Renders nothing at all when no real number is configured — never a
// fabricated WhatsApp link (see lib/whatsapp.ts). Positioned with extra
// bottom clearance below `lg:` specifically because the product page's
// mobile sticky "Ajouter au panier" bar occupies the same bottom-right
// corner there; above `lg:` that bar doesn't exist, so it sits lower.
//
// Two distinct shapes, not one element resized: mobile stays a compact
// circle (icon only — screen space is precious, and hover doesn't really
// exist on touch). Desktop is a real pill with "Besoin d'aide ?" visible by
// default (never hidden behind a hover-only tooltip), that grows slightly
// and brightens on hover rather than staying static.
export function WhatsAppButton() {
  const shouldReduceMotion = useSafeReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("whatsapp");
  const whatsappUrl = getWhatsAppSupportUrl(locale);

  if (!whatsappUrl) return null;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("contactAria")}
      initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8, y: 12 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      transition={{ duration: 0.4, delay: 1, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-20 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-white/10 text-foreground shadow-xl backdrop-blur-xl transition-colors duration-300 hover:bg-white/25 hover:shadow-2xl lg:bottom-6 lg:right-6 lg:h-auto lg:w-auto lg:justify-start lg:gap-2.5 lg:rounded-full lg:py-3.5 lg:pl-3.5 lg:pr-5"
    >
      {/* Decorative gradient sheen, same glass language as WelcomePopup —
          purely atmospheric, gives the frosted shape real depth instead of a
          flat tint. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-transparent"
      />
      {shouldReduceMotion ? null : (
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#25D366]/50 lg:left-7"
          animate={{ scale: [1, 1.7], opacity: [0.6, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 2.6, ease: "easeOut" }}
        />
      )}
      <WhatsAppIcon className="relative h-6 w-6 shrink-0 text-[#25D366]" />
      <span className="relative hidden whitespace-nowrap text-sm font-medium lg:inline-block">
        {t("needHelp")}
      </span>
    </motion.a>
  );
}
