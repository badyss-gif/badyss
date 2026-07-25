"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { setLocale } from "@/i18n/actions";
import { locales, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3.5c2.5 2.3 2.5 15 0 17M12 3.5c-2.5 2.3-2.5 15 0 17"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path d="M3.8 9h16.4M3.8 15h16.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Shared between the desktop panel and the mobile in-menu list — both just
// need "current locale, switch to X, is it pending".
function useLocaleSwitch() {
  const activeLocale = useLocale() as Locale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: Locale) {
    if (nextLocale === activeLocale) return;
    startTransition(async () => {
      await setLocale(nextLocale);
      router.refresh();
    });
  }

  return { activeLocale, switchTo, isPending };
}

const panelVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
};

// Desktop-only (`lg:` and up, per the header's own breakpoint for its full
// nav) — a globe trigger that opens a small glass floating panel, not a
// generic "FR / AR / EN" text row. Positioned `right-0` since it sits near
// the header's right edge; centering would risk clipping off-screen.
export function LanguageSwitcherDesktop({ dark, className }: { dark?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("language");
  const { activeLocale, switchTo, isPending } = useLocaleSwitch();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [open]);

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("choose")}
        className={cn(
          "flex h-10 w-10 items-center justify-center transition-colors duration-300",
          dark ? "text-white" : "text-foreground"
        )}
      >
        <GlobeIcon className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="menu"
            aria-label={t("choose")}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={panelVariants}
            className="absolute right-0 top-full z-40 mt-3 w-44 overflow-hidden rounded-2xl border border-white/40 bg-white/80 py-1.5 text-foreground shadow-xl backdrop-blur-xl"
          >
            {locales.map((locale) => (
              <button
                key={locale}
                type="button"
                role="menuitemradio"
                aria-checked={locale === activeLocale}
                disabled={isPending}
                onClick={() => {
                  switchTo(locale);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors duration-200 hover:bg-black/5 disabled:opacity-60",
                  locale === activeLocale ? "font-medium text-foreground" : "text-muted-foreground"
                )}
              >
                <span dir={locale === "ar" ? "rtl" : "ltr"}>{t(locale)}</span>
                {locale === activeLocale ? (
                  <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                ) : null}
              </button>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

// Mobile variant, embedded directly inside NavOverlay's own footer row —
// same visual language as the rest of that overlay (plain inline row, no
// second floating panel needed on a screen that's already a full takeover).
export function LanguageSwitcherMobile({ onSelect }: { onSelect?: () => void }) {
  const t = useTranslations("language");
  const { activeLocale, switchTo, isPending } = useLocaleSwitch();

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs uppercase tracking-wide">
      {locales.map((locale) => (
        <button
          key={locale}
          type="button"
          aria-pressed={locale === activeLocale}
          disabled={isPending}
          dir={locale === "ar" ? "rtl" : "ltr"}
          onClick={() => {
            switchTo(locale);
            onSelect?.();
          }}
          className={cn(
            "transition-colors disabled:opacity-60",
            locale === activeLocale
              ? "text-foreground underline underline-offset-4"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t(locale)}
        </button>
      ))}
    </div>
  );
}
