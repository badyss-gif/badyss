import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { FaqSearchExperience } from "@/components/faq/FaqSearchExperience";
import { siteConfig } from "@/config/site";
import { routes } from "@/config/routes";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("faq");
  return { title: t("metaTitle"), description: t("metaDescription") };
}

// Every answer here is either a verified fact (contact, real category
// slugs) or honestly marked as pending real business confirmation — the
// live site's own FAQ is 100% placeholder Lorem Ipsum
// (docs/BADYSS-SITE-BLUEPRINT.md §2), so nothing here is adapted from it,
// and no policy is invented.
export default async function FaqPage() {
  const t = await getTranslations("faq");

  const categories = [
    {
      id: "commandes",
      title: t("categoryOrdersTitle"),
      items: [
        { question: t("ordersQ1"), answer: t("ordersA1") },
        { question: t("ordersQ2"), answer: t("ordersA2", { phone: siteConfig.contact.phone }) },
      ],
    },
    {
      id: "livraison",
      title: t("categoryShippingTitle"),
      items: [
        { question: t("shippingQ1"), answer: t("shippingA1") },
        { question: t("shippingQ2"), answer: t("shippingA2") },
      ],
    },
    {
      id: "paiement",
      title: t("categoryPaymentTitle"),
      items: [{ question: t("paymentQ1"), answer: t("paymentA1") }],
    },
    {
      id: "tailles",
      title: t("categorySizesTitle"),
      items: [
        { question: t("sizesQ1"), answer: t("sizesA1") },
        { question: t("sizesQ2"), answer: t("sizesA2") },
      ],
    },
    {
      id: "retours",
      title: t("categoryReturnsTitle"),
      items: [{ question: t("returnsQ1"), answer: t("returnsA1") }],
    },
    {
      id: "produits",
      title: t("categoryProductsTitle"),
      items: [{ question: t("productsQ1"), answer: t("productsA1") }],
    },
    {
      id: "service-client",
      title: t("categoryServiceClientTitle"),
      items: [{ question: t("serviceClientQ1"), answer: t("serviceClientA1", { phone: siteConfig.contact.phone }) }],
    },
  ];

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-3 max-w-xl font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
        {t("title")}
      </h1>

      <div className="mt-8">
        <FaqSearchExperience categories={categories} />
      </div>

      <p className="mt-12 max-w-3xl text-sm text-muted-foreground">
        {t("noAnswerPrefix")}{" "}
        <Link href={routes.contact} className="text-foreground underline underline-offset-2">
          {t("contactUs")}
        </Link>
        .
      </p>
    </Section>
  );
}
