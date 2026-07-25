import type { Metadata } from "next";
import { HeroConceptSelector } from "@/components/hero-experiments/HeroConceptSelector";
import { HeroCinematicEditorial } from "@/components/hero-experiments/HeroCinematicEditorial";
import { HeroTypographic } from "@/components/hero-experiments/HeroTypographic";
import { HeroImmersiveParallax } from "@/components/hero-experiments/HeroImmersiveParallax";
import { HeroSplitInteractive } from "@/components/hero-experiments/HeroSplitInteractive";
import { HeroExperimental } from "@/components/hero-experiments/HeroExperimental";
import { heroConcepts } from "@/components/hero-experiments/concepts";

// Internal, development-only comparison route — not part of the
// customer-facing site, same treatment as `/design-system` (noindex here,
// plus disallowed in robots.ts). Nothing here is wired into `/` yet; this
// page exists purely to judge the 5 Hero directions side by side before one
// is chosen for the real homepage.
export const metadata: Metadata = {
  title: "Hero Experiments",
  robots: { index: false, follow: false },
};

export default function HeroExperimentsPage() {
  return (
    <div className="pb-24">
      <div className="border-b border-border bg-background px-4 py-6 sm:px-6 lg:px-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Interne — pas le site public
        </p>
        <h1 className="mt-2 font-display text-display-sm font-extrabold tracking-tight">
          Exploration Hero BADYSS
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Cinq directions créatives complètes, pour comparaison uniquement. Aucune n&apos;est encore
          intégrée à la page d&apos;accueil.
        </p>
      </div>

      <HeroConceptSelector />

      <section id={heroConcepts[0].id} className="scroll-mt-24">
        <HeroCinematicEditorial />
      </section>
      <section id={heroConcepts[1].id} className="scroll-mt-24">
        <HeroTypographic />
      </section>
      <section id={heroConcepts[2].id} className="scroll-mt-24">
        <HeroImmersiveParallax />
      </section>
      <section id={heroConcepts[3].id} className="scroll-mt-24">
        <HeroSplitInteractive />
      </section>
      <section id={heroConcepts[4].id} className="scroll-mt-24">
        <HeroExperimental />
      </section>
    </div>
  );
}
