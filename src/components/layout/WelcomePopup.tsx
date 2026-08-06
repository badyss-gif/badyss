"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { LinkButton } from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { routes } from "@/config/routes";
import { getSocialLinks } from "@/lib/social";

const socialLinks = getSocialLinks();

const STORAGE_KEY = "badyss-welcome-seen";
const DELAY_MS = 6000;
const SCROLL_THRESHOLD = 0.35;

// Internal-only tool pages (also noindex'd, see their own metadata) — a
// customer-facing "welcome to the shop" popup has no business appearing
// here. Concretely mattered for `/hero-experiments`: it's a long, five-hero
// comparison page, so scrolling through it while testing routinely crosses
// the 35% depth trigger below. Confirmed via testing that letting the popup
// open there did real damage beyond just being irrelevant — opening it
// calls `useScrollLock`, which calls `lenis.stop()`, which froze an
// in-progress Lenis `scrollTo` animation (the concept selector's jump)
// mid-flight, silently breaking that navigation.
const EXCLUDED_ROUTES = new Set(["/hero-experiments", "/design-system"]);

// Triggers once per session, whichever comes first: a 6s delay, or the
// visitor scrolling past ~35% of the page — never on load, never twice in
// the same session (sessionStorage flag). A full-bleed campaign photo with a
// frosted-glass content panel (`backdrop-blur` over the image, not a flat
// card) — a bottom sheet on mobile, a centered card on desktop, rounded
// corners on both (the same "something sliding up" motif already used by
// the Hero's curtain-reveal transition elsewhere on this page). Full dialog
// semantics: labelled, Escape closes, focus moves in on open and is trapped
// inside, and returns to whatever was focused before opening.
export function WelcomePopup() {
  const pathname = usePathname();
  const excluded = EXCLUDED_ROUTES.has(pathname);
  const shouldReduceMotion = useSafeReducedMotion();
  const t = useTranslations("welcomePopup");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);
  const triggeredRef = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (excluded || sessionStorage.getItem(STORAGE_KEY)) return;

    function trigger() {
      if (triggeredRef.current) return;
      triggeredRef.current = true;
      setOpen(true);
    }

    const timer = window.setTimeout(trigger, DELAY_MS);

    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable > SCROLL_THRESHOLD) trigger();
    }
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [excluded]);

  function close() {
    setOpen(false);
    sessionStorage.setItem(STORAGE_KEY, "1");
  }

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("a[href], button");
    firstFocusable?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
      previouslyFocused.current?.focus();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-gradient-to-br from-black/70 via-black/55 to-black/70 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={close}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="welcome-popup-title"
            onClick={(event) => event.stopPropagation()}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9, y: 28 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, filter: "blur(14px)", transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
            }
            transition={shouldReduceMotion ? { duration: 0.2 } : { type: "spring", stiffness: 260, damping: 24 }}
            className="relative grid w-full max-w-lg grid-cols-1 overflow-hidden rounded-t-[32px] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-2xl sm:rounded-[32px] md:max-w-3xl md:grid-cols-2"
          >
            {/* Decorative gradient wash — pure CSS, purely atmospheric (no
                content depends on it), giving the glass card a subtle sheen
                rather than a flat translucent slab. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-transparent" />

            <button
              type="button"
              onClick={close}
              aria-label={tCommon("close")}
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <span aria-hidden className="text-xl leading-none">
                ×
              </span>
            </button>

            <div className="relative order-2 flex flex-col justify-center gap-3 p-5 sm:gap-4 sm:p-9 md:order-1">
              <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90">
                {t("badge")}
              </span>
              <h2
                id="welcome-popup-title"
                className="font-display text-display-sm font-extrabold leading-[1.08] tracking-tight text-white sm:text-display-md"
              >
                {t("title")}
              </h2>
              <p className="text-sm text-white/75 sm:text-base">
                {t("bodyLine1")}
                <br />
                {t("bodyLine2")}
              </p>
              <div className="mt-1 flex flex-col gap-3 sm:mt-2 sm:flex-row">
                <LinkButton
                  href={routes.shop}
                  onClick={close}
                  className="justify-center bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {t("discover")}
                </LinkButton>
                <Button variant="ghost" onClick={close} className="justify-center text-white hover:bg-white/10">
                  {t("later")}
                </Button>
              </div>

              {socialLinks.length > 0 ? (
                <div className="mt-4 flex items-center gap-3 border-t border-white/15 pt-4">
                  {socialLinks.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative order-1 hidden aspect-[16/10] overflow-hidden md:order-2 md:block md:aspect-auto">
              <Image
                src="/images/editorial/campaign.png"
                alt=""
                aria-hidden
                fill
                sizes="(min-width: 768px) 24rem, 100vw"
                className={shouldReduceMotion ? "object-cover" : "object-cover hero-image-drift"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-l" />

              <motion.span
                animate={shouldReduceMotion ? undefined : { y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-md"
              >
                {t("newBadge")}
              </motion.span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
