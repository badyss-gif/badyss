import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

// Minimal luxury band: thin dividers, generous air, no imagery — a quiet
// counterpoint to the more visual sections around it, matching the
// "less, but confident" register high-fashion sites use for values/manifesto
// strips. Copy is brand positioning, not a fabricated fact.
export async function BrandValues() {
  const t = await getTranslations("home.brandValues");
  const values = [
    { index: "01", label: t("value1Label"), detail: t("value1Detail") },
    { index: "02", label: t("value2Label"), detail: t("value2Detail") },
    { index: "03", label: t("value3Label"), detail: t("value3Detail") },
  ];

  return (
    <Section spacing="editorial" className="border-t border-border">
      <div className="grid gap-10 sm:grid-cols-3 sm:divide-x sm:divide-border">
        {values.map((value, index) => (
          <Reveal key={value.index} delay={index * 0.1} className="sm:px-8 sm:first:pl-0 sm:last:pr-0">
            <span className="text-xs text-muted-foreground">{value.index}</span>
            <p className="mt-4 font-display text-2xl font-extrabold tracking-tight">{value.label}</p>
            <p className="mt-3 max-w-[28ch] text-sm text-muted-foreground">{value.detail}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
