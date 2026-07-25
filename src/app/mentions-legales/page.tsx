import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageShell, type LegalSection } from "@/components/legal/LegalPageShell";
import { PendingInfo } from "@/components/legal/PendingInfo";
import { siteConfig } from "@/config/site";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("legalNotice");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

// The one legal page that is almost entirely business-specific facts (legal
// entity, publisher, host) rather than general policy — most sections are
// necessarily <PendingInfo> here, which is honest, not a shortcut: inventing
// a company name, RC/ICE number, or hosting provider would be worse than
// leaving it clearly marked.
export default async function LegalNoticePage() {
  const t = await getTranslations("legalNotice");

  const sections: LegalSection[] = [
    {
      id: "editeur-du-site",
      title: t("publisherTitle"),
      content: (
        <p>
          {t("publisherContentPrefix")} <PendingInfo>{t("publisherPending")}</PendingInfo>. {t("publisherContentMiddle")}{" "}
          <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
            {siteConfig.contact.phone}
          </a>
          .
        </p>
      ),
    },
    {
      id: "directeur-de-la-publication",
      title: t("directorTitle"),
      content: <PendingInfo>{t("directorPending")}</PendingInfo>,
    },
    { id: "hebergeur", title: t("hostTitle"), content: <PendingInfo>{t("hostPending")}</PendingInfo> },
    { id: "propriete-intellectuelle", title: t("ipTitle"), content: <p>{t("ipContent")}</p> },
    { id: "limitation-de-responsabilite", title: t("liabilityTitle"), content: <p>{t("liabilityContent")}</p> },
    {
      id: "contact",
      title: t("contactTitle"),
      content: (
        <p>
          {t("contactContentPrefix")}{" "}
          <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
            {siteConfig.contact.phone}
          </a>
          .
        </p>
      ),
    },
  ];

  return <LegalPageShell title={t("pageTitle")} sections={sections} />;
}
