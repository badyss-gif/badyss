"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSafeReducedMotion } from "@/components/motion/useSafeReducedMotion";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/config/site";

interface ShippingProgressBarProps {
  subtotal: number;
  currency: string;
}

/**
 * Renders nothing when no free-shipping threshold is configured
 * (siteConfig.shipping.freeShippingThreshold) — same honesty pattern as
 * WhatsAppButton: never fabricate a business fact like "150 MAD" just to
 * fill the UI. The moment BADYSS confirms a real threshold, this activates
 * everywhere it's used with zero other changes needed.
 */
export function ShippingProgressBar({ subtotal, currency }: ShippingProgressBarProps) {
  const threshold = siteConfig.shipping.freeShippingThreshold;
  const shouldReduceMotion = useSafeReducedMotion();
  const t = useTranslations("cart");

  if (!threshold) return null;

  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(1, subtotal / threshold);
  const unlocked = remaining === 0;

  return (
    <div>
      <p className="text-sm text-foreground">
        {unlocked ? (
          t("freeShippingUnlocked")
        ) : (
          <>
            {t("freeShippingRemainingPrefix")} <span className="font-medium">{formatPrice(remaining, currency)}</span>{" "}
            {t("freeShippingRemainingSuffix")}
          </>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
