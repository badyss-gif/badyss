"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface CollectionBannerData {
  image: string;
  alt: string;
  tagline: string;
}

// A slim, crossfading banner tied to the active category filter — the
// "collection banner" changes with the shopper's selection instead of
// staying static, without needing a full page navigation. Only real,
// existing campaign photography — one entry per top-level Shop category
// (the same 3 verified in CategoryShowcase) plus a default for "View all".
// No invented per-category imagery.
export function CollectionBanner({ categorySlug, label }: { categorySlug: string | null; label: string }) {
  const t = useTranslations("home.categoryShowcase");
  const tShop = useTranslations("shop");
  const tAlt = useTranslations("imageAlt");

  const banners: Record<string, CollectionBannerData> = {
    "grandes-tailles": {
      image: "/images/campaigns/grandes-tailles.png",
      alt: tAlt("campagneGrandesTailles"),
      tagline: t("grandesTaillesTagline"),
    },
    "t-shirt": {
      image: "/images/categories/t-shirts.png",
      alt: tAlt("tshirtPremium"),
      tagline: t("tShirtsTagline"),
    },
    "ensembles-grande-taille": {
      image: "/images/categories/ensembles.png",
      alt: tAlt("ensembleCoordonne"),
      tagline: t("ensemblesTagline"),
    },
  };

  const defaultBanner: CollectionBannerData = {
    image: "/images/editorial/campaign.png",
    alt: tAlt("campagneEditoriale"),
    tagline: tShop("defaultBannerTagline"),
  };

  const data = (categorySlug && banners[categorySlug]) || defaultBanner;

  return (
    <div className="relative h-28 w-full overflow-hidden rounded-2xl sm:h-36">
      <AnimatePresence mode="wait">
        <motion.div
          key={categorySlug ?? "all"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image src={data.image} alt={data.alt} fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 sm:inset-x-7">
            <p className="text-xs uppercase tracking-[0.25em] text-white/70">{label}</p>
            <p className="mt-1 font-display font-extrabold tracking-tight text-white">{data.tagline}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
