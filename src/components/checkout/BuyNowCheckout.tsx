"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/LinkButton";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { QuantityStepper } from "@/components/commerce/QuantityStepper";
import { ProductImage } from "@/components/commerce/ProductImage";
import { CheckoutTrustBadges } from "./CheckoutTrustBadges";
import { ReassuranceStrip } from "@/components/shared/ReassuranceStrip";
import { findVariantForSelection } from "@/features/products/variants";
import { formatPrice } from "@/lib/format";
import { getEffectiveUnitPrice, getBadyssSavings, shouldShowMoreThanMaxCta } from "@/lib/badyss-offer";
import { isValidMoroccanPhone } from "@/lib/validation";
import { getWhatsAppOrderUrl } from "@/lib/whatsapp";
import { submitOrder } from "@/lib/actions/orders";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

// Common destinations only — the field stays free text (via `list`, not a
// closed <select>) so an address in a smaller town isn't blocked. Left
// untranslated (real Moroccan place names, not UI copy).
const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Salé",
  "Tétouan",
  "Nador",
  "El Jadida",
  "Béni Mellal",
  "Khouribga",
];

interface FormValues {
  fullName: string;
  phone: string;
  address: string;
  city: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

interface BuyNowCheckoutProps {
  product: Product;
  initialQuantity: number;
  initialAttributes: Record<string, string>;
}

function validate(values: FormValues, t: ReturnType<typeof useTranslations<"buyNow">>): FormErrors {
  const errors: FormErrors = {};
  if (values.fullName.trim().length < 2) {
    errors.fullName = t("fullNameError");
  }
  if (!isValidMoroccanPhone(values.phone)) {
    errors.phone = t("phoneError");
  }
  if (values.address.trim().length < 5) {
    errors.address = t("addressError");
  }
  if (values.city.trim().length < 2) {
    errors.city = t("cityError");
  }
  return errors;
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-error">{error}</span> : null}
    </label>
  );
}

function OrderSummaryLine({ product, quantity, attributes }: { product: Product; quantity: number; attributes: [string, string][] }) {
  const t = useTranslations("buyNow");
  return (
    <>
      <p className="text-sm font-medium text-foreground">{product.name}</p>
      {attributes.length > 0 ? (
        <p className="mt-1 text-xs text-muted-foreground">
          {attributes.map(([name, value]) => `${name} : ${value}`).join(" · ")}
        </p>
      ) : null}
      <p className="mt-1 text-sm text-muted-foreground">{t("quantity", { n: quantity })}</p>
    </>
  );
}

/**
 * One-page "Acheter maintenant" checkout for a single product — deliberately
 * separate from `CheckoutClient` (the cart-based `/commande` flow): this one
 * has no cart dependency, no step indicator, and a single always-visible
 * form. No real order backend exists (same standing limitation as
 * `/commande` — see its own doc comment), so on submit the confirmed order
 * is handed to a real person via a pre-filled WhatsApp link
 * (`getWhatsAppOrderUrl`) rather than a fabricated "payment successful"
 * screen — the honest bridge, upgraded from a bare phone number to a
 * working deep link with every detail already filled in.
 */
