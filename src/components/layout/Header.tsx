"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { TOPBAR_HEIGHT, FIXED_STACK_HEIGHT } from "@/config/layout";
import { cn } from "@/lib/utils";
import { SearchButton } from "./SearchButton";
import { CartButton } from "./CartButton";
import { WishlistHeaderButton } from "./WishlistHeaderButton";
import { NavOverlay } from "./NavOverlay";
import { BoutiqueMegaMenu } from "./BoutiqueMegaMenu";
import { LanguageSwitcherDesktop } from "./LanguageSwitcher";
import type { Product } from "@/types/product";

// Flat top-level links (Boutique itself carries the mega menu, rendered
// separately below). "L'Univers" is deliberately not in this flat row —
// still reachable via the mobile menu and footer — keeping the desktop bar
// to exactly the set requested: Boutique, Grandes tailles, T-shirts,
// Ensembles, Contact. Labels resolved via translations at render time (see
// `secondaryNavKeys` usage below) since `nav.*` message keys aren't known
// statically.
const secondaryNavKeys = [
  { key: "grandesTailles" as const, href: routes.categories.grandesTailles },
  { key: "tShirts" as const, href: routes.categories.tShirt },
  { key: "ensembles" as const, href: routes.categories.ensembles },
  { key: "contact" as const, href: routes.contact },
];

function NavLink({ href, label, dark }: { href: string; label: string; dark: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-2 transition-colors duration-300",
        dark ? "text-white/90 hover:text-white" : "text-foreground/80 hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
}

// The header starts transparent over the full-bleed hero on the homepage and
// becomes solid once scrolled past it. Only the homepage has a hero to sit
// over; every other route (including `/hero-experiments` — its own intro
// text block sits above the first hero concept, not hero imagery, so a
// transparent header there would be unreadable) always gets the solid
// header. Client component: needs pathname + scroll position.
//
// Desktop (`lg:` and up): the full navigation is directly visible — Boutique
// (mega menu), Grandes Tailles, T-Shirts, Ensembles, Contact — never hidden
// behind a hamburger. Below `lg:`, NavOverlay's own trigger takes over with
// the full-screen mobile menu; this component doesn't duplicate that trigger.
export function Header({ products }: { products: Product[] }) {
  const pathname = usePathname();
  const hasHero = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const t = useTranslations("nav");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const scrolled = latest > 72;
    setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
  });

  const transparent = hasHero && !isScrolled;

  return (
    <>
      <header
        style={{ top: TOPBAR_HEIGHT }}
        className={cn(
          "fixed inset-x-0 z-50 transition-colors duration-300",
          transparent ? "bg-transparent" : "border-b border-border bg-surface"
        )}
      >
        <Container className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href={routes.home} aria-label={siteConfig.name} className="justify-self-start">
            <Logo variant={transparent ? "white" : "auto"} className="h-9 sm:h-10" priority />
          </Link>

          <nav className="hidden items-center gap-9 text-sm lg:flex">
            <BoutiqueMegaMenu dark={transparent} />
            {secondaryNavKeys.map((item) => (
              <NavLink key={item.href} href={item.href} label={t(item.key)} dark={transparent} />
            ))}
          </nav>

          {/* Explicit `col-start-3`, not left to grid auto-placement: below
              `lg:`, the nav above is `display:none` (via `hidden`), which
              removes it from the grid item list entirely — auto-placement
              then slides this div into the vacated middle ("auto") track
              instead of the real last ("1fr") track, leaving a real gap
              before the right edge instead of sitting flush against it.
              Pinning the column explicitly makes the mobile icon/hamburger
              group always land in the actual rightmost track, regardless of
              whether the nav item participates in layout. */}
          <div className="col-start-3 flex items-center justify-self-end gap-4">
            <div
              className={cn(
                "flex items-center gap-1 rounded-full transition-colors duration-300",
                transparent && "text-white"
              )}
            >
              <SearchButton products={products} />
              <WishlistHeaderButton />
              <CartButton products={products} />
              <LanguageSwitcherDesktop dark={transparent} className="hidden lg:block" />
            </div>
            <NavOverlay dark={transparent} />
          </div>
        </Container>
      </header>
      {/* The header (and the always-visible TopBar above it) are `fixed`, so
          they can genuinely overlay a full-bleed hero at y=0. Every other
          route has no hero to sit over, so it needs this reserved-space
          spacer or its content would render underneath the fixed stack. */}
      {!hasHero ? <div style={{ height: FIXED_STACK_HEIGHT }} aria-hidden /> : null}
    </>
  );
}
