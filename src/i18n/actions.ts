"use server";

import { cookies } from "next/headers";
import { locales, LOCALE_COOKIE, type Locale } from "./config";

function isSupportedLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

// The only place the locale cookie is written — `cookies().set()` must run
// inside a Server Function/Route Handler (Next can't set cookies during
// Server Component rendering). `LanguageSwitcher` calls this then refreshes
// the router so every Server Component re-reads the new locale.
export async function setLocale(nextLocale: string): Promise<void> {
  if (!isSupportedLocale(nextLocale)) return;
  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE, nextLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
