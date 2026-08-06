"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/features/cart/CartContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { CheckoutProgress } from "./CheckoutProgress";
import { CheckoutTrustBadges } from "./CheckoutTrustBadges";
import { ReassuranceStrip } from "@/components/shared/ReassuranceStrip";
import { ProductImage } from "@/components/commerce/ProductImage";
import { formatPrice } from "@/lib/format";
import { isValidMoroccanPhone } from "@/lib/validation";
import { getWhatsAppCartOrderUrl } from "@/lib/whatsapp";
import { submitOrder } from "@/lib/actions/orders";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Step = 1 | 2;

interface FormValues {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues, t: ReturnType<typeof useTranslations<"buyNow">>): FormErrors {
  const errors: FormErrors = {};
  if (values.fullName.trim().length < 2) errors.fullName = t("fullNameError");
  if (!isValidMoroccanPhone(values.phone)) errors.phone = t("phoneError");
  if (values.address.trim().length < 5) errors.address = t("addressError");
  if (values.city.trim().length < 2) errors.city = t("cityError");
  return errors;
}

/**
 * Cart-based checkout — collects only Nom complet/Téléphone/Adresse/Ville
 * (same fields and validation as `BuyNowCheckout`'s single-product flow),
 * then places a real WooCommerce order via the `submitOrder` server action
 * for every item currently in the cart. On success the cart is cleared and
 * a WhatsApp handoff link (`getWhatsAppCartOrderUrl`) is offered, matching
 * `BuyNowCheckout`'s confirmation screen.
 */
