"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon, FacebookIcon } from "@/components/ui/SocialIcons";

function LinkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M9 15l6-6M10.5 6.5l1-1a3.5 3.5 0 015 5l-1 1M13.5 17.5l-1 1a3.5 3.5 0 01-5-5l1-1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface SocialShareProps {
  productName: string;
  url: string;
}

// All three actions are genuinely functional — a real clipboard copy and
// real share-intent URLs (WhatsApp/Facebook's own share endpoints) — never
// fake share counts or "X personnes ont partagé" claims.
export function SocialShare({ productName, url }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const t = useTranslations("product");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (unsupported browser/context) — silently
      // no-op rather than throwing; the share links below still work.
    }
  }

  const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`${productName} — ${url}`)}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-widest text-muted-foreground">{t("share")}</span>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={t("copyLink")}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </button>
      <a
        href={whatsappShare}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("shareWhatsApp")}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
      >
        <WhatsAppIcon className="h-3.5 w-3.5" />
      </a>
      <a
        href={facebookShare}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("shareFacebook")}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted"
      >
        <FacebookIcon className="h-3.5 w-3.5" />
      </a>
      {copied ? <span className="text-xs text-muted-foreground">{t("linkCopied")}</span> : null}
    </div>
  );
}
