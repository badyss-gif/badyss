import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { CategoryHero } from "@/components/category/CategoryHero";
import { CategoryProductListing } from "@/components/category/CategoryProductListing";
import { getCategoryBySlug, getProductsByCategorySlug } from "@/lib/api";
import type { ProductSortKey } from "@/features/products/sort";

const validSortKeys: ProductSortKey[] = ["newest", "price-asc", "price-desc", "name-asc", "name-desc"];

interface CategoryPageProps {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug[slug.length - 1]);
  if (!category) return {};
  const t = await getTranslations("shop");
  return {
    title: category.name,
    description: t("categoryMetaDescription", { name: category.name }),
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const categorySlug = slug[slug.length - 1];
  const t = await getTranslations("shop");
  const tAlt = await getTranslations("imageAlt");

  const [category, products] = await Promise.all([
    getCategoryBySlug(categorySlug),
    getProductsByCategorySlug(categorySlug),
  ]);

  if (!category) notFound();

  // Editorial content per real, verified category slug
  // (docs/BADYSS-SITE-BLUEPRINT.md §2) — deliberately different hero
  // treatments so category pages don't share one repeated template. Copy is
  // style/positioning only, no invented sourcing or fit claims.
  const categoryContent: Record<
    string,
    {
      eyebrow: string;
      description: string;
      variant: "full-bleed" | "split" | "typographic";
      image?: { src: string; alt: string };
      imagePosition?: "left" | "right";
    }
  > = {
    "grandes-tailles": {
      eyebrow: t("categoryEyebrow"),
      description: t("categoryGrandesTaillesDescription"),
      variant: "full-bleed",
      image: { src: "/images/campaigns/grandes-tailles.png", alt: tAlt("campagneGrandesTailles") },
    },
    "t-shirt": {
      eyebrow: t("categoryEyebrow"),
      description: t("categoryTshirtDescription"),
      variant: "split",
      imagePosition: "left",
      image: { src: "/images/categories/t-shirts.png", alt: tAlt("tshirtPremiumUrbain") },
    },
    "ensembles-grande-taille": {
      eyebrow: t("categoryEyebrow"),
      description: t("categoryEnsemblesDescription"),
      variant: "split",
      imagePosition: "right",
      image: { src: "/images/categories/ensembles.png", alt: tAlt("ensembleCoordonne") },
    },
  };

  const content = categoryContent[categorySlug] ?? {
    eyebrow: t("categoryEyebrow"),
    description: t("categoryFallbackDescription", { name: category.name }),
    variant: "typographic" as const,
  };

  const initialSort = validSortKeys.includes(search.sort as ProductSortKey)
    ? (search.sort as ProductSortKey)
    : "newest";

  return (
    <>
      <CategoryHero
        eyebrow={content.eyebrow}
        title={category.name}
        description={content.description}
        variant={content.variant}
        image={content.image}
        imagePosition={content.imagePosition}
      />
      <Section spacing="tight" className="pb-24 pt-12">
        <CategoryProductListing
          products={products}
          basePath={`/product-category/${slug.join("/")}`}
          initialSort={initialSort}
        />
      </Section>
    </>
  );
}
