import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollMarquee } from "@/components/sections/ScrollMarquee";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { WhyBadyss } from "@/components/sections/WhyBadyss";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { VideoSection } from "@/components/sections/VideoSection";
import { EditorialProductHybrid } from "@/components/sections/EditorialProductHybrid";
import { EditorialCampaign } from "@/components/sections/EditorialCampaign";
import { LargeSizeCollection } from "@/components/sections/LargeSizeCollection";
import { BrandValues } from "@/components/sections/BrandValues";
import { Lookbook } from "@/components/sections/Lookbook";
import { CustomerBenefits } from "@/components/sections/CustomerBenefits";
import { ReassuranceSection } from "@/components/sections/ReassuranceSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { Community } from "@/components/sections/Community";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { Newsletter } from "@/components/sections/Newsletter";
import { getFeaturedProducts } from "@/lib/api";
import { routes } from "@/config/routes";

// Description is PROPOSED — states only verified catalog facts (ensembles,
// t-shirts, sneakers, grandes tailles all real), deliberately avoiding the
// disputed delivery/payment claims (see Footer's `reassurance` list).
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("home");
  return { description: t("metaDescription") };
}

const HERO_ALT = "Homme en tenue urbaine contemporaine BADYSS, marchant dans une rue moderne au Maroc.";

// Homepage as one continuous creative experience, not a stack of isolated
// e-commerce blocks: Hero pins and ScrollMarquee curtains up over it, the
// category journey pins and crossfades, the video frame scales in and out
// of view, and the editorial/product/campaign sections that follow all
// carry real commerce (real routes, live WooCommerce product data) without
// ever reverting to a plain grid-and-banner layout.
// TopBar/Header/Footer/WelcomePopup are rendered once in the root layout.
export default async function Home() {
  const t = await getTranslations("home.featuredProducts");
  const featuredProducts = await getFeaturedProducts(8);
  const spotlightProduct = featuredProducts[1] ?? featuredProducts[0];

  return (
    <>
      <HeroSection />
      <ScrollMarquee />
      <CategoryShowcase />
      <WhyBadyss />
      {featuredProducts.length > 0 ? (
        <FeaturedProducts
          heading={t("heading")}
          products={featuredProducts.slice(0, 4)}
          ctaLabel={t("ctaLabel")}
          ctaHref={routes.shop}
        />
      ) : null}
      <VideoSection poster="/images/hero/desktop.png" posterAlt={HERO_ALT} />
      {spotlightProduct ? <EditorialProductHybrid product={spotlightProduct} /> : null}
      <EditorialCampaign />
      <LargeSizeCollection />
      <BrandValues />
      <Lookbook />
      <CustomerBenefits />
      <Testimonials />
      <Community />
      <FaqPreview />
      <ReassuranceSection />
      <Newsletter />
    </>
  );
}
