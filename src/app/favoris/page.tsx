import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { FavoritesClient } from "@/components/wishlist/FavoritesClient";
import { getProducts } from "@/lib/api";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("wishlist");
  return { title: t("title"), robots: { index: false, follow: true } };
}

export default async function FavoritesPage() {
  const products = await getProducts();
  const t = await getTranslations("wishlist");

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-display-lg font-extrabold tracking-tight">{t("title")}</h1>
      <div className="mt-12">
        <FavoritesClient products={products} />
      </div>
    </Section>
  );
}
