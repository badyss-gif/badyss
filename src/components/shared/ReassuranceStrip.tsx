"use client";

import { useTranslations } from "next-intl";
import { REASSURANCE_ITEMS } from "@/lib/reassurance";
import { cn } from "@/lib/utils";

interface ReassuranceStripProps {
  className?: string;
}

// Compact icon+label row — reused as-is in the Footer band, the Contact
// page, and both checkout sidebars, so the five reassurance facts read
// identically everywhere they appear.
export function ReassuranceStrip({ className }: ReassuranceStripProps) {
  const t = useTranslations("reassurance");

  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-3", className)}>
      {REASSURANCE_ITEMS.map(({ key, icon: Icon }) => (
        <div key={key} className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          <span>{t(key)}</span>
        </div>
      ))}
    </div>
  );
}
