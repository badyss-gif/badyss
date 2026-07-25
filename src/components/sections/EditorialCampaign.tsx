import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { CreativeVisual } from "@/components/ui/CreativeVisual";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { routes } from "@/config/routes";

const pillarKeys = ["pillar1", "pillar2", "pillar3"] as const;

// Sticky-image scroll storytelling on desktop: the image pins in place
// (plain CSS `position: sticky`, not a scroll-hijack library) while the text
// column's extra height gives each block room to reveal in sequence as the
// user scrolls past. Mobile falls back to a simple stacked reveal — a
// composition difference, not a shrunk desktop layout.
// Copy is PROPOSED brand voice, general positioning only — no invented brand
// history, founder, or specific facts (docs/BADYSS-SITE-BLUEPRINT.md §1/§9).
export async function EditorialCampaign() {
  const t = await getTranslations("home.editorialCampaign");
  const tCommon = await getTranslations("common");

  return (
    <Section spacing="editorial" containerClassName="md:grid md:grid-cols-2 md:gap-16">
      <div className="relative md:sticky md:top-20 md:h-[80vh]">
        <span
          aria-hidden
          className="absolute -left-4 top-1/2 hidden -translate-y-1/2 origin-left rotate-90 whitespace-nowrap text-xs uppercase tracking-[0.35em] text-muted-foreground md:block"
        >
          {t("kicker")}
        </span>
        <CreativeVisual
          kind="campaign"
          aspect="tall"
          image={{ src: "/images/editorial/campaign.png", alt: t("imageAlt") }}
          className="h-full"
        />
      </div>
      <div className="mt-10 flex flex-col justify-center gap-10 md:mt-0 md:min-h-[150vh] md:py-24">
        <Reveal>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-display-md font-extrabold tracking-tight md:text-display-lg">
            {t("headingLine1")}
            <br />
            {t("headingLine2")}
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="max-w-md text-muted-foreground">{t("body")}</p>
        </Reveal>

        <div className="flex flex-col gap-6 border-t border-border pt-8">
          {pillarKeys.map((key, index) => (
            <Reveal key={key} delay={0.28 + index * 0.08}>
              <div className="flex items-start gap-4">
                <span className="font-display text-sm font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display font-extrabold tracking-tight">{t(`${key}Label`)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t(`${key}Detail`)}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.5}>
          <LinkButton href={routes.about} variant="secondary">
            {tCommon("learnMore")}
          </LinkButton>
        </Reveal>
      </div>
    </Section>
  );
}
