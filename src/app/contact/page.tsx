import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { WhatsAppIcon } from "@/components/ui/SocialIcons";
import { ReassuranceStrip } from "@/components/shared/ReassuranceStrip";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { getSocialLinks } from "@/lib/social";
import { getWhatsAppSupportUrl } from "@/lib/whatsapp";
import type { Locale } from "@/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

const socialLinks = getSocialLinks();

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const tFooter = await getTranslations("footer");
  const locale = (await getLocale()) as Locale;
  const whatsappUrl = getWhatsAppSupportUrl(locale);

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("eyebrow")}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <h1 className="mt-3 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
              {t("title")}
            </h1>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 max-w-sm text-muted-foreground">{t("subtitle")}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm">
              <div className="flex flex-col gap-1">
                {siteConfig.contact.serviceNumbers.map((number) => (
                  <a key={number} href={`tel:${number}`} className="font-display text-lg font-extrabold text-foreground">
                    {number}
                  </a>
                ))}
              </div>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  {t("chatOnWhatsApp")}
                </a>
              ) : null}
              <Link
                href={routes.faq}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {t("viewFaq")}
              </Link>
              <Link
                href={routes.sizeGuide}
                className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                {tFooter("guideDesTailles")}
              </Link>
            </div>
          </Reveal>

          {socialLinks.length > 0 ? (
            <Reveal delay={0.3}>
              <div className="mt-8 flex items-center gap-3 border-t border-border pt-6">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.32}>
            <div className="mt-8 border-t border-border pt-6">
              <ReassuranceStrip />
            </div>
          </Reveal>

          {/* Opening hours: only a "closes ~23:30" snapshot is verified (via
              the store's Google Maps listing), not a confirmed day-by-day
              schedule — linking out to the live listing avoids stating
              specific hours we can't stand behind. */}
          <Reveal delay={0.36}>
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("hoursLabel")}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t("hoursText")}</p>
            </div>
          </Reveal>

          {/* Real physical store, confirmed via its Google Maps listing
              (see config/site.ts). The `output=embed` query parameter is a
              key-less Google Maps embed — no Maps JavaScript API key is
              configured in this project, and none is needed for a simple
              location embed like this. */}
          <Reveal delay={0.42}>
            <div className="mt-8 border-t border-border pt-6">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("locationLabel")}</p>
              <p className="mt-3 text-sm text-muted-foreground">{t("storeVisitText")}</p>
              <div className="mt-4 aspect-[16/9] w-full overflow-hidden border border-border">
                <iframe
                  src={`https://www.google.com/maps?q=${encodeURIComponent(
                    `${siteConfig.store.name}, ${siteConfig.store.address}`
                  )}&output=embed`}
                  title={t("mapIframeTitle")}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full grayscale-[15%]"
                />
              </div>
              <p className="mt-3 text-sm text-foreground">{siteConfig.store.name}</p>
              <p className="text-sm text-muted-foreground">{siteConfig.store.address}</p>
              <a
                href={siteConfig.store.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-foreground underline-offset-2 hover:underline"
              >
                {t("getDirections")}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <Reveal delay={0.1}>
            <div className="border border-border p-6 sm:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
