import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { CheckoutClient } from "@/components/checkout/CheckoutClient";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("checkout");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function CheckoutPage() {
  const t = await getTranslations("checkout");
  const tCart = await getTranslations("cart");

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{tCart("eyebrow")}</p>
      <h1 className="mt-3 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
        {t("title")}
      </h1>
      <div className="mt-10">
        <CheckoutClient />
      </div>
    </Section>
  );
}
