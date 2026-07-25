import { getTranslations } from "next-intl/server";
import { FaqAccordion } from "@/components/faq/FaqAccordion";

// Generic, product-relevant questions — not the site-wide FAQ (see
// src/app/faq) — same honest, non-fabricated answers as the rest of the site.
export async function ProductFaq() {
  const t = await getTranslations("product");
  const items = [
    { question: t("faqQ1"), answer: t("faqA1") },
    { question: t("faqQ2"), answer: t("faqA2") },
    { question: t("faqQ3"), answer: t("faqA3") },
    { question: t("faqQ4"), answer: t("faqA4") },
  ];

  return (
    <div>
      <h2 className="font-display text-display-sm font-extrabold tracking-tight">{t("faqHeading")}</h2>
      <div className="mt-8 max-w-2xl">
        <FaqAccordion items={items} />
      </div>
    </div>
  );
}
