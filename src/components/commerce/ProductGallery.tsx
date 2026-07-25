"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ProductImage } from "./ProductImage";
import { Portal } from "@/components/motion/Portal";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { cn } from "@/lib/utils";
import type { ProductImage as ProductImageType } from "@/types/product";

interface ProductGalleryProps {
  images: ProductImageType[];
  productName: string;
}

// A single real image today (mock catalog has none — the honest
// `ProductImage` placeholder renders instead) doesn't need a thumbnail
// strip or zoom, but the architecture is ready the moment a product has
// real multi-image WooCommerce data: thumbnails appear, and the main image
// becomes clickable to open a larger view.
export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const shouldReduceMotion = useSafeReducedMotion();
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const current = images[active] ?? null;

  useScrollLock(zoomOpen);

  useEffect(() => {
    if (!zoomOpen) return;
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") setZoomOpen(false);
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [zoomOpen]);

  return (
    <div className="sm:flex sm:gap-4">
      {/* Thumbnail rail — a vertical column beside the main image on desktop
          (the editorial-gallery convention), a horizontal row above it on
          mobile. Dormant today: the mock catalog has zero real images per
          product (see ProductImage's own comment), so this only appears
          once real multi-image WooCommerce data exists. */}
      {images.length > 1 ? (
        <div className="order-2 mt-4 flex gap-3 sm:order-1 sm:mt-0 sm:w-20 sm:shrink-0 sm:flex-col">
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={t("photoNumber", { n: index + 1 })}
              aria-current={active === index}
              className={cn(
                "relative h-20 w-16 shrink-0 overflow-hidden border-2 transition-colors sm:h-24 sm:w-full",
                active === index ? "border-foreground" : "border-transparent hover:border-border"
              )}
            >
              <ProductImage image={image} className="h-full w-full" />
            </button>
          ))}
        </div>
      ) : null}

      <motion.button
        type="button"
        onClick={() => images.length > 0 && setZoomOpen(true)}
        aria-label={images.length > 0 ? t("enlargePhoto", { name: productName }) : undefined}
        disabled={images.length === 0}
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 1.03 }}
        animate={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="order-1 block w-full flex-1 disabled:cursor-default sm:order-2"
      >
        <ProductImage image={current} priority sizes="(min-width: 1024px) 50vw, 100vw" className="w-full" />
      </motion.button>

      <Portal>
        <AnimatePresence>
          {zoomOpen ? (
            <motion.div
              className="fixed inset-0 z-[85] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoomOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label={t("enlargedPhoto", { name: productName })}
            >
              <button
                type="button"
                onClick={() => setZoomOpen(false)}
                aria-label={tCommon("close")}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
              >
                <span aria-hidden className="text-2xl leading-none">
                  ×
                </span>
              </button>
              <motion.div
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                onClick={(event) => event.stopPropagation()}
                className="relative aspect-[3/4] w-full max-w-2xl"
              >
                <ProductImage image={current} className="h-full w-full" sizes="90vw" />
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Portal>
    </div>
  );
}
