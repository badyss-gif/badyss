import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("returns");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

// PLACEHOLDER — no verified return policy exists yet
// (docs/BADYSS-SITE-BLUEPRINT.md §18). Deliberately not inventing return
// windows, conditions, or costs — the steps above describe the general
// process, not specific deadlines/fees.
export default async function ReturnsPage() {
  const t = await getTranslations("returns");
  const steps = [
    { label: t("step1Label"), detail: t("step1Detail") },
    { label: t("step2Label"), detail: t("step2Detail") },
    { label: t("step3Label"), detail: t("step3Detail") },
  ];

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h1 className="mt-3 font-display text-display-lg font-extrabold tracking-tight">{t("title")}</h1>
      </Reveal>
      <Reveal delay={0.12}>
        <p className="mt-4 max-w-lg text-muted-foreground">{t("subtitle")}</p>
      </Reveal>

      <div className="mt-12 grid gap-3 sm:grid-cols-3">
        {steps.map((step, index) => (
          <Reveal key={step.label} delay={index * 0.06}>
            <div className="h-full border border-border p-5">
              <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-2 font-display font-extrabold tracking-tight">{step.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 max-w-xl border border-border bg-muted p-6 text-sm">
          <p className="font-medium text-foreground">{t("infoTitle")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("infoBodyPrefix")}{" "}
            <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
              {siteConfig.contact.phone}
            </a>
            .
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.26}>
        <p className="mt-6 text-sm text-muted-foreground">
          {t("helpPrefix")}{" "}
          <Link href={routes.contact} className="text-foreground underline underline-offset-2">
            {t("contactServiceClient")}
          </Link>
          .
        </p>
      </Reveal>
    </Section>
  );
}
