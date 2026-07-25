import { getTranslations } from "next-intl/server";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";

interface Testimonial {
  quote: string;
  name: string;
  location?: string;
  initials: string;
  dir?: "rtl";
}

// These are example/demo testimonials, not real customer reviews — BADYSS
// has no verified review data yet. Labeled "Avis client — exemple" (never
// "vérifié") on every card so nothing here is presented as a genuine,
// verified endorsement. Swap this array for real, verified reviews the
// moment they exist; the component itself needs no changes to do so.
const testimonials: Testimonial[] = [
  {
    quote: "Franchement la qualité est incroyable. Livraison rapide et le tissu est vraiment premium.",
    name: "Yassine",
    location: "Casablanca",
    initials: "Y",
  },
  {
    quote: "لباس زوين بزاف والخامة ممتازة. غادي نعاود نطلب مرة أخرى.",
    name: "حمزة",
    location: "الرباط",
    initials: "ح",
    dir: "rtl",
  },
  {
    quote: "Top qualité. Le pantalon tombe parfaitement. Je recommande.",
    name: "Mehdi",
    initials: "M",
  },
  {
    quote: "Service client réactif et vêtements conformes aux photos.",
    name: "Salma",
    initials: "S",
  },
  {
    quote: "Zwin bzaaf. Kifach ja lya l produit khir mn tsawer.",
    name: "Othmane",
    initials: "O",
  },
];

function StarRow() {
  return (
    <div className="flex items-center gap-0.5 text-accent" aria-hidden>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.6l5.79-.84L10 1.5z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, exampleBadge }: { testimonial: Testimonial; exampleBadge: string }) {
  const rtl = testimonial.dir === "rtl";

  return (
    <div
      className="group flex h-full w-[82vw] shrink-0 snap-start flex-col rounded-3xl border border-border bg-surface p-7 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-foreground/20 hover:shadow-xl sm:w-[360px]"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-foreground font-display text-sm font-extrabold text-background">
            {testimonial.initials}
          </span>
          <div>
            <p className="font-display text-sm font-extrabold tracking-tight text-foreground">
              {testimonial.name}
            </p>
            {testimonial.location ? (
              <p className="text-xs text-muted-foreground">{testimonial.location}</p>
            ) : null}
          </div>
        </div>
        <StarRow />
      </div>

      <p
        dir={rtl ? "rtl" : "ltr"}
        className={`mt-5 flex-1 text-[15px] leading-relaxed text-foreground/90 ${rtl ? "text-right" : "text-left"}`}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">
        {exampleBadge}
      </span>
    </div>
  );
}

// A premium horizontal rail, not a static 3-column grid: cards scroll-snap
// on every breakpoint (native scroll, no JS carousel state), while the
// section's own entrance still uses the standard vertical Reveal — the
// "elegant fade while scrolling" is the page scroll bringing the rail into
// view, distinct from the rail's own horizontal drag/swipe scroll.
export async function Testimonials() {
  const t = await getTranslations("home.testimonials");

  return (
    <Section spacing="editorial" className="border-t border-border">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("eyebrow")}</p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-3 max-w-xl font-display text-display-md font-extrabold leading-[1.05] tracking-tight sm:text-display-lg">
          {t("heading")}
        </h2>
      </Reveal>

      <Reveal delay={0.16}>
        <div className="mt-12 -mx-4 flex gap-5 overflow-x-auto scroll-px-4 px-4 pb-4 [scroll-snap-type:x_mandatory] scrollbar-hidden sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:scroll-px-0 lg:px-0">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} testimonial={testimonial} exampleBadge={t("exampleBadge")} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
