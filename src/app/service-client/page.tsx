import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle, Ruler, RotateCcw, Truck } from "lucide-react";
import { getTranslations, getLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { getWhatsAppSupportUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("serviceClient");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// A navigation hub, not a wall of text — every card links to a real, built
// page. WhatsApp only appears when a real number is configured
// (config/env.ts).
export default async function ServiceClientPage() {
  const t = await getTranslations("serviceClient");
  const tFooter = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const whatsappUrl = getWhatsAppSupportUrl(locale);

  const cards = [
    { label: t("contactCardLabel"), description: t("contactCardDesc"), href: routes.contact, Icon: MessageCircle },
    { label: tFooter("faq"), description: t("faqCardDesc"), href: routes.faq, Icon: HelpCircle },
    { label: tFooter("guideDesTailles"), description: t("sizeGuideCardDesc"), href: routes.sizeGuide, Icon: Ruler },
    { label: tFooter("livraison"), description: t("shippingCardDesc"), href: routes.shipping, Icon: Truck },
    { label: tFooter("retours"), description: t("returnsCardDesc"), href: routes.returns, Icon: RotateCcw },
  ];

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-3 max-w-xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
        {t("title")}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <a href={`tel:${siteConfig.contact.phone}`} className="font-medium text-foreground hover:underline">
          {siteConfig.contact.phone}
        </a>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 hover:text-foreground"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        ) : null}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, index) => (
          <Reveal key={card.href} delay={index * 0.05}>
            <Link
              href={card.href}
              className="group flex h-full flex-col gap-4 rounded-2xl border border-border p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                <card.Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display font-extrabold tracking-tight">{card.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              </div>
              <span className="mt-auto text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {t("learnMoreCta")}
              </span>
            </Link>
          </Reveal>
        ))}
        {whatsappUrl ? (
          <Reveal delay={cards.length * 0.05}>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col gap-4 rounded-2xl border border-border p-7 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-foreground/25 hover:shadow-lg"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display font-extrabold tracking-tight">WhatsApp</p>
                <p className="mt-1 text-sm text-muted-foreground">{t("whatsAppCardDesc")}</p>
              </div>
              <span className="mt-auto text-sm font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {t("openWhatsApp")}
              </span>
            </a>
          </Reveal>
        ) : null}
      </div>
    </Section>
  );
}
