import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ProductGallery } from "@/components/commerce/ProductGallery";
import { AddToCartPanel } from "@/components/commerce/AddToCartPanel";
import { ProductCard } from "@/components/commerce/ProductCard";
import { ProductFaq } from "@/components/commerce/ProductFaq";
import { ProductInstagramTeaser } from "@/components/commerce/ProductInstagramTeaser";
import { RecentlyViewed } from "@/components/commerce/RecentlyViewed";
import { RecordProductView } from "@/components/commerce/RecordProductView";
import { getCompleteTheLookProducts } from "@/features/products/related";
import { getProductBySlug, getRelatedProducts, getProducts } from "@/lib/api";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription || `${product.name} — BADYSS.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, allProducts] = await Promise.all([getRelatedProducts(product), getProducts()]);
  const completeTheLook = getCompleteTheLookProducts(product, allProducts);
  const description = product.description || product.shortDescription;
  const t = await getTranslations("product");

  return (
    <>
      <RecordProductView productId={product.id} />

      <Section spacing="tight" className="pt-24 lg:pt-28">
        <div className="grid gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div>
            <ProductGallery images={product.images} productName={product.name} />
          </div>
          <div className="md:sticky md:top-32 md:self-start">
            <AddToCartPanel product={product} />
          </div>
        </div>

        {description ? (
          <div className="mt-16 max-w-2xl border-t border-border pt-10">
            <h2 className="font-display text-lg font-extrabold">{t("description")}</h2>
            {/* WooCommerce descriptions are merchant-authored HTML (paragraphs,
                headings, lists) from the same admin that already controls the
                rest of the catalog — rendered as markup here, not escaped
                text, or every product description would show its raw tags. */}
            <div
              className="mt-3 text-muted-foreground [&_h3]:mt-6 [&_h3]:font-display [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-foreground [&_li]:mt-1 [&_p]:mt-3 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 first:[&>*]:mt-0"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        ) : null}
      </Section>

      {completeTheLook.length > 0 ? (
        <Section spacing="editorial" className="border-t border-border">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("completeTheLook")}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 font-display text-display-sm font-extrabold tracking-tight">
              {t("composeYourLook")}
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {completeTheLook.map((lookProduct, index) => (
              <Reveal key={lookProduct.id} delay={index * 0.05}>
                <ProductCard product={lookProduct} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section spacing="editorial" className="border-t border-border">
          <Reveal>
            <h2 className="font-display text-display-sm font-extrabold tracking-tight">{t("youMayAlsoLike")}</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-4">
            {related.map((relatedProduct, index) => (
              <Reveal key={relatedProduct.id} delay={index * 0.05}>
                <ProductCard product={relatedProduct} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <RecentlyViewed allProducts={allProducts} currentProductId={product.id} />

      <Section spacing="editorial" className="border-t border-border">
        <ProductFaq />
      </Section>

      <Section spacing="editorial" className="border-t border-border">
        <ProductInstagramTeaser />
      </Section>
    </>
  );
}
