import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPageShell, type LegalSection } from "@/components/legal/LegalPageShell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("cookies");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

// Honest about what actually runs today: no analytics/advertising script
// exists anywhere in this codebase (checked layout.tsx and every page — no
// gtag/GA/Meta Pixel), so the "cookies analytiques" section says exactly
// that instead of describing a tracking system that doesn't exist. The
// "essentiels" list below names the real localStorage keys this site uses
// (cart, wishlist, recently-viewed, recent searches, welcome-popup flag).
export default async function CookiesPage() {
  const t = await getTranslations("cookies");

  const sections: LegalSection[] = [
    { id: "quest-ce-quun-cookie", title: t("whatIsTitle"), content: <p>{t("whatIsContent")}</p> },
    {
      id: "cookies-essentiels",
      title: t("essentialTitle"),
      content: (
        <>
          <p>{t("essentialIntro")}</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>{t("essentialItem1")}</li>
            <li>{t("essentialItem2")}</li>
            <li>{t("essentialItem3")}</li>
            <li>{t("essentialItem4")}</li>
            <li>{t("essentialItem5")}</li>
          </ul>
        </>
      ),
    },
    { id: "cookies-analytiques", title: t("analyticsTitle"), content: <p>{t("analyticsContent")}</p> },
    { id: "cookies-de-preference", title: t("preferenceTitle"), content: <p>{t("preferenceContent")}</p> },
    { id: "gestion-des-cookies", title: t("managementTitle"), content: <p>{t("managementContent")}</p> },
    { id: "consentement-de-lutilisateur", title: t("consentTitle"), content: <p>{t("consentContent")}</p> },
  ];

  return <LegalPageShell title={t("pageTitle")} intro={<p>{t("intro")}</p>} sections={sections} />;
}
