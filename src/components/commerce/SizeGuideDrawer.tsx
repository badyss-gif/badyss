"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Portal } from "@/components/motion/Portal";
import { useScrollLock } from "@/components/motion/useScrollLock";
import { SizeIllustration } from "@/components/size-guide/SizeIllustration";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface SizeGuideDrawerProps {
  open: boolean;
  onClose: () => void;
  sizes: string[];
}

// Reference row for clothing (letter) sizes only — shoe sizes (numeric,
// e.g. "38"-"44") have no universal reference row to overlay, so those
// render just the product's own options with no invented chart.
const CLOTHING_SIZE_RANGE = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

// Contextual slide-over triggered next to the size selector, so shoppers
// can check fit without leaving the product page — same underlying content
// as the full /guide-des-tailles page (how-to-measure + size chart), reused
// via the `sizeGuide` translation namespace rather than duplicated copy.
// Still honors the same constraint as that page: no invented cm/inch
// measurements (docs/BADYSS-SITE-BLUEPRINT.md §2 — real garment
// measurements aren't available yet), only the label-only chart with this
// product's own sizes highlighted within it.
export function SizeGuideDrawer({ open, onClose, sizes }: SizeGuideDrawerProps) {
  const t = useTranslations("sizeGuide");
  const tProduct = useTranslations("product");
  useScrollLock(open);

  // No `sizes` at all (product only varies by color, e.g. mock products
  // #2/#8) falls back to the generic reference chart with nothing
  // highlighted — still useful general guidance, not an empty table.
  const hasSizes = sizes.length > 0;
  const isClothingSize = !hasSizes || sizes.some((size) => CLOTHING_SIZE_RANGE.includes(size.toUpperCase()));
  const chartSizes = isClothingSize ? CLOTHING_SIZE_RANGE : sizes;

  const measuringSteps = [
    { letter: "A", label: t("measureChestLabel"), detail: t("measureChestDetail") },
    { letter: "B", label: t("measureWaistLabel"), detail: t("measureWaistDetail") },
    { letter: "C", label: t("measureHipsLabel"), detail: t("measureHipsDetail") },
  ];

  return (
    <Portal>
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[75] flex justify-end bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
          >
            <motion.div
              onClick={(event) => event.stopPropagation()}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-surface p-6 sm:p-8"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label={tProduct("closeSizeGuide")}
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-muted text-foreground"
              >
                <span aria-hidden className="text-xl leading-none">
                  ×
                </span>
              </button>

              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
              <h2 className="mt-2 font-display text-display-sm font-extrabold tracking-tight">{t("title")}</h2>

              {isClothingSize ? (
                <>
                  <h3 className="mt-8 font-display text-sm font-extrabold tracking-tight">{t("howToMeasure")}</h3>
                  <div className="mt-4 grid grid-cols-[80px_1fr] gap-4">
                    <SizeIllustration className="h-auto w-20 text-muted-foreground" />
                    <div className="flex flex-col divide-y divide-border border-y border-border">
                      {measuringSteps.map((step) => (
                        <div key={step.label} className="flex items-start gap-3 py-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium text-foreground">
                            {step.letter}
                          </span>
                          <div>
                            <p className="text-sm font-medium text-foreground">{step.label}</p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}

              <h3 className="mt-8 font-display text-sm font-extrabold tracking-tight">{t("sizeChartTitle")}</h3>
              {hasSizes ? (
                <p className="mt-1 text-xs text-muted-foreground">{tProduct("sizeGuideAvailableSizes")}</p>
              ) : null}
              <div className="mt-4 overflow-x-auto">
                <div className="flex min-w-max divide-x divide-border border border-border">
                  {chartSizes.map((size) => {
                    const isAvailable = sizes.some((productSize) => productSize.toUpperCase() === size.toUpperCase());
                    return (
                      <div
                        key={size}
                        className={cn(
                          "flex-1 px-4 py-3 text-center text-sm font-medium transition-colors",
                          isAvailable ? "bg-foreground text-background" : "text-muted-foreground"
                        )}
                      >
                        {size}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 border border-border bg-muted p-4 text-xs">
                <p className="font-medium text-foreground">{t("sizeChartPending")}</p>
                <p className="mt-1.5 text-muted-foreground">
                  {t("sizeChartContactPrefix")}{" "}
                  <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                    {siteConfig.contact.phone}
                  </a>{" "}
                  {t("sizeChartContactMiddle")}{" "}
                  <Link href={routes.faq} onClick={onClose} className="text-foreground underline underline-offset-2">
                    FAQ
                  </Link>
                  .
                </p>
              </div>

              {isClothingSize ? (
                <>
                  <h3 className="mt-8 font-display text-sm font-extrabold tracking-tight">{t("tipsTitle")}</h3>
                  <ul className="mt-3 flex flex-col gap-2">
                    {[t("tip1"), t("tip2")].map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span aria-hidden className="mt-1 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}

              <Link
                href={routes.sizeGuide}
                onClick={onClose}
                className="mt-auto pt-8 text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {tProduct("viewFullSizeGuide")}
              </Link>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}
