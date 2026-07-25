import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { HeroSection } from "@/components/sections/HeroSection";
import { ScrollMarquee } from "@/components/sections/ScrollMarquee";
import { BrandStatement } from "@/components/sections/BrandStatement";
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
import { Testimonials } from "@/components/sections/Testimonials";
import { Community } from "@/components/sections/Community";
import { FaqPreview } from "@/components/sections/FaqPreview";
import { Newsletter } from "@/components/sections/Newsletter";
import { mockFeaturedProducts } from "@/lib/mock-data/products";
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
// carry real commerce (real routes, real mock product data, real verified
// facts only) without ever reverting to a plain grid-and-banner layout.
// TopBar/Header/Footer/WelcomePopup are rendered once in the root layout.
export default async function Home() {
  const t = await getTranslations("home.featuredProducts");

  return (
    <>
      <HeroSection />
      <ScrollMarquee />
      <BrandStatement />
      <CategoryShowcase />
      <WhyBadyss />
      <FeaturedProducts
        heading={t("heading")}
        products={mockFeaturedProducts}
        ctaLabel={t("ctaLabel")}
        ctaHref={routes.shop}
      />
      <VideoSection poster="/images/hero/desktop.png" posterAlt={HERO_ALT} />
      <EditorialProductHybrid product={mockFeaturedProducts[1]} />
      <EditorialCampaign />
      <LargeSizeCollection />
      <BrandValues />
      <Lookbook />
      <CustomerBenefits />
      <Testimonials />
      <Community />
      <FaqPreview />
      <Newsletter />
    </>
  );
}
