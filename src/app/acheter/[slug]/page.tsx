import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { BuyNowCheckout } from "@/components/checkout/BuyNowCheckout";
import { getProductBySlug } from "@/lib/api";

interface BuyNowPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ qty?: string; attrs?: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("buyNow");
  return { title: t("metaTitle"), robots: { index: false, follow: true } };
}

function parseQuantity(raw: string | undefined): number {
  const value = raw ? Number.parseInt(raw, 10) : 1;
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, 99);
}

function parseAttributes(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const entries = Object.entries(parsed as Record<string, unknown>).filter(
      (entry): entry is [string, string] => typeof entry[1] === "string"
    );
    return Object.fromEntries(entries);
  } catch {
    return {};
  }
}

// Single-product "Acheter maintenant" checkout page — the selected
// attributes/quantity arrive via the query string from `AddToCartPanel`'s
// Buy Now button (no cart involved, so there's nothing to read from
// CartContext). `attrs` is display-only here (see BuyNowCheckout) — the
// product page is still the source of truth for actually picking variants.
export default async function BuyNowPage({ params, searchParams }: BuyNowPageProps) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const initialQuantity = parseQuantity(query.qty);
  const initialAttributes = parseAttributes(query.attrs);
  const t = await getTranslations("buyNow");

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      <h1 className="mt-3 font-display text-display-lg font-extrabold leading-[0.95] tracking-tight">
        {t("title")}
      </h1>
      <div className="mt-10">
        <BuyNowCheckout product={product} initialQuantity={initialQuantity} initialAttributes={initialAttributes} />
      </div>
    </Section>
  );
}
