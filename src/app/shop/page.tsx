import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopExperience } from "@/components/shop/ShopExperience";
import { getProducts, getCategories } from "@/lib/api";
import type { ProductSortKey } from "@/features/products/sort";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("shop");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const validSortKeys: ProductSortKey[] = ["newest", "price-asc", "price-desc", "name-asc", "name-desc"];

interface ShopPageProps {
  searchParams: Promise<{ categorie?: string; sort?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, allCategories] = await Promise.all([getProducts(), getCategories()]);
  const topLevelCategories = allCategories.filter((category) => category.parentId === null);

  const initialSort = validSortKeys.includes(params.sort as ProductSortKey)
    ? (params.sort as ProductSortKey)
    : "newest";

  return (
    <>
      <ShopHero />

      <Section spacing="tight" className="pb-24 pt-10">
        <ShopExperience
          products={products}
          categories={topLevelCategories}
          initialCategorySlug={params.categorie ?? null}
          initialSort={initialSort}
        />
      </Section>
    </>
  );
}
