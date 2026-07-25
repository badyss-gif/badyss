// Small, dependency-free form-validation helpers. Kept separate from
// lib/utils.ts (which only holds the generic `cn()` class merger) since this
// is a distinct concern with room to grow (more field types later).

/**
 * Moroccan mobile/landline numbers: 10 digits starting with 0, or the same
 * number in international form (+212/212 replacing the leading 0). Second
 * digit must be 5 (landline), 6 or 7 (mobile) — the only valid Moroccan
 * prefixes. Spaces/dashes/dots are stripped before testing so "06 12 34 56
 * 78" and "06-12-34-56-78" both validate.
 */
const MOROCCAN_PHONE_PATTERN = /^(?:0|(?:\+212|212))[5-7]\d{8}$/;

export function normalizePhone(value: string): string {
  return value.replace(/[\s.-]/g, "");
}

export function isValidMoroccanPhone(value: string): boolean {
  return MOROCCAN_PHONE_PATTERN.test(normalizePhone(value));
}
