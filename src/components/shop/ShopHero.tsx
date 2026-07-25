import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

// Full-bleed, not padded inside the page's usual Container — built directly
// (like LargeSizeCollection) rather than through CreativeVisual, since this
// needs a custom viewport-relative height CreativeVisual's fixed aspect
// presets don't offer. Reuses the same approved hero photography as the
// homepage (no new/invented imagery), with a scrim + overlaid headline so
// the Boutique landing feels like the start of an experience rather than a
// bare product-listing page.
export async function ShopHero() {
  const t = await getTranslations("shop");
  const tAlt = await getTranslations("imageAlt");

  return (
    <div className="relative h-[42vh] min-h-[320px] w-full overflow-hidden bg-foreground sm:h-[50vh]">
      <Image
        src="/images/hero/desktop.png"
        alt={tAlt("styleUrbain")}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-8 sm:px-6 sm:pb-10 lg:px-8">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">{t("heroEyebrow")}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="mt-3 max-w-2xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight text-white sm:text-display-xl">
            {t("heroTitle")}
          </h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-4 max-w-md text-white/80">{t("heroSubtitle")}</p>
        </Reveal>
      </div>
    </div>
  );
}
