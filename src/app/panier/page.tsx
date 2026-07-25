import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { CartPageClient } from "@/components/cart/CartPageClient";
import { getProducts } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cart");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

export default async function CartPage() {
  const products = await getProducts();
  const t = await getTranslations("cart");

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
        {t("title")}
      </h1>
      <div className="mt-10">
        <CartPageClient products={products} />
      </div>
    </Section>
  );
}
