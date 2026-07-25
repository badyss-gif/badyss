import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";
import { getSocialLinks } from "@/lib/social";

const instagram = getSocialLinks().find((link) => link.label === "Instagram");

export async function ProductInstagramTeaser() {
  if (!instagram) return null;
  const t = await getTranslations("product");
  const tAlt = await getTranslations("imageAlt");

  // Same real, approved campaign photography as the homepage's Community
  // section (never a live feed integration or fake post/like counts) — a
  // compact teaser scaled for the bottom of a product page rather than a
  // full homepage section.
  const tiles = [
    { src: "/images/hero/desktop.png", alt: tAlt("styleUrbain") },
    { src: "/images/categories/ensembles.png", alt: tAlt("ensembleCoordonne") },
    { src: "/images/categories/t-shirts.png", alt: tAlt("tshirtPremium") },
    { src: "/images/campaigns/grandes-tailles.png", alt: tAlt("campagneGrandesTailles") },
  ];

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <Reveal>
          <h2 className="font-display text-display-sm font-extrabold tracking-tight">{t("followUs")}</h2>
        </Reveal>
        <Reveal delay={0.08}>
          <a
            href={instagram.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            <instagram.Icon className="h-4 w-4" />
            {instagram.label}
          </a>
        </Reveal>
      </div>
      <div className="mt-6 grid grid-cols-4 gap-3">
        {tiles.map((tile, index) => (
          <Reveal key={tile.src} delay={index * 0.05}>
            <div className="group relative aspect-square overflow-hidden">
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
