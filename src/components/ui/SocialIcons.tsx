// Simple, minimal line-art icons matching the site's existing hand-rolled
// icon style (Header's search/cart icons) — lucide-react deliberately
// doesn't ship trademarked brand marks, so these are drawn directly.
// `className` is passed through so callers control size/color via Tailwind.

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" />
    </svg>
  );
}

export function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M13.6 20V13h1.9l.3-2.3h-2.2V9.2c0-.66.18-1.1 1.13-1.1h1.2V6.08c-.2-.03-.9-.08-1.7-.08-1.7 0-2.85 1.02-2.85 2.9v1.62H9.4V13h1.9v7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M6.3 17.7 5 20.5l2.9-1.2A8 8 0 1 0 6.3 17.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.1 9.6c.2-.5.4-.5.6-.5h.5c.15 0 .35 0 .5.4.2.5.6 1.5.65 1.6.05.15.1.3 0 .5-.1.2-.15.3-.3.45-.15.15-.3.35-.45.45-.15.15-.3.3-.15.55.15.25.7 1.15 1.5 1.85 1 .9 1.85 1.2 2.1 1.35.25.15.4.1.55-.05.15-.15.6-.7.75-.95.15-.25.3-.2.5-.1.2.1 1.3.6 1.5.7.2.1.35.15.4.25.05.1.05.55-.15 1.1-.2.5-1.15 1-1.6 1.05-.4.05-.9.1-3.2-.85-2.4-1-3.9-3.5-4.05-3.65-.15-.15-1.15-1.5-1.15-2.9 0-1.4.75-2.05 1-2.3Z"
        fill="currentColor"
      />
    </svg>
  );
}
