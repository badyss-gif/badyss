"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { routes } from "@/config/routes";
import { cn } from "@/lib/utils";

interface MegaMenuLink {
  labelKey: "grandesTailles" | "tShirts" | "ensembles" | "nouveautes";
  href: string;
  preview: string;
  tagKey?: "lePlusFort";
}

// Same real routes as everywhere else — no invented categories. Labels
// resolved via translations at render time (see `links` usage below).
const links: MegaMenuLink[] = [
  {
    labelKey: "grandesTailles",
    href: routes.categories.grandesTailles,
    preview: "/images/categories/grandes-tailles.png",
    tagKey: "lePlusFort",
  },
  {
    labelKey: "tShirts",
    href: routes.categories.tShirt,
    preview: "/images/categories/t-shirts.png",
  },
  {
    labelKey: "ensembles",
    href: routes.categories.ensembles,
    preview: "/images/categories/ensembles.png",
  },
  {
    labelKey: "nouveautes",
    href: `${routes.shop}?sort=newest`,
    preview: "/images/hero/desktop.png",
  },
];

// Desktop-only "Boutique" mega menu: the label is a real link to /shop (it
// works with JS disabled or on a quick click), hovering it — or the panel
// itself — reveals a richer preview instead of a plain dropdown list. A
// short close delay keeps the panel open while the cursor travels from the
// trigger down into it, matching standard mega-menu behavior.
export function BoutiqueMegaMenu({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState(links[0].preview);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations("nav");

  function handleEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpen(false), 180);
  }

  useEffect(() => {
    if (!open) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [open]);

  return (
    <div className="relative" onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <Link
        href={routes.shop}
        className={cn(
          "relative py-2 transition-colors duration-300",
          dark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
        )}
        aria-expanded={open}
      >
        {t("boutique")}
      </Link>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-full z-40 mt-5 w-[600px] -translate-x-1/2 border border-border bg-surface p-8 shadow-xl"
          >
            <div className="grid grid-cols-2 gap-8">
              <ul className="flex flex-col gap-1">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onMouseEnter={() => setPreview(link.preview)}
                      className="group flex items-baseline gap-2 py-2 font-display text-xl font-extrabold tracking-tight text-foreground transition-colors hover:text-accent"
                    >
                      {t(link.labelKey)}
                      {link.tagKey ? (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground group-hover:text-accent">
                          {t(link.tagKey)}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                <Image key={preview} src={preview} alt="" aria-hidden fill sizes="300px" className="object-cover" />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
