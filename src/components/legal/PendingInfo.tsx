import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

// Visually distinct inline marker for the one or two facts per section that
// genuinely can't be filled in yet (company registration number, registered
// address, DPO contact...) — everything else around it is real, complete
// text. Keeps "what still needs confirmation" scannable at a glance instead
// of buried in a single generic disclaimer at the top of the page.
export async function PendingInfo({ children }: { children: ReactNode }) {
  const t = await getTranslations("legal");

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-foreground">
      <span aria-hidden className="text-accent">
        •
      </span>
      <span>
        <span className="font-medium">{t("toConfirm")}</span> {children}
      </span>
    </span>
  );
}
