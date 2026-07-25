# BADYSS Project Status

## Current Phase

Phase 9 — Multi-language support (fr/en/ar via next-intl, cookie-based, RTL-correct), footer/hero/WhatsApp polish. Verified at 375/390/430/1440/1920px × 3 locales via real rendered screenshots. No live WooCommerce, no full checkout, no additional pages.

# Phase 9 — Internationalization + Final UI/UX Refinements

## Language Switcher (next-intl)

- **Not previously configured** — installed fresh (`next-intl@4.13.4`). Chose the **cookie-based "without i18n routing" mode**, not `/[locale]/...` URL prefixing: the existing 23-route tree, mock catalog, and checkout flow stay completely untouched, at the cost of losing static prerendering (see Trade-off below).
- `src/i18n/config.ts` — single source of truth (`locales`, `defaultLocale: "fr"`, `rtlLocales`, `LOCALE_COOKIE`). `src/i18n/request.ts` — reads the `badyss_locale` cookie server-side, falls back to `fr`. `src/i18n/actions.ts` — the one `"use server"` function that writes the cookie (Next requires cookie writes happen in a Server Function/Route Handler, never during Server Component render).
- `next.config.ts` wrapped with `createNextIntlPlugin("./src/i18n/request.ts")` — verified this customized Next.js 16 fork (renamed `middleware.ts` → `proxy.ts`, confirmed via `node_modules/next/dist/docs`) has no issue with next-intl's plugin, since the cookie-based mode needs no proxy/middleware at all.
- `src/components/layout/LanguageSwitcher.tsx` — `LanguageSwitcherDesktop` (globe icon in the header icon row, `hidden lg:block`, opens a glass/blur floating panel via Framer Motion with Français/العربية/English and an active-locale dot indicator) and `LanguageSwitcherMobile` (inline pill row embedded directly in `NavOverlay`'s footer, same visual language as the rest of the mobile menu — no second floating panel on a screen that's already a full takeover). Both share a `useLocaleSwitch()` hook: calls the `setLocale` server action, then `router.refresh()` so every Server Component re-reads the new locale.
- **RTL**: `<html dir="rtl">` set automatically for Arabic in the root layout. No manual per-component RTL overrides were needed anywhere — verified via real screenshots that header/nav/hero/footer/WhatsApp pill/mobile menu all mirror correctly purely from native CSS logical flexbox behavior under `dir="rtl"`. The one deliberate exception: the floating WhatsApp button/bubble stay bottom-**right** in every locale (uses physical `right-*`, not a logical property) — this matches real-world convention (WhatsApp's own widget, Intercom, etc. are bottom-right regardless of page direction), not an oversight.
- **Arabic typography**: Archivo/Inter have no Arabic glyphs. Added `Noto_Sans_Arabic` via `next/font/google` (`--font-arabic`), and a single CSS rule — `html[lang="ar"] { --font-body: var(--font-arabic); --font-display: var(--font-arabic); }` — repoints the existing `font-sans`/`font-display` Tailwind utilities at it globally, so no component needed touching for font switching.

## Scope of Translation (deliberate, documented limit)

Translated: header nav + mega menu, mobile nav overlay, footer (groups/tagline/reassurance/copyright), hero copy, TopBar ticker, WhatsApp button/bubble copy + prefilled message, language switcher itself, and the search/wishlist/cart icon aria-labels. **Not translated this phase**: deeper page content (shop/product/cart-drawer/search-results/FAQ/legal pages, WelcomePopup) — stays French-only, per the brief's own "French should remain the default for now." Cart/wishlist count badges use a locale-neutral `Label (N)` format rather than attempting correct per-locale pluralization (Arabic plural grammar in particular is non-trivial and out of scope for an aria-label).

## Trade-off: Dynamic Rendering

Reading the locale cookie (`cookies()`, an async Request-time API per Next's own docs) in `i18n/request.ts` opts every route through the root layout into dynamic (`ƒ`) rendering — confirmed in the build output, where routes that were previously static (`○`) are now server-rendered per-request. This is inherent to cookie-based locale detection, not a bug. The alternative (`/[locale]/...` URL routing with `generateStaticParams`) would restore static generation per locale but requires restructuring the entire route tree — a much larger change than this phase's scope. Flagging as a known, revisit-if-traffic-demands-it trade-off.

## Other Fixes

- **Footer**: removed the oversized closing "BADYSS" wordmark block entirely (`src/components/layout/Footer.tsx`) — the copyright bar now follows the link columns directly, no leftover gap.
- **WhatsApp number**: updated `.env.local` to the real number (`212627999736`, no spaces/plus in the actual `wa.me` URL — verified via curl) and the prefilled message to the client's exact requested French wording. Confirmed rendering correctly on `/`, `/shop`, `/contact`, `/service-client` (all HTTP 200, correct `wa.me` href).
- **Hero gradient**: replaced the flat 3-stop Tailwind gradient with a 6-stop cinematic gradient (inline style, needs finer control than `from/via/to` allows) — near-clear at the top so the golden-hour architecture/model stay bright, gradually darkening into the text zone, strongest at the very bottom behind the CTA row. First pass (3 stops, `0.92→0.1`) looked like a hard curtain at 1920×1080 specifically (the photo's own darker foreground shadow compounded with the overlay) — re-tuned to 6 gentler stops after actually inspecting the rendered screenshot, not just the code.

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing
- `npm run build` — succeeds, all 23 routes generate (now `ƒ` dynamic — see Trade-off above)
- Real Playwright screenshots (temporary devDependency, removed again after use — same pattern as Phase 7/8) across **3 locales × 5 viewports (375/390/430/1440/1920)** — zero horizontal overflow in all 15 combinations, confirmed via `scrollWidth === clientWidth`, not just visual spot-checks.

---

# Phase 8 — Mobile Premium Pass + Verification

## What Was Already In Place

On starting this phase, the mobile header, full-screen mobile nav overlay, WhatsApp floating button + proactive support bubble, and the cinematic scroll-linked hero were all already built to essentially the target spec (from an earlier, uncommitted session — `PROJECT_STATUS.md` hadn't been updated for it yet, and its diagnostic Playwright script/screenshots were still sitting uncommitted in the repo root). Verified via real rendered screenshots, not just code review:
- **Mobile header** (`Header.tsx` + `NavOverlay.tsx`): exact requested layout — logo left, search/heart/cart icons, hamburger far right, no "MENU" text, no cropping at 375/390/430px.
- **Mobile nav overlay**: full-viewport cream takeover, blurred campaign-photo accent, numbered oversized editorial links, staggered Framer Motion entrance, social/service-client footer row — not a generic dropdown.
- **WhatsApp support**: desktop glass pill with "Besoin d'aide ?" + pulse, mobile compact circular button, both real `wa.me` links (gated to render nothing if no number is configured — never a fabricated number).
- **Hero**: sticky scroll-linked cinematic hero with real photography, bottom-anchored editorial typography, scroll-linked scale/parallax, smooth fade into the next section.

## Bug Found and Fixed

Real bounding-box verification (Playwright, temporary devDependency, removed again after use — same pattern as Phase 7) found that `WhatsAppSupportBubble` genuinely overlapped the hero's own body copy ("Des silhouettes pensées pour bouger librement.") on mobile — confirmed via actual DOM `getBoundingClientRect()` overlap, not just a screenshot eyeballing. Root cause: the bubble reveals purely on a 4s timer at a fixed screen position, and the homepage hero (`position: sticky` inside a 140vh wrapper) keeps its bottom-anchored text opaque and in view well past one viewport height of scrolling.

Fix, in `src/components/layout/WhatsAppSupportBubble.tsx`:
- On the homepage only (`usePathname() === routes.home`), the reveal now additionally requires the visitor to have scrolled past ~1.4 viewport heights (matching the hero wrapper's own `h-[140vh]`) before the timer can reveal the bubble — sidesteps the collision without hardcoding hero pixel geometry into an unrelated component. Other routes keep the original timer-only reveal.
- The bubble now also self-hides ~6s after reveal, or immediately if the visitor scrolls more than 150px further — since it's `fixed`-positioned, leaving it up indefinitely meant it would drift over whatever scrolled underneath it (confirmed via screenshot: it briefly sat over a product-card wishlist icon and a trust-section heading). This makes it read as a toast-like nudge instead of a persistent obstruction, consistent with the original "don't show aggressively" intent.
- Re-verified via Playwright: bubble no longer appears with zero scroll on the homepage; still appears immediately on non-hero routes (e.g. `/contact`); no longer overlaps hero text once revealed.

## Also Verified This Phase

- No horizontal overflow at 375/390/430/1440px (`document.documentElement.scrollWidth === clientWidth` at every width, checked programmatically, not just visually).
- Full incremental-scroll screenshot sweep of the homepage at 375px and 1440px (not full-page-at-once, which misses `Reveal`'s `IntersectionObserver`-gated animations) — every section (category showcase, featured products, editorial campaign, grandes tailles, lookbook, FAQ, community, newsletter, footer) renders cleanly, no cropped images, no text touching edges, no broken transitions.
- Desktop mega menu (hover on "Boutique") renders correctly over the hero.
- Zero browser console errors/warnings across the full sweep.

## ⚠️ Known Placeholder, Not Fixed This Phase

`.env.local`'s `NEXT_PUBLIC_WHATSAPP_NUMBER` is currently set to `212600000000` — a placeholder/test value (not a real BADYSS number; `.env.local` is gitignored, so this was set locally, likely for testing this exact feature). The WhatsApp button/bubble/CTA links all work correctly with whatever number is configured, but this must be swapped for the real BADYSS WhatsApp Business number before real launch — flagged, not guessed at or replaced with another invented number.

## Cleanup

Removed all `qa*.png`/`qa*.mjs` diagnostic files and uninstalled the temporary `playwright` devDependency after use (verified via `grep -i playwright package.json` — no match; `package-lock.json`'s only remaining "playwright" string is vitest's own unrelated `@vitest/browser-playwright` optional peer reference).

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing (unchanged; this phase's fix is presentational timing logic, consistent with the project's existing convention of not unit-testing effect-driven UI timing)
- `npm run build` — succeeds, all 23 routes generate correctly
- `npm audit` — 12 high-severity advisories, all nested inside `next`'s own dependency tree (`postcss`, `sharp` via `next`, `eslint-plugin-*` via `eslint-config-next`) — same pre-existing category flagged in Phase 7 (then 3, now 12 — advisory-database growth over time, not new vulnerable code introduced this phase), not fixable without a breaking Next.js downgrade

---

# Phase 7 — Real Visual Verification + Bug Fix

## What Happened

Every prior creative phase had the same standing caveat: "no live-viewport visual QA — browser extension not connected." This phase, Playwright's CLI and cached Chromium browsers turned out to already be available on this machine (no new download needed), so real screenshots were finally possible. This mattered: it surfaced a genuine bug that pure code/build verification could never have caught.

## The Bug

A full-page Playwright screenshot of the homepage looked almost entirely blank below the hero — which matches what you described seeing. Two separate things turned out to be true at once:

1. **The blank appearance itself was partly a capture artifact, not a real bug.** `Reveal` (the scroll-triggered fade-in used throughout the homepage) starts every wrapped element at `opacity: 0` and only reveals it via an `IntersectionObserver` (Framer Motion's `whileInView`) when it's actually scrolled into view. A single full-page "capture the whole 8000px document at once" screenshot doesn't perform a real incremental scroll, so those observers never fire, and everything wrapped in `Reveal` stays invisible in that specific capture method. **Verified this is not a bug for real visitors**: a script that scrolled the page incrementally (like an actual user) showed every `Reveal`-wrapped section fading in correctly within 200–400ms of entering view, exactly as designed.
2. **But one real, serious bug was hiding underneath that false alarm.** Once verified via proper incremental-scroll screenshots, `FeaturedProducts` was genuinely broken-looking: the asymmetric "hero object" layout from the previous phase made the featured product's image slot enormous — and since mock product data correctly has zero fabricated images (real photos only, never invented), that giant slot rendered as a massive flat, empty beige rectangle spanning multiple screen-heights. This is almost certainly what actually drove the "too empty, too template-like" impression, independent of the screenshot-timing issue.

## The Fix

- **`ProductImage`'s empty state** (`src/components/commerce/ProductImage.tsx`): changed from a flat `bg-muted` rectangle to the same diagonal-stripe placeholder pattern already used by `CreativeVisual` — reads as "photo pending," not "broken," and now looks intentional at any size.
- **`FeaturedProducts`** (`src/components/sections/FeaturedProducts.tsx`): removed the oversized "hero object + supporting products" asymmetric layout entirely. Replaced with a clean, evenly-sized 4-column grid (mild vertical stagger on two items for rhythm, not a giant slot) — the asymmetric-hero-object idea only pays off once there's real photography to showcase; with placeholder data it actively made things worse. Mobile's horizontal snap-scroll carousel was already fine and is unchanged.
- Re-verified via real incremental-scroll screenshots (not full-page) that the fix looks correct: modest, consistent placeholder tiles, clear price/sale hierarchy, clean transition into the next section.

## Diagnostic Method (for future reference)

`playwright`'s CLI (`npx playwright screenshot ...`) and its Chromium browser were already cached locally (`~/Library/Caches/ms-playwright`), so no heavy download was needed. To run custom scripts (scrolling incrementally, checking computed styles, reading console/page errors), `playwright` was temporarily added as a devDependency, used for this diagnostic, then **fully removed again** (`npm uninstall playwright`) — it's not something the site itself needs, only a one-time verification aid. `package.json`/`package-lock.json` are back to their pre-diagnostic state; confirmed via `grep -i playwright package.json` (no match).

## Screenshots Reviewed (real incremental scroll, not full-page)

Desktop (1440×900) and mobile (390×844), scrolled step-by-step through the entire homepage:
- Hero: confirmed strong — real photography, oversized layered typography, scroll cue, transparent-to-solid header working correctly on scroll.
- Category Showcase: confirmed good — real editorial photography, asymmetric composition, kinetic hover labels visible correctly.
- **Featured Products: confirmed broken (giant empty rectangles) → now fixed (see above).**
- Editorial Campaign: confirmed strong — sticky image genuinely pins while text reveals beside it, real atmospheric photography reads well.
- Grandes Tailles: confirmed strong — full-viewport, real cinematic photography, large typography, best-looking section on the page.
- Trust section: confirmed clean and minimal, as intended.
- Footer: confirmed working, oversized closing wordmark renders correctly.
- Mobile: hero/category/carousel all confirmed working with the correct mobile-specific compositions (portrait hero image, horizontal snap-scroll, modest-sized carousel cards — the mobile version of the product-image issue was much less severe than desktop precisely because carousel cards were never oversized).

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings (also confirms no leftover diagnostic scripts remain — they were deleted, not just gitignored)
- `npm test` — 23/23 passing
- `npm run build` — succeeds
- Real rendered output verified via actual scrolling screenshots (first time this was possible this project) — this is a stronger verification bar than any previous phase achieved

## Takeaway for Future Phases

Passing `tsc`/`lint`/`build` and even confirming HTTP 200s was never sufficient to catch this — the bug was purely visual and only showed up when actually looking at rendered output under realistic conditions. Now that real screenshot capability is confirmed available on this machine, future creative phases should use it as a matter of course, not just when explicitly escalated.

---

# Phase 6 — Creative Homepage Redesign

## Concept

Every section was rebuilt around one rule: no section should look like "image, three cards, banner, footer." Concretely: an asymmetric, staggered Category composition instead of three equal cards; an asymmetric "hero object + supporting products" Featured Products layout instead of a 4-column grid; a genuine sticky-image scroll storytelling `EditorialCampaign`; a full-viewport `LargeSizeCollection` with scroll-linked image scale; a scroll-reactive transparent-to-solid Header; oversized typography (`text-display-2xl`, new this phase) used as a graphic element in the Hero; a magnetic CTA and cursor-following category badges as restrained desktop-only premium touches. All seven approved visuals are now wired in for real — nothing is a placeholder anymore except the mock product images (still architecturally correct to leave those as-is, since real WooCommerce photos are a separate, unrelated data source).

## Files Changed

New: `src/components/motion/MagneticButton.tsx`, `src/components/motion/CursorFollowBadge.tsx`.
Rewritten: `src/components/layout/Header.tsx` (now client, scroll+pathname-aware transparency), `src/components/sections/HeroSection.tsx` (client, scroll-linked parallax/scale, oversized layered type, scroll cue, magnetic CTA), `src/components/sections/CategoryShowcase.tsx` (asymmetric staggered grid, real images, kinetic hover, cursor badge, mobile snap-scroll), `src/components/sections/FeaturedProducts.tsx` (asymmetric hero-object layout, mobile snap-scroll), `src/components/sections/EditorialCampaign.tsx` (sticky-image storytelling, real image, no longer uses `CampaignBlock`), `src/components/sections/LargeSizeCollection.tsx` (client, full-viewport, scroll-linked scale, real image), `src/components/commerce/ProductCard.tsx` (added missing availability/stock badge), `src/components/layout/Footer.tsx` (oversized closing wordmark), `src/components/sections/TrustSection.tsx` (typography polish), `src/app/globals.css` (`--text-display-2xl` token).
Removed: `src/components/sections/CampaignBlock.tsx` (dead code — both its callers now have bespoke layouts).
New image assets: `public/images/categories/{grandes-tailles,t-shirts,ensembles}.png`, `public/images/editorial/campaign.png`, `public/images/campaigns/grandes-tailles.png` — copied from the approved `docs/visual-assets/*-v1.png` batch (treated as approved, since this phase's prompt listed all of them under "current approved visual assets").

## Hero Experience

Oversized three-line headline (`text-display-lg` mobile → `text-display-2xl` on large desktop) with a small tracked eyebrow label above it, both inside `CreativeVisual`'s image/overlay system (unchanged mechanism, new visual weight). As the user scrolls through the hero's own height: the image scales from 1 → 1.15 (clipped by the section's `overflow-hidden`, so it reads as a controlled zoom, not overflow spillover) while the text fades and lifts (`y: 0 → -60`, `opacity: 1 → 0`) via `useScroll`/`useTransform` targeting the section itself — this is also the hero's transition mechanism into `CategoryShowcase`, reinforced by a bottom gradient fade and a `Scroll` cue that sits in the hero's own space. The primary CTA is wrapped in `MagneticButton` (desktop/mouse-only, springs back on leave). All scroll-linked transforms are skipped outright under `prefers-reduced-motion` (verified via the `useReducedMotion` gate — not just slowed down, entirely absent).

## Scroll Experience

- Hero → Category: gradient fade + scroll-linked hero exit (above).
- Category tiles: staggered `Reveal` entrance (delay per tile) — a genuine asymmetric composition (7/12-width dominant tile + two 5/12 tiles, one offset `md:mt-10` to break grid alignment), not three equal cards.
- Featured Products: asymmetric hero-object grid on desktop (`md:col-span-7` featured item + `md:col-span-5` stacked supporting items, deliberately uneven bottom edges — an editorial signature, not a bug).
- Editorial Campaign: **real sticky scroll storytelling** — `position: sticky` (plain CSS, no scroll-hijack library) pins the image in a `md:h-[80vh]` box while the text column's extra height (`md:min-h-[140vh]`) gives four `Reveal`-staggered text blocks room to surface progressively as the user scrolls past. Mobile gets a simple stacked flow instead — a real composition difference, not the desktop layout shrunk.
- Grandes Tailles: full-viewport (`min-h-[85vh]` mobile → `min-h-screen` desktop), with a scroll-linked image scale (1.08 → 1 → 1.08 across the section's scroll range) reinforcing it as the site's most powerful visual moment.
- Trust/Footer: typography polish only, plus a new oversized closing wordmark in the footer — a designed ending rather than an abrupt stop.

## Category Interaction

Desktop: asymmetric 12-column grid (not equal cards), oversized category labels (`text-3xl`/`text-display-lg` on the dominant tile) sitting on the image via the overlay system, a kinetic hover (letter-spacing expands, an underline draws in — pure CSS, no JS), and a cursor-following circular badge (`CursorFollowBadge`, mouse-pointer-gated, `md:` and up only) that appears only on genuine mouse hover. Mobile: a horizontal snap-scroll carousel (`snap-x snap-mandatory`, `w-[80vw]` tiles) — a different composition, not the desktop grid stacked, since asymmetric multi-column grids don't translate meaningfully to a single narrow column.

## Product Experience

Desktop: the first product renders large (`md:col-span-7`, `priority` image) as a genuine "hero object," the remaining products stack smaller alongside (`md:col-span-5`) — intentionally asymmetric, not a uniform 4-up grid. Mobile: horizontal snap-scroll carousel (`w-[62vw]` cards). Name/price/sale price were already clearly shown (Phase 1); this phase added the availability badge (`ProductCard`) that was requested but had never actually been implemented — "Rupture de stock"/"Sur commande" now render as a real label plus a dimmed image when stock isn't simply in-stock. Nothing here compromises legibility for creativity — price/name/availability remain plain text, high contrast, no decorative treatment.

## Editorial Experience

See Scroll Experience above — this is the section that most literally implements "sticky image + progressive text reveal." No JS scroll-hijacking is involved; `position: sticky` is native CSS, and the reveals are the same `Reveal` component used everywhere else, just sequenced with staggered delays against a taller-than-usual text column.

## Grandes Tailles Experience

Full-viewport treatment, oversized two-line headline (`text-display-lg` → `text-display-2xl`), scroll-linked image scale reinforcing it as the strongest single visual moment on the page — deliberately distinct from `EditorialCampaign`'s side-by-side sticky treatment (different aspect ratio, different layout mechanic, different scale of typography), matching the requirement that this section "must not look like a normal category banner."

## Motion System

Framer Motion only (no GSAP, per your approved decision, reaffirmed). Inventory this phase: `useScroll`/`useTransform` for the Hero's exit parallax and Grandes Tailles' scale; `useMotionValueEvent` for the Header's scroll-threshold detection (state only changes when crossing the threshold, not on every scroll pixel — avoids unnecessary re-renders); `MagneticButton` (`useMotionValue`/`useSpring`) for one CTA; `CursorFollowBadge` for category-tile hover; `Reveal` (existing, unchanged) for all scroll-triggered section/text entrances. Plain CSS handles everything that doesn't need scroll/pointer awareness (hover scales, letter-spacing transitions, the sticky positioning itself). Every scroll-linked or pointer-driven effect is gated by `useReducedMotion` and disabled outright (not just shortened) when the user prefers reduced motion.

## Desktop vs. Mobile Differences (not shrink-to-fit)

| Section | Desktop | Mobile |
|---|---|---|
| Header | Transparent over hero, solid on scroll | Same mechanism, same effect (not disabled — works identically since it's viewport-position-based, not a desktop-only affordance) |
| Category | Asymmetric 12-col grid, cursor badge on hover | Horizontal snap-scroll carousel |
| Featured Products | Hero-object + stacked supporting grid | Horizontal snap-scroll carousel |
| Editorial Campaign | Sticky image + progressive text reveal (`md:min-h-[140vh]` scroll runway) | Simple stacked image-then-text |
| Grandes Tailles | `min-h-screen`, `text-display-2xl` | `min-h-[85vh]`, `text-display-lg` |
| Hero CTA | Magnetic hover | Plain tap target (no magnetic effect — `pointerType !== "mouse"` check) |

## Performance

- Header's scroll listener uses Framer Motion's `useMotionValueEvent` (rAF-driven) and only triggers a re-render when crossing the 72px threshold, not per scroll pixel.
- Hero/Grandes-Tailles scroll transforms animate only `transform`/`opacity` (compositor-friendly, no layout thrash).
- `CursorFollowBadge`/`MagneticButton` are both gated to `pointerType === "mouse"` and/or hidden below `md:`, so touch devices do zero extra work for them.
- No new npm dependencies — everything this phase uses Framer Motion (already installed) or plain CSS.
- Verified in the actual compiled build output that new Tailwind values (`text-display-2xl` → `font-size:6rem`, `min-h-[140vh]` → `min-height:140vh`, `min-h-[85vh]` → `min-height:85vh`) generated correctly, not silently dropped.

## Accessibility

- `CursorFollowBadge` and the scroll-cue are `aria-hidden`/decorative-only; the actual interactive element in every case remains a real `<Link>` with its own accessible name.
- `MagneticButton` renders as a plain wrapper with no semantic role of its own — the `LinkButton` inside it is still the real, keyboard-focusable, screen-reader-visible control; the magnetic effect is purely a pointer-driven visual embellishment layered on top, never a replacement for standard interaction.
- All scroll-linked/pointer-driven motion is skipped entirely (not just slowed) under `prefers-reduced-motion`, verified via `useReducedMotion()` checks in every new client component that adds motion.
- Header's transparent state doesn't touch any `aria-*`/focus behavior — purely a color/background swap; keyboard navigation and focus-visible rings are untouched from Phase 1.
- Single `<h1>` confirmed still present on the real rendered homepage (curl-verified).

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing (unchanged; this phase is presentational/interaction work, no new pure logic needing tests)
- `npm run build` — succeeds; routes unchanged
- Dev server / HTTP verification: `/` and `/design-system` both return 200; all seven image assets (`hero/desktop.png`, `hero/mobile.png`, `categories/grandes-tailles.png`, `categories/t-shirts.png`, `categories/ensembles.png`, `editorial/campaign.png`, `campaigns/grandes-tailles.png`) return 200; single `<h1>` and exactly one `<header>`/`<footer>` confirmed on the rendered page; no hardcoded pixel widths introduced (verified via grep — the new `w-[80vw]`/`w-[62vw]` carousel-item widths are intentional viewport-relative units, not fixed pixels)

## Known, Deliberate Scope Limits (not oversights)

- **No custom cursor replacement** — a full OS-cursor takeover is a common Awwwards technique but a real usability/accessibility risk if done carelessly (breaks native cursor affordances, easy to get wrong on trackpads/high-refresh displays). Implemented the safer "magnetic button + cursor-following badge" pattern instead, which gets most of the premium feeling without replacing native browser cursor behavior.
- **No horizontal-scroll-driven "pinned" section** (e.g., a horizontally-scrolling gallery pinned via `position: sticky` + transform while the page scrolls vertically) — considered for the category/product carousels, but genuine horizontal-scroll-hijacking sections are exactly the pattern this phase's own brief warned against ("do not design confusing"); the snap-scroll carousels achieve a comparable mobile-first swipeable feeling with standard, predictable touch-scroll behavior instead.
- **No live-viewport visual QA this phase** — same standing limitation as every prior creative phase: the browser automation tool needs its extension connected, which it wasn't this session. Everything above was verified at the code/build/HTTP/compiled-CSS level, not with an actual rendered screenshot across the 320–1920px range requested. This is the most important open item before calling this visually final.

---

# Phase 5C — Creative Homepage Implementation

## What Changed

- **Hero images integrated for real**: `CreativeVisual` was extended (it was placeholder-only through Phase 4) to render actual images via `next/image`, with an `image`/`mobileImage` pair for genuine per-breakpoint art direction — not one crop stretched across sizes. `HeroSection` now uses the approved `docs/visual-assets/hero-desktop-v2.png` / `hero-mobile-v2.png`, copied into `public/images/hero/`.
- **New `campaign-wide` aspect preset** (`4:5` mobile → `21:9` desktop) added to `CreativeVisual`, used only by `LargeSizeCollection` — the approved decision to give Grandes Tailles a distinctly wider, more cinematic ratio than the standard editorial split. Verified in the actual compiled CSS (`aspect-ratio:21/9` present in the build output).
- **`LargeSizeCollection` rebuilt as its own layout** — no longer shares `CampaignBlock`'s 50/50 side-by-side treatment. It's now full-bleed (`Section withContainer={false}`), text-over-image like a scaled-down hero, giving it real visual weight instead of reading as "a normal category banner."
- **`CampaignBlock` (used by `EditorialCampaign`)**: image now wrapped in `Reveal` alongside the text, staggered (`delay={0.12}` on the text) for a choreographed entrance instead of everything fading in simultaneously.
- **`ProductCard`**: hover changed from opacity-dip to a `scale-[1.04]` zoom (consistent with category-tile hover language). Added a genuinely conditional secondary-image-on-hover — only renders when `product.images.length > 1`. Current mock products have zero images, so this path is real but dormant; it will activate automatically once real multi-image WooCommerce data exists. Nothing fabricated to force-demo it.
- **`CategoryShowcase`**: category label typography bumped (`text-2xl` → `sm:text-display-sm`) for stronger editorial hierarchy.
- **Subtle hero image drift**: a slow (`12s`), CSS-only scale animation (`1.0 → 1.06`), opt-in via `driftOnLoad` on `CreativeVisual`, used only by the hero. Plain CSS, not Framer Motion — no JS needed for this one, and it's trivially disabled under `prefers-reduced-motion` (verified in the compiled CSS: a `@media (prefers-reduced-motion: reduce)` override sets `animation: none`).

## Files Changed

- `public/images/hero/desktop.png`, `public/images/hero/mobile.png` — new, copied from the approved `docs/visual-assets/` generations
- `src/components/ui/CreativeVisual.tsx` — rewritten to support real images (`image`/`mobileImage`/`driftOnLoad` props) alongside the existing placeholder path; new `campaign-wide` aspect preset
- `src/app/globals.css` — added the `hero-image-drift` keyframes + reduced-motion override
- `src/components/sections/HeroSection.tsx` — wired to the real approved images
- `src/components/sections/LargeSizeCollection.tsx` — rewritten as a standalone full-bleed layout (previously a thin wrapper over `CampaignBlock`)
- `src/components/sections/CampaignBlock.tsx` — image now reveals too, staggered vs. text
- `src/components/sections/CategoryShowcase.tsx` — typography polish only
- `src/components/commerce/ProductCard.tsx` — hover zoom + conditional secondary image

`EditorialCampaign.tsx`, `TrustSection.tsx`, `FeaturedProducts.tsx`, `Header.tsx`, `Footer.tsx`, `MobileNavToggle.tsx` — **unchanged** this phase; already satisfied the creative-interaction/responsive bar from Phase 3.

## Creative Interactions Implemented (Framer Motion + CSS, no GSAP)

- **Page/section entrance**: deliberately *not* a blanket page-fade — would delay the hero (LCP element) for no storytelling benefit. Hero renders immediately; below-the-fold sections use `Reveal` (unchanged from Phase 3/4).
- **Hero reveal**: the hero text itself is static (unchanged reasoning from Phase 3); the new drift animation on the image is the hero's one motion element, CSS-only.
- **Image reveal**: `CampaignBlock`'s image and `LargeSizeCollection`'s full block now both use `Reveal`, not just text.
- **Scroll-triggered section reveals**: unchanged, `Reveal` throughout (category tiles, featured-products heading, campaigns, trust section).
- **Hover transitions**: `ProductCard` and category tiles both use a `scale-[1.02]–[1.04]` zoom (CSS transition, no JS) — consistent hover language site-wide.
- **Button micro-interactions**: unchanged from Phase 3 (`active:scale-[0.98]`, color transitions).
- **Mobile touch interactions**: unchanged from Phase 3 (full-screen nav overlay, search/cart overlays) — already met the bar.
- **No GSAP added** — per your approved decision, Framer Motion (`Reveal`) plus plain CSS covers everything implemented this phase. No scroll-linked parallax was added beyond the CSS drift; if a genuine need for `useScroll`/`useTransform`-based scroll-linked movement comes up later, that's a small addition, not a new dependency.

## Responsive Behavior

- **Hero art direction is now genuinely responsive**, not shrunk: distinct mobile (4:5, portrait full-body composition) vs. desktop (16:9, wide environmental composition) images, swapped via CSS breakpoint visibility (`md:hidden` / `hidden md:block`), each with its own `next/image` element.
- **Known, accepted trade-off**: both hero images are marked `priority` (both preload/fetch eagerly) since a Server Component can't know the client's viewport ahead of render, and correctness of art direction (showing the right crop per device) was prioritized over saving one image fetch. This is a real, minor bandwidth cost — flagged as a future optimization candidate (e.g., revisit with a native `<picture>`/`<source media>` approach), not silently ignored.
- `LargeSizeCollection`'s new `campaign-wide` preset: `4:5` mobile → `21:9` desktop — a deliberately different ratio per breakpoint, not the same crop scaled.
- Everything else (category grid stacking, campaign image/text reordering, product grid columns) is unchanged from Phase 3 — already breakpoint-intentional, not CSS-shrunk.
- Re-verified via grep: no new hardcoded pixel widths introduced this phase.

## Hero Integration Detail

- Alt text (both breakpoints): "Homme en tenue urbaine contemporaine BADYSS, marchant dans une rue moderne au Maroc." — descriptive, not a business claim.
- No `next.config.ts` change needed — these are local `/public` images, not remote, so no `remotePatterns` config is required.
- Verified via `curl`: both `/images/hero/desktop.png` and `/images/hero/mobile.png` return HTTP 200 and are served through Next's image-optimization pipeline (`/_next/image?url=...`), not raw.

## Remaining Placeholders (intentional — next visual batch, not yet generated)

- Category tiles (`CategoryShowcase`): Grandes tailles / T-shirts / Ensembles — still `CreativeVisual` placeholder pattern.
- Editorial campaign (`EditorialCampaign`): still placeholder.
- Grandes Tailles campaign (`LargeSizeCollection`): still placeholder, but now in its final `campaign-wide` layout — ready for the real image to drop in with zero further layout work, matching this project's "architecture first, visuals after" pattern.
- Product images: still empty (mock products have no images) — real WooCommerce photos, never AI-generated, per the standing product-image-vs-creative-visual separation.

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing (unchanged; this phase's changes are presentational/visual, no new pure logic)
- `npm run build` — succeeds; routes unchanged; **verified in the actual compiled CSS** that both the new `campaign-wide` (`aspect-ratio:21/9`) preset and the `hero-image-drift` animation (plus its reduced-motion override) compiled correctly, not silently dropped
- Dev server: confirmed via curl — `/` and `/design-system` both return 200 (no regression from the `CreativeVisual` rewrite), both hero image assets return 200 and are served via `/_next/image`, single `<h1>` still present

## Genuine Blockers

None from this phase's implementation. Still outstanding from earlier phases (unchanged): the two disputed Trust-section claims need reconfirmation, WordPress/WooCommerce backend access is still needed to move past mock data, and the remaining AI visual batch (category/editorial/Grandes Tailles images) awaits your review of this homepage pass before generation starts, per your explicit instruction.

---

# Phase 3 — Homepage Implementation

## Sections Implemented (docs/BADYSS-SITE-BLUEPRINT.md §4 curated structure)

`src/app/page.tsx` now assembles: `HeroSection` → `CategoryShowcase` → `FeaturedProducts` ("Sélection du moment") → `EditorialCampaign` → `LargeSizeCollection` → `TrustSection`, with `Header`/`Footer` rendered once in the root layout. This matches the blueprint's curated ~7-section structure, not the original 15-section strawman.

## Components Created

- `src/components/sections/HeroSection.tsx` — uses `CreativeVisual kind="hero"`, static (not `Reveal`-wrapped — see Motion Decisions below)
- `src/components/sections/CategoryShowcase.tsx` — asymmetric grid (one tall tile + two stacked), only the 3 categories this phase's prompt named as verified
- `src/components/sections/FeaturedProducts.tsx` — one configurable component (heading/products/cta props), not duplicated per "featured/new/bestsellers" variant
- `src/components/sections/CampaignBlock.tsx` — shared internal layout for the two editorial sections below (avoids duplicating the image+copy+CTA JSX)
- `src/components/sections/EditorialCampaign.tsx` — thin wrapper over `CampaignBlock`
- `src/components/sections/LargeSizeCollection.tsx` — thin wrapper over `CampaignBlock`
- `src/components/sections/TrustSection.tsx` — typography-only, no icon grid
- `src/components/layout/SearchButton.tsx`, `CartButton.tsx` — real, functional header utilities (not inert placeholder buttons)
- `src/components/ui/LinkButton.tsx` — new; see Architecture Correction below
- `src/config/routes.ts` — new; single source of truth for internal route paths

## Components Modified

- `src/components/layout/Header.tsx` — real primary nav (Boutique, Grandes tailles, T-shirts, Ensembles, Contact), wired to `routes.ts`
- `src/components/layout/MobileNavToggle.tsx` — now accepts `items` and renders real links in the full-screen overlay (previously a placeholder message)
- `src/components/layout/Footer.tsx` — real link groups (Boutique/Service client/Légal), phone number, no invented email/social/WhatsApp/address
- `src/components/ui/Button.tsx` — see Architecture Correction below

## Architecture Correction (small, caught during implementation)

While building the hero CTA, I initially nested a `next/link` inside the `Button` component (a native `<button>`) — invalid HTML (interactive-inside-interactive) and an accessibility bug. Fixed by extracting the shared visual styling into an exported `buttonStyles()` helper in `Button.tsx`, and adding a new `LinkButton.tsx` that renders a real `<a>` (via `next/link`) with identical styling. `Button` stays a real `<button>`; `LinkButton` is used everywhere a CTA navigates rather than performs an action. This is the only correction the blueprint doesn't need updating for — it's an implementation-level fix, not an architecture/business decision.

## Mock Data Used

`src/lib/mock-data/products.ts` — 4 products, names suffixed `(produit d'exemple)` so they're unmistakably not real catalog data, using only fields on the domain `Product` type (no invented colors/sizes beyond generic placeholders like "Taille: S/M/L/XL"). Used by `FeaturedProducts` on the homepage. No cart/add-to-cart action on these cards — consistent with the Phase 1 `ProductCard` decision that this is premature before real checkout architecture exists.

## Verified Information Used

- Real category slugs: `grandes-tailles`, `t-shirt`, `ensembles-grande-taille` (`CategoryShowcase`, nav, footer)
- Real phone number `0707003517` (Footer)
- Real order-tracking feature, now linked as `/suivi-commande` in the Footer (previously flagged as "must not be dropped" — preserved)

## Proposed Copy (all PROPOSED, not client-approved)

- Hero: "Le style ne connaît pas de taille." / "Ensembles, sneakers et essentiels du quotidien, pensés pour un style urbain et affirmé." — style/positioning only, no operational claims
- Editorial campaign: general brand-tone copy, explicitly not derived from the live site's "Alma Seven" demo content (§1/§9 of the blueprint)
- Large-size collection: states only the verified fact that grandes-tailles spans multiple real subcategories — no invented fit philosophy or sourcing claims
- Homepage meta description: states only verified catalog facts (ensembles/t-shirts/sneakers/grandes tailles), deliberately omits the disputed delivery/payment claims

## ⚠️ Trust Section — content needs verification before real launch

`TrustSection` displays "Paiement à la livraison" and "Livraison partout au Maroc" per this phase's explicit prompt instruction, but **both are NOT_VERIFIED** — they contradict the live site's own `/info/shipping/` and `/info/payments/` pages (Phase 0 finding: unedited theme demo content describing Europe/USA delivery and card-only payment with no COD mention). This is flagged prominently in a code comment directly above the component's content array. **These two claims must be reconfirmed with you/the client before this section reaches a real customer.** The third statement, "Suivi de commande en ligne," is the one fully verified real feature.

## Routes Used

All from `src/config/routes.ts`, matching `docs/BADYSS-SITE-BLUEPRINT.md` §2 (Option A — legacy WooCommerce URL patterns preserved): `/shop`, `/product-category/grandes-tailles`, `/product-category/t-shirt`, `/product-category/ensembles-grande-taille`, `/contact`, `/suivi-commande`, `/faq`, `/livraison`, `/retours`, `/politique-de-confidentialite`, `/conditions-generales`, `/cookies`, `/a-propos`. **None of these destination pages exist yet** — only `/` and `/design-system` are real routes today. Every link will 404 until its page is built in a later phase, per the blueprint's recommended implementation order (§21). This is expected, not a regression.

## Visual Placeholders

- Hero: `CreativeVisual kind="hero"` — diagonal-stripe placeholder pattern, no real image. Ready for a real fal.ai image to drop in via the same component without restructuring.
- Category tiles: `CreativeVisual aspect="tall"/"portrait"` — same placeholder pattern.
- Editorial/large-size campaigns: `CreativeVisual kind="campaign" aspect="tall"`.
- Product cards: `ProductImage image={null}` (mock products have no images) — renders the real empty-state fallback, not a fake photo.

## Responsive Behavior

- Verified via grep: zero hardcoded pixel widths in any new component.
- Category grid: single column stacked on mobile → asymmetric 3-column/2-row grid from `md:` up (one tall tile + two stacked, per the "avoid generic small cards" instruction).
- Featured products: 2 columns mobile → 3 tablet → 4 desktop (unchanged `ProductCard` grid convention from Phase 1).
- Campaign sections: stacked image-then-text on mobile → side-by-side (alternating left/right) from `md:` up.
- Trust section: stacked with horizontal dividers on mobile → three columns with vertical dividers from `sm:` up.
- Footer: 2-column mobile → 4-column desktop.
- NOT_VERIFIED this phase (same limitation as Phase 1): no live-viewport screenshot check — browser extension still not connected this session. Verified at code/HTTP level (grep, curl, generated HTML inspection) only.

## Accessibility

- Single `<h1>` on the page (hero headline) — verified via `curl | grep` on the actual rendered HTML.
- `SearchButton`/`CartButton` overlays use `role="dialog"`, `aria-modal`, `aria-hidden` toggling, and real focus-reachable close buttons with `sr-only` labels.
- `CartButton` badge only renders when `itemCount > 0`; icon button always has a descriptive `aria-label` including the current count.
- Fixed the `Button`/`Link` nesting bug (see Architecture Correction) specifically because it was an accessibility problem, not just a lint nitpick.
- All new interactive elements inherit the global `:focus-visible` ring from Phase 1 — no per-component focus styling needed.

## Motion Decisions

- `Reveal` (scroll-triggered fade+slide) used on: category tiles, featured-products heading, campaign sections, trust section — all genuinely below-the-fold-on-load content.
- **Deliberately NOT used on the hero** — `Reveal`'s `initial={{opacity:0}}` would mean the hero heading (the likely LCP element) starts invisible until framer-motion's JS runs, delaying visible paint for no real storytelling benefit on content that's immediately in view anyway. This directly follows the Phase 1 motion philosophy ("Framer Motion reserved for scroll-triggered reveals," not "animate everything on load") — the hero doesn't qualify, so it renders statically.
- Category tile hover: `scale-[1.02]` transform on the whole tile (CSS transition, no JS) — consistent with the existing `ProductCard` hover pattern.

## Performance Decisions

- `HeroSection`, `CategoryShowcase`, `FeaturedProducts`, `EditorialCampaign`, `LargeSizeCollection`, `TrustSection`, `Header`, `Footer` are all Server Components. Only `SearchButton`, `CartButton`, and `MobileNavToggle` are Client Components (`"use client"`) — the minimum needed for actual interactivity.
- First `ProductCard` in `FeaturedProducts` gets `priority` (via the existing `ProductImage` prop) since it's likely to be near the viewport on load; the rest lazy-load by default (`next/image`'s default behavior).
- No new dependencies added this phase.

## SEO Implementation

- Homepage-specific `metadata.description` added in `page.tsx` (route-level, extends the root layout's title template) — PROPOSED copy, verified-facts-only (see above).
- Single `<h1>`, logical `<h2>` per section (verified no duplicate/skipped heading levels).
- Existing Phase 0 foundation unchanged and still active: `robots.ts`, `sitemap.ts`, Organization JSON-LD in the root layout.
- No keyword stuffing — copy is short and positioning-focused, not SEO-padded.

## Files Created / Modified This Phase

Created: `src/config/routes.ts`, `src/lib/mock-data/products.ts`, `src/components/ui/LinkButton.tsx`, `src/components/layout/SearchButton.tsx`, `src/components/layout/CartButton.tsx`, `src/components/sections/{HeroSection,CategoryShowcase,FeaturedProducts,CampaignBlock,EditorialCampaign,LargeSizeCollection,TrustSection}.tsx`.
Modified: `src/app/page.tsx` (replaced the create-next-app starter content — the actual homepage now), `src/components/layout/Header.tsx`, `src/components/layout/MobileNavToggle.tsx`, `src/components/layout/Footer.tsx`, `src/components/ui/Button.tsx`.
`docs/BADYSS-SITE-BLUEPRINT.md` — **not modified**; nothing in implementation revealed a necessary architectural correction to the blueprint itself (the Button/LinkButton split was an implementation-level fix, not a blueprint-level one).

## Dependencies Added

None. No new dependency was genuinely necessary this phase.

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing (unchanged; homepage sections are presentational, no new pure-logic to test)
- `npm run build` — succeeds; routes unchanged (`/`, `/_not-found`, `/design-system`, `/robots.txt`, `/sitemap.xml`)
- Dev server: confirmed via curl — `/` and `/design-system` both return HTTP 200 (no regression from the `Button` refactor), homepage has exactly one `<h1>`, one `<header>` and one `<footer>`, real category/shop/contact `href`s present, meta description and Organization JSON-LD both present

## Not Verified This Phase

- Live-viewport visual/responsive check (browser extension still not connected — same limitation as Phase 1)
- Whether the Trust section's two flagged claims are actually still true (see ⚠️ above) — this blocks treating the homepage as launch-ready, independent of any further engineering work

## Decisions Requiring Your Approval

1. All proposed hero/editorial/large-size copy (see Proposed Copy above)
2. The Trust section content — **specifically needs reconfirmation, not just approval**, given the direct contradiction found in Phase 0
3. Whether linking the header/footer/homepage now to not-yet-built routes (§ Routes Used) is acceptable during this build-out period, or whether you'd prefer those links suppressed until each destination page exists

---


# Phase 1 — Creative Direction

All decisions in this section are **PROPOSED** — original creative work for your approval, not business facts, and not copied from any inspiration site's layout/branding/colors/typography.

## Creative Direction

**"Urban Editorial Commerce"** (internal direction name only, never shown on the site): modern fashion + urban energy + editorial storytelling + premium e-commerce + Moroccan market context + AI creative art direction. Concretely this means: warm near-monochrome neutrals so product photography stays the visual focus, one confident accent used sparingly, sharp/square imagery and surfaces (gallery-like) contrasted with soft pill-shaped buttons (tactile), generous whitespace on storytelling sections vs. tighter rhythm on commerce grids, and restrained motion (CSS for micro-interactions, Framer Motion only for scroll-triggered editorial reveals).

## Color System — PROPOSED

Semantic tokens as CSS variables in `src/app/globals.css` (`@theme inline` maps them to Tailwind utilities: `bg-accent`, `text-muted-foreground`, etc. — verified generated correctly in the production build output). Light mode is primary; a dark-mode variant exists via `prefers-color-scheme` but is spot-checked only, not exhaustively audited.

| Token | Light value | Role |
|---|---|---|
| `background` | `#F7F5F2` | warm off-white page background |
| `foreground` | `#171412` | primary text |
| `muted` / `muted-foreground` | `#EDE9E2` / `#6B655D` | secondary surfaces/text |
| `surface` | `#FFFFFF` | card/panel surfaces (subtle lift, not heavy borders) |
| `border` | `#E2DED7` | hairline borders |
| `accent` / `accent-foreground` | `#9C4A1E` / `#FFFFFF` | one confident accent — a darkened burnt terracotta, a nod to the Moroccan market context without being literal/touristy |
| `inverse` / `inverse-foreground` | `#171412` / `#F7F5F2` | full-bleed dark editorial sections |
| `success` / `error` | `#3F7A4E` / `#B23B3B` | system feedback |

Contrast was calculated (WCAG relative-luminance formula), not eyeballed: `foreground` on `background` ≈ 16.9:1; `accent-foreground` on `accent` ≈ 6.15:1; `accent` as text on `background` ≈ 5.66:1; `muted-foreground` on `background` ≈ 5.31:1 — all pass AA for normal text. The lighter ochre I considered first (≈3.3–3.6:1) was rejected specifically because it failed AA and only the darker terracotta shown above was kept.

## Typography — PROPOSED

Two families via `next/font/google` (self-hosted, zero extra network request, correctly licensed — no CSS `@import` from third parties):
- **Archivo** (700/800) — `font-display` — bold editorial display headlines
- **Inter** (variable) — `font-sans` — body/UI/product names/prices

Both include the `latin-ext` subset for French diacritics (é, è, à, ç…). A custom display type scale is registered directly in Tailwind's `@theme` (not hardcoded per-component): `text-display-sm` (1.5rem) → `text-display-xl` (3.5rem), each with matched line-height/letter-spacing. Verified in the actual build output (`.text-display-xl{font-size:3.5rem;line-height:...1.05;letter-spacing:...-.02em}`) — confirmed generated, not silently dropped.

## Spacing, Grid & Radius — PROPOSED

- `Section` component has three spacing modes: `tight` (commerce grids), `default`, `editorial` (generous storytelling rhythm) — demonstrated side-by-side on `/design-system`.
- `Container` keeps the existing `max-w-7xl` + responsive padding; full-bleed editorial sections use `withContainer={false}`.
- Product grids: 2 columns mobile → 3 tablet → 4 desktop, no card borders/shadows.
- **Radius philosophy**: sharp/square for images, cards, inputs, and surfaces (editorial, gallery-like); **pill-shaped** (`rounded-full`) only for buttons — a deliberate single contrast point rather than uniform rounding everywhere.

## Component System

- `components/ui/`: `Container`, `Section` (spacing/tone variants), `Button` (variant × size × disabled × loading, all using semantic tokens, focus-visible ring applied globally via `@layer base`), `Input`, `TextLink`, `Skeleton`, `CreativeVisual`.
- `components/layout/`: `Header`, `Footer`, `MobileNavToggle` — all refactored to semantic tokens (no more raw `neutral-*`).
- `components/commerce/`: `ProductImage` (real images only), `ProductCard` (new this phase).
- `components/motion/Reveal.tsx` (new) — Framer Motion scroll reveal, `useReducedMotion`-aware.

## Product Card Philosophy — PROPOSED

`components/commerce/ProductCard.tsx`: image is the hero (no border/shadow/box), name and price directly below, sale price shown with strikethrough regular price, color/size info shown **only if the product's own `attributes` actually contain it** (a name-match heuristic — `/couleur|color/i` — decides whether to surface a label; nothing is invented per product). No quick-add/cart action included yet — wiring a button to non-existent cart UI would be premature (Phase 5). Demonstrated on `/design-system` with clearly-labeled mock data (`"(mock)"` suffix in names) — not real BADYSS catalog data.

## Editorial Visual System — PROPOSED

`CreativeVisual` rebuilt with a richer, still placeholder-only API: `kind` (hero/editorial/campaign/background), `aspect` (fixed presets — `portrait`/`tall`/`hero`/`square`/`wide`, written as literal Tailwind classes so the JIT scanner can find them; a dynamically-interpolated `aspect-[${x}]` string would silently fail to generate CSS, so presets are deliberately closed, not free-form), `overlay` (none/scrim-bottom/scrim-full), `contentPosition`, and a `focalPoint` prop (plain CSS `object-position`, ready for when a real `<Image>` replaces the placeholder in Phase 6). Still renders zero real images.

## Header / Navigation Direction — PROPOSED (conceptual only, no final labels)

- **Desktop**: slim sticky header, logo left, primary nav reserved center/right, utility icons (search/account/cart) reserved on the right for Phase 5. Not built as inert placeholder buttons — a button with no action is a real accessibility smell, so the header currently just reserves the layout space and documents intent.
- **Mobile**: upgraded `MobileNavToggle` from a small dropdown to a **full-screen overlay** (per this phase's explicit direction that mobile nav must feel intentional, not a collapsed desktop menu) — large tap targets, safe-area-aware padding (`env(safe-area-inset-bottom)`), animated hamburger→X icon, body scroll lock while open. Content is still a placeholder message — final navigation labels are explicitly not invented, pending sitemap confirmation.

## Motion Language — PROPOSED

CSS transitions for all micro-interactions (button hover/active, card image hover) — cheaper and smoother than JS for simple state changes. Framer Motion (`Reveal` component) reserved specifically for scroll-triggered editorial reveals, used sparingly. `useReducedMotion()` makes `Reveal` render statically with no animation when the user prefers reduced motion. GSAP/ScrollTrigger remain uninstalled — no component yet justifies them (Phase 6 territory).

## Mobile-First Decisions

- All new components use unprefixed (mobile) base styles with `sm:`/`md:`/`lg:` overrides only where the design actually changes — verified via grep that no component contains a hardcoded pixel width.
- `CreativeVisual`'s `hero`/`tall` aspect presets are taller/more portrait on mobile, widening on `md:` — editorial images should feel immersive on a phone, not cropped awkwardly.
- Mobile nav is a deliberate full-screen takeover rather than a shrunk desktop menu.
- Product grid is 2 columns from the smallest viewport up (not 1), so cards stay a reasonable size without excessive scrolling.

## Accessibility Decisions

- Global `:focus-visible` outline (2px, accent color, 2px offset) applied once in `@layer base` — every interactive element gets a visible focus ring for free, not per-component.
- All color pairings for text use WCAG-AA-verified contrast (see Color System table above) — not just the primary foreground/background pair.
- `Button` exposes real `disabled` and `aria-busy`/loading states, not just visual styling.
- `CreativeVisual` and `Skeleton` use `role="img"`/`aria-hidden` appropriately so screen readers don't announce meaningless placeholder content.
- `MobileNavToggle` manages `aria-expanded`/`aria-controls` and locks body scroll while open; icon-only close button has an `sr-only` label.
- `Reveal` respects `prefers-reduced-motion` by skipping animation entirely, not just shortening it.

## Files Created / Modified This Phase

Created: `src/app/design-system/page.tsx`, `src/components/ui/Input.tsx`, `src/components/ui/TextLink.tsx`, `src/components/commerce/ProductCard.tsx`, `src/components/motion/Reveal.tsx`.
Rewritten: `src/app/globals.css` (full token + type-scale system), `src/app/layout.tsx` (new fonts, token-based body classes), `src/components/ui/Button.tsx`, `src/components/ui/Section.tsx`, `src/components/ui/CreativeVisual.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/MobileNavToggle.tsx`, `src/components/ui/Skeleton.tsx` (tokens), `src/components/commerce/ProductImage.tsx` (tokens).
Modified: `src/app/robots.ts` (added `/design-system` to disallow).

## Dependencies Added

- `framer-motion@^12.42.2` — the only new dependency this phase, used solely by `Reveal` for scroll-triggered editorial reveals. Nothing else (GSAP, Lenis, Three.js, icon libraries, `class-variance-authority`) was added — none were justified yet.

## Quality Gate Results

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors/warnings
- `npm test` — 23/23 passing (unchanged from Phase 0 foundation; no new logic this phase needed new tests, only presentational components)
- `npm run build` — succeeds; routes now include `/design-system`; confirmed in the actual generated CSS that custom `text-display-*` tokens and `bg-accent` compiled correctly (not silently dropped)
- Dev server: confirmed `/design-system` returns HTTP 200, `robots.txt` correctly disallows it, fonts (`font-display`, Inter) present in rendered HTML

## Not Verified This Phase

- **Live-viewport visual/responsive check** — the browser automation tool available in this session requires its browser extension to be connected, which it wasn't. Everything above was verified at the code/build/HTTP level (grep for hardcoded widths, generated CSS inspection, HTTP 200s), not with an actual rendered screenshot at mobile/tablet/desktop widths. Recommend a manual pass (or reconnecting the extension) before treating this direction as final.
- Dark-mode contrast pairs beyond the primary foreground/background — spot-checked logic only, not calculated exhaustively like the light-mode table above.

## Decisions Needing Your Approval

1. The color palette and accent color (burnt terracotta) — this is the single most visible brand decision made this phase.
2. The Archivo + Inter typeface pairing.
3. The pill-buttons/sharp-surfaces radius contrast as the system's signature detail.
4. The full-screen mobile nav pattern direction.
5. Everything else in this document not explicitly re-confirmed is still open (locale/currency defaults, `html lang`, real content gaps) — see earlier Phase 0 sections below, still unresolved.

---



## Environment

- OS: macOS 15.7.7 (Darwin 24.6.0)
- Node version: v24.15.0
- Package manager: npm 11.12.1 (pnpm 9.12.0 and yarn 1.22.22 also installed locally, available if preferred)
- Git: 2.15.0 (present and working; notably old version — NOT_VERIFIED whether this matters, revisit only if git commands misbehave)
- Next.js version: 16.2.11
- React version: 19.2.4
- TypeScript version: ^5
- Tailwind CSS version: ^4 (via `@tailwindcss/postcss`)
- Vitest version: ^4.1.10

## Installed Dependencies

Runtime:
- `next@16.2.11`, `react@19.2.4`, `react-dom@19.2.4`
- `clsx@^2.1.1` — conditional className composition, used by `cn()`
- `tailwind-merge@^3.6.0` — resolves conflicting Tailwind classes inside `cn()`
- `zod@^4.4.3` — runtime schema validation for server environment variables
- `server-only@^0.0.1` — build-time guard preventing WordPress/WooCommerce secrets from entering client bundles

Dev:
- `@tailwindcss/postcss@^4`, `@types/node@^20`, `@types/react@^19`, `@types/react-dom@^19`
- `eslint@^9`, `eslint-config-next@16.2.11`
- `typescript@^5`
- `vitest@^4.1.10` — unit tests for the pure data/formatting/reducer layer

Deliberately still not installed: any animation library (Framer Motion/GSAP/Lenis/Three.js — Phase 6 only, no component justifies them yet), any UI component library, `class-variance-authority` or similar (the two variant primitives we have are simple enough for a manual `Record<>` map), any WooCommerce/WordPress SDK beyond our own typed fetch layer.

## Architecture Decisions

- **Data layer isolation**: components never call `fetch` directly. `src/lib/wordpress/` and `src/lib/woocommerce/` hold low-level, `server-only`-guarded fetch wrappers; `src/lib/api/index.ts` is the *only* import surface application code should use.
- **Domain types vs. wire types**: `src/types/woocommerce.ts` / `wordpress.ts` mirror the official REST API wire format exactly. `src/types/product.ts`, `cart.ts`, `customer.ts`, `order.ts` are our own decoupled domain models. `src/lib/woocommerce/transform.ts` maps one to the other, so UI code never depends on WooCommerce-specific field names, and swapping data sources later doesn't ripple through components.
- **Env split**: `src/config/env.ts` (public, browser-safe) vs. `src/config/server-env.ts` (secrets, `server-only`-guarded, throws only when actually called without config — so the app builds today with zero real credentials).
- **Feature folders hold logic, not empty scaffolding**: created `src/features/cart/` (reducer) and `src/features/products/` (sort/filter) because they have real, tested pure functions today. Deliberately did **not** create `src/features/categories/`, `checkout/`, `search/` yet — no real logic exists for them yet and empty folders were explicitly ruled out; they'll appear when their first real logic lands (checkout in particular depends on decisions not yet made about the WooCommerce checkout flow).
- **`components/sections/` not created** — building homepage/editorial sections is explicitly out of scope for this phase (Phase 4).
- **No `ProductCard` component** — explicitly excluded this phase; `ProductImage` (image handling only, no price/name/layout) is as far as commerce UI goes right now.

## Type System (`src/types/`)

- `product.ts` — `ProductImage`, `ProductCategory`, `ProductAttribute`, `ProductPrice`, `ProductStock` (+ `StockStatus`), `ProductVariant`, `Product`. Domain-level, used by UI/feature code.
- `cart.ts` — `CartItem`, `Cart`.
- `customer.ts` — `Customer` (id, email, firstName, lastName only — kept minimal, no invented fields).
- `order.ts` — `Order`, `OrderLineItem`, modeled on the official WooCommerce REST Order schema.
- `woocommerce.ts` / `wordpress.ts` — raw wire-format types matching the official public REST API docs. NOT_VERIFIED against the real BADYSS install's custom attributes/plugins.

## API / Data Layer (`src/lib/`)

- `wordpress/client.ts` — low-level WP REST API v2 fetch wrapper.
- `woocommerce/client.ts` — low-level WC REST API v3 fetch wrapper. Uses HTTP Basic Auth (not query-string keys) so consumer secrets never land in logs or cached URLs.
- `woocommerce/products.ts` — `getProducts()`, `getProductBySlug()`, `searchProducts()`.
- `woocommerce/categories.ts` — `getCategories()`, `getCategoryBySlug()`.
- `woocommerce/transform.ts` — `mapWooCommerceProduct()`, `mapWooCommerceCategory()`; unit-tested with generic fixtures (not real catalog data).
- `api/index.ts` — barrel exporting domain-typed `getProducts`, `getProductBySlug`, `searchProducts`, `getCategories`, `getCategoryBySlug`, `wordPressFetch`. This is the only module app code should import backend data from.

None of these have been called against a live backend — no credentials exist yet, so they're typed, unit-testable, unexercised architecture, ready to wire up once WordPress/WooCommerce access is available.

## SEO Foundation

- `src/app/robots.ts` — dynamic robots.txt, disallows `/cart`, `/checkout`, `/account`, `/api`; references sitemap.
- `src/app/sitemap.ts` — dynamic sitemap.xml, homepage entry only so far (real product/category URLs get appended once the data layer is wired to live data).
- `metadataBase` set in root layout so relative canonical/OG URLs resolve correctly; per-route `alternates.canonical` can override once real routes exist.
- OpenGraph (`siteName`, `locale: fr_MA`, `type: website`) and Twitter card (`summary_large_image`) foundations added — no description or images yet, since no verified copy or creative visuals exist (won't fill with placeholder marketing text).
- `src/lib/seo/organization-schema.ts` — Organization JSON-LD built only from verified `siteConfig` fields (name, url, phone). Unverified fields (social links) are omitted entirely rather than faked. Rendered in root layout via an inline `<script type="application/ld+json">` — safe because the JSON is built entirely from static internal config, no user input.

## Site Configuration (`src/config/site.ts`)

Central config object with explicit VERIFIED/PROPOSED/NOT_VERIFIED labeling per field:
- `name: "BADYSS"` — VERIFIED (client's own brand name)
- `contact.phone: "0707003517"` — VERIFIED (consistent across live site header + contact page)
- `description` — `null`, PLACEHOLDER (no verified brand copy)
- `defaultLocale: "fr"`, `currency: "MAD"`, `country: "MA"` — PROPOSED (consistent with observed business context, not yet explicitly confirmed by you)
- `social.{facebook,instagram,youtube}` — `null`, NOT_VERIFIED (icons seen on live site footer, exact profile URLs not yet captured)

## Design System Foundation (`src/components/ui/`)

Minimal, intentionally neutral-styled (gray palette) primitives — **not** final visual design, which is Phase 1's job:
- `Container.tsx` — max-width + responsive horizontal padding
- `Section.tsx` — vertical rhythm wrapper, optional `Container`
- `Button.tsx` — `variant`/`size` API (primary/secondary/ghost × sm/md/lg); palette is a placeholder, the API shape is the durable part
- `Skeleton.tsx` — generic loading placeholder
- `CreativeVisual.tsx` — placeholder for future fal.ai-generated editorial visuals (Phase 6); deliberately renders no image
- `components/commerce/ProductImage.tsx` — renders only **real** WooCommerce product images via `next/image`; architecturally separated from `CreativeVisual` per the project's product-photo-vs-AI-visual rule. `next.config.ts` remotePatterns for the WP media domain are not yet configured — domain unknown until backend access is confirmed.

No typography scale/heading primitives created yet — font choices and type scale are a Phase 1 creative decision; Tailwind's built-in text utilities are sufficient until then.

## Layout Foundation (`src/components/layout/`)

- `Header.tsx` — sticky header, site name, empty nav slot (`aria-hidden`, commented — real IA is Phase 1), mobile nav toggle. No links to not-yet-existing routes.
- `MobileNavToggle.tsx` — client component proving the open/close drawer pattern with a placeholder message; no real navigation content yet.
- `Footer.tsx` — copyright + verified phone number only. No legal/policy links — the live site's equivalent pages are unedited theme demo content (see below), so no links are added until real content exists.
- Deferred (not built, no clear content yet): announcement bar (would require real business info, e.g. a shipping threshold message), search overlay, cart drawer (need real product data / cart wiring — Phase 5).
- Wired into `src/app/layout.tsx`: `Header` + `<main>{children}</main>` + `Footer` around the still-default `page.tsx` starter content, proving the layout composition works before Phase 4 replaces the homepage.

## Responsive Strategy

- Mobile-first Tailwind usage throughout: base styles unprefixed, `md:` breakpoint used to reveal desktop nav / hide mobile toggle.
- No hardcoded pixel widths anywhere in new components (verified via grep) — everything uses relative units, `max-w-*`, and Tailwind's responsive utilities.
- `Container` constrains width and applies responsive padding (`px-4 sm:px-6 lg:px-8`) so nothing can force horizontal overflow.
- NOT_VERIFIED this session: an actual live-viewport visual check (mobile/tablet/desktop breakpoints in a real browser) — the browser automation tool available in this session requires a browser-extension connection that wasn't active. Code-level review is done; a real visual pass is recommended once you can connect the extension or via manual browser testing.

## Verified

- `npx tsc --noEmit` — 0 errors.
- `npm run lint` (ESLint) — 0 errors/warnings.
- `npm test` (Vitest) — **23/23 tests passing** across 5 test files: `cn()` class merging, `formatPrice()`, WooCommerce→domain transform mapping (price/sale/stock/images/categories/attributes), cart reducer (add/merge/variation-separation/update/remove/clear), product sort/filter.
- `npm run build` — succeeds; routes: `/`, `/_not-found`, `/robots.txt`, `/sitemap.xml`.
- `npm run dev` — confirmed hot-reload picked up the new Header/Footer/JSON-LD (checked via curl: `<header>`/`<footer>` tags and one `application/ld+json` script present in served HTML).
- `.gitignore` allows committing `.env.example` while real `.env*` stays ignored.
- `npm audit`: same 3 pre-existing vulnerabilities, all nested inside `next`'s own dependency tree — not fixable from our `package.json`, not new.

## Verified — Public Live-Site Discovery (2026-07-22, read-only, no credentials)

Fetched only public URLs on badyss.ma (robots.txt, wp-sitemap.xml and sub-sitemaps, homepage, `/info/*` pages). No login, no admin access, nothing modified.

- **Confirmed standard WooCommerce/WordPress install.** URL conventions: `/product/{slug}/`, `/product-category/{slug}/` (nesting under `grandes-tailles`), `/shop/`, `/shop/cart/`, `/shop/checkout/`, `/shop/my-account/`, `/shop/sale/`, `/info/{page}/`.
- **Real product catalog per the live sitemap: exactly 15 published products** — more than the 12 in the original brief. New ones found: `under-armour-sk`, `sandale-le-suede-slide`, `sabot-hermes`.
- **Real category slugs confirmed:** `t-shirt`, `grandes-tailles` (+ nested `chaussures`, `pantalon`, `pantalons-grande-taille`, `tshirt-grande-taille`), `ensembles-grande-taille`. A separate standalone page `/grandes-tailles-categorie/` exists outside the normal `/product-category/` tree — purpose NOT_VERIFIED.
- **Phone number `0707003517` appears consistently** (header + `/info/contact/`) — treat as VERIFIED, still worth confirming directly with the client.
- `/info/contact/` has a real contact form; footer icons for Facebook, YouTube, Instagram (exact URLs not yet captured).
- `/info/online-order-tracking/` is a **real, functioning WooCommerce order-tracking feature** — genuine feature to plan for, not placeholder.

### ⚠️ Most "trust" pages are unedited theme demo content, not real BADYSS policy

`/info/shipping/`, `/info/payments/`, `/info/refunds-returns/`, `/info/faq/`, and `/info/about/` contain leftover demo content from a WooCommerce/WordPress fashion theme demo branded "The Seven" (fictional founder "Alma Seven", generic timeline, Lorem Ipsum). The shipping page describes Europe/USA delivery (contradicts "Livraison partout au Maroc"); the payments page lists card processors only with no COD mention (contradicts "Paiement à la livraison"). **None of this counts as verified BADYSS content — treat as NOT_FOUND despite the pages existing.** Real content must come from you/the client; none of it has been invented or migrated.

## Not Verified

- WordPress/WooCommerce admin-level access: REST API vs GraphQL availability, installed plugins/customizations, stock/order data, actual payment/shipping methods configured in WooCommerce settings, customer accounts, reviews plugin.
- Real shipping policy, payment methods (including whether COD is actually offered), returns/refund policy, FAQ content, brand story/values — all currently NOT_FOUND as real content (see finding above).
- Exact social media profile URLs.
- Purpose of `/grandes-tailles-categorie/` and orphan pages (`/home-001/`, `/home-002/`, `/under-construction-page/`, `/sample-page/`, `/info/design-system-check/`).
- Whether Hostinger hosting has constraints relevant to headless API access.
- Whether the WooCommerce REST API v3 schema in `src/types/woocommerce.ts` matches the real store exactly (custom attributes, ACF fields, etc.).
- Live-viewport responsive check (see Responsive Strategy above — browser extension not connected this session).

## Proposed / Needs Your Input

- Package manager: **npm** (in use) — flag if you'd rather switch to pnpm/yarn.
- `<html lang="en">` left unchanged — whether the new site is French-only, bilingual (fr/ar), or needs `next-intl` is a real decision, not made for you.
- `formatPrice()` / `siteConfig` default to `MAD` / `fr-MA` / `fr` locale — reasonable technical defaults given business context, not yet explicitly confirmed by you.
- Real content for shipping, payments, returns, FAQ, and brand story (see live-site finding) — needed before those pages can be built for real (Phase 4+).

## Current Architecture

```
badyss/
├── .env.example
├── .gitignore
├── AGENTS.md / CLAUDE.md            # auto-generated Next.js 16 agent notes
├── PROJECT_STATUS.md
├── vitest.config.ts
├── package.json
├── next.config.ts                   # unmodified — image remotePatterns pending known WP media domain
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Header/Footer wired in, metadataBase, OG/Twitter, Organization JSON-LD
│   │   ├── page.tsx                 # still the default create-next-app starter — homepage not built
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Container.tsx
│   │   │   ├── Section.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── CreativeVisual.tsx   # AI/editorial visual placeholder (Phase 6)
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── MobileNavToggle.tsx
│   │   └── commerce/
│   │       └── ProductImage.tsx     # real WooCommerce images only
│   ├── features/
│   │   ├── cart/
│   │   │   ├── cart-reducer.ts
│   │   │   └── cart-reducer.test.ts
│   │   └── products/
│   │       ├── sort.ts
│   │       └── sort.test.ts
│   ├── config/
│   │   ├── env.ts                   # public config (NEXT_PUBLIC_SITE_URL)
│   │   ├── server-env.ts            # secrets, server-only guarded
│   │   └── site.ts                  # central site config, VERIFIED/PROPOSED/NOT_VERIFIED labeled
│   ├── lib/
│   │   ├── utils.ts / utils.test.ts
│   │   ├── format.ts / format.test.ts
│   │   ├── seo/
│   │   │   └── organization-schema.ts
│   │   ├── api/
│   │   │   └── index.ts             # single import surface for all backend data
│   │   ├── wordpress/
│   │   │   └── client.ts
│   │   └── woocommerce/
│   │       ├── client.ts
│   │       ├── products.ts
│   │       ├── categories.ts
│   │       └── transform.ts / transform.test.ts
│   └── types/
│       ├── product.ts / cart.ts / customer.ts / order.ts   # domain models
│       └── woocommerce.ts / wordpress.ts                    # raw wire-format types
└── tsconfig.json
```

Deliberately not created: `features/categories/`, `features/checkout/`, `features/search/`, `components/sections/` — no real logic/content exists for them yet.

## Next Step

The architecture is ready to receive real data. Two things gate the next real build phase:
1. **Real business content** for shipping, payments, returns, FAQ, and brand story — currently `NOT_FOUND` (the live equivalents are theme demo text).
2. **WordPress/WooCommerce admin or REST API credentials** — to move the data layer from "typed but unexercised" to actually wired up.

Neither is required to keep making architecture-only progress if you'd rather continue there, but both are required before Phase 4 (Homepage) can use anything real.

Waiting for your instructions before proceeding further.
