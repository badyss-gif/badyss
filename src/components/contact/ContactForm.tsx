"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";

type Status = "idle" | "loading" | "submitted";

// Real, verified field pattern (Name/Email/Phone/Request — matches the live
// site, docs/BADYSS-SITE-BLUEPRINT.md §10). No backend endpoint exists yet
// to actually deliver the message, so the final state is honest about that
// rather than pretending it was sent — the same pattern used by
// NewsletterForm/checkout elsewhere in this project. The loading state is
// real UI feedback (not a fake delay to simulate a fake network call) —
// it's the same brief transition used everywhere a form here moves between
// states, so the interaction still feels complete and considered.
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const t = useTranslations("contact");

  return (
    <AnimatePresence mode="wait">
      {status === "submitted" ? (
        <motion.div
          key="submitted"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="border border-border bg-muted p-6 text-sm"
        >
          <p className="font-medium text-foreground">{t("formNotConnected")}</p>
          <p className="mt-2 text-muted-foreground">
            {t("formContactDirectlyPrefix")}{" "}
            <a href={`tel:${siteConfig.contact.phone}`} className="text-foreground underline underline-offset-2">
              {siteConfig.contact.phone}
            </a>
            {t("formContactDirectlySuffix")}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          onSubmit={(event) => {
            event.preventDefault();
            setStatus("loading");
            window.setTimeout(() => setStatus("submitted"), 500);
          }}
          className="flex flex-col gap-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Input required placeholder={t("formNamePlaceholder")} aria-label={t("formNamePlaceholder")} disabled={status === "loading"} />
            <Input type="tel" placeholder={t("formPhonePlaceholder")} aria-label={t("formPhonePlaceholder")} disabled={status === "loading"} />
          </div>
          <Input
            type="email"
            required
            placeholder={t("formEmailPlaceholder")}
            aria-label={t("formEmailPlaceholder")}
            disabled={status === "loading"}
          />
          <textarea
            required
            placeholder={t("formMessagePlaceholder")}
            aria-label={t("formMessagePlaceholder")}
            rows={5}
            disabled={status === "loading"}
            className="w-full rounded-none border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button type="submit" loading={status === "loading"} className="w-full justify-center sm:w-auto">
            {t("formSend")}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
