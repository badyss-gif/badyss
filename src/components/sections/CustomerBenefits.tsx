"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/LinkButton";
import { Reveal } from "@/components/motion/Reveal";
import { routes } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

// An interactive index/panel pair instead of the standard three-column icon
// strip — hovering or tapping a topic swaps the panel beside it. No claim
// here goes beyond what's actually confirmed; each still links to a real
// page for the eventual full detail.
export function CustomerBenefits() {
  const [active, setActive] = useState(0);
  const t = useTranslations("home.customerBenefits");
  const tFooter = useTranslations("footer");
  const tCommon = useTranslations("common");

  // Deliberately neutral, non-committal copy for anything not fully verified
  // (delivery/payment specifics — see docs/BADYSS-SITE-BLUEPRINT.md §1/§18)
  // so nothing here invents a claim. The phone number is the one genuinely
  // verified fact, so that entry gets more confident copy.
  const topics = [
    { index: "01", label: tFooter("livraison"), href: routes.shipping, copy: t("livraisonCopy") },
    { index: "02", label: tFooter("retours"), href: routes.returns, copy: t("retoursCopy") },
    { index: "03", label: tFooter("faq"), href: routes.faq, copy: t("faqCopy") },
    {
      index: "04",
      label: tFooter("serviceClient"),
      href: routes.contact,
      copy: t("serviceClientCopy", { phone: siteConfig.contact.phone }),
    },
    { index: "05", label: t("paiementLabel"), href: routes.shop, copy: t("paiementCopy") },
  ];

  return (
    <Section spacing="editorial" className="border-t border-border">
      <Reveal>
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="mt-3 font-display text-display-md font-extrabold tracking-tight">{t("heading")}</h2>
      </Reveal>

      <div className="mt-12 grid gap-8 md:grid-cols-12 md:gap-12">
        <div className="flex flex-col border-t border-border md:col-span-5 md:border-t-0">
          {topics.map((topic, index) => (
            <button
              key={topic.label}
              type="button"
              onClick={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              className={cn(
                "flex items-center gap-4 border-b border-border py-5 text-left transition-colors",
                active === index ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="text-xs">{topic.index}</span>
              <span className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
                {topic.label}
              </span>
            </button>
          ))}
        </div>

        <div className="relative min-h-[160px] md:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="max-w-md text-lg text-muted-foreground">{topics[active].copy}</p>
              <LinkButton href={topics[active].href} variant="secondary" className="mt-6">
                {tCommon("learnMore")}
              </LinkButton>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
