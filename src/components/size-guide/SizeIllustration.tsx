// A generic body-measurement diagram — universal how-to-measure guidance
// (chest/waist/hip lines), not a BADYSS-specific garment measurement chart.
// Hand-drawn line art matching the site's existing icon style (stroke,
// currentColor), not a stock photo.
export function SizeIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 320" fill="none" className={className} aria-hidden>
      {/* Head */}
      <circle cx="100" cy="30" r="22" stroke="currentColor" strokeWidth="1.5" />
      {/* Torso */}
      <path
        d="M62 70c0-8 17-15 38-15s38 7 38 15v70c0 40-8 70-8 100H70c0-30-8-60-8-100V70z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Arms */}
      <path d="M62 78 L30 150 M138 78 L170 150" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />

      {/* Chest line */}
      <line x1="20" y1="100" x2="180" y2="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <text x="10" y="97" fontSize="11" fill="currentColor" textAnchor="end">
        A
      </text>

      {/* Waist line */}
      <line x1="20" y1="150" x2="180" y2="150" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <text x="10" y="147" fontSize="11" fill="currentColor" textAnchor="end">
        B
      </text>

      {/* Hip line */}
      <line x1="20" y1="185" x2="180" y2="185" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
      <text x="10" y="182" fontSize="11" fill="currentColor" textAnchor="end">
        C
      </text>
    </svg>
  );
}
