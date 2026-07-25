"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface NewsletterFormProps {
  /** "dark" for use on an inverse/dark section (Newsletter section); "light" for the default surface. */
  tone?: "light" | "dark";
  className?: string;
}

// Presentational only — there is no confirmed email service behind BADYSS
// yet (docs/BADYSS-SITE-BLUEPRINT.md §14/§20 flag this as an open question).
// Submitting does not pretend to send anything anywhere; it honestly says
// signup isn't wired up yet, the same honesty pattern already used by
// SearchButton for its no-live-data state.
export function NewsletterForm({ tone = "light", className }: NewsletterFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const dark = tone === "dark";
  const t = useTranslations("newsletter");

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitted(true);
        }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Input
            type="email"
            required
            disabled={submitted}
            placeholder={t("placeholder")}
            aria-label={t("ariaLabel")}
            className={cn(
              "peer",
              dark && "border-white/25 bg-transparent text-inverse-foreground placeholder:text-inverse-foreground/50 focus-visible:border-white"
            )}
          />
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 -bottom-px h-px origin-center scale-x-0 transition-transform duration-300 ease-out peer-focus-visible:scale-x-100",
              dark ? "bg-white" : "bg-foreground"
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={submitted}
          className={cn("shrink-0", dark && "bg-white text-foreground hover:bg-white/90")}
        >
          {submitted ? t("thanks") : t("subscribe")}
        </Button>
      </form>
      <p
        role="status"
        className={cn("mt-2 min-h-[1em] text-xs", dark ? "text-inverse-foreground/60" : "text-muted-foreground")}
      >
        {submitted ? t("thanksMessage") : ""}
      </p>
    </div>
  );
}
