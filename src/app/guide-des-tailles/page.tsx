import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { SizeIllustration } from "@/components/size-guide/SizeIllustration";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("sizeGuide");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// Label progression only (no invented cm/inch measurements) — shows how the
// standard range continues into grandes tailles without asserting numbers
// that don't exist yet (see the PLACEHOLDER note below).
const sizeRange = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];

// PLACEHOLDER for the measurement table — no verified garment measurements
// exist yet (docs/BADYSS-SITE-BLUEPRINT.md §2: "needs real garment
// measurements from the client"). Deliberately not inventing a chest/waist
// table — a customer could genuinely rely on wrong numbers to pick a size,
// which is worse than an honest "not yet available" note. The generic
// "how to measure yourself" steps above are universal guidance, not
// BADYSS-specific data, so they're safe to publish now.
export default async function SizeGuidePage() {
  const t = await getTranslations("sizeGuide");

  const measuringSteps = [
    { letter: "A", label: t("measureChestLabel"), detail: t("measureChestDetail") },
    { letter: "B", label: t("measureWaistLabel"), detail: t("measureWaistDetail") },
    { letter: "C", label: t("measureHipsLabel"), detail: t("measureHipsDetail") },
  ];

  const tips = [t("tip1"), t("tip2"), t("tip3"), t("tip4")];

  const sizeFaqItems = [
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
  ];

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="mt-3 max-w-xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
          {t("title")}
        </h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-4 max-w-lg text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-14 grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="font-display text-lg font-extrabold tracking-tight">{t("howToMeasure")}</h2>
          </Reveal>

          <div className="mt-6 grid grid-cols-[auto_1fr] gap-6 sm:grid-cols-[140px_1fr]">
            <Reveal delay={0.04}>
              <SizeIllustration className="h-auto w-28 text-muted-foreground sm:w-full" />
            </Reveal>
            <div className="flex flex-col divide-y divide-border border-y border-border">
              {measuringSteps.map((step, index) => (
                <Reveal key={step.label} delay={0.06 + index * 0.06}>
                  <div className="flex items-start gap-4 py-5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-foreground">
                      {step.letter}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{step.label}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{step.detail}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.3}>
            <h3 className="mt-10 font-display text-base font-extrabold tracking-tight">{t("tipsTitle")}</h3>
          </Reveal>
          <ul className="mt-4 flex flex-col gap-3">
            {tips.map((tip, index) => (
              <Reveal key={tip} delay={0.34 + index * 0.05}>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span aria-hidden className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground" />
                  {tip}
                </li>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-6">
          <Reveal>
            <h2 className="font-display text-lg font-extrabold tracking-tight">{t("fitTitle")}</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-4 text-muted-foreground">{t("fitBody")}</p>
          </Reveal>
          <Reveal delay={0.16}>
            <h2 className="mt-10 font-display text-lg font-extrabold tracking-tight">{t("grandesTaillesTitle")}</h2>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-4 text-muted-foreground">{t("grandesTaillesBody")}</p>
          </Reveal>
          <Reveal delay={0.28}>
            <div className="mt-6">
              <LinkButton href={routes.categories.grandesTailles} variant="secondary">
                {t("grandesTaillesCta")}
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-16">
        <Reveal>
          <h2 className="font-display text-lg font-extrabold tracking-tight">{t("sizeChartTitle")}</h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-6 overflow-x-auto">
            <div className="flex min-w-max divide-x divide-border border border-border">
              {sizeRange.map((size) => (
                <div key={size} className="flex-1 px-6 py-4 text-center">
                  <p className="font-display font-extrabold tracking-tight">{size}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-6 max-w-2xl border border-border bg-muted p-6 text-sm">
            <p className="font-medium text-foreground">{t("sizeChartPending")}</p>
            <p className="mt-2 text-muted-foreground">
              {t("sizeChartContactPrefix")}{" "}
              <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                {siteConfig.contact.phone}
              </a>{" "}
              {t("sizeChartContactMiddle")}{" "}
              <Link href={routes.faq} className="text-foreground underline underline-offset-2">
                FAQ
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </div>

      <div className="mt-16 max-w-2xl">
        <Reveal>
          <h2 className="font-display text-lg font-extrabold tracking-tight">{t("faqTitle")}</h2>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="mt-6">
            <FaqAccordion items={sizeFaqItems} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