export function CheckoutClient() {
  const { cart, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [values, setValues] = useState<FormValues>({ fullName: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const t = useTranslations("checkout");
  const tBuyNow = useTranslations("buyNow");
  const tCart = useTranslations("cart");

  if (cart.items.length === 0 && status !== "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <p className="font-display text-2xl font-extrabold">{tCart("empty")}</p>
        <LinkButton href={routes.shop}>{tCart("viewShop")}</LinkButton>
      </div>
    );
  }

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  function handleContinue(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values, tBuyNow);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    setStep(2);
  }

  async function handleFinalize() {
    setSubmitError(null);
    setStatus("submitting");
    const result = await submitOrder({
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      city: values.city,
      items: cart.items.map((item) => ({
        productId: item.productId,
        variationId: item.variationId,
        quantity: item.quantity,
      })),
    });

    if (result.ok) {
      setReference(result.orderNumber);
      setStatus("success");
      clear();
    } else {
      setStatus("idle");
      setSubmitError(tBuyNow("orderError"));
    }
  }

  if (status === "success") {
    const whatsappUrl = getWhatsAppCartOrderUrl({
      reference,
      items: cart.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        attributes: item.attributes,
      })),
      totalPrice: cart.subtotal,
      currency: cart.currency,
      customerName: values.fullName,
      phone: values.phone,
      address: values.address,
      city: values.city,
    });

    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-8 text-center sm:py-12">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <Check className="h-6 w-6" strokeWidth={2} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {tBuyNow("orderReceived")}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {tBuyNow("reference")} <span className="font-medium text-foreground">{reference}</span>
          </p>
        </div>

        <div className="w-full border border-border p-6 text-left">
          <ul className="flex flex-col divide-y divide-border">
            {cart.items.map((item) => (
              <li key={`${item.productId}:${item.variationId ?? ""}`} className="flex gap-4 py-3 first:pt-0">
                <ProductImage image={item.image} className="w-16 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {tBuyNow("quantity", { n: item.quantity })}
                  </p>
                </div>
                <span className="whitespace-nowrap text-sm font-medium text-foreground">
                  {formatPrice(item.unitPrice * item.quantity, cart.currency)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
            <span className="text-muted-foreground">{tBuyNow("total")}</span>
            <span className="font-medium text-foreground">{formatPrice(cart.subtotal, cart.currency)}</span>
          </div>
          <div className="mt-4 flex flex-col gap-0.5 border-t border-border pt-4 text-sm text-muted-foreground">
            <p className="text-foreground">{values.fullName}</p>
            <p>{values.phone}</p>
            <p>
              {values.address}, {values.city}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3">
          {whatsappUrl ? (
            <>
              <LinkButton
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="w-full justify-center gap-2"
              >
                <WhatsAppIcon className="h-4 w-4" />
                {tBuyNow("confirmViaWhatsApp")}
              </LinkButton>
              <p className="text-xs text-muted-foreground">{tBuyNow("whatsAppHint")}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {tBuyNow("teamWillContactPrefix")}{" "}
              <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                {siteConfig.contact.phone}
              </a>{" "}
              {tBuyNow("teamWillContactSuffix")}
            </p>
          )}
          <LinkButton href={routes.shop} variant="secondary" className="w-full justify-center">
            {tBuyNow("continueShopping")}
          </LinkButton>
        </div>
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
                onSubmit={handleContinue}
                noValidate
                className="flex flex-col gap-6"
              >
                <div>
                  <h2 className="font-display text-lg font-extrabold">{tBuyNow("yourInfo")}</h2>
                  <div className="mt-4 flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-foreground">{tBuyNow("fullNameLabel")}</span>
                      <Input
                        value={values.fullName}
                        onChange={(event) => updateField("fullName", event.target.value)}
                        placeholder={tBuyNow("fullNamePlaceholder")}
                        autoComplete="name"
                        aria-invalid={Boolean(errors.fullName)}
                        className={cn(errors.fullName && "border-error focus-visible:border-error")}
                      />
                      {errors.fullName ? <span className="text-xs text-error">{errors.fullName}</span> : null}
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-foreground">{tBuyNow("phoneLabel")}</span>
                      <Input
                        type="tel"
                        inputMode="tel"
                        value={values.phone}
                        onChange={(event) => updateField("phone", event.target.value)}
                        placeholder={tBuyNow("phonePlaceholder")}
                        autoComplete="tel"
                        aria-invalid={Boolean(errors.phone)}
                        className={cn(errors.phone && "border-error focus-visible:border-error")}
                      />
                      {errors.phone ? <span className="text-xs text-error">{errors.phone}</span> : null}
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-foreground">{tBuyNow("addressLabel")}</span>
                      <Input
                        value={values.address}
                        onChange={(event) => updateField("address", event.target.value)}
                        placeholder={tBuyNow("addressPlaceholder")}
                        autoComplete="street-address"
                        aria-invalid={Boolean(errors.address)}
                        className={cn(errors.address && "border-error focus-visible:border-error")}
                      />
                      {errors.address ? <span className="text-xs text-error">{errors.address}</span> : null}
                    </label>
                    <label className="flex flex-col gap-1.5">
                      <span className="text-sm font-medium text-foreground">{tBuyNow("cityLabel")}</span>
                      <Input
                        value={values.city}
                        onChange={(event) => updateField("city", event.target.value)}
                        placeholder={tBuyNow("cityPlaceholder")}
                        autoComplete="address-level2"
                        aria-invalid={Boolean(errors.city)}
                        className={cn(errors.city && "border-error focus-visible:border-error")}
                      />
                      {errors.city ? <span className="text-xs text-error">{errors.city}</span> : null}
                    </label>
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

                <div className="flex flex-col gap-0.5 border border-border p-4 text-sm text-muted-foreground">
                  <p className="text-foreground">{values.fullName}</p>
                  <p>{values.phone}</p>
                  <p>
                    {values.address}, {values.city}
                  </p>
                </div>

                {submitError ? <p className="text-sm text-error">{submitError}</p> : null}

                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(1)}
                    disabled={status === "submitting"}
                    className="justify-center"
                  >
                    {t("back")}
                  </Button>
                  <Button
                    type="button"
                    size="lg"
                    loading={status === "submitting"}
                    onClick={handleFinalize}
                    className="flex-1 justify-center"
                  >
                    {t("finalize")}
                  </Button>
                </div>
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
          <ReassuranceStrip className="mt-4 flex-col items-start gap-2 border-t border-border pt-4" />
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
