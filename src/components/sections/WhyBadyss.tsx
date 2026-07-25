import { Sparkles, Truck, Ruler, MessageCircle } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

// Brand value props, not specific commitments — deliberately no speed/time
// guarantees on the "Livraison rapide" card body (only the earlier
// LargeSizeCollection/CustomerBenefits precedent stands: no fabricated
// delivery timeframes, docs/BADYSS-SITE-BLUEPRINT.md §1/§18).
export async function WhyBadyss() {
  const t = await getTranslations("home.whyBadyss");
  const tNav = await getTranslations("nav");
  const tFooter = await getTranslations("footer");

  // Pillars 3/4 reuse the exact same words already translated elsewhere
  // ("Grandes tailles" / "Service client") rather than duplicating them.
  const pillars = [
    { icon: Sparkles, label: t("pillar1Label"), detail: t("pillar1Detail") },
    { icon: Truck, label: t("pillar2Label"), detail: t("pillar2Detail") },
    { icon: Ruler, label: tNav("grandesTailles"), detail: t("pillar3Detail") },
    { icon: MessageCircle, label: tFooter("serviceClient"), detail: t("pillar4Detail") },
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

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.label} delay={index * 0.06}>
            <div className="group h-full rounded-2xl border border-border p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                <pillar.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="mt-5 font-display font-extrabold tracking-tight">{pillar.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{pillar.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
