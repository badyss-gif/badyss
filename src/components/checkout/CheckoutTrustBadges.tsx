"use client";

import { ShieldCheck, MessageCircle, Ruler } from "lucide-react";
import { useTranslations } from "next-intl";

// Only genuinely true statements — no payment-security certification claims
// (no real payment processing exists yet, see CheckoutClient) and no
// invented shipping/return promises. "Confidential information" is a
// general privacy statement any form handling reasonably makes, not a
// specific security/compliance claim.
export function CheckoutTrustBadges() {
  const t = useTranslations("checkout");
  const tFooter = useTranslations("footer");
  const badges = [
    { icon: ShieldCheck, label: t("trustConfidential") },
    { icon: Ruler, label: tFooter("grandesTaillesDisponibles") },
    { icon: MessageCircle, label: tFooter("serviceClientDedie") },
  ];

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3">
      {badges.map(({ icon: Icon, label }) => (
        <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
          {label}
        </div>
      ))}
    </div>
  );
}
