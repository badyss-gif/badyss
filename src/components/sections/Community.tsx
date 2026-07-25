import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { getSocialLinks } from "@/lib/social";

interface GridTile {
  src: string;
  alt: string;
  aspect: string;
}

// A mood grid of the same real, approved campaign photography used
// elsewhere on the site — never presented as a live Instagram feed (no fake
// posts, likes, or follower counts). Reusing existing assets here is
// deliberate: this section is about the brand world, not a feed integration
// that doesn't exist. Varied aspect ratios (not a uniform square grid) give
// the CSS-columns layout below a genuine masonry rhythm.
export async function Community() {
  const t = await getTranslations("home.community");
  const tAlt = await getTranslations("imageAlt");
  const socialLinks = getSocialLinks().map((link) => ({ ...link, label: t("followOn", { platform: link.label }) }));

  const tiles: GridTile[] = [
    { src: "/images/hero/desktop.png", alt: tAlt("styleUrbain"), aspect: "aspect-[3/4]" },
    { src: "/images/categories/ensembles.png", alt: tAlt("ensembleCoordonne"), aspect: "aspect-square" },
    { src: "/images/editorial/campaign.png", alt: tAlt("campagneEditoriale"), aspect: "aspect-[4/5]" },
    { src: "/images/categories/t-shirts.png", alt: tAlt("tshirtPremium"), aspect: "aspect-[3/5]" },
    { src: "/images/campaigns/grandes-tailles.png", alt: tAlt("campagneGrandesTailles"), aspect: "aspect-[4/5]" },
    { src: "/images/categories/grandes-tailles.png", alt: tAlt("styleGrandeTaille"), aspect: "aspect-square" },
  ];

  return (
    <Section spacing="editorial" className="border-t border-border">
      <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-3 max-w-md font-display text-display-md font-extrabold leading-[1.05] tracking-tight">
              {t("heading")}
            </h2>
          </Reveal>
        </div>
        {socialLinks.length > 0 ? (
          <Reveal delay={0.16}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{t("followUs")}</span>
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-foreground"
                >
                  <Icon className="h-4 w-4 transition-colors" />
                  {label}
                </a>
              ))}
            </div>
          </Reveal>
        ) : null}
      </div>

      <div className="mt-10 columns-2 gap-3 sm:columns-3 sm:gap-4">
        {tiles.map((tile, index) => (
          <Reveal key={tile.src} delay={index * 0.05} className="mb-3 break-inside-avoid sm:mb-4">
            <div className={`group relative overflow-hidden ${tile.aspect}`}>
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
