import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LegalPageShell, type LegalSection } from "@/components/legal/LegalPageShell";
import { PendingInfo } from "@/components/legal/PendingInfo";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("terms");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

// Real, substantive content — specific commitments that aren't verified yet
// (delivery timeframes/costs, return deadlines, exact payment methods) stay
// deliberately general here and point to the dedicated Livraison/Retours
// pages, which already carry their own honest "pending confirmation" notices
// rather than duplicating invented specifics on this page too.
export default async function TermsPage() {
  const t = await getTranslations("terms");

  const sections: LegalSection[] = [
    { id: "objet", title: t("objetTitle"), content: <p>{t("objetContent")}</p> },
    { id: "produits", title: t("produitsTitle"), content: <p>{t("produitsContent")}</p> },
    { id: "prix", title: t("prixTitle"), content: <p>{t("prixContent")}</p> },
    { id: "commande", title: t("commandeTitle"), content: <p>{t("commandeContent")}</p> },
    { id: "validation", title: t("validationTitle"), content: <p>{t("validationContent")}</p> },
    {
      id: "paiement",
      title: t("paiementTitle"),
      content: (
        <p>
          {t("paiementContentPrefix")} <PendingInfo>{t("paiementPending")}</PendingInfo>. {t("paiementContentSuffix")}
        </p>
      ),
    },
    {
      id: "livraison",
      title: t("livraisonTitle"),
      content: (
        <p>
          {t("livraisonContentPrefix")}{" "}
          <Link href={routes.shipping} className="text-foreground underline underline-offset-2">
            {t("livraisonTitle")}
          </Link>{" "}
          {t("livraisonContentMiddle")} <PendingInfo>{t("livraisonPending")}</PendingInfo>.
        </p>
      ),
    },
    {
      id: "retours",
      title: t("retoursTitle"),
      content: (
        <p>
          {t("retoursContentPrefix")}{" "}
          <Link href={routes.returns} className="text-foreground underline underline-offset-2">
            {t("retoursTitle")}
          </Link>
          . <PendingInfo>{t("retoursPending")}</PendingInfo>.
        </p>
      ),
    },
    { id: "responsabilite", title: t("responsabiliteTitle"), content: <p>{t("responsabiliteContent")}</p> },
    { id: "propriete-intellectuelle", title: t("proprieteTitle"), content: <p>{t("proprieteContent")}</p> },
    {
      id: "service-client",
      title: t("serviceClientTitle"),
      content: (
        <p>
          {t("serviceClientContentPrefix")}{" "}
          <Link href={routes.serviceClient} className="text-foreground underline underline-offset-2">
            {t("serviceClientTitle")}
          </Link>{" "}
          {t("serviceClientContentMiddle")}{" "}
          <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
            {siteConfig.contact.phone}
          </a>
          .
        </p>
      ),
    },
    {
      id: "contact",
      title: t("contactTitle"),
      content: (
        <p>
          BADYSS — <PendingInfo>{t("contactPending")}</PendingInfo>. {t("contactContentMiddle")}{" "}
          <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
            {siteConfig.contact.phone}
          </a>{" "}
          {t("contactContentSuffix")}{" "}
          <Link href={routes.contact} className="text-foreground underline underline-offset-2">
            {t("contactFormLink")}
          </Link>
          .
        </p>
      ),
    },
  ];

  return <LegalPageShell title={t("pageTitle")} intro={<p>{t("intro")}</p>} sections={sections} />;
}
