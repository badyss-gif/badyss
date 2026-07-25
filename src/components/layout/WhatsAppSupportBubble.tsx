"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { getWhatsAppSupportUrl } from "@/lib/whatsapp";
import { routes } from "@/config/routes";
import type { Locale } from "@/i18n/config";

const STORAGE_KEY = "badyss-whatsapp-bubble-seen";
const DELAY_MS = 4000;
// Being `fixed`, the bubble necessarily sits on top of whatever scrolls
// underneath it — fine for a brief glance, but left up indefinitely it
// drifts over page content (product cards, section headings) as the visitor
// keeps scrolling. Auto-hiding it shortly after reveal (or the moment the
// visitor scrolls further, whichever comes first) keeps it a toast-like
// nudge instead of a persistent obstruction.
const AUTO_HIDE_MS = 6000;
const AUTO_HIDE_SCROLL_DELTA = 150;
// The homepage hero is `position: sticky` inside a 140vh wrapper (see
// HeroSection) — it stays pinned, fully opaque, well beyond one viewport
// height of scrolling. Revealing this bubble purely on a timer used to
// visually collide with the hero's own bottom-anchored copy on mobile
// (confirmed via a real bounding-box check, not just eyeballing). Requiring
// scroll past ~1.4 viewport heights — matching that wrapper's own height —
// before the timer can reveal it sidesteps the collision on every route,
// without this component needing to import hero-specific geometry.
const SCROLL_REVEAL_RATIO = 1.4;

// A small proactive nudge next to the WhatsApp button — appears once per
// session after a short delay and only once the visitor has scrolled past
// the fold (never on every page load, never more than once per session:
// sessionStorage flag, same pattern as WelcomePopup), dismissible, and never
// blocks the button itself underneath it.
export function WhatsAppSupportBubble() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();
  const locale = useLocale() as Locale;
  const t = useTranslations("whatsapp");
  const tCommon = useTranslations("common");
  const whatsappUrl = getWhatsAppSupportUrl(locale);
  const hasHero = usePathname() === routes.home;

  useEffect(() => {
    if (!whatsappUrl) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Only the homepage's sticky hero risks the collision described above —
    // every other route can reveal on the timer alone, same as before.
    const minScroll = hasHero ? window.innerHeight * SCROLL_REVEAL_RATIO : 0;
    let timerElapsed = false;
    let hideTimer: number | undefined;
    let revealScrollY = 0;

    function hide() {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "1");
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", handleScrollAfterReveal);
    }

    function handleScrollAfterReveal() {
      if (Math.abs(window.scrollY - revealScrollY) > AUTO_HIDE_SCROLL_DELTA) hide();
    }

    function tryReveal() {
      if (!timerElapsed || window.scrollY < minScroll) return;
      revealScrollY = window.scrollY;
      setVisible(true);
      window.removeEventListener("scroll", tryReveal);
      hideTimer = window.setTimeout(hide, AUTO_HIDE_MS);
      window.addEventListener("scroll", handleScrollAfterReveal, { passive: true });
    }

    const timer = window.setTimeout(() => {
      timerElapsed = true;
      tryReveal();
    }, DELAY_MS);

    window.addEventListener("scroll", tryReveal, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
      window.removeEventListener("scroll", tryReveal);
      window.removeEventListener("scroll", handleScrollAfterReveal);
    };
  }, [whatsappUrl, hasHero]);

  function dismiss() {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  if (!whatsappUrl) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          className="fixed bottom-[9.5rem] right-5 z-40 flex max-w-[15rem] items-start gap-2 rounded-2xl border border-white/25 bg-white/15 p-3.5 pr-2.5 text-sm text-foreground shadow-xl backdrop-blur-xl lg:bottom-[5.75rem] lg:right-6"
        >
          <p className="flex-1 leading-snug">
            {t("bubbleGreeting")}
            <br />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="font-medium underline underline-offset-2"
            >
              {t("writeToUs")}
            </a>
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label={tCommon("close")}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground"
          >
            <span aria-hidden className="text-base leading-none">
              ×
            </span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
