import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/Reveal";

// A customer-journey timeline, not a fabricated company-history one — this
// project's standing rule is no invented founding dates/milestones (no
// verified brand history exists). The timeline visual language is real; the
// content is the genuinely true steps of buying from BADYSS today.
export async function BrandJourney() {
  const t = await getTranslations("about");
  const steps = [
    { index: "01", label: t("journeyStep1Label"), detail: t("journeyStep1Detail") },
    { index: "02", label: t("journeyStep2Label"), detail: t("journeyStep2Detail") },
    { index: "03", label: t("journeyStep3Label"), detail: t("journeyStep3Detail") },
    { index: "04", label: t("journeyStep4Label"), detail: t("journeyStep4Detail") },
  ];

  return (
    <div>
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("journeyEyebrow")}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 max-w-lg font-display text-display-md font-extrabold leading-[1.05] tracking-tight">
          {t("journeyTitle")}
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-0 sm:grid-cols-4">
        {steps.map((step, index) => (
          <Reveal key={step.index} delay={index * 0.08}>
            <div className="relative border-t-2 border-foreground pt-6 sm:mr-6">
              <span className="font-display text-sm font-bold text-muted-foreground">{step.index}</span>
              <p className="mt-3 font-display text-lg font-extrabold tracking-tight">{step.label}</p>
              <p className="mt-2 text-sm text-muted-foreground">{step.detail}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
