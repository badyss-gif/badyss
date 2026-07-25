import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { routes } from "@/config/routes";
import { TOPBAR_HEIGHT } from "@/config/layout";

interface TickerItem {
  label: string;
  href?: string;
}

function TickerContent({ items }: { items: TickerItem[] }) {
  return (
    <>
      {items.map((item, index) => (
        <span key={index} className="flex shrink-0 items-center gap-3 px-5">
          {item.href ? (
            <Link href={item.href} className="transition-opacity hover:opacity-70">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
          <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-current opacity-50" />
        </span>
      ))}
    </>
  );
}

// A branded ticker, not a generic announcement bar: solid accent color (the
// system's "one confident accent, used sparingly" — this is exactly the kind
// of highlight moment that earns it), always visible, distinct from the
// transparent/solid Header beneath it. Pure CSS marquee (see globals.css) —
// no client JS, loops seamlessly, pauses on hover/focus, and is fully inert
// under prefers-reduced-motion via a plain media query.
export async function TopBar() {
  const t = await getTranslations("topBar");

  // Real destinations only where a link is added — pure brand lines with no
  // natural destination stay plain text. Deliberately NOT including a
  // delivery/payment claim here (e.g. "Livraison partout au Maroc") —
  // docs/BADYSS-SITE-BLUEPRINT.md §1/§18 flags that exact claim as
  // contradicted by the live site's own shipping page.
  //
  // Eight distinct messages, not four or five: a marquee only reads as
  // "duplicated content" when one full lap is narrower than the viewport —
  // at that width, the technically-necessary second copy (for the seamless
  // `translateX(-50%)` loop) becomes simultaneously visible right next to
  // the first, and the repeat looks like a mistake rather than a loop. With
  // eight messages, one lap comfortably exceeds any real viewport width, so
  // the seam is never on screen at once.
  const tickerItems: TickerItem[] = [
    { label: t("styleUrbain") },
    { label: t("grandesTaillesDisponibles"), href: routes.categories.grandesTailles },
    { label: t("styleSansLimites") },
    { label: t("nouvelleCollection"), href: `${routes.shop}?sort=newest` },
    { label: t("decouvrirBadyss"), href: routes.about },
    { label: t("ensemblesEtTshirts"), href: routes.shop },
    { label: t("penseTouteslesSilhouettes") },
    { label: t("badyssMaroc") },
  ];

  return (
    <div
      style={{ height: TOPBAR_HEIGHT }}
      className="fixed inset-x-0 top-0 z-[70] flex items-center overflow-hidden bg-accent text-[10px] font-medium uppercase tracking-[0.18em] text-accent-foreground sm:text-xs sm:tracking-[0.2em]"
    >
      <div className="marquee-track flex w-max shrink-0">
        <TickerContent items={tickerItems} />
        <TickerContent items={tickerItems} />
      </div>
    </div>
  );
}
