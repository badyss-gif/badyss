import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { VideoSection } from "@/components/sections/VideoSection";
import { BrandValues } from "@/components/sections/BrandValues";
import { WhyBadyss } from "@/components/sections/WhyBadyss";
import { BrandJourney } from "@/components/about/BrandJourney";
import { routes } from "@/config/routes";
import { getSocialLinks } from "@/lib/social";

const HERO_ALT = "Homme en tenue urbaine contemporaine BADYSS, marchant dans une rue moderne au Maroc.";

const socialLinks = getSocialLinks();

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("about");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// Editorial brand page — large typography, real photography, no invented
// brand history/founder/timeline (docs/BADYSS-SITE-BLUEPRINT.md §1/§9
// explicitly rule out adapting the live site's unrelated "Alma Seven" demo
// content). Everything here is positioning/values copy, not fabricated fact.
export default async function AboutPage() {
  const t = await getTranslations("about");
  const tAlt = await getTranslations("imageAlt");

  return (
    <>
      <div className="relative flex min-h-[70vh] w-full items-end overflow-hidden bg-foreground sm:min-h-[85vh]">
        <Image
          src="/images/editorial/campaign.png"
          alt={tAlt("campagneEditoriale")}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/30" />
        <div className="relative z-10 w-full px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/70">{t("heroEyebrow")}</p>
          <h1 className="mt-3 max-w-2xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight text-white sm:text-display-2xl">
            {t("heroTitleLine1")}
            <br />
            {t("heroTitleLine2")}
          </h1>
        </div>
      </div>

      <Section spacing="editorial">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("approachEyebrow")}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="mt-4 font-display text-display-md font-extrabold leading-[1.05] tracking-tight">
                {t("approachTitle")}
              </h2>
            </Reveal>
          </div>
          <div className="flex flex-col gap-6 lg:col-span-6 lg:col-start-7">
            <Reveal delay={0.12}>
              <p className="text-lg text-muted-foreground">{t("approachBody1")}</p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="text-muted-foreground">{t("approachBody2")}</p>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section spacing="editorial" className="border-t border-border" tone="inverse">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-inverse-foreground/60">{t("missionEyebrow")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 font-display text-display-md font-extrabold leading-[1.1] tracking-tight sm:text-display-lg">
              {t("missionTitle")}
            </h2>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-6 text-inverse-foreground/75">{t("missionBody")}</p>
          </Reveal>
        </div>
      </Section>

      <Section spacing="editorial" className="border-t border-border">
        <BrandJourney />
      </Section>

      <Section spacing="tight" withContainer={false} className="border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <div className="relative aspect-[4/5]">
            <Image
              src="/images/categories/grandes-tailles.png"
              alt={tAlt("styleGrandeTaille")}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-6 px-4 py-14 sm:px-10 lg:px-16">
            <Reveal>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("grandesTaillesEyebrow")}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h2 className="font-display text-display-sm font-extrabold leading-[1.05] tracking-tight sm:text-display-md">
                {t("grandesTaillesTitle")}
              </h2>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="max-w-sm text-muted-foreground">{t("grandesTaillesBody")}</p>
            </Reveal>
            <Reveal delay={0.24}>
              <LinkButton href={routes.categories.grandesTailles} variant="secondary" className="w-fit">
                {t("grandesTaillesCta")}
              </LinkButton>
            </Reveal>
          </div>
        </div>
      </Section>

      <VideoSection poster="/images/hero/desktop.png" posterAlt={HERO_ALT} />

      <BrandValues />

      <WhyBadyss />

      <Section spacing="editorial" tone="inverse" className="text-center">
        <Reveal>
          <h2 className="mx-auto max-w-xl font-display text-display-md font-extrabold leading-[1.05] tracking-tight">
            {t("closingTitle")}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-8">
            <LinkButton href={routes.shop} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {t("closingCta")}
            </LinkButton>
          </div>
        </Reveal>
        {socialLinks.length > 0 ? (
          <Reveal delay={0.18}>
            <div className="mt-10 flex items-center justify-center gap-4">
              <p className="text-xs uppercase tracking-[0.3em] text-inverse-foreground/60">{t("followUs")}</p>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-inverse-foreground transition-colors hover:bg-white/10"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}
      </Section>
    </>
  );
}
