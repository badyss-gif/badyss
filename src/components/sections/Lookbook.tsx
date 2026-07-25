import { getTranslations } from "next-intl/server";
import { CreativeVisual } from "@/components/ui/CreativeVisual";
import { LinkButton } from "@/components/ui/LinkButton";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { routes } from "@/config/routes";

// A two-up editorial lookbook, not a product grid — each card is a full
// creative visual with its own caption and CTA, existing approved campaign
// photography only (no invented lookbook shoot).
export async function Lookbook() {
  const t = await getTranslations("home.lookbook");
  const tAlt = await getTranslations("imageAlt");
  const looks = [
    {
      label: t("look1Label"),
      title: t("look1Title"),
      image: { src: "/images/categories/ensembles.png", alt: tAlt("ensembleCoordonne") },
      href: routes.categories.ensembles,
    },
    {
      label: t("look2Label"),
      title: t("look2Title"),
      image: { src: "/images/categories/t-shirts.png", alt: tAlt("tshirtPremium") },
      href: routes.categories.tShirt,
    },
  ];

  return (
    <Section spacing="editorial" className="border-t border-border">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 max-w-lg font-display text-display-md font-extrabold leading-[1.05] tracking-tight">
          {t("heading")}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-4 md:grid-cols-2 md:gap-6">
        {looks.map((look, index) => (
          <Reveal key={look.title} delay={index * 0.1}>
            <a href={look.href} className="group block">
              <CreativeVisual
                aspect="tall"
                overlay="scrim-bottom"
                image={look.image}
                contentPosition="bottom-left"
                className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-white/70">{look.label}</p>
                  <h3 className="mt-2 font-display text-display-sm font-extrabold tracking-tight text-white">
                    {look.title}
                  </h3>
                </div>
              </CreativeVisual>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-8 flex justify-center">
          <LinkButton href={routes.shop} variant="secondary">
            {t("cta")}
          </LinkButton>
        </div>
      </Reveal>
    </Section>
  );
}
