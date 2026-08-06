import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { REASSURANCE_ITEMS } from "@/lib/reassurance";

// Homepage reinforcement of the five client-confirmed purchase
// reassurances, styled as the same card grid as WhyBadyss/service-client so
// the pattern reads as one system across the site.
export async function ReassuranceSection() {
  const t = await getTranslations("reassurance");

  return (
    <Section spacing="editorial" className="border-t border-border">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {REASSURANCE_ITEMS.map(({ key, icon: Icon }, index) => (
          <Reveal key={key} delay={index * 0.06}>
            <div className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-border p-6 text-center transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <p className="font-display text-sm font-extrabold tracking-tight">{t(key)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
