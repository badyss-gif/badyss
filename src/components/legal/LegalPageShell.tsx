import type { ReactNode } from "react";
import { getTranslations, getLocale } from "next-intl/server";
import { Section } from "@/components/ui/Section";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

interface LegalPageShellProps {
  title: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

// Real, complete content per section (see PendingInfo for the few
// business-specific facts that genuinely aren't confirmed yet) — this shell
// only provides the structural chrome (title, sticky-ready TOC, anchored
// sections), never generates "content en attente" filler on its own anymore.
export async function LegalPageShell({ title, intro, sections }: LegalPageShellProps) {
  const t = await getTranslations("legal");
  const locale = await getLocale();
  const updatedOn = new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <Section spacing="editorial" className="pt-24 lg:pt-28">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("infoLabel")}</p>
      <h1 className="mt-3 font-display text-display-lg font-extrabold tracking-tight">{title}</h1>
      <p className="mt-3 text-xs text-muted-foreground">
        {t("lastUpdated")} {updatedOn}
      </p>

      {intro ? <div className="mt-6 max-w-2xl text-muted-foreground">{intro}</div> : null}

      <nav aria-label={t("summary")} className="mt-10 max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">{t("summary")}</p>
        <ol className="mt-3 flex flex-col divide-y divide-border border-y border-border">
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className="flex items-center gap-4 py-4 transition-colors hover:text-accent"
              >
                <span className="text-xs text-muted-foreground">{String(index + 1).padStart(2, "0")}</span>
                <span>{section.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-14 flex max-w-2xl flex-col gap-12">
        {sections.map((section, index) => (
          <div key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="font-display text-lg font-extrabold tracking-tight">
              {String(index + 1).padStart(2, "0")}. {section.title}
            </h2>
            <div className="mt-3 flex flex-col gap-3 text-sm text-muted-foreground">{section.content}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
