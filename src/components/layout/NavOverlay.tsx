"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { Portal } from "@/components/motion/Portal";
import { Logo } from "@/components/ui/Logo";
import { LinkButton } from "@/components/ui/LinkButton";
import { LanguageSwitcherMobile } from "./LanguageSwitcher";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { getSocialLinks } from "@/lib/social";
import { cn } from "@/lib/utils";

const primaryLinkKeys = [
  { key: "boutique" as const, href: routes.shop },
  { key: "grandesTailles" as const, href: routes.categories.grandesTailles },
  { key: "tShirts" as const, href: routes.categories.tShirt },
  { key: "ensembles" as const, href: routes.categories.ensembles },
  { key: "aPropos" as const, href: routes.about },
  { key: "contact" as const, href: routes.contact },
];

const socialLinks = getSocialLinks({ includeWhatsApp: true });

const overlayVariants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
  },
  exit: {
    clipPath: "inset(0 0 100% 0)",
    transition: { duration: 0.45, ease: [0.76, 0, 0.24, 1] as const },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const linkVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: { y: "0%", opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { y: "100%", opacity: 0, transition: { duration: 0.3 } },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

interface NavOverlayProps {
  dark?: boolean;
}

// A completely different canvas from the desktop nav (a flat visible bar) —
// a sophisticated, warm cream full-bleed takeover (not a dark drawer): a
// softly blurred campaign photo as a quiet textural accent in the corner,
// oversized numbered editorial links, a CTA, and social/service info at the
// foot. Built to feel like a fashion editorial's mobile menu, not a
// dropdown. Deliberately mobile/tablet-only (`lg:hidden` on the trigger);
// desktop keeps its own always-visible bar.
export function NavOverlay({ dark = false }: NavOverlayProps) {
  const [open, setOpen] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const tOverlay = useTranslations("navOverlay");

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const firstFocusable = dialogRef.current?.querySelector<HTMLElement>("a[href], button");
    firstFocusable?.focus();

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
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
    <>
      {/* Desktop (`lg:` and up) has the full navigation directly visible in
          Header — this trigger (and the menu it opens) is a mobile/tablet-only
          affordance below that breakpoint. Icon only — no "Menu" label. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="site-nav-overlay"
        aria-label={tCommon("openMenu")}
        className="flex h-10 w-10 items-center justify-center lg:hidden"
      >
        <span className="flex h-3.5 w-5 flex-col justify-between">
          <span className={cn("h-px w-full transition-colors", dark ? "bg-white" : "bg-foreground")} />
          <span className={cn("h-px w-full transition-colors", dark ? "bg-white" : "bg-foreground")} />
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <Portal>
            <motion.div
              ref={dialogRef}
              id="site-nav-overlay"
              role="dialog"
              aria-modal="true"
              aria-label={tCommon("navigation")}
              className="fixed inset-0 z-[80] flex flex-col overflow-hidden bg-background text-foreground"
              initial={shouldReduceMotion ? { opacity: 0 } : "hidden"}
              animate={shouldReduceMotion ? { opacity: 1 } : "visible"}
              exit={shouldReduceMotion ? { opacity: 0 } : "exit"}
              variants={shouldReduceMotion ? undefined : overlayVariants}
            >
              {/* Quiet textural accent, not a full-bleed photo — real approved
                  campaign photography, heavily blurred and faded so the
                  dominant field stays a warm off-white, per the requested
                  "sophisticated cream" direction rather than a dark takeover. */}
              <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-[26rem] w-[26rem] overflow-hidden rounded-full opacity-[0.18] blur-2xl sm:h-[32rem] sm:w-[32rem]">
                <Image src="/images/editorial/campaign.png" alt="" aria-hidden fill sizes="32rem" className="object-cover" />
              </div>
              <div className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-[2px]" />

              <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-6">
                <Link href={routes.home} onClick={() => setOpen(false)} aria-label={siteConfig.name}>
                  <Logo variant="auto" className="h-7" />
                </Link>
                <motion.button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={tCommon("closeMenu")}
                  whileHover={shouldReduceMotion ? undefined : { rotate: 90 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground"
                >
                  <span aria-hidden className="text-xl leading-none">
                    ×
                  </span>
                </motion.button>
              </div>

              <div className="flex flex-1 flex-col justify-center gap-10 overflow-y-auto px-5 pb-8 sm:px-6">
                <motion.nav
                  variants={shouldReduceMotion ? undefined : listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {primaryLinkKeys.map((link, index) => (
                    <div key={link.href} className="overflow-hidden border-b border-border first:border-t">
                      <motion.div variants={shouldReduceMotion ? undefined : linkVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setOpen(false)}
                          className="group flex items-baseline gap-4 py-3 sm:py-4"
                        >
                          <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                          <span className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground transition-colors duration-200 group-hover:text-accent sm:text-5xl">
                            {tNav(link.key)}
                          </span>
                        </Link>
                      </motion.div>
                    </div>
                  ))}
                </motion.nav>

                <motion.div variants={shouldReduceMotion ? undefined : fadeUpVariants} initial="hidden" animate="visible">
                  <LinkButton href={routes.shop} onClick={() => setOpen(false)}>
                    {tOverlay("discoverCollection")}
                  </LinkButton>
                </motion.div>
              </div>

              <div className="flex shrink-0 flex-col gap-4 border-t border-border px-5 py-5 sm:px-6">
                <LanguageSwitcherMobile onSelect={() => setOpen(false)} />
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wide text-muted-foreground">
                  <Link href={routes.serviceClient} onClick={() => setOpen(false)} className="transition-colors hover:text-foreground">
                    {tOverlay("serviceClient")}
                  </Link>
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
                <a href={`tel:${siteConfig.contact.phone}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {siteConfig.contact.phone}
                </a>
              </div>
            </motion.div>
          </Portal>
        ) : null}
      </AnimatePresence>
    </>
  );
}
