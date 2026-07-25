import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

// A dedicated, full-width moment before the footer — not a form squeezed
// into a footer column. Dark/inverse tone marks it as its own "final act"
// rather than more of the same light commerce rhythm.
export async function Newsletter() {
  const t = await getTranslations("home.newsletter");

  return (
    <Section spacing="editorial" tone="inverse" className="relative overflow-hidden text-center">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/25 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-1/4 h-72 w-72 translate-x-1/2 rounded-full bg-inverse-foreground/10 blur-[100px]"
      />
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-inverse-foreground/60">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mx-auto mt-4 max-w-2xl font-display text-display-md font-extrabold leading-[1.05] tracking-tight sm:text-display-lg">
          {t("heading")}
        </h2>
      </Reveal>
      <Reveal delay={0.16}>
        <p className="mx-auto mt-4 max-w-md text-inverse-foreground/70">{t("body")}</p>
      </Reveal>
      <Reveal delay={0.24}>
        <div className="mx-auto mt-8 flex justify-center">
          <NewsletterForm tone="dark" />
        </div>
      </Reveal>
    </Section>
  );
}
