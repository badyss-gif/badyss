"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/commerce/ProductCard";
import { QuickView } from "@/components/commerce/QuickView";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface FeaturedProductsProps {
  heading: string;
  products: Product[];
  ctaLabel: string;
  ctaHref: string;
}

// Tracks which card is nearest the center of the rail's visible area (the
// "active" card, which enlarges) via IntersectionObserver against the rail
// itself as the root — no scroll-position math, works identically for
// mouse-wheel, trackpad, touch swipe, and the arrow buttons.
function useActiveIndex(containerRef: RefObject<HTMLDivElement | null>, count: number) {
  const [active, setActive] = useState(0);
  const ratiosRef = useRef<number[]>(new Array(count).fill(0));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number((entry.target as HTMLElement).dataset.index);
          ratiosRef.current[index] = entry.intersectionRatio;
        });
        let bestIndex = 0;
        let bestRatio = -1;
        ratiosRef.current.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });
        setActive(bestIndex);
      },
      { root: container, threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "0px -30% 0px -30%" }
    );

    const items = container.querySelectorAll<HTMLElement>("[data-index]");
    items.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [containerRef, count]);

  return active;
}

// "La sélection BADYSS" — an editorial discovery rail, not a 4-column grid.
// The centered/active card enlarges, its neighbors recede — a continuous
// horizontal exploration rather than a static block. Real product data still
// drives everything (name/price/sale/availability via ProductCard) — no
// visual effect here compromises usability, per the explicit instruction not
// to sacrifice commerce clarity for creativity.
export function FeaturedProducts({ heading, products, ctaLabel, ctaHref }: FeaturedProductsProps) {
  const t = useTranslations("home.featuredProducts");
  const containerRef = useRef<HTMLDivElement>(null);
  const active = useActiveIndex(containerRef, products.length);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  function scrollByCard(direction: 1 | -1) {
    const container = containerRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>("[data-index]");
    const step = (card?.clientWidth ?? 320) + 24;
    container.scrollBy({ left: direction * step, behavior: "smooth" });
  }

  return (
    <Section spacing="tight" withContainer={false}>
      <Container className="flex items-end justify-between gap-4">
        <Reveal>
          <div>
            <h2 className="font-display text-display-sm font-extrabold">{heading}</h2>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
        </Reveal>
        <div className="hidden items-center gap-3 sm:flex">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            aria-label={t("prevAria")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <span aria-hidden>←</span>
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            aria-label={t("nextAria")}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-muted"
          >
            <span aria-hidden>→</span>
          </button>
          <LinkButton href={ctaHref} variant="ghost" size="sm">
            {ctaLabel}
          </LinkButton>
        </div>
      </Container>

      <div
        ref={containerRef}
        className="scrollbar-hidden mt-8 flex snap-x snap-proximity gap-6 overflow-x-auto px-4 pb-4 pt-2 sm:px-6 lg:px-8"
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            data-index={index}
            className={cn(
              "w-[68vw] shrink-0 snap-center transition-all duration-500 ease-out sm:w-[38vw] lg:w-[26vw]",
              active === index ? "scale-100 opacity-100" : "scale-[0.93] opacity-60"
            )}
          >
            <ProductCard product={product} priority={index === 0} onQuickView={setQuickViewProduct} />
          </div>
        ))}
      </div>

      <div className="mt-6 px-4 sm:hidden">
        <LinkButton href={ctaHref} variant="secondary" className="w-full">
          {ctaLabel}
        </LinkButton>
      </div>

      <QuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </Section>
  );
}
