"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/cart/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { CheckoutProgress } from "./CheckoutProgress";
import { CheckoutTrustBadges } from "./CheckoutTrustBadges";
import { formatPrice } from "@/lib/format";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";

type Step = 1 | 2;

/**
 * A real two-step form (Informations → Paiement) — client-side only for
 * now, ready to POST to a real order-creation endpoint once one exists.
 * What it deliberately does NOT do: invent a payment method, show payment
 * network logos for methods that aren't actually wired up, or pretend to
 * charge a card. docs/BADYSS-SITE-BLUEPRINT.md §8 recommends redirecting to
 * a real WooCommerce-hosted checkout for the actual payment/order-creation
 * step once that's connected — until then, the honest bridge is the
 * verified phone number, not a fake "Order confirmed" screen.
 */
export function CheckoutClient() {
  const { cart } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="font-display text-2xl font-extrabold">{tCart("empty")}</p>
        <LinkButton href={routes.shop}>{tCart("viewShop")}</LinkButton>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-10">
        <CheckoutProgress currentStep={step} steps={[t("stepInformation"), t("stepPayment")]} />
      </div>

      <div className="grid gap-12 md:grid-cols-[1fr_320px] lg:grid-cols-[1fr_360px]">
        <div>
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form
                key="step-1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                onSubmit={(event) => {
                  event.preventDefault();
                  setStep(2);
                }}
                className="flex flex-col gap-10"
              >
                <div>
                  <h2 className="font-display text-lg font-extrabold">{t("contactHeading")}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input type="email" required placeholder={t("emailPlaceholder")} aria-label={t("emailPlaceholder")} />
                    <Input type="tel" required placeholder={t("phonePlaceholder")} aria-label={t("phonePlaceholder")} />
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-lg font-extrabold">{t("shippingHeading")}</h2>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <Input required placeholder={t("firstNamePlaceholder")} aria-label={t("firstNamePlaceholder")} />
                    <Input required placeholder={t("lastNamePlaceholder")} aria-label={t("lastNamePlaceholder")} />
                    <Input required placeholder={t("addressPlaceholder")} aria-label={t("addressPlaceholder")} className="sm:col-span-2" />
                    <Input required placeholder={t("cityPlaceholder")} aria-label={t("cityPlaceholder")} />
                    <Input placeholder={t("postalCodePlaceholder")} aria-label={t("postalCodePlaceholder")} />
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full justify-center sm:w-auto">
                  {t("continueToPayment")}
                </Button>
              </motion.form>
            ) : (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-8"
              >
                <div>
                  <h2 className="font-display text-lg font-extrabold">{t("paymentHeading")}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{t("paymentDesc")}</p>
                </div>

                {submitted ? (
                  <div className="border border-border bg-muted p-5 text-sm">
                    <p className="font-medium text-foreground">{t("onlinePaymentSoon")}</p>
                    <p className="mt-2 text-muted-foreground">
                      {t("finalizeNowPrefix")}{" "}
                      <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                        {siteConfig.contact.phone}
                      </a>
                      .
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setStep(1)}
                      className="justify-center"
                    >
                      {t("back")}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      onClick={() => setSubmitted(true)}
                      className="flex-1 justify-center"
                    >
                      {t("finalize")}
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-12 border-t border-border pt-8">
            <CheckoutTrustBadges />
          </div>
        </div>

        <aside className="h-max border border-border p-6 md:sticky md:top-32">
          <h2 className="font-display text-lg font-extrabold">{t("yourOrder")}</h2>
          <ul className="mt-4 flex flex-col divide-y divide-border text-sm">
            {cart.items.map((item) => (
              <li key={`${item.productId}:${item.variationId ?? ""}`} className="flex justify-between gap-4 py-3 first:pt-0">
                <span className="text-foreground">
                  {item.name}
                  <span className="text-muted-foreground"> × {item.quantity}</span>
                </span>
                <span className="whitespace-nowrap text-foreground">
                  {formatPrice(item.unitPrice * item.quantity, cart.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">{t("subtotal")}</span>
            <span className="font-medium text-foreground">{formatPrice(cart.subtotal, cart.currency)}</span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{t("shippingSeparately")}</p>
          <Link
            href={routes.cart}
            className="mt-4 block text-center text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {t("editCart")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