export function BuyNowCheckout({ product, initialQuantity, initialAttributes }: BuyNowCheckoutProps) {
  const t = useTranslations("buyNow");
  const tCheckout = useTranslations("checkout");
  const tProduct = useTranslations("product");
  const [quantity, setQuantity] = useState(initialQuantity);
  const [values, setValues] = useState<FormValues>({ fullName: "", phone: "", address: "", city: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [reference, setReference] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resolvedVariant = findVariantForSelection(product, initialAttributes);
  const effectivePrice = resolvedVariant?.price ?? product.price;
  const effectiveStock = resolvedVariant?.stock ?? product.stock;
  const effectiveOffer = resolvedVariant?.badyssOffer ?? product.badyssOffer;
  const unitPrice = getEffectiveUnitPrice(effectivePrice.amount, effectiveOffer, quantity);
  const totalPrice = unitPrice * quantity;
  const savings = getBadyssSavings(effectiveOffer, quantity);
  const attributesEntries = Object.entries(initialAttributes);
  const isOutOfStock = effectiveStock.status === "out-of-stock";

  function updateField(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => (current[field] ? { ...current, [field]: undefined } : current));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values, t);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitError(null);
    setStatus("submitting");
    const result = await submitOrder({
      fullName: values.fullName,
      phone: values.phone,
      address: values.address,
      city: values.city,
      items: [{ productId: product.id, variationId: resolvedVariant?.id, quantity, unitPrice }],
    });

    if (result.ok) {
      setReference(result.orderNumber);
      setStatus("success");
    } else {
      setStatus("idle");
      setSubmitError(t("orderError"));
    }
  }

  if (status === "success") {
    const whatsappUrl = getWhatsAppOrderUrl({
      reference,
      productName: product.name,
      attributes: initialAttributes,
      quantity,
      totalPrice,
      currency: effectivePrice.currency,
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
          <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{t("orderReceived")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("reference")} <span className="font-medium text-foreground">{reference}</span>
          </p>
        </div>

        <div className="w-full border border-border p-6 text-left">
          <div className="flex gap-4">
            <ProductImage image={resolvedVariant?.image ?? product.images[0] ?? null} className="w-20 shrink-0" />
            <div className="flex-1">
              <OrderSummaryLine product={product} quantity={quantity} attributes={attributesEntries} />
            </div>
            <span className="whitespace-nowrap text-sm font-medium text-foreground">
              {formatPrice(totalPrice, effectivePrice.currency)}
            </span>
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
                {t("confirmViaWhatsApp")}
              </LinkButton>
              <p className="text-xs text-muted-foreground">{t("whatsAppHint")}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t("teamWillContactPrefix")}{" "}
              <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                {siteConfig.contact.phone}
              </a>{" "}
              {t("teamWillContactSuffix")}
            </p>
          )}
          <LinkButton href={routes.shop} variant="secondary" className="w-full justify-center">
            {t("continueShopping")}
          </LinkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6 order-2 md:order-1">
        <div>
          <h2 className="font-display text-lg font-extrabold">{t("yourInfo")}</h2>
          <div className="mt-4 flex flex-col gap-4">
            <Field label={t("fullNameLabel")} error={errors.fullName}>
              <Input
                value={values.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                placeholder={t("fullNamePlaceholder")}
                autoComplete="name"
                aria-invalid={Boolean(errors.fullName)}
                className={cn(errors.fullName && "border-error focus-visible:border-error")}
              />
            </Field>
            <Field label={t("phoneLabel")} error={errors.phone}>
              <Input
                type="tel"
                inputMode="tel"
                value={values.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder={t("phonePlaceholder")}
                autoComplete="tel"
                aria-invalid={Boolean(errors.phone)}
                className={cn(errors.phone && "border-error focus-visible:border-error")}
              />
            </Field>
            <Field label={t("addressLabel")} error={errors.address}>
              <Input
                value={values.address}
                onChange={(event) => updateField("address", event.target.value)}
                placeholder={t("addressPlaceholder")}
                autoComplete="street-address"
                aria-invalid={Boolean(errors.address)}
                className={cn(errors.address && "border-error focus-visible:border-error")}
              />
            </Field>
            <Field label={t("cityLabel")} error={errors.city}>
              <Input
                list="badyss-cities"
                value={values.city}
                onChange={(event) => updateField("city", event.target.value)}
                placeholder={t("cityPlaceholder")}
                autoComplete="address-level2"
                aria-invalid={Boolean(errors.city)}
                className={cn(errors.city && "border-error focus-visible:border-error")}
              />
              <datalist id="badyss-cities">
                {MOROCCAN_CITIES.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </Field>
          </div>
        </div>

        <Button type="submit" size="lg" loading={status === "submitting"} disabled={isOutOfStock} className="w-full justify-center">
          {t("confirmOrder")}
        </Button>
        {submitError ? <p className="-mt-3 text-sm text-error">{submitError}</p> : null}

        <div className="border-t border-border pt-6">
          <CheckoutTrustBadges />
        </div>
      </form>

      <aside className="order-1 h-max border border-border p-6 md:sticky md:top-32 md:order-2">
        <h2 className="font-display text-lg font-extrabold">{tCheckout("yourOrder")}</h2>
        <div className="mt-4 flex gap-4">
          <ProductImage image={resolvedVariant?.image ?? product.images[0] ?? null} className="w-24 shrink-0" />
          <div className="flex-1">
            <OrderSummaryLine product={product} quantity={quantity} attributes={attributesEntries} />
            <div className="mt-3">
              <QuantityStepper quantity={quantity} onChange={setQuantity} size="sm" />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{t("total")}</span>
          <span className="font-medium text-foreground">{formatPrice(totalPrice, effectivePrice.currency)}</span>
        </div>
        {savings?.percent ? (
          <p className="mt-1 text-xs text-accent">{tCheckout("quantityDiscountApplied", { percent: savings.percent })}</p>
        ) : null}
        {savings?.amount ? (
          <p className="mt-1 text-xs text-accent">
            {tCheckout("quantityDiscountAppliedAmount", { amount: formatPrice(savings.amount, effectivePrice.currency) ?? "" })}
          </p>
        ) : null}
        {shouldShowMoreThanMaxCta(effectiveOffer, quantity) ? (
          <p className="mt-2 text-xs text-muted-foreground">
            {tProduct("moreThanMaxCta")}{" "}
            <a
              href={effectiveOffer.moreThanMax.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline underline-offset-2"
            >
              {tProduct("moreThanMaxLink")}
            </a>
          </p>
        ) : null}
        <p className="mt-2 text-xs text-muted-foreground">{tCheckout("shippingSeparately")}</p>
        <ReassuranceStrip className="mt-4 flex-col items-start gap-2 border-t border-border pt-4" />
        <Link
          href={routes.product(product.slug)}
          className="mt-4 block text-center text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          {t("editProduct")}
        </Link>
      </aside>
    </div>
  );
}
