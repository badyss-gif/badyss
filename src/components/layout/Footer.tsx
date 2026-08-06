import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";
import { getSocialLinks } from "@/lib/social";
import { ReassuranceStrip } from "@/components/shared/ReassuranceStrip";

const socialLinks = getSocialLinks({ includeWhatsApp: true });

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="group relative inline-block py-0.5">
      <span className="relative z-10 transition-colors duration-300 group-hover:text-foreground">
        {children}
      </span>
      <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-foreground transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");

  // Link groups use only routes confirmed in docs/BADYSS-SITE-BLUEPRINT.md
  // §2. Most destinations aren't built yet — expected per the blueprint's
  // recommended implementation order, not a bug. Built inside the component
  // (not module scope) since labels need the resolved-per-request `t`/`tNav`.
  const footerGroups = [
    {
      title: t("boutique"),
      links: [
        { label: t("toutVoir"), href: routes.shop },
        { label: tNav("grandesTailles"), href: routes.categories.grandesTailles },
        { label: tNav("tShirts"), href: routes.categories.tShirt },
        { label: tNav("ensembles"), href: routes.categories.ensembles },
      ],
    },
    {
      title: t("serviceClient"),
      href: routes.serviceClient,
      links: [
        { label: tNav("contact"), href: routes.contact },
        { label: t("faq"), href: routes.faq },
        { label: t("guideDesTailles"), href: routes.sizeGuide },
        { label: t("livraison"), href: routes.shipping },
        { label: t("retours"), href: routes.returns },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("confidentialite"), href: routes.privacyPolicy },
        { label: t("conditionsGenerales"), href: routes.terms },
        { label: t("cookies"), href: routes.cookies },
      ],
    },
  ];

  // Only fully verified facts (docs/BADYSS-SITE-BLUEPRINT.md §17).
  const reassurance = [
    { label: t("serviceClientDedie"), href: routes.contact },
    { label: t("grandesTaillesDisponibles"), href: routes.categories.grandesTailles },
    { label: siteConfig.contact.phone, href: `tel:${siteConfig.contact.phone}` },
  ];

  return (
    <footer className="border-t border-border bg-background text-sm text-muted-foreground">
      <Container className="flex flex-col gap-3 border-b border-border py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        {reassurance.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="font-display text-sm font-bold tracking-tight text-foreground transition-colors hover:text-accent"
          >
            {item.label}
          </Link>
        ))}
      </Container>

      <Container className="border-b border-border py-6">
        <ReassuranceStrip className="justify-center gap-x-8 gap-y-3 text-center" />
      </Container>

      <Container className="grid grid-cols-2 gap-8 py-16 sm:grid-cols-4">
        <div className="col-span-2 flex flex-col gap-4 sm:col-span-1">
          <Link href={routes.home} aria-label={siteConfig.name} className="w-fit">
            <Logo variant="auto" className="h-10" />
          </Link>
          <p className="max-w-[20ch] text-sm text-muted-foreground">{t("tagline")}</p>
          {socialLinks.length > 0 ? (
            <div className="mt-1 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-foreground hover:bg-muted"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          ) : null}

          {/* Real physical store, confirmed via its Google Maps listing
              (see config/site.ts). Shown in the footer so it's visible
              from every page, not just Contact. */}
          <div className="mt-2 border-t border-border pt-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("visitStore")}</p>
            <p className="mt-2 text-sm text-foreground">{siteConfig.store.name}</p>
            <p className="text-sm text-muted-foreground">{siteConfig.store.address}</p>
            <a
              href={siteConfig.store.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-foreground underline-offset-2 hover:underline"
            >
              {t("getDirections")}
            </a>
          </div>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="font-medium text-foreground">
              {group.href ? (
                <Link href={group.href} className="transition-colors hover:text-accent">
                  {group.title}
                </Link>
              ) : (
                group.title
              )}
            </h3>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <Container className="border-t border-border py-6 text-xs">
        {t("copyright", { year: new Date().getFullYear() })}
      </Container>
    </footer>
  );
}
