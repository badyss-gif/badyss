import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { LinkButton } from "@/components/ui/LinkButton";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

// A short, curated subset of the full FAQ page (src/app/faq) — same honest
// answers, not a duplicated data source rewritten from scratch.
export async function FaqPreview() {
  const t = await getTranslations("home.faqPreview");
  const items = [
    { question: t("q1"), answer: t("a1") },
    { question: t("q2"), answer: t("a2") },
    { question: t("q3"), answer: t("a3", { phone: siteConfig.contact.phone }) },
    { question: t("q4"), answer: t("a4") },
  ];

  return (
    <Section spacing="editorial" className="border-t border-border">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
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
        <Reveal delay={0.16}>
          <LinkButton href={routes.faq} variant="secondary">
            {t("cta")}
          </LinkButton>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mx-auto mt-10 max-w-3xl">
          <FaqAccordion items={items} />
        </div>
      </Reveal>
    </Section>
  );
}
