import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LegalPageShell, type LegalSection } from "@/components/legal/LegalPageShell";
import { PendingInfo } from "@/components/legal/PendingInfo";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

// Real, substantive content throughout — only the handful of genuinely
// business-specific facts (legal entity name, RC/ICE number, registered
// address, DPO contact email) are marked with <PendingInfo>, never invented.
// See docs/BADYSS-SITE-BLUEPRINT.md §17/§20 and PROJECT_STATUS.md for what's
// been checked and confirmed NOT_FOUND on the live site.
export default async function PrivacyPolicyPage() {
  const t = await getTranslations("privacy");

  const sections: LegalSection[] = [
    {
      id: "introduction",
      title: t("introTitle"),
      content: (
        <>
          <p>{t("introBody1")}</p>
          <p>{t("introBody2")}</p>
        </>
      ),
    },
    {
      id: "donnees-collectees",
      title: t("dataCollectedTitle"),
      content: (
        <>
          <p>{t("dataCollectedIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <span className="text-foreground">{t("dataCollectedItem1Label")}</span> {t("dataCollectedItem1")}
            </li>
            <li>
              <span className="text-foreground">{t("dataCollectedItem2Label")}</span> {t("dataCollectedItem2")}
            </li>
            <li>
              <span className="text-foreground">{t("dataCollectedItem3Label")}</span> {t("dataCollectedItem3")}
            </li>
            <li>
              <span className="text-foreground">{t("dataCollectedItem4Label")}</span> {t("dataCollectedItem4")}
            </li>
          </ul>
          <p>{t("dataCollectedClosing")}</p>
        </>
      ),
    },
    {
      id: "utilisation-des-donnees",
      title: t("dataUseTitle"),
      content: (
        <>
          <p>{t("dataUseIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>{t("dataUseItem1")}</li>
            <li>{t("dataUseItem2")}</li>
            <li>{t("dataUseItem3")}</li>
            <li>{t("dataUseItem4")}</li>
            <li>{t("dataUseItem5")}</li>
            <li>{t("dataUseItem6")}</li>
          </ul>
          <p>{t("dataUseClosing")}</p>
        </>
      ),
    },
    {
      id: "cookies",
      title: t("cookiesTitle"),
      content: (
        <p>
          {t("cookiesContentPrefix")}{" "}
          <Link href={routes.cookies} className="text-foreground underline underline-offset-2">
            {t("cookiesPageLink")}
          </Link>
          .
        </p>
      ),
    },
    {
      id: "conservation",
      title: t("retentionTitle"),
      content: (
        <>
          <p>{t("retentionIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>{t("retentionItem1")}</li>
            <li>{t("retentionItem2")}</li>
            <li>{t("retentionItem3")}</li>
          </ul>
        </>
      ),
    },
    { id: "securite", title: t("securityTitle"), content: <p>{t("securityContent")}</p> },
    {
      id: "droits-des-utilisateurs",
      title: t("rightsTitle"),
      content: (
        <>
          <p>{t("rightsIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>{t("rightsItem1")}</li>
            <li>{t("rightsItem2")}</li>
            <li>{t("rightsItem3")}</li>
            <li>{t("rightsItem4")}</li>
            <li>{t("rightsItem5")}</li>
          </ul>
          <p>
            {t("rightsClosingPrefix")}
            <PendingInfo>{t("authorityPending")}</PendingInfo>).
          </p>
        </>
      ),
    },
    {
      id: "contact",
      title: t("contactTitle"),
      content: (
        <>
          <p>{t("contactIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              {t("contactByPhone")}{" "}
              <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
                {siteConfig.contact.phone}
              </a>
              ;
            </li>
            <li>
              {t("contactByForm")}{" "}
              <Link href={routes.contact} className="text-foreground underline underline-offset-2">
                {t("contactFormLink")}
              </Link>{" "}
              ;
            </li>
            <li>
              {t("contactByEmail")} <PendingInfo>{t("emailPending")}</PendingInfo>.
            </li>
          </ul>
          <p>
            {t("entityLabel")} <PendingInfo>{t("entityPending")}</PendingInfo>.
          </p>
        </>
      ),
    },
  ];

  return <LegalPageShell title={t("pageTitle")} intro={<p>{t("intro")}</p>} sections={sections} />;
}
